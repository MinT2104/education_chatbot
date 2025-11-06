import { AuthRequest } from '../../../shared/middleware/auth'
import { Response, NextFunction } from 'express'

export const getUsers = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // TODO: Implement get users
    res.json({ message: 'Get users endpoint' })
  } catch (error) {
    next(error)
  }
}

export const getStats = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // TODO: Implement get stats
    res.json({ message: 'Get stats endpoint' })
  } catch (error) {
    next(error)
  }
}


