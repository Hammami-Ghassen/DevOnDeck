import express from 'express';
import { getOrganizationOffers, getCandidateSearches } from '../controllers/searchController.js';
import { protect, organizationOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/offers', protect, organizationOnly, getOrganizationOffers);
router.get('/searches', protect, organizationOnly, getCandidateSearches);

export default router;
