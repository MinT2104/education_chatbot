import { Request, Response, NextFunction } from 'express'
import { authService } from '../services/authService'
import { AppError } from '../../../shared/middleware/errorHandler'

export const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.signup(req.body)
    res.status(201).json(result)
  } catch (error) {
    next(error)
  }
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.login(req.body, res)
    res.json(result)
  } catch (error) {
    next(error)
  }
}

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await authService.logout(req)
    res.json({ message: 'Logged out successfully' })
  } catch (error) {
    next(error)
  }
}

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.refreshToken(req)
    res.json(result)
  } catch (error) {
    next(error)
  }
}

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await authService.getMe(req)
    res.json(user)
  } catch (error) {
    next(error)
  }
}

export const googleAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.googleAuth(req.query.code as string)
    res.json(result)
  } catch (error) {
    next(error)
  }
}

export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await authService.verifyEmail(req.body.email, req.body.code)
    res.json({ message: 'Email verified successfully' })
  } catch (error) {
    next(error)
  }
}

export const resendVerificationEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await authService.resendVerificationEmail(req.body.email)
    res.json({ message: 'Verification email sent' })
  } catch (error) {
    next(error)
  }
}

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await authService.forgotPassword(req.body.email)
    res.json({ message: 'Password reset email sent' })
  } catch (error) {
    next(error)
  }
}

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await authService.resetPassword(req.body.email, req.body.code, req.body.password)
    res.json({ message: 'Password reset successfully' })
  } catch (error) {
    next(error)
  }
}

