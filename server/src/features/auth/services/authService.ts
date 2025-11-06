import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { Request, Response } from 'express'
import { config } from '../../../shared/config'
import { User } from '../../../models/User'
import { setCookieOptions } from '../../../shared/utils/cookieHandler'
import { AppError } from '../../../shared/middleware/errorHandler'
// TODO: Import email service when implemented

export const authService = {
  async signup(data: { name: string; email: string; password: string }) {
    // Check if user exists
    const existingUser = await User.findOne({ email: data.email })
    if (existingUser) {
      throw new AppError('User already exists', 400)
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 12)

    // Create user
    const user = await User.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
    })

    // TODO: Send verification email

    return { email: user.email }
  },

  async login(data: { email: string; password: string }, res?: Response) {
    // Find user
    const user = await User.findOne({ email: data.email })
    if (!user) {
      throw new AppError('Invalid credentials', 401)
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(data.password, user.password)
    if (!isValidPassword) {
      throw new AppError('Invalid credentials', 401)
    }

    // Generate tokens
    const accessToken = jwt.sign(
      { userId: user._id, email: user.email },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    )

    const refreshToken = jwt.sign(
      { userId: user._id, email: user.email },
      config.jwt.refreshSecret,
      { expiresIn: config.jwt.refreshExpiresIn }
    )

    // Store refresh token in database
    user.refreshToken = refreshToken
    await user.save()

    // Set HTTP-only cookies
    if (res) {
      res.cookie('access_token', accessToken, setCookieOptions(15 * 60 * 1000)) // 15 minutes
      res.cookie('refresh_token', refreshToken, setCookieOptions(7 * 24 * 60 * 60 * 1000)) // 7 days
    }

    // Remove sensitive data
    const userObj = user.toObject()
    delete userObj.password
    delete userObj.refreshToken

    return {
      user: userObj,
      accessToken,
      refreshToken,
    }
  },

  async logout(req: Request) {
    const token = req.cookies?.refresh_token || req.headers.authorization?.split(' ')[1]
    if (token) {
      try {
        const decoded = jwt.verify(token, config.jwt.refreshSecret) as { email: string }
        await User.updateOne({ email: decoded.email }, { $unset: { refreshToken: 1 } })
      } catch (error) {
        // Token invalid, but still logout
      }
    }
  },

  async refreshToken(req: Request) {
    const refreshToken = req.cookies?.refresh_token || req.body.refreshToken

    if (!refreshToken) {
      throw new AppError('Refresh token required', 401)
    }

    try {
      const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret) as {
        userId: string
        email: string
      }

      const user = await User.findOne({ email: decoded.email })
      if (!user || user.refreshToken !== refreshToken) {
        throw new AppError('Invalid refresh token', 401)
      }

      // Generate new tokens
      const newAccessToken = jwt.sign(
        { userId: user._id, email: user.email },
        config.jwt.secret,
        { expiresIn: config.jwt.expiresIn }
      )

      const newRefreshToken = jwt.sign(
        { userId: user._id, email: user.email },
        config.jwt.refreshSecret,
        { expiresIn: config.jwt.refreshExpiresIn }
      )

      // Update refresh token in database
      user.refreshToken = newRefreshToken
      await user.save()

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      }
    } catch (error: any) {
      throw new AppError('Invalid refresh token', 401)
    }
  },

  async getMe(req: Request) {
    // This assumes authMiddleware has already set req.user
    const token = req.headers.authorization?.split(' ')[1] || req.cookies?.access_token
    if (!token) {
      throw new AppError('Authentication required', 401)
    }

    const decoded = jwt.verify(token, config.jwt.secret) as { email: string }
    const user = await User.findOne({ email: decoded.email }).select('-password -refreshToken')
    if (!user) {
      throw new AppError('User not found', 404)
    }

    return user
  },

  async googleAuth(code: string) {
    // TODO: Implement Google OAuth
    throw new AppError('Google OAuth not yet implemented', 501)
  },

  async verifyEmail(email: string, code: string) {
    // TODO: Implement email verification
    throw new AppError('Email verification not yet implemented', 501)
  },

  async resendVerificationEmail(email: string) {
    // TODO: Implement resend verification email
    throw new AppError('Resend verification email not yet implemented', 501)
  },

  async forgotPassword(email: string) {
    // TODO: Implement forgot password
    throw new AppError('Forgot password not yet implemented', 501)
  },

  async resetPassword(email: string, code: string, password: string) {
    // TODO: Implement reset password
    throw new AppError('Reset password not yet implemented', 501)
  },
}

