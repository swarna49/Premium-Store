import express from "express"
import User from "../models/User.js"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import auth, { isAdmin } from "../middleware/auth.js"

const router = express.Router()

// Get all users (admin only)
router.get("/", auth, isAdmin, async (req, res) => {
    try {
        const users = await User.find({}, { password: 0 }).sort({ createdAt: -1 })
        res.json(users)
    } catch (error) {
        console.error("Get users error:", error)
        res.status(500).json({ message: "Error fetching users" })
    }
})

// Register new user
router.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body

        // Validate input
        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" })
        }

        // Hash password
        const hash = await bcrypt.hash(password, 10)

        // Create user
        const user = await User.create({ name, email, password: hash })

        // Generate token
        const token = jwt.sign(
            { id: user._id, isAdmin: user.isAdmin },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        )

        res.status(201).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin
            }
        })
    } catch (error) {
        console.error("Register error:", error)
        res.status(500).json({ message: "Server error during registration" })
    }
})

// Login user
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" })
        }

        // Find user
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" })
        }

        // Check password
        const isValidPassword = await bcrypt.compare(password, user.password)
        if (!isValidPassword) {
            return res.status(401).json({ message: "Invalid credentials" })
        }

        // Generate token
        const token = jwt.sign(
            { id: user._id, isAdmin: user.isAdmin },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        )

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin
            }
        })
    } catch (error) {
        console.error("Login error:", error)
        res.status(500).json({ message: "Server error during login" })
    }
})

export default router
