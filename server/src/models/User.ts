import mongoose, { Schema, Document } from 'mongoose'

export interface IUser extends Document {
  name: string
  email: string
  password: string
  nickname?: string
  profileImg?: string
  phone?: string
  lang?: string
  chatType?: string
  biography?: string
  role: 'user' | 'admin' | 'super_admin'
  subscription?: Schema.Types.ObjectId
  voiceSubscription?: Schema.Types.ObjectId
  config?: {
    theme?: 'light' | 'dark'
    language?: string
    notifications?: boolean
  }
  refreshToken?: string
  isEmailVerified: boolean
  currentLimit: number
  maxRateLimit: number
  planLimit?: {
    count: number
  }
  voicePlanLimit?: {
    count: number
  }
  voiceDownloadCount: number
  buyMore?: {
    quantity: number
    usedCount: number
  }
  buyMoreVoice?: {
    quantity: number
    usedCount: number
  }
  bought: boolean
  freeLimitEndDate?: Date
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    nickname: String,
    profileImg: String,
    phone: String,
    lang: { type: String, default: 'en' },
    chatType: { type: String, default: 'gemini_beta' },
    biography: String,
    role: { type: String, enum: ['user', 'admin', 'super_admin'], default: 'user' },
    subscription: { type: Schema.Types.ObjectId, ref: 'Subscription' },
    voiceSubscription: { type: Schema.Types.ObjectId, ref: 'Subscription' },
    config: {
      theme: { type: String, enum: ['light', 'dark'], default: 'light' },
      language: String,
      notifications: { type: Boolean, default: true },
    },
    refreshToken: { type: String, select: false },
    isEmailVerified: { type: Boolean, default: false },
    currentLimit: { type: Number, default: 0 },
    maxRateLimit: { type: Number, default: 10 },
    planLimit: {
      count: Number,
    },
    voicePlanLimit: {
      count: Number,
    },
    voiceDownloadCount: { type: Number, default: 0 },
    buyMore: {
      quantity: { type: Number, default: 0 },
      usedCount: { type: Number, default: 0 },
    },
    buyMoreVoice: {
      quantity: { type: Number, default: 0 },
      usedCount: { type: Number, default: 0 },
    },
    bought: { type: Boolean, default: false },
    freeLimitEndDate: Date,
  },
  {
    timestamps: true,
  }
)

// Indexes
UserSchema.index({ email: 1 })
UserSchema.index({ role: 1 })

export const User = mongoose.model<IUser>('User', UserSchema)


