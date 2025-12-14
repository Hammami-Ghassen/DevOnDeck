import express from 'express';
import { getDeveloperApplications } from '../controllers/applicationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get logged-in developer's applications
router.get('/my-applications', protect, getDeveloperApplications);

export default router;