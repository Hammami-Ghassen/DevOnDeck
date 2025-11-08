import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import adminRoutes from './routes/adminRoutes.js';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js'; 
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
app.use('/auth', authRoutes); 


const PORT = process.env.PORT;

const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`✅ Server listening on http://localhost:${PORT}`);
  });
};

start();
