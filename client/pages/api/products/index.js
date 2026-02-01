import dbConnect from "../../../utils/dbConnect";
import Product from "../../../models/Product";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
    await dbConnect();

    const { method } = req;

    switch (method) {
        case "GET":
            try {
                const { search, category, sort } = req.query;
                let query = {};

                if (search) {
                    query.name = { $regex: search, $options: "i" };
                }
                if (category) {
                    query.category = category;
                }

                let productsQuery = Product.find(query);

                if (sort === "newest") productsQuery = productsQuery.sort({ createdAt: -1 });
                else if (sort === "price-low") productsQuery = productsQuery.sort({ price: 1 });
                else if (sort === "price-high") productsQuery = productsQuery.sort({ price: -1 });

                const products = await productsQuery;
                res.status(200).json(products);
            } catch (error) {
                res.status(400).json({ message: "Error fetching products" });
            }
            break;

        case "POST":
            // Admin only check
            try {
                const token = req.headers.authorization?.split(" ")[1];
                if (!token) return res.status(401).json({ message: "No token provided" });

                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                if (!decoded.isAdmin) return res.status(403).json({ message: "Admin access required" });

                const product = await Product.create(req.body);
                res.status(201).json(product);
            } catch (error) {
                res.status(400).json({ message: "Error creating product" });
            }
            break;

        default:
            res.setHeader("Allow", ["GET", "POST"]);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}
