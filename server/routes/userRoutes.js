// userRoutes.js
import { Router } from 'express'
import * as userController from '../controllers/userController.js'

const router = Router()

router.get("/:id", userController.fetchDeveloper)
router.put("/:id", userController.updateDeveloper)

export default router
