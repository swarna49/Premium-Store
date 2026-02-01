import dbConnect from "../../utils/dbConnect";
import Product from "../../models/Product";
import User from "../../models/User";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
    if (req.method !== "GET") return res.status(405).end();

    await dbConnect();

    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ message: "No token provided" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded.isAdmin) return res.status(403).json({ message: "Admin access required" });

        const totalProducts = await Product.countDocuments();
        const totalUsers = await User.countDocuments();
        const outOfStock = await Product.countDocuments({ stock: 0 });

        res.status(200).json({
            totalProducts,
            totalUsers,
            outOfStock
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching stats" });
    }
}
