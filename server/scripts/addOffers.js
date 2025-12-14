import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Offer from '../models/offerModel.js';
import User from '../models/userModel.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const addOffers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✓ Connected to MongoDB');

    // Read offers from JSON file
    const offersPath = path.join(__dirname, '../data/offers.json');
    const offersData = JSON.parse(fs.readFileSync(offersPath, 'utf-8'));
    
    // Get or create organization users
    const orgMapping = {};
    
    // Find existing organizations or use the first organization user
    const organizations = await User.find({ role: 'organization' });
    
    if (organizations.length === 0) {
      console.error('✗ No organization users found in database.');
      console.log('Please create at least one organization user first.');
      process.exit(1);
    }
    
    console.log(`✓ Found ${organizations.length} organization(s)`);
    
    // Map string IDs to actual ObjectIds (cycle through available orgs)
    const uniqueOrgIds = [...new Set(offersData.offers.map(o => o.organizationId))];
    uniqueOrgIds.forEach((stringId, index) => {
      orgMapping[stringId] = organizations[index % organizations.length]._id;
    });
    
    console.log('✓ Organization ID mapping created');
    
    // Transform offers with valid ObjectIds
    const transformedOffers = offersData.offers.map(offer => ({
      ...offer,
      organizationId: orgMapping[offer.organizationId]
    }));
    
    // Clear existing offers (optional - comment out to keep existing)
    await Offer.deleteMany({});
    console.log('✓ Cleared existing offers');

    // Insert offers
    const insertedOffers = await Offer.insertMany(transformedOffers);
    console.log(`✓ Added ${insertedOffers.length} offers successfully`);

    // Display summary
    console.log('\nOffers Summary:');
    insertedOffers.forEach((offer, index) => {
      console.log(`${index + 1}. ${offer.title} - ${offer.contractType} - ${offer.status}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('✗ Error adding offers:', error.message);
    process.exit(1);
  }
};

addOffers();