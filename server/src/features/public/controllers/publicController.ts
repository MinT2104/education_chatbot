import { Request, Response, NextFunction } from 'express'

export const getLanguages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // TODO: Implement get languages
    res.json({ languages: [] })
  } catch (error) {
    next(error)
  }
}

export const getConfig = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // TODO: Implement get config
    res.json({ config: {} })
  } catch (error) {
    next(error)
  }
}


