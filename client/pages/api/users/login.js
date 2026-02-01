import dbConnect from "../../../utils/dbConnect";
import User from "../../../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

    await dbConnect();

    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(401).json({ message: "Invalid credentials" });

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return res.status(401).json({ message: "Invalid credentials" });

        const token = jwt.sign(
            { id: user._id, isAdmin: user.isAdmin },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(200).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Server error during login" });
    }
}
