import mongoose, { Schema, Document } from 'mongoose'

export interface IChatHistory extends Document {
  title: string
  user: mongoose.Types.ObjectId
  chat: mongoose.Types.ObjectId
  sessionId?: string
  timestamp: Date
  favor: boolean
  createdAt: Date
  updatedAt: Date
}

const chatHistorySchema = new Schema<IChatHistory>(
  {
    title: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    chat: {
      type: Schema.Types.ObjectId,
      ref: 'Chat',
    },
    sessionId: {
      type: String,
    },
    favor: {
      type: Boolean,
      default: false,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
)

chatHistorySchema.index({ user: 1 })
chatHistorySchema.index({ favor: 1 })
chatHistorySchema.index({ createdAt: -1 })

export const ChatHistory = mongoose.model<IChatHistory>('ChatHistory', chatHistorySchema)

