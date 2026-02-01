import mongoose from "mongoose"
import dotenv from "dotenv"
import Product from "./models/product.js"

dotenv.config()

const products = [
    {
        name: "Premium Wireless Headphones",
        price: 16599,
        description: "High-quality wireless headphones with active noise cancellation and 30-hour battery life. Perfect for music lovers and professionals.",
        category: "Electronics",
        stock: 50,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop"
    },
    {
        name: "Smart Watch Pro",
        price: 24899,
        description: "Advanced smartwatch with fitness tracking, heart rate monitor, GPS, and 7-day battery life. Stay connected and healthy.",
        category: "Electronics",
        stock: 35,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop"
    },
    {
        name: "Designer Backpack",
        price: 7499,
        description: "Stylish and durable backpack with laptop compartment, USB charging port, and water-resistant material. Perfect for work or travel.",
        category: "Fashion",
        stock: 75,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop"
    },
    {
        name: "Portable Bluetooth Speaker",
        price: 6649,
        description: "Powerful portable speaker with 360° sound, waterproof design, and 12-hour playtime. Take your music anywhere.",
        category: "Electronics",
        stock: 60,
        image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&h=500&fit=crop"
    },
    {
        name: "Premium Coffee Maker",
        price: 12449,
        description: "Professional-grade coffee maker with programmable settings, thermal carafe, and built-in grinder. Brew café-quality coffee at home.",
        category: "Home & Kitchen",
        stock: 40,
        image: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500&h=500&fit=crop"
    },
    {
        name: "Yoga Mat Premium",
        price: 4149,
        description: "Extra-thick yoga mat with non-slip surface, eco-friendly material, and carrying strap. Perfect for yoga, pilates, and fitness.",
        category: "Sports & Fitness",
        stock: 100,
        image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500&h=500&fit=crop"
    },
    {
        name: "Wireless Gaming Mouse",
        price: 5809,
        description: "High-precision gaming mouse with RGB lighting, programmable buttons, and 20,000 DPI sensor. Dominate your games.",
        category: "Electronics",
        stock: 45,
        image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=500&h=500&fit=crop"
    },
    {
        name: "Stainless Steel Water Bottle",
        price: 2489,
        description: "Insulated water bottle keeps drinks cold for 24 hours or hot for 12 hours. BPA-free, leak-proof, and eco-friendly.",
        category: "Sports & Fitness",
        stock: 120,
        image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&h=500&fit=crop"
    },
    {
        name: "LED Desk Lamp",
        price: 3319,
        description: "Modern LED desk lamp with adjustable brightness, color temperature control, and USB charging port. Perfect for work and study.",
        category: "Home & Kitchen",
        stock: 65,
        image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&h=500&fit=crop"
    },
    {
        name: "Wireless Earbuds Pro",
        price: 10789,
        description: "True wireless earbuds with active noise cancellation, touch controls, and 24-hour battery with charging case.",
        category: "Electronics",
        stock: 8,
        image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&h=500&fit=crop"
    },
    {
        name: "Canvas Tote Bag",
        price: 2074,
        description: "Eco-friendly canvas tote bag with reinforced handles and inner pocket. Perfect for shopping, beach, or everyday use.",
        category: "Fashion",
        stock: 90,
        image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=500&h=500&fit=crop"
    },
    {
        name: "Portable Phone Charger",
        price: 2904,
        description: "High-capacity 20,000mAh power bank with fast charging, dual USB ports, and LED display. Never run out of battery.",
        category: "Electronics",
        stock: 55,
        image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500&h=500&fit=crop"
    },
    {
        name: "Sunglasses Classic",
        price: 4979,
        description: "Polarized sunglasses with UV400 protection, durable frame, and stylish design. Perfect for driving and outdoor activities.",
        category: "Fashion",
        stock: 0,
        image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&h=500&fit=crop"
    },
    {
        name: "Resistance Bands Set",
        price: 1659,
        description: "Complete set of 5 resistance bands with different strength levels, door anchor, and carrying bag. Perfect for home workouts.",
        category: "Sports & Fitness",
        stock: 85,
        image: "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=500&h=500&fit=crop"
    },
    {
        name: "Ceramic Plant Pot Set",
        price: 3734,
        description: "Set of 3 modern ceramic plant pots with drainage holes and saucers. Perfect for indoor plants and home decoration.",
        category: "Home & Kitchen",
        stock: 70,
        image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500&h=500&fit=crop"
    }
]

const seedProducts = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI)
        console.log("✅ MongoDB Connected")

        // Clear existing products
        await Product.deleteMany({})
        console.log("🗑️  Cleared existing products")

        // Insert new products
        const createdProducts = await Product.insertMany(products)
        console.log(`✅ Added ${createdProducts.length} products`)

        console.log("\n📦 Products added:")
        createdProducts.forEach((product, index) => {
            console.log(`${index + 1}. ${product.name} - $${product.price} (${product.stock} in stock)`)
        })

        console.log("\n🎉 Database seeded successfully!")
        console.log("🌐 Visit http://localhost:3000 to see your products!")

        process.exit(0)
    } catch (error) {
        console.error("❌ Error seeding database:", error)
        process.exit(1)
    }
}

seedProducts()
