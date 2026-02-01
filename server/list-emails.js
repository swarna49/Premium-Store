import User from "./models/User.js";
import connectDB from "./config/db.js";
import dotenv from "dotenv";

dotenv.config();

try {
    await connectDB();
    const users = await User.find({}, { email: 1 });
    console.log("Emails in DB:", users.map(u => u.email));
    process.exit(0);
} catch (error) {
    console.error("Error:", error);
    process.exit(1);
}
