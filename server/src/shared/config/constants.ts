export const CHAT_TYPE = {
  PRIVATE: 'private',
  PUBLIC: 'public',
  PUBLIC_O3: 'public_O3',
  PRIVATE_O3: 'private_O3',
  UPGRADE: 'upgrade',
  DEEPSEEK: 'deepseek',
  DEEPSEEK_V3_PUBLIC: 'deepseek_v3_public',
  DEEPSEEK_V3_PRIVATE: 'deepseek_v3_private',
  GPT_PRIVATE: 'gpt_private',
  GPT_PUBLIC: 'gpt_public',
  GEMINI_BETA_PUBLIC: 'gemini_beta_public',
  GEMINI_BETA_PRIVATE: 'gemini_beta_private',
} as const

export type ChatType = typeof CHAT_TYPE[keyof typeof CHAT_TYPE]

export const SUBSCRIPTION_TYPE = {
  CHAT: 'chat_subscription',
  CUSTOM_VOICE: 'voice_subscription',
} as const

export type SubscriptionType = typeof SUBSCRIPTION_TYPE[keyof typeof SUBSCRIPTION_TYPE]

