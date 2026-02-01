import User from "./models/User.js";
import connectDB from "./config/db.js";
import dotenv from "dotenv";

dotenv.config();

try {
    await connectDB();
    const users = await User.find({}, { password: 0 }); // Don't show passwords
    console.log("Users in DB:", users);
    process.exit(0);
} catch (error) {
    console.error("Error checking users:", error);
    process.exit(1);
}
