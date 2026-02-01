import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    products: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },
        name: String,
        price: Number,
        quantity: {
            type: Number,
            required: true,
            min: 1
        }
    }],
    total: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
        default: "pending"
    },
    paid: {
        type: Boolean,
        default: false
    },
    paymentMethod: {
        type: String,
        default: "stripe"
    },
    shippingAddress: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String
    },
    stripeSessionId: String
}, {
    timestamps: true
});

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
