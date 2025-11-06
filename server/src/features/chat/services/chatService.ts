import axios from 'axios'
import { Chat } from '../../../models/Chat'
import { ChatHistory } from '../../../models/ChatHistory'
import { User } from '../../../models/User'
import { CHAT_TYPE, ChatType } from '../../../shared/config/constants'
import { AppError } from '../../../shared/middleware/errorHandler'

const CHAT_ENDPOINT = process.env.CHAT_ENDPOINT || 'http://3.139.169.72:8001'
const CHAT_ENDPOINT_2 = process.env.CHAT_ENDPOINT_2 || 'http://3.139.169.72:8003'
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'f5b4de17-25f0-4570-ae6b-e28bdf9ab15a'

const getChatEndpoint = (type: ChatType): string => {
  switch (type) {
    case CHAT_TYPE.DEEPSEEK:
    case CHAT_TYPE.UPGRADE:
      return CHAT_ENDPOINT_2
    default:
      return CHAT_ENDPOINT
  }
}

const getModelName = (type: ChatType): string => {
  switch (type) {
    case CHAT_TYPE.GPT_PRIVATE:
    case CHAT_TYPE.GPT_PUBLIC:
      return 'gpt4'
    case CHAT_TYPE.PUBLIC:
    case CHAT_TYPE.PRIVATE:
      return 'deepseek-v3.2-exp'
    case CHAT_TYPE.PRIVATE_O3:
    case CHAT_TYPE.PUBLIC_O3:
      return 'gpto3'
    case CHAT_TYPE.DEEPSEEK:
      return 'deepseek'
    case CHAT_TYPE.DEEPSEEK_V3_PUBLIC:
    case CHAT_TYPE.DEEPSEEK_V3_PRIVATE:
      return 'deepseek-v3.2-exp'
    case CHAT_TYPE.GEMINI_BETA_PUBLIC:
    case CHAT_TYPE.GEMINI_BETA_PRIVATE:
      return 'gemini-2.0-flash-lite'
    default:
      return 'gpt4'
  }
}

const getChatType = (type: ChatType): string => {
  switch (type) {
    case CHAT_TYPE.GPT_PUBLIC:
    case CHAT_TYPE.PUBLIC:
    case CHAT_TYPE.PUBLIC_O3:
    case CHAT_TYPE.GEMINI_BETA_PUBLIC:
    case CHAT_TYPE.DEEPSEEK_V3_PUBLIC:
      return 'public'
    default:
      return 'private'
  }
}

const isTellMore = (msg: string): boolean => {
  const lowerMsg = msg.toLowerCase().trim()
  return lowerMsg === 'tell me more' || lowerMsg === 'tell me more.'
}

export const chatService = {
  async createChat(
    userId: string,
    userInput: string,
    previousChat: any[],
    chatHistoryId: string | null,
    chatType: ChatType
  ) {
    try {
      const user = await User.findById(userId)
      if (!user) {
        throw new AppError('User not found', 404)
      }

      // Handle "Tell me more"
      let sessionId: string | null = null
      if (isTellMore(userInput)) {
        const recentChat = await Chat.findOne({
          'messages.sender': userId,
        }).sort({ _id: -1 })

        if (recentChat) {
          const chatHis = await ChatHistory.findById(recentChat.chatHistory)
          sessionId = chatHis?.sessionId || null
        }
      }

      // Get or create chat history
      let chatHistory = chatHistoryId
        ? await ChatHistory.findById(chatHistoryId)
        : null

      if (!chatHistory) {
        // Create new chat history
        const title = userInput.substring(0, 50) || 'New Chat'
        chatHistory = await ChatHistory.create({
          title,
          user: userId as any,
          sessionId: sessionId || undefined,
        })
      } else {
        // Update session ID if we got a new one
        if (sessionId && !chatHistory.sessionId) {
          chatHistory.sessionId = sessionId
          await chatHistory.save()
        }
        sessionId = chatHistory.sessionId || sessionId
      }

      // Call AI service
      const endpoint = getChatEndpoint(chatType)
      const response = await axios({
        url: `${endpoint}/chat`,
        method: 'post',
        timeout: 180000, // 3 minutes
        headers: {
          'Content-Type': 'application/json',
        },
        data: JSON.stringify({
          user_input: userInput,
          context_window: 50,
          sent_per_para: 10,
          max_new_tokens: 16000,
          response_type: 'short',
          temperature: 1.0,
          top_p: 0.9,
          chat_type: getChatType(chatType),
          language: user.lang || 'English',
          model: getModelName(chatType),
          name_type: user.nickname || user.name,
          session_id: sessionId || '',
          api_key: GEMINI_API_KEY,
        }),
      })

      const { response: aiResponse, useful_sources, session_id, related_questions } = response.data

      // Update session ID if we got a new one
      if (session_id && chatHistory) {
        chatHistory.sessionId = session_id
        await chatHistory.save()
      }

      // Save chat message
      let chat = await Chat.findOne({ chatHistory: chatHistory._id })
      if (!chat) {
        chat = await Chat.create({
          chatHistory: chatHistory._id,
          messages: [],
        })
        chatHistory.chat = chat._id
        await chatHistory.save()
      }

      chat.messages.push({
        sender: userId as any,
        message: {
          user: userInput,
          gemini: aiResponse,
        },
        chatType,
        sources: useful_sources,
        timestamp: new Date(),
      })
      await chat.save()

      return {
        chatMessage: {
          _id: chat.messages[chat.messages.length - 1].timestamp.toString(),
          message: {
            user: userInput,
            gemini: aiResponse,
          },
          chatType,
          sources: useful_sources,
          timestamp: new Date(),
        },
        chatHistoryId: chatHistory._id.toString(),
        relatedQuestions: related_questions,
        sources: useful_sources,
      }
    } catch (error: any) {
      if (error instanceof AppError) {
        throw error
      }
      throw new AppError(
        error.response?.data?.message || 'Failed to create chat',
        500
      )
    }
  },

  async getChatHistory(userId: string, limit: number = 20, skip: number = 0) {
    try {
      const histories = await ChatHistory.find({ user: userId })
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip)
        .populate('chat')
        .lean()

      return histories
    } catch (error) {
      throw new AppError('Failed to get chat history', 500)
    }
  },

  async getChatDetail(chatHistoryId: string, userId: string) {
    try {
      const history = await ChatHistory.findOne({
        _id: chatHistoryId,
        user: userId,
      })
        .populate('chat')
        .lean()

      if (!history) {
        throw new AppError('Chat history not found', 404)
      }

      return history
    } catch (error: any) {
      if (error instanceof AppError) {
        throw error
      }
      throw new AppError('Failed to get chat detail', 500)
    }
  },

  async deleteChat(chatHistoryId: string, userId: string) {
    try {
      const history = await ChatHistory.findOne({
        _id: chatHistoryId,
        user: userId,
      })

      if (!history) {
        throw new AppError('Chat history not found', 404)
      }

      if (history.chat) {
        await Chat.findByIdAndDelete(history.chat)
      }

      await ChatHistory.findByIdAndDelete(chatHistoryId)

      return { message: 'Chat deleted successfully' }
    } catch (error: any) {
      if (error instanceof AppError) {
        throw error
      }
      throw new AppError('Failed to delete chat', 500)
    }
  },

  async deleteAllChats(userId: string) {
    try {
      const histories = await ChatHistory.find({ user: userId })
      const chatIds = histories.filter((h) => h.chat).map((h) => h.chat!)

      await Chat.deleteMany({ _id: { $in: chatIds } })
      await ChatHistory.deleteMany({ user: userId })

      return { message: 'All chats deleted successfully' }
    } catch (error) {
      throw new AppError('Failed to delete all chats', 500)
    }
  },

  async addToFavorites(chatHistoryId: string, userId: string) {
    try {
      const history = await ChatHistory.findOne({
        _id: chatHistoryId,
        user: userId,
      })

      if (!history) {
        throw new AppError('Chat history not found', 404)
      }

      history.favor = true
      await history.save()

      return { message: 'Chat added to favorites' }
    } catch (error: any) {
      if (error instanceof AppError) {
        throw error
      }
      throw new AppError('Failed to add to favorites', 500)
    }
  },
}
