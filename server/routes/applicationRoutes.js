import express from 'express';
import { getDeveloperApplications, updateApplicationStatus } from '../controllers/applicationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get logged-in developer's applications
router.get('/my-applications/:developerId', protect, getDeveloperApplications);

// Update application status (accept/reject)
router.put('/:applicationId/status', protect, updateApplicationStatus);

export default router;