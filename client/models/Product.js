import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Product name is required"],
        trim: true
    },
    price: {
        type: Number,
        required: [true, "Price is required"],
        min: [0, "Price cannot be negative"]
    },
    image: {
        type: String,
        required: [true, "Product image is required"]
    },
    description: {
        type: String,
        required: [true, "Description is required"],
        trim: true
    },
    category: {
        type: String,
        trim: true
    },
    stock: {
        type: Number,
        default: 0,
        min: [0, "Stock cannot be negative"]
    }
}, {
    timestamps: true
});

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);
