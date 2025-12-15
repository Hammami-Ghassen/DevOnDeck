import express from "express";
import { getDevelopersByOfferId  } from "../controllers/devController.js";
const router = express.Router();

router.get("/offers/:offerId", getDevelopersByOfferId);

export default router;