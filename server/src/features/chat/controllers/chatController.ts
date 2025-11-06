import { AuthRequest } from '../../../shared/middleware/auth'
import { Response, NextFunction } from 'express'
import { chatService } from '../services/chatService'
import { z } from 'zod'

const createChatSchema = z.object({
  userInput: z.string().min(1).max(10000),
  previousChat: z.array(z.any()).optional(),
  chatHistoryId: z.string().nullable().optional(),
  chatType: z.string().optional(),
})

export const createChat = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const validated = createChatSchema.parse(req.body)
    const chatType = validated.chatType || req.user.chatType || 'gemini_beta_public'

    const result = await chatService.createChat(
      req.user._id.toString(),
      validated.userInput,
      validated.previousChat || [],
      validated.chatHistoryId || null,
      chatType as any
    )

    res.json(result)
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ message: 'Invalid input', errors: error.errors })
    }
    next(error)
  }
}

export const getChatHistory = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const limit = parseInt(req.query.limit as string) || 20
    const skip = parseInt(req.query.skip as string) || 0

    const histories = await chatService.getChatHistory(
      req.user._id.toString(),
      limit,
      skip
    )

    res.json(histories)
  } catch (error) {
    next(error)
  }
}

export const getChatDetail = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const { id } = req.params
    const detail = await chatService.getChatDetail(id, req.user._id.toString())

    res.json(detail)
  } catch (error) {
    next(error)
  }
}

export const deleteChat = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const { id } = req.params
    const result = await chatService.deleteChat(id, req.user._id.toString())

    res.json(result)
  } catch (error) {
    next(error)
  }
}

export const deleteAllChats = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const result = await chatService.deleteAllChats(req.user._id.toString())

    res.json(result)
  } catch (error) {
    next(error)
  }
}

export const addToFavorites = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const { id } = req.params
    const result = await chatService.addToFavorites(id, req.user._id.toString())

    res.json(result)
  } catch (error) {
    next(error)
  }
}
