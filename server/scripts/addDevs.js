// scripts/addDevs.js (ESM)
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import User from '../models/userModel.js'; // <-- IMPORTANT: include .js extension

// __dirname replacement for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });


// path to JSON (project-root/data/developers.json)
const jsonPath = path.join(__dirname, '..', 'data', 'developers.json');

async function run() {
  try {
    // ensure file exists
    if (!fs.existsSync(jsonPath)) {
      throw new Error(`JSON file not found at ${jsonPath}`);
    }

    const raw = fs.readFileSync(jsonPath, 'utf8');
    const parsed = JSON.parse(raw);
    const developers = parsed.developers ?? parsed; // support both { developers: [...] } or direct array

    if (!Array.isArray(developers) || developers.length === 0) {
      console.log('No developers found in JSON file. Exiting.');
      return;
    }

    const mongoUri = process.env.MONGO_URI;
    await mongoose.connect(mongoUri, { keepAlive: true });
    console.log('✅ Connected to MongoDB');

    // Optional: clear collection first
    await User.deleteMany({});
    console.log('🗑️  Cleared users collection');

    const inserted = await User.insertMany(developers);
    console.log(`✅ Inserted ${inserted.length} developers`);

  } catch (err) {
    console.error('❌ Error seeding developers:', err);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

run();
