import User from "./models/User.js";
import connectDB from "./config/db.js";
import dotenv from "dotenv";

dotenv.config();

try {
    await connectDB();
    const admins = await User.find({ isAdmin: true }, { email: 1 });
    console.log("Current Admin Emails:", admins.map(a => a.email));
    process.exit(0);
} catch (error) {
    console.error("Error:", error);
    process.exit(1);
}
