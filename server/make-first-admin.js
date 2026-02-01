import User from "./models/User.js";
import connectDB from "./config/db.js";
import dotenv from "dotenv";

dotenv.config();

try {
    await connectDB();
    const user = await User.findOne();
    if (user) {
        user.isAdmin = true;
        await user.save();
        console.log(`User ${user.email} is now ADMIN!`);
    } else {
        console.log("No users found");
    }
    process.exit(0);
} catch (error) {
    console.error("Error:", error);
    process.exit(1);
}
