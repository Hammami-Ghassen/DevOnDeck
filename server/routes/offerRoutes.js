import express from 'express';
import { getAllOffers, getOfferById, applyToOffer } from '../controllers/offerController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllOffers);
router.get('/:id', getOfferById);

// Protected route (developers only)
router.post('/:id/apply', protect, applyToOffer);

export default router;