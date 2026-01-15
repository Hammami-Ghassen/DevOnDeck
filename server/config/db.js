import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    });
    console.log("MongoDB connected ✅");
  } catch (error) {
    console.error("MongoDB connection failed ❌", error.message);
    console.error("\n🔧 TO FIX THIS:");
    console.error("1. Go to https://cloud.mongodb.com/");
    console.error("2. Select your cluster");
    console.error("3. Click 'Network Access' → 'Add IP Address'");
    console.error("4. Click 'Allow Access from Anywhere' (0.0.0.0/0)");
    console.error("5. Restart this server\n");
    process.exit(1);
  }
};

export default connectDB;