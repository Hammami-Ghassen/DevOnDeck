import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/userModel.js';

dotenv.config();

async function verifyPassword(email, passwordToTest) {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/mydb';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      console.log(`❌ User with email ${email} not found`);
      return;
    }

    // Compare password
    const isMatch = await bcrypt.compare(passwordToTest, user.password);

    console.log(`\n🔐 Password Verification for ${user.name} (${user.email})`);
    console.log(`Password: "${passwordToTest}"`);
    console.log(`Result: ${isMatch ? '✅ CORRECT' : '❌ INCORRECT'}`);
    console.log('');

  } catch (err) {
    console.error('❌ Error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Test with command line arguments or hardcoded values
const email = process.argv[2] || 'test@t.t';
const password = process.argv[3] || '123456';

verifyPassword(email, password);