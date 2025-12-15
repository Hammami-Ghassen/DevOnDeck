// routes/adminRoutes.js
import express from 'express';
import * as adminController from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
const router = express.Router();

router.use(protect, adminOnly);

// GET /admin/users - Get all users (developers + organizations)
router.get('/users', adminController.getUsers);



// POST /admin/developers
router.post('/developers', adminController.createDeveloper);

// PUT /admin/developers/:id
router.put('/developers/:id', adminController.updateDeveloper);

// DELETE /admin/developers/:id
router.delete('/developers/:id', adminController.deleteDeveloper);

export default router;