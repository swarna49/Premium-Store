import User from "./models/User.js";
import connectDB from "./config/db.js";
import dotenv from "dotenv";

dotenv.config();

const makeAdmin = async (email) => {
    try {
        await connectDB();
        const user = await User.findOneAndUpdate(
            { email: email.toLowerCase() },
            { isAdmin: true },
            { new: true }
        );
        if (user) {
            console.log(`User ${user.email} is now an admin!`);
        } else {
            console.log(`User with email ${email} not found.`);
        }
        process.exit(0);
    } catch (error) {
        console.error("Error making admin:", error);
        process.exit(1);
    }
};

// Check if email is provided
const emailArg = process.argv[2];
if (!emailArg) {
    console.log("Please provide an email address: node make-admin.js user@example.com");
    process.exit(1);
}

makeAdmin(emailArg);
