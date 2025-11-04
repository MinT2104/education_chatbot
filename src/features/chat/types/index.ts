// Legacy types (backward compatibility)
export interface ChatMessage {
  _id: string
  message: {
    user: string
    gemini: string
  }
  chatType?: string
  sources?: any[]
  timestamp: Date
}

export interface ChatHistory {
  _id: string
  title: string
  user: string
  chat?: any
  sessionId?: string
  timestamp: Date
  favor: boolean
  createdAt: Date
  updatedAt: Date
}

export interface PreviousChat {
  user: string
  gemini: string
}

// New types for ChatGPT-like UI
export interface Citation {
  id: string
  title: string
  url: string
  snippet?: string
}

export interface MessageVariant {
  id: string
  contentMd: string
  timestamp: number
}

export interface MessageFeedback {
  like?: boolean
  dislike?: boolean
  note?: string
}

export interface MessageAttachment {
  id: string
  type: 'image' | 'file' | 'audio'
  url: string
  name: string
  size?: number
}

export interface NewMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content?: string
  contentMd?: string
  attachments?: MessageAttachment[]
  citations?: Citation[]
  variants?: MessageVariant[]
  feedback?: MessageFeedback
  timestamp: number
  streamed?: boolean
  pinned?: boolean
}

export interface ConversationTools {
  web?: boolean
  code?: boolean
  vision?: boolean
  rag?: boolean
}

export interface ConversationMemory {
  enabled: boolean
}

export interface Conversation {
  id: string
  title: string
  pinned?: boolean
  createdAt: number
  updatedAt: number
  messages: NewMessage[]
  tools?: ConversationTools
  memory?: ConversationMemory
  folderId?: string
}

export interface ConversationFolder {
  id: string
  name: string
  color?: string
  icon?: string
}

