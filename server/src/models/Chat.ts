import mongoose, { Schema, Document } from 'mongoose'

export interface IMessage {
  sender: mongoose.Types.ObjectId
  message: {
    user: string
    gemini: string
  }
  alias?: string
  chatType?: string
  sources?: any
  timestamp: Date
}

export interface IChat extends Document {
  chatHistory: mongoose.Types.ObjectId
  messages: IMessage[]
  createdAt: Date
  updatedAt: Date
}

const messageSchema = new Schema<IMessage>(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    message: {
      user: { type: String, required: true },
      gemini: { type: String, required: true },
    },
    alias: String,
    chatType: String,
    sources: Schema.Types.Mixed,
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
)

const chatSchema = new Schema<IChat>(
  {
    chatHistory: {
      type: Schema.Types.ObjectId,
      ref: 'ChatHistory',
    },
    messages: [messageSchema],
  },
  {
    timestamps: true,
  }
)

chatSchema.index({ chatHistory: 1 })
chatSchema.index({ 'messages.sender': 1 })

export const Chat = mongoose.model<IChat>('Chat', chatSchema)

