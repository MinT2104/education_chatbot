import { Router } from 'express'
import { authRateLimiter } from '../../shared/middleware/rateLimiter'
import * as authController from '../controllers/authController'

const router = Router()

router.post('/signup', authRateLimiter, authController.signup)
router.post('/login', authRateLimiter, authController.login)
router.post('/logout', authController.logout)
router.post('/refresh', authController.refreshToken)
router.get('/me', authController.getMe)
router.get('/google', authController.googleAuth)
router.post('/email-verification', authRateLimiter, authController.verifyEmail)
router.post('/resend-email-verification', authRateLimiter, authController.resendVerificationEmail)
router.post('/forgot', authRateLimiter, authController.forgotPassword)
router.post('/reset-password', authRateLimiter, authController.resetPassword)

export default router


