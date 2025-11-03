import { Request, Response, NextFunction } from 'express'
import { logger } from '../../core/logger'

export class AppError extends Error {
  statusCode: number
  isOperational: boolean

  constructor(message: string, statusCode: number = 500) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = true
    Error.captureStackTrace(this, this.constructor)
  }
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err instanceof AppError ? err.statusCode : 500
  const message = err.message || 'Internal Server Error'

  // Log error
  logger.error({
    error: err,
    url: `${req.method} ${req.url}`,
    ip: req.ip,
    userAgent: req.get('user-agent'),
    stack: err.stack,
  })

  // Don't leak error details in production
  const isDevelopment = process.env.NODE_ENV === 'development'

  res.status(statusCode).json({
    message,
    ...(isDevelopment && { stack: err.stack }),
    ...(isDevelopment && { error: err }),
  })
}
