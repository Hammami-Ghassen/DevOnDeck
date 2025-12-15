import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { fileURLToPath } from 'url';
import path from 'path';
import User from "../models/userModel.js";

// __dirname replacement for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars from parent directory (same as addDevs.js)
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const addOrg = async () => {
    try {
        // Verify MONGO_URI is loaded
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is not defined in environment variables");
        }

        // Connect to Database (same pattern as addDevs.js)
        await mongoose.connect(process.env.MONGO_URI, { keepAlive: true });
        console.log("✅ Connected to MongoDB");

        const email = "org@test.com";
        const password = "password123";

        // Check if user already exists
        const userExists = await User.findOne({ email });

        if (userExists) {
            console.log("Organization user already exists");
            process.exit(0);
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create organization user
        const user = await User.create({
            email,
            password: hashedPassword,
            role: "organization",
            name: "Test Organization"
        });

        console.log("✅ Organization user created successfully");
        console.log(`Email: ${user.email}`);
    } catch (error) {
        console.error("❌ Error:", error.message);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        console.log("🔌 Disconnected from MongoDB");
    }
};

addOrg();