import apiClient from "../../../core/api/axios";

export interface GuestUsageStatus {
  success: boolean;
  current: number;
  limit: number;
  messagesLeft: number;
  bonusAvailable: boolean;
  isGuest: boolean;
}

export interface AddUsageResponse {
  success: boolean;
  message: string;
  bonus?: number;
  current?: number;
  limit?: number;
  messagesLeft?: number;
  alreadyClaimed?: boolean;
}

class GuestService {
  /**
   * Add more free messages for guest users (one-time bonus)
   */
  async addUsage(): Promise<AddUsageResponse> {
    try {
      const response = await apiClient.post<AddUsageResponse>(
        "/guest/add-usage",
        {},
        {
          withCredentials: true, // Important: send cookies
        }
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw error;
    }
  }

  /**
   * Get guest usage status
   */
  async getStatus(): Promise<GuestUsageStatus> {
    try {
      const response = await apiClient.get<GuestUsageStatus>("/guest/status", {
        withCredentials: true,
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        return error.response.data;
      }
      throw error;
    }
  }
}

export const guestService = new GuestService();
