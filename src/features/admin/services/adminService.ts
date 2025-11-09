import apiClient from "../../../core/api/axios";

export interface AdminSubscription {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  plan: string;
  status: string;
  paypalSubscriptionId?: string;
  startDate?: string;
  nextBillingDate?: string;
  cancelReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  location?: string;
  plan: string;
  status: string;
  lastActive: string;
  createdAt: string;
  subscription?: AdminSubscription | null;
}

export interface AdminSubscriptionsResponse {
  success: boolean;
  subscriptions: AdminSubscription[];
}

export interface AdminSubscriptionResponse {
  success: boolean;
  subscription: AdminSubscription | null;
}

export const adminService = {
  /**
   * Get all subscriptions (admin only)
   */
  async getAllSubscriptions(params?: {
    status?: string;
    plan?: string;
  }): Promise<AdminSubscriptionsResponse> {
    const response = await apiClient.get("/payment/admin/subscriptions", {
      params,
    });
    return response.data;
  },

  /**
   * Get subscription by user ID (admin only)
   */
  async getSubscriptionByUserId(
    userId: string
  ): Promise<AdminSubscriptionResponse> {
    const response = await apiClient.get(
      `/payment/admin/subscription/${userId}`
    );
    return response.data;
  },

  /**
   * Get all users (admin only)
   * Only returns students by default
   */
  async getAllUsers(): Promise<AdminUser[]> {
    const response = await apiClient.get("/user", {
      params: {
        page: 1,
        limit: 1000, // Get all users, adjust if needed
        query: JSON.stringify({ role: "student" }), // Only get students
      },
    });
    // API returns { rows: [], total: number, ... }
    return Array.isArray(response.data)
      ? response.data
      : response.data?.rows || [];
  },

  /**
   * Get user by ID (admin only)
   */
  async getUserById(userId: string): Promise<AdminUser> {
    const response = await apiClient.get(`/user/${userId}`);
    return response.data;
  },

  /**
   * Get all schools (admin only)
   */
  async getAllSchools(): Promise<School[]> {
    const response = await apiClient.get("/school", {
      params: {
        page: 1,
        limit: 1000,
      },
    });
    // API returns { rows: [], total: number, ... }
    return Array.isArray(response.data)
      ? response.data
      : response.data?.rows || [];
  },

  /**
   * Create a new school (admin only)
   */
  async createSchool(data: {
    name: string;
    address?: string;
    country?: string;
  }): Promise<School> {
    const response = await apiClient.post("/school", data);
    return response.data;
  },

  /**
   * Update school (admin only)
   */
  async updateSchool(
    id: string,
    data: {
      name?: string;
      address?: string;
      country?: string;
      totalStudents?: number;
      totalTeachers?: number;
    }
  ): Promise<School> {
    const response = await apiClient.put(`/school/${id}`, data);
    return response.data;
  },

  /**
   * Delete school (admin only)
   */
  async deleteSchool(id: string): Promise<void> {
    await apiClient.delete(`/school/${id}`);
  },
};

export interface School {
  id: string;
  name: string;
  address?: string;
  country?: string;
  totalStudents: number;
  totalTeachers: number;
  createdAt: string;
  updatedAt?: string;
}
