import dbConnect from "../../utils/dbConnect";
import Product from "../../models/Product";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
    const { id } = req.query;
    const { method } = req;

    await dbConnect();

    // Admin auth helper
    const verifyAdmin = () => {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) throw new Error("401");
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded.isAdmin) throw new Error("403");
    };

    switch (method) {
        case "GET":
            try {
                const product = await Product.findById(id);
                if (!product) return res.status(404).json({ message: "Product not found" });
                res.status(200).json(product);
            } catch (error) {
                res.status(400).json({ message: "Error fetching product" });
            }
            break;

        case "PUT":
            try {
                verifyAdmin();
                const product = await Product.findByIdAndUpdate(id, req.body, { new: true });
                res.status(200).json(product);
            } catch (error) {
                const status = error.message === "401" ? 401 : error.message === "403" ? 403 : 400;
                res.status(status).json({ message: error.message });
            }
            break;

        case "DELETE":
            try {
                verifyAdmin();
                await Product.findByIdAndDelete(id);
                res.status(200).json({ message: "Product deleted" });
            } catch (error) {
                const status = error.message === "401" ? 401 : error.message === "403" ? 403 : 400;
                res.status(status).json({ message: error.message });
            }
            break;

        default:
            res.status(405).end();
    }
}
