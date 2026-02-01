import express from "express"
import Product from "../models/product.js"
import auth from "../middleware/auth.js"

const router = express.Router()

// Get all products
router.get("/", async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 })
        res.json(products)
    } catch (error) {
        console.error("Get products error:", error)
        res.status(500).json({ message: "Error fetching products" })
    }
})

// Get single product
router.get("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        if (!product) {
            return res.status(404).json({ message: "Product not found" })
        }
        res.json(product)
    } catch (error) {
        console.error("Get product error:", error)
        res.status(500).json({ message: "Error fetching product" })
    }
})

// Create product (admin only)
router.post("/", auth, async (req, res) => {
    try {
        // Check if user is admin
        if (!req.user.isAdmin) {
            return res.status(403).json({ message: "Access denied. Admin only." })
        }

        const product = await Product.create(req.body)
        res.status(201).json(product)
    } catch (error) {
        console.error("Create product error:", error)
        res.status(500).json({ message: "Error creating product" })
    }
})

// Update product (admin only)
router.put("/:id", auth, async (req, res) => {
    try {
        if (!req.user.isAdmin) {
            return res.status(403).json({ message: "Access denied. Admin only." })
        }

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        )

        if (!product) {
            return res.status(404).json({ message: "Product not found" })
        }

        res.json(product)
    } catch (error) {
        console.error("Update product error:", error)
        res.status(500).json({ message: "Error updating product" })
    }
})

// Delete product (admin only)
router.delete("/:id", auth, async (req, res) => {
    try {
        if (!req.user.isAdmin) {
            return res.status(403).json({ message: "Access denied. Admin only." })
        }

        const product = await Product.findByIdAndDelete(req.params.id)

        if (!product) {
            return res.status(404).json({ message: "Product not found" })
        }

        res.json({ message: "Product deleted successfully" })
    } catch (error) {
        console.error("Delete product error:", error)
        res.status(500).json({ message: "Error deleting product" })
    }
})

export default router
