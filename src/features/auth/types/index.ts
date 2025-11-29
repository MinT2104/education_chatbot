export interface User {
  _id: string;
  id?: string;
  name: string;
  nickname?: string;
  email: string;
  lang?: string;
  avatar_url?: string;
  phone?: string;
  chatType?: string;
  biography?: string;
  subscription?: Subscription;
  voiceSubscription?: VoiceSubscription;
  config?: UserConfig;
  bought?: boolean;
  role?: "user" | "admin" | "super_admin";
  plan?: "free" | "starter" | "pro" | "enterprise" | string;
  buyMore?: boolean;
  planLimit?: number;
  isSubscribed?: boolean;
  maxRateLimit?: number;
  currentLimit?: number;
  voiceDownloadCount?: number;
  voicePlanLimit?: number;
  buyMoreVoice?: boolean;
  isEmailVerification?: boolean;
}

export interface Subscription {
  planId: string;
  planName: string;
  startDate: Date | string;
  endDate: Date | string;
  status: "active" | "expired" | "cancelled";
}

export interface VoiceSubscription {
  planId: string;
  planName: string;
  startDate: Date | string;
  endDate: Date | string;
  status: "active" | "expired" | "cancelled";
}

export interface UserConfig {
  theme?: "light" | "dark";
  language?: string;
  notifications?: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
  phone?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  verification_email_sent?: boolean;
}
