import express from 'express';
import { getOrganizationOffers, getCandidateSearches, createOffer } from '../controllers/searchController.js';
import { protect, organizationOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/offers', protect, organizationOnly, getOrganizationOffers);
router.post('/offers', protect, organizationOnly, createOffer);
router.get('/searches', protect, organizationOnly, getCandidateSearches);

export default router;
