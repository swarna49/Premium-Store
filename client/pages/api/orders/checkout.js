import dbConnect from "../../../utils/dbConnect";
import Order from "../../../models/Order";
import Stripe from "stripe";
import jwt from "jsonwebtoken";

const stripe = new Stripe(process.env.STRIPE_KEY);

export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).end();

    await dbConnect();

    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ message: "No token provided" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        const { items, shippingAddress } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: items.map(item => ({
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: item.name,
                        images: item.image ? [item.image] : []
                    },
                    unit_amount: Math.round(item.price * 100)
                },
                quantity: item.quantity
            })),
            mode: "payment",
            success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.origin}/cart`,
            client_reference_id: userId,
            metadata: {
                userId: userId,
                shippingAddress: JSON.stringify(shippingAddress),
                items: JSON.stringify(items)
            }
        });

        res.status(200).json({ url: session.url, sessionId: session.id });
    } catch (error) {
        console.error("Checkout error:", error);
        res.status(500).json({ message: "Error creating checkout session" });
    }
}
