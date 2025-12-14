import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import adminRoutes from './routes/adminRoutes.js';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import searchRoutes from './routes/searchRoutes.js';
import offerRoutes from './routes/offerRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import devRoutes from "./routes/devRoutes.js"
dotenv.config();

const app = express();

// CORS configuration - allow credentials (cookies)
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173', process.env.CLIENT_URL],
  credentials: true
}));

// Middleware
app.use(express.json());
app.use(cookieParser());

// Health check
app.get('/', (_req, res) => res.send('API running'));

// Mount routes
app.use('/admin', adminRoutes);
app.use('/users', userRoutes);
app.use('/auth', authRoutes);
app.use('/organization', searchRoutes);
app.use('/offers', offerRoutes);
app.use('/applications', applicationRoutes);
app.use('/developers', devRoutes);
const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`✅ Server listening on http://localhost:${PORT}`);
  });
};

start();