import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import { chatService } from '../services/chatService'
import type { ChatMessage, ChatHistory } from '../types'

interface ChatState {
  messages: ChatMessage[]
  historyId: string | null
  chatType: string
  isLoading: boolean
  language: string
  favorites: string[]
  recentChats: ChatHistory[]
  isReplying: boolean
}

const initialState: ChatState = {
  messages: [],
  historyId: null,
  chatType: 'gemini_beta_public',
  isLoading: false,
  language: 'en',
  favorites: [],
  recentChats: [],
  isReplying: false,
}

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<ChatMessage>) => {
      state.messages.push(action.payload)
    },
    setMessages: (state, action: PayloadAction<ChatMessage[]>) => {
      state.messages = action.payload
    },
    setHistoryId: (state, action: PayloadAction<string | null>) => {
      state.historyId = action.payload
    },
    setChatType: (state, action: PayloadAction<string>) => {
      state.chatType = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload
    },
    addToFavorites: (state, action: PayloadAction<string>) => {
      if (!state.favorites.includes(action.payload)) {
        state.favorites.push(action.payload)
      }
    },
    removeFromFavorites: (state, action: PayloadAction<string>) => {
      state.favorites = state.favorites.filter((id) => id !== action.payload)
    },
    setRecentChats: (state, action: PayloadAction<ChatHistory[]>) => {
      state.recentChats = action.payload
    },
    clearChat: (state) => {
      state.messages = []
      state.historyId = null
    },
    setIsReplying: (state, action: PayloadAction<boolean>) => {
      state.isReplying = action.payload
    },
  },
})

// Async thunks
export const sendChat = createAsyncThunk(
  'chat/sendChat',
  async (data: {
    userInput: string
    previousChat?: any[]
    chatHistoryId?: string | null
    chatType?: string
  }) => {
    const response = await chatService.createChat(data)
    return response
  }
)

export const fetchChatHistory = createAsyncThunk(
  'chat/fetchHistory',
  async (params?: { limit?: number; skip?: number }) => {
    const response = await chatService.getChatHistory(
      params?.limit || 20,
      params?.skip || 0
    )
    return response
  }
)

export const {
  addMessage,
  setMessages,
  setHistoryId,
  setChatType,
  setLoading,
  setLanguage,
  addToFavorites,
  removeFromFavorites,
  setRecentChats,
  clearChat,
} = chatSlice.actions

export const chatReducer = chatSlice.reducer


