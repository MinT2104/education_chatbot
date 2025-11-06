import { Router } from 'express'
import { authMiddleware, adminMiddleware } from '../../shared/middleware/auth'
import * as adminController from '../controllers/adminController'

const router = Router()

router.use(authMiddleware) // Require authentication
router.use(adminMiddleware) // Require admin role

// Admin routes
router.get('/users', adminController.getUsers)
router.get('/stats', adminController.getStats)

export default router


