// scripts/checkDevelopers.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/userModel.js'; // <-- include .js extension

dotenv.config();

async function checkDevelopers() {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/mydb';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Query all developers
    const developers = await User.find({ role: 'developer' }).sort({ createdAt: -1 });

    if (developers.length === 0) {
      console.log('No developers found in the database.');
    } else {
      console.log(`Found ${developers.length} developers:\n`);
      developers.forEach((dev, index) => {
        console.log(`${index + 1}. ${dev.name} | ${dev.email} | ${dev.localisation}`);
      });
    }
  } catch (err) {
    console.error('❌ Error querying developers:', err);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the script
checkDevelopers();
