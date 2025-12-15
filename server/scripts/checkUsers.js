// scripts/checkUsers.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import User from '../models/userModel.js';

// __dirname replacement for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });

async function checkUsers() {
  try {
    const mongoUri = process.env.MONGO_URI;
    await mongoose.connect(mongoUri, { keepAlive: true });
    console.log('✅ Connected to MongoDB');

    // Query all users
    const users = await User.find({}).sort({ createdAt: -1 });

    if (users.length === 0) {
      console.log('No users found in the database.');
    } else {
      console.log(`Found ${users.length} users:\n`);
      users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.name}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   Location: ${user.localisation || 'N/A'}`);
        console.log(`   ID: ${user._id}`);
        console.log(`   Password Hash: ${user.password}`);
        console.log('');
      });
    }
  } catch (err) {
    console.error('❌ Error querying users:', err);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

checkUsers();