import express from "express";
import { getDevelopersByOfferId, getMatchingScore } from "../controllers/devController.js";
const router = express.Router();

router.get("/offers/:offerId", getDevelopersByOfferId);
router.get("/matching/:offerId/:developerId", getMatchingScore);

export default router;