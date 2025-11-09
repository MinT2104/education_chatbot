import apiClient from '../../../core/api/axios'
import type { ChatMessage, ChatHistory } from '../types'

export const chatService = {
  async createChat(data: {
    userInput: string
    conversationId?: string
    // sessionId removed - backend handles via cookie
    previousChat?: any[]
    chatHistoryId?: string | null
    chatType?: string
    role?: 'student' | 'teacher'
    schoolId?: string
    schoolName?: string
    grade?: string
    subject?: string
    topic?: string
  }): Promise<{
    success: boolean
    message: {
      id: string
      role: string
      content: string
      contentMd: string
      timestamp: number
      streamed: boolean
    }
    chatHistoryId: string | null
    relatedQuestions?: string[]
    sources?: any[]
  }> {
    const response = await apiClient.post('/chat', data)
    return response.data
  },

  async getChatHistory(limit: number = 20, skip: number = 0): Promise<ChatHistory[]> {
    const response = await apiClient.get('/chat/history', {
      params: { limit, skip },
    })
    return response.data
  },

  async getChatDetail(historyId: string): Promise<ChatHistory> {
    const response = await apiClient.get(`/chat/history/${historyId}`)
    return response.data
  },

  async deleteChat(historyId: string): Promise<void> {
    await apiClient.delete(`/chat/history/${historyId}`)
  },

  async deleteAllChats(): Promise<void> {
    await apiClient.delete('/chat/history')
  },

  async addToFavorites(historyId: string): Promise<void> {
    await apiClient.post(`/chat/favorite/${historyId}`)
  },

  async getSchools(): Promise<Array<{ id: string; name: string; address?: string; country?: string }>> {
    const response = await apiClient.get('/school/public', {
      params: { page: 1, limit: 1000 },
    })
    return response.data
  },
}

