import apiClient from '../../../core/api/axios'
import type { ChatMessage, ChatHistory } from '../types'

export const chatService = {
  async createChat(data: {
    userInput: string
    previousChat?: any[]
    chatHistoryId?: string | null
    chatType?: string
  }): Promise<{
    chatMessage: ChatMessage
    chatHistoryId: string
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
}

