import express from 'express';
import { register, login, refreshAccessToken, logout, getMe } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refreshAccessToken);
router.post('/logout', logout);

// Protected route
router.get('/me', protect, getMe);

export default router;