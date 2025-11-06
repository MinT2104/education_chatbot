import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { config } from '../config'
import { User } from '../../../models/User'
import { getCookieValue } from '../utils/cookieHandler'
import { AppError } from './errorHandler'

export interface AuthRequest extends Request {
  user?: any
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get token from Authorization header or cookie
    let token: string | undefined =
      req.headers.authorization?.split(' ')[1] ||
      req.cookies?.access_token ||
      getCookieValue(req.headers.cookie || '', 'access_token')

    if (!token) {
      throw new AppError('Authentication required', 401)
    }

    // Verify token
    const decoded = jwt.verify(token, config.jwt.secret) as { email: string; userId: string }

    // Get user from database
    const user = await User.findOne({ email: decoded.email }).select(
      '-password -chatHistory -sentEmailRateLimit -emailVerification'
    )

    if (!user) {
      throw new AppError('User not found', 401)
    }

    // Attach user to request
    req.user = user
    next()
  } catch (error: any) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return next(new AppError('Invalid or expired token', 401))
    }
    next(error)
  }
}

// Middleware to check if user is admin
export const adminMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return next(new AppError('Authentication required', 401))
  }

  if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
    return next(new AppError('Admin access required', 403))
  }

  next()
}


