import express from "express";
import { getDeveloperById , updateDeveloper} from "../controllers/userController.js";

const router = express.Router();

// GET développeur par id
router.get("/:id", getDeveloperById);

// PUT mise à jour développeur
router.put("/:id", protect, updateDeveloper);

export default router;
