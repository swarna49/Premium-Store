import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import connectDB from "./config/db.js"

import userRoutes from "./routes/userRoutes.js"
import productRoutes from "./routes/productRoutes.js"
import orderRoutes from "./routes/orderRoutes.js"

dotenv.config()
connectDB()

const app = express()

// Request logger
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`)
    next()
})

// CORS configuration
console.log('CLIENT_URL:', process.env.CLIENT_URL);
app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        // or any localhost origin for development
        if (!origin || origin.startsWith('http://localhost:')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}))

// Webhook route MUST come before express.json() to preserve raw body
app.use("/api/orders/webhook", orderRoutes)

// Body parsing middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use("/api/users", userRoutes)
app.use("/api/products", productRoutes)
app.use("/api/orders", orderRoutes)

// Health check route
app.get("/health", (req, res) => {
    res.json({ status: "OK", message: "Server is running" })
})

// Error handling middleware
app.use((err, req, res, next) => {
    console.error("Error:", err.stack)
    res.status(err.status || 500).json({
        message: err.message || "Internal server error",
        ...(process.env.NODE_ENV === "development" && { stack: err.stack })
    })
})

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`)
    console.log(`Environment: ${process.env.NODE_ENV || "development"}`)
})
