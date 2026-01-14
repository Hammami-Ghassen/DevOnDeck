import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { fileURLToPath } from 'url';
import path from 'path';
import User from "../models/userModel.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const addDeveloper = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is not defined");
        }

        await mongoose.connect(process.env.MONGO_URI, { keepAlive: true });
        console.log("✅ Connected to MongoDB");

        const email = "dev@test.com";
        const password = "dev123";

        const userExists = await User.findOne({ email });

        if (userExists) {
            console.log("❌ Developer user already exists");
            console.log(`Email: ${email}`);
            console.log(`Password: ${password}`);
            process.exit(0);
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            email,
            password: hashedPassword,
            role: "developer",
            name: "Developer Test",
            skills: ["JavaScript", "React", "Node.js"],
            frameworks: ["Express", "MongoDB"],
            localisation: "Paris, France",
            contact: {
                mail: "dev@test.com",
                numero: "+33 6 12 34 56 78"
            },
            bio: "Développeur full-stack passionné avec 3 ans d'expérience"
        });

        console.log("✅ Developer user created successfully!");
        console.log(`Email: ${user.email}`);
        console.log(`Password: ${password}`);
        console.log(`Role: ${user.role}`);

        process.exit(0);
    } catch (error) {
        console.error("❌ Error:", error.message);
        process.exit(1);
    }
};

addDeveloper();
