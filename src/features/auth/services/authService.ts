import apiClient from "../../../core/api/axios";
import { setCookie, removeCookie } from "../../../core/utils/cookie";
import type {
  User,
  LoginCredentials,
  SignupData,
  AuthResponse,
} from "../types";

// Backend API response types
interface BackendLoginResponse {
  success: boolean;
  message: string;
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    auth_providers?: string;
  };
}

interface BackendRegisterResponse {
  success: boolean;
  message: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  token?: string;
}

interface BackendGoogleAuthResponse {
  success: boolean;
  message: string;
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    auth_providers?: string;
  };
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<BackendLoginResponse>(
      "/auth/login",
      credentials
    );

    // Map backend response to frontend format
    const authResponse: AuthResponse = {
      user: response.data.user as User,
      accessToken: response.data.access_token,
      refreshToken: response.data.refresh_token,
    };

    // Store tokens in cookies (7 days for refresh token, 6 hours for access token)
    setCookie("access_token", authResponse.accessToken, {
      expires: 0.25, // 6 hours in days
      path: "/",
      secure: import.meta.env.PROD,
      sameSite: "lax",
    });
    setCookie("refresh_token", authResponse.refreshToken, {
      expires: 7, // 7 days
      path: "/",
      secure: import.meta.env.PROD,
      sameSite: "lax",
    });

    return authResponse;
  },

  async signup(data: SignupData): Promise<{ email: string }> {
    const response = await apiClient.post<BackendRegisterResponse>(
      "/auth/register",
      {
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone,
      }
    );

    return { email: response.data.user.email };
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post("/auth/logout");
    } catch (error) {
      // Continue with cleanup even if API call fails
      console.error("Logout API error:", error);
    } finally {
      // Remove tokens from cookies
      removeCookie("access_token", { path: "/" });
      removeCookie("refresh_token", { path: "/" });
      // Also remove from localStorage for backward compatibility
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    }
  },

  async getMe(): Promise<User> {
    const response = await apiClient.get<User>("/auth/me");
    return response.data;
  },

  async refreshToken(): Promise<AuthResponse | null> {
    try {
      const response = await apiClient.post<BackendLoginResponse>(
        "/auth/refresh",
        {}
      );

      // Map backend response to frontend format
      const authResponse: AuthResponse = {
        user: response.data.user as User,
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
      };

      // Store tokens in cookies
      setCookie("access_token", authResponse.accessToken, {
        expires: 0.25, // 6 hours
        path: "/",
        secure: import.meta.env.PROD,
        sameSite: "lax",
      });
      setCookie("refresh_token", authResponse.refreshToken, {
        expires: 7, // 7 days
        path: "/",
        secure: import.meta.env.PROD,
        sameSite: "lax",
      });

      return authResponse;
    } catch (error) {
      return null;
    }
  },

  async googleAuth(code: string, state: string): Promise<AuthResponse> {
    const response = await apiClient.get<BackendGoogleAuthResponse>(
      `/auth/google/callback?code=${code}&state=${state}`
    );

    // Map backend response to frontend format
    const authResponse: AuthResponse = {
      user: response.data.user as User,
      accessToken: response.data.access_token,
      refreshToken: response.data.refresh_token,
    };

    // Store tokens in cookies
    setCookie("access_token", authResponse.accessToken, {
      expires: 0.25, // 6 hours
      path: "/",
      secure: import.meta.env.PROD,
      sameSite: "lax",
    });
    setCookie("refresh_token", authResponse.refreshToken, {
      expires: 7, // 7 days
      path: "/",
      secure: import.meta.env.PROD,
      sameSite: "lax",
    });

    return authResponse;
  },

  async verifyEmail(email: string, code: string): Promise<void> {
    await apiClient.post("/auth/email-verification", { email, code });
  },

  async resendVerificationEmail(email: string): Promise<void> {
    await apiClient.post("/auth/resend-email-verification", { email });
  },

  async forgotPassword(email: string): Promise<void> {
    await apiClient.post("/auth/forget-password", { email });
  },

  async resetPassword(
    email: string,
    code: string,
    password: string
  ): Promise<void> {
    await apiClient.post("/auth/reset-passoword", { email, code, password });
  },
};
