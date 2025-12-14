import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "../models/userModel.js";
import connectDB from "../config/db.js";

// Load env vars
dotenv.config();

const addOrg = async () => {
    try {
        // Connect to Database
        await connectDB();

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

        // Create new organization user
        const user = await User.create({
            name: "Test Organization",
            email: email,
            password: hashedPassword,
            role: "organization",
            // Add default required fields if any specific to your schema validation
            // Based on previous view_file, other fields have defaults or are not required
        });

        console.log(`Organization created successfully: ${user.email} / ${password}`);
        process.exit(0);
    } catch (error) {
        console.error("Error adding organization:", error);
        process.exit(1);
    }
};

addOrg();
