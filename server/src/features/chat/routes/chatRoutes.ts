import { Router } from 'express'
import { authMiddleware } from '../../shared/middleware/auth'
import { chatRateLimiter } from '../../shared/middleware/rateLimiter'
import * as chatController from '../controllers/chatController'

const router = Router()

router.use(authMiddleware) // All chat routes require authentication
router.use(chatRateLimiter) // Apply rate limiting

router.get('/history', chatController.getChatHistory)
router.get('/history/:id', chatController.getChatDetail)
router.post('/', chatController.createChat)
router.delete('/history/:id', chatController.deleteChat)
router.delete('/history', chatController.deleteAllChats)
router.post('/favorite/:id', chatController.addToFavorites)

export default router


