import dbConnect from "../../../utils/dbConnect";
import User from "../../../models/User";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
    if (req.method !== "GET") return res.status(405).json({ message: "Method not allowed" });

    await dbConnect();

    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return res.status(401).json({ message: "No token provided" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded.isAdmin) return res.status(403).json({ message: "Admin access required" });

        const users = await User.find({}, { password: 0 }).sort({ createdAt: -1 });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users" });
    }
}
