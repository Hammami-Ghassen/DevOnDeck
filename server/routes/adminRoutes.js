// routes/adminRoutes.js
import express from 'express';
import * as adminController from '../controllers/adminController.js';

const router = express.Router();

// GET /admin/developers
router.get('/developers', adminController.getDevelopers);

// POST /admin/developers
router.post('/developers', adminController.createDeveloper);

// PUT /admin/developers/:id
router.put('/developers/:id', adminController.updateDeveloper);

// DELETE /admin/developers/:id
router.delete('/developers/:id', adminController.deleteDeveloper);

export default router;
