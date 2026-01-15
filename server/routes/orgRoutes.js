import express from 'express';
import { getOrganizationOffers, getCandidateSearches, createOffer,updateOffer } from '../controllers/orgController.js';
import { protect, organizationOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/offers', protect, organizationOnly, getOrganizationOffers);
router.post('/offers', protect, organizationOnly, createOffer);
router.get('/searches', protect, organizationOnly, getCandidateSearches);
router.put('/offers/:id', protect, organizationOnly, updateOffer);

export default router;
