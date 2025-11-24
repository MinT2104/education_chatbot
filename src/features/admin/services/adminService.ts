import apiClient from "../../../core/api/axios";
import axios from "axios";
import { School } from "../types";

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
  email_verified?: boolean;
  email_verified_at?: string;
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
   * Get activity logs for a user (admin only)
   */
  async getUserLogs(
    userId: string,
    params?: {
      limit?: number;
      offset?: number;
      type?: string;
      from?: string;
      to?: string;
    }
  ): Promise<{ success: boolean; logs: any[] }> {
    const response = await apiClient.get(`/admin/users/${userId}/logs`, {
      params,
    });
    return response.data;
  },

  /**
   * Get all activity logs (admin only)
   */
  async getAllLogs(params?: {
    limit?: number;
    offset?: number;
    type?: string;
    from?: string;
    to?: string;
  }): Promise<{ success: boolean; logs: any[] }> {
    const response = await apiClient.get(`/admin/logs`, { params });
    return response.data;
  },
  /**
   * Admin: Cancel a user's subscription
   */
  async cancelUserSubscription(
    userId: string
  ): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.post(`/payment/admin/cancel/${userId}`);
    return response.data;
  },

  /**
   * Admin: Refund user's last payment (if supported)
   */
  async refundUserSubscription(
    userId: string
  ): Promise<{ success?: boolean; message: string }> {
    const response = await apiClient.post(`/payment/admin/refund/${userId}`);
    return response.data;
  },

  /**
   * Delete user (Admin only)
   */
  async deleteUser(userId: string): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.delete(`/user/${userId}/delete`);
    return response.data;
  },

  /**
   * Toggle user status (Admin only)
   */
  async toggleUserStatus(
    userId: string,
    status: "active" | "inactive"
  ): Promise<{ success: boolean; message: string; user: AdminUser }> {
    const response = await apiClient.patch(`/user/${userId}/status`, { status });
    return response.data;
  },

  /**
   * Verify user email (Admin only)
   */
  async verifyUserEmail(userId: string): Promise<{ success: boolean; message: string; user: AdminUser }> {
    const response = await apiClient.patch(`/user/${userId}/verify-email`);
    return response.data;
  },

  /**
   * Unverify user email (Admin only)
   */
  async unverifyUserEmail(userId: string): Promise<{ success: boolean; message: string; user: AdminUser }> {
    const response = await apiClient.patch(`/user/${userId}/unverify-email`);
    return response.data;
  },

  /**
   * App settings (pricing/limits)
   */
  async getAppSettings(): Promise<{
    success: boolean;
    settings: Record<string, string>;
  }> {
    const response = await apiClient.get("/settings");
    return response.data;
  },
  async updateAppSettings(
    payload: Record<string, string | number>
  ): Promise<{ success: boolean; settings: Record<string, string> }> {
    const response = await apiClient.put("/settings", payload);
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
    state?: string;
    city?: string;
    schoolBoard?: string;
    languages?: string[];
    category?: "government" | "private";
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
      state?: string;
      city?: string;
      schoolBoard?: string;
      languages?: string[];
      category?: "government" | "private";
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

  /**
   * Prompts management
   */
  async getRolePrompts(): Promise<{ success: boolean; prompts: RolePrompt[] }> {
    const response = await apiClient.get("/prompt");
    return response.data;
  },

  async updateRolePrompts(
    prompts: RolePrompt[]
  ): Promise<{ success: boolean; prompts: RolePrompt[] }> {
    const response = await apiClient.put("/prompt", prompts);
    return response.data;
  },

  /**
   * Static pages
   */
  async getStaticPages(): Promise<{
    success: boolean;
    pages: StaticPageSummary[];
  }> {
    const response = await apiClient.get("/pages");
    return response.data;
  },

  async updateStaticPage(
    id: string,
    payload: { title?: string; content?: string }
  ): Promise<{ success: boolean; page: StaticPageSummary }> {
    const response = await apiClient.put(`/pages/${id}`, payload);
    return response.data;
  },

  /**
   * Get all documents from external API
   */
  async getAllDocuments(params?: {
    page?: number;
    page_size?: number;
  }): Promise<{
    documents: any[];
    pagination: {
      total: number;
      page: number;
      page_size: number;
      total_pages: number;
      has_next: boolean;
      has_prev: boolean;
    };
  }> {
    const response = await axios.get(
      import.meta.env.VITE_PYTHON_URL + "/list",
      {
        params,
      }
    );
    return response.data;
  },

  /**
   * Helper: Get school by name
   */
  async getSchoolByName(name: string): Promise<School | null> {
    const schools = await this.getAllSchools();
    return schools.find(s => s.name === name) || null;
  },

  /**
   * Delete document from external API
   */
  async deleteDocument(
    documentId: string
  ): Promise<{ success: boolean; message?: string;[key: string]: any }> {
    const response = await axios.delete(
      import.meta.env.VITE_PYTHON_URL + `/delete/${documentId}`
    );
    return response.data;
  },

  /**
   * Get all active subjects (public endpoint)
   * No authentication required
   */
  async getSubjects(params?: {
    page?: number;
    limit?: number;
  }): Promise<Subject[]> {
    const response = await apiClient.get("/subject/public", {
      params: {
        page: params?.page || 1,
        limit: params?.limit || 1000,
      },
    });
    // API returns array directly
    return Array.isArray(response.data) ? response.data : [];
  },

  /**
   * Get all subjects (admin endpoint with pagination and filters)
   * Requires authentication
   */
  async getAllSubjectsAdmin(params?: {
    page?: number;
    limit?: number;
    query?: Record<string, any>;
  }): Promise<{
    rows: Subject[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    currentPage: number;
  }> {
    const queryParams: any = {
      page: params?.page || 1,
      limit: params?.limit || 1000,
    };

    if (params?.query && Object.keys(params.query).length > 0) {
      queryParams.query = JSON.stringify(params.query);
    }

    const response = await apiClient.get("/subject", {
      params: queryParams,
    });
    return response.data;
  },

  /**
   * Get subject by ID
   * Requires authentication
   */
  async getSubjectById(id: string): Promise<Subject> {
    const response = await apiClient.get(`/subject/${id}`);
    return response.data;
  },

  /**
   * Create a new subject
   * Requires authentication (Admin only)
   */
  async createSubject(data: {
    name: string;
    code?: string | null;
    description?: string | null;
    gradeLevel?: string | null;
    isActive?: boolean;
  }): Promise<Subject> {
    const response = await apiClient.post("/subject", {
      name: data.name,
      code: data.code || null,
      description: data.description || null,
      gradeLevel: data.gradeLevel || null,
      isActive: data.isActive !== undefined ? data.isActive : true,
    });
    return response.data;
  },

  /**
   * Update subject
   * Requires authentication (Admin only)
   */
  async updateSubject(
    id: string,
    data: {
      name?: string;
      code?: string | null;
      description?: string | null;
      gradeLevel?: string | null;
      isActive?: boolean;
    }
  ): Promise<Subject> {
    const response = await apiClient.put(`/subject/${id}`, data);
    return response.data;
  },

  /**
   * Delete subject
   * Requires authentication (Admin only)
   */
  async deleteSubject(id: string): Promise<{ success: boolean }> {
    await apiClient.delete(`/subject/${id}`);
    return { success: true };
  },

  /**
   * Get guest rate limits (admin only)
   */
  async getGuestLimits(): Promise<{
    success: boolean;
    limits: {
      guest: number;
      authenticated: number;
      goPlan: number | null;
    };
  }> {
    const response = await apiClient.get("/settings/limits/guest");
    return response.data;
  },

  /**
   * Get guest rate limits (public - no auth required)
   */
  async getPublicGuestLimits(): Promise<{
    success: boolean;
    limits: {
      guest: number;
      authenticated: number;
      goPlan: number | null;
    };
  }> {
    const response = await apiClient.get("/settings/limits/public");
    return response.data;
  },

  /**
   * Update guest daily limit (admin only)
   */
  async updateGuestLimit(limit: number): Promise<{
    success: boolean;
    limits: {
      guest: number;
      authenticated: number;
      goPlan: number | null;
    };
  }> {
    const response = await apiClient.patch("/settings/limits/guest", { limit });
    return response.data;
  },

  /**
   * Update authenticated user daily limit (admin only)
   */
  async updateAuthLimit(limit: number): Promise<{
    success: boolean;
    limits: {
      guest: number;
      authenticated: number;
      goPlan: number | null;
    };
  }> {
    const response = await apiClient.patch("/settings/limits/authenticated", { limit });
    return response.data;
  },

  /**
   * Get dashboard statistics
   */
  async getDashboardStats(): Promise<{
    success: boolean;
    stats: {
      newUsersToday: number;
      salesToday: number;
      totalRevenueToday: string;
      canceledOrdersToday: number;
    };
  }> {
    const response = await apiClient.get("/dashboard/stats");
    return response.data;
  },

  /**
   * Cron Jobs Management
   */

  /**
   * Get cron job status
   */
  async getCronStatus(): Promise<CronStatus> {
    const response = await apiClient.get("/cron/status");
    return response.data;
  },

  /**
   * Trigger cron job manually
   */
  async triggerCronJob(): Promise<CronTriggerResponse> {
    const response = await apiClient.post("/cron/check-document-status");
    return response.data;
  },

  /**
   * Get cron logs for a specific date
   */
  async getCronLogs(date?: string): Promise<CronLogsResponse> {
    const response = await apiClient.get("/cron/logs", {
      params: date ? { date } : {},
    });
    return response.data;
  },

  /**
   * Get available log dates
   */
  async getCronLogDates(): Promise<CronLogDatesResponse> {
    const response = await apiClient.get("/cron/logs/dates");
    return response.data;
  },

  /**
   * Initiate document upload - Step 1
   * Creates a pending record in Supabase via Node.js
   */
  async initiateUpload(params: {
    document_name: string;
    school_id: string;
    grade: string;
    subject: string;
    file: File;
  }): Promise<{ document: any }> {
    const response = await apiClient.post("/document/initiate", {
      school_id: params.school_id,
      document_name: params.document_name,
      file_name: params.file.name,
      file_size: params.file.size,
      file_type: params.file.type,
      grade: params.grade,
      subject: params.subject,
    });
    return response.data;
  },

  /**
   * Upload document - NEW 2-STEP FLOW for smooth UX with CHUNKED UPLOAD support
   * Step 1: Create record in Supabase (status=0/pending)
   * Step 2a: For large files (>10MB): Upload in chunks with retry
   * Step 2b: For small files: Direct upload (legacy)
   */
  async uploadDocument(params: {
    file: File;
    document_name: string;
    school_name: string;
    standard: string;
    subject: string;
    onUploadProgress?: (progressEvent: any) => void;
    onLog?: (type: 'info' | 'success' | 'warning' | 'error', message: string, details?: string) => void;
  }): Promise<{
    success: boolean;
    documentId: string;
    status: string;
    message?: string;
  }> {
    const { file, document_name, school_name, standard, subject, onUploadProgress, onLog } = params;

    // Import chunked upload service
    const { ChunkedUploadService, shouldUseChunkedUpload } = await import('./chunkedUploadService');

    // STEP 1: Validate school and initiate upload
    const schools = await apiClient.get("/school", {
      params: { page: 1, limit: 1000 },
    });
    const schoolsList = Array.isArray(schools.data) ? schools.data : schools.data?.rows || [];
    const school = schoolsList.find((s: any) => s.name === school_name);

    if (!school) {
      throw new Error(`School not found: ${school_name}`);
    }

    const step1Msg = `Step 1/2: Creating pending record for "${document_name}"`;
    console.log(`[UPLOAD] ${step1Msg}`);
    if (onLog) onLog('info', step1Msg);

    // STEP 1: Create pending record in Supabase (status=0)
    const initResult = await this.initiateUpload({
      document_name,
      school_id: school.id,
      grade: standard,
      subject: subject,
      file: file,
    });

    const documentId = initResult.document.id;
    const uploadId = initResult.document.upload_id || ChunkedUploadService.generateUploadId();
    const step1Success = `✅ Document ID created: ${documentId} (status=pending)`;
    console.log(`[UPLOAD] ${step1Success}`);
    if (onLog) onLog('success', step1Success);

    try {
      // STEP 2: Decide between chunked or direct upload
      const useChunked = shouldUseChunkedUpload(file);
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);

      if (useChunked) {
        // STEP 2a: Chunked upload for large files
        const step2Msg = `Step 2/2: Uploading large file (${fileSizeMB}MB) in chunks...`;
        console.log(`[UPLOAD] ${step2Msg}`);
        if (onLog) onLog('info', step2Msg, 'Using chunked upload for reliability');

        const chunkedService = new ChunkedUploadService();
        const result = await chunkedService.uploadFileInChunks({
          file,
          uploadId,
          documentId,
          metadata: {
            document_name,
            school_name,
            standard,
            subject,
          },
          onChunkProgress: (chunkIndex: number, progress: number) => {
            // Optional: track individual chunk progress
            if (progress === 100) {
              onLog?.('info', `Chunk ${chunkIndex + 1} uploaded`);
            }
          },
          onChunkComplete: (chunkIndex: number, total: number) => {
            // Update overall progress based on chunks completed
            const overallProgress = Math.round(((chunkIndex + 1) / total) * 100);
            onUploadProgress?.({
              loaded: overallProgress,
              total: 100,
            });
          },
          onChunkError: (chunkIndex: number, error: Error, willRetry: boolean, attempt: number) => {
            if (willRetry) {
              onLog?.('warning', `Chunk ${chunkIndex + 1} failed (${attempt} attempts), retrying...`, error.message);
            } else {
              onLog?.('error', `Chunk ${chunkIndex + 1} failed after max retries`, error.message);
            }
          },
          onOverallProgress: (percent: number) => {
            onUploadProgress?.({
              loaded: percent,
              total: 100,
            });
          },
          onLog,
        });

        return {
          success: result.success,
          documentId: result.document_id,
          status: result.status === 2 ? 'success' : 'pending',
          message: result.message,
        };

      } else {
        // STEP 2b: Direct upload for small files (legacy)
        const step2Msg = `Step 2/2: Uploading small file (${fileSizeMB}MB) directly...`;
        console.log(`[UPLOAD] ${step2Msg}`);
        if (onLog) onLog('info', step2Msg, 'Using direct upload');

        const formData = new FormData();
        formData.append("file", file);
        formData.append("document_name", document_name);
        formData.append("school_name", school_name);
        formData.append("standard", standard);
        formData.append("subject", subject);
        formData.append("document_id", documentId);

        const response = await axios.post(import.meta.env.VITE_PYTHON_URL + "/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          timeout: 1800000, // 30 minutes
          onUploadProgress,
        });

        const step2Success = `✅ Python processing complete (status=${response.data.status})`;
        console.log(`[UPLOAD] ${step2Success}`);
        if (onLog) onLog('success', step2Success);

        return {
          success: true,
          documentId,
          status: response.data.status === 2 ? 'success' : 'pending',
          message: response.data.message,
        };
      }

    } catch (error: any) {
      // Log detailed error
      const errorMsg = `Python upload failed: ${error.message || error}`;
      console.error(`[UPLOAD ERROR]`, error);
      if (onLog) onLog('error', errorMsg, error.response?.data?.detail || '');

      // Re-throw to be handled by caller
      throw error;
    }
  },
};

// Re-export School type for backward compatibility
export type { School } from "../types";

export interface RolePrompt {
  id?: string;
  role: "student" | "teacher" | string;
  content: string;
}

export interface StaticPageSummary {
  id: string;
  slug: string;
  title: string;
  content: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string | null;
  description: string | null;
  gradeLevel: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Cron job management
 */

export interface CronStatus {
  running: boolean;
  isCurrentlyChecking: boolean;
  checkInterval: string;
  pythonServerUrl: string;
}

export interface CronLogsResponse {
  success: boolean;
  logs: string[];
  date: string;
  totalLines: number;
  returnedLines: number;
  logFile: string;
}

export interface CronLogDatesResponse {
  success: boolean;
  dates: string[];
  totalDates: number;
}

export interface CronTriggerResponse {
  success: boolean;
  message: string;
  result: any;
  duration: string;
  triggeredBy: string;
  triggeredAt: string;
}
