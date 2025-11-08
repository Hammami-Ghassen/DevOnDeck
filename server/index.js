import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import adminRoutes from './routes/adminRoutes.js';
import userRoutes from './routes/userRoutes.js';

import cors from 'cors';

// server/index.js

dotenv.config();


const app = express();
app.use(cors());

// Middleware
app.use(express.json());

// Health check
app.get('/', (_req, res) => res.send('API running'));

// Mount admin routes
app.use('/admin', adminRoutes);
app.use('/users', userRoutes);

const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
};

start();
