import express from "express"
import Stripe from "stripe"
import Order from "../models/order.js"
import auth from "../middleware/auth.js"

const stripe = new Stripe(process.env.STRIPE_KEY)
const router = express.Router()

// Create checkout session
router.post("/checkout", auth, async (req, res) => {
    try {
        const { items, shippingAddress } = req.body

        if (!items || items.length === 0) {
            return res.status(400).json({ message: "Cart is empty" })
        }

        // Calculate total
        const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)

        // Create Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: items.map(item => ({
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: item.name,
                        images: item.image ? [item.image] : []
                    },
                    unit_amount: Math.round(item.price * 100) // Convert to cents
                },
                quantity: item.quantity
            })),
            mode: "payment",
            success_url: `${process.env.CLIENT_URL || "http://localhost:3000"}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL || "http://localhost:3000"}/cart`,
            client_reference_id: req.user.id,
            metadata: {
                userId: req.user.id,
                shippingAddress: JSON.stringify(shippingAddress),
                items: JSON.stringify(items)
            }
        })

        res.json({ url: session.url, sessionId: session.id })
    } catch (error) {
        console.error("Checkout error:", error)
        res.status(500).json({ message: "Error creating checkout session" })
    }
})

// Stripe webhook to confirm payment and create order
router.post("/webhook", express.raw({ type: "application/json" }), async (req, res) => {
    const sig = req.headers["stripe-signature"]
    let event

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        )
    } catch (err) {
        console.error("Webhook signature verification failed:", err.message)
        return res.status(400).send(`Webhook Error: ${err.message}`)
    }

    // Handle the checkout.session.completed event
    if (event.type === "checkout.session.completed") {
        const session = event.data.object

        try {
            const { userId, shippingAddress, items } = session.metadata

            // Create order after successful payment
            await Order.create({
                userId,
                products: JSON.parse(items).map(item => ({
                    productId: item.productId || item._id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity
                })),
                total: session.amount_total / 100, // Convert from cents
                paid: true,
                status: "processing",
                shippingAddress: JSON.parse(shippingAddress),
                stripeSessionId: session.id
            })

            console.log("Order created successfully for session:", session.id)
        } catch (error) {
            console.error("Error creating order from webhook:", error)
        }
    }

    res.json({ received: true })
})

// Get user's orders
router.get("/my-orders", auth, async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user.id })
            .sort({ createdAt: -1 })
            .populate("products.productId")

        res.json(orders)
    } catch (error) {
        console.error("Get orders error:", error)
        res.status(500).json({ message: "Error fetching orders" })
    }
})

// Get single order
router.get("/:id", auth, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate("products.productId")

        if (!order) {
            return res.status(404).json({ message: "Order not found" })
        }

        // Ensure user can only view their own orders (unless admin)
        if (order.userId.toString() !== req.user.id && !req.user.isAdmin) {
            return res.status(403).json({ message: "Access denied" })
        }

        res.json(order)
    } catch (error) {
        console.error("Get order error:", error)
        res.status(500).json({ message: "Error fetching order" })
    }
})

// Get all orders (admin only)
router.get("/", auth, async (req, res) => {
    try {
        if (!req.user.isAdmin) {
            return res.status(403).json({ message: "Access denied. Admin only." })
        }

        const orders = await Order.find()
            .sort({ createdAt: -1 })
            .populate("userId", "name email")
            .populate("products.productId")

        res.json(orders)
    } catch (error) {
        console.error("Get all orders error:", error)
        res.status(500).json({ message: "Error fetching orders" })
    }
})

// Update order status (admin only)
router.patch("/:id/status", auth, async (req, res) => {
    try {
        if (!req.user.isAdmin) {
            return res.status(403).json({ message: "Access denied. Admin only." })
        }

        const { status } = req.body
        const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"]

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status" })
        }

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        )

        if (!order) {
            return res.status(404).json({ message: "Order not found" })
        }

        res.json(order)
    } catch (error) {
        console.error("Update order status error:", error)
        res.status(500).json({ message: "Error updating order status" })
    }
})

export default router
