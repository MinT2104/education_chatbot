import apiClient from "../../../core/api/axios";
import type { Conversation } from "../types";

// Backend API response types (snake_case from backend)
interface BackendConversation {
  id: string;
  user_id: string;
  title: string;
  pinned: boolean;
  messages: any; // JSONB from backend
  tools: any; // JSONB from backend
  memory: any; // JSONB from backend
  folder_id: string | null;
  school_name: string | null;
  subject: string | null;
  created_at: string;
  updated_at: string;
}

// Convert backend format to frontend format
const mapBackendToFrontend = (backend: BackendConversation): Conversation => {
  return {
    id: backend.id,
    title: backend.title,
    pinned: backend.pinned,
    createdAt: new Date(backend.created_at).getTime(),
    updatedAt: new Date(backend.updated_at).getTime(),
    messages: Array.isArray(backend.messages) ? backend.messages : [],
    tools: backend.tools || {},
    memory: backend.memory || { enabled: false },
    folderId: backend.folder_id || undefined,
    schoolName: backend.school_name || undefined,
    subject: backend.subject || undefined,
  };
};

// Convert frontend format to backend format
const mapFrontendToBackend = (frontend: Partial<Conversation>) => {
  return {
    title: frontend.title,
    pinned: frontend.pinned,
    messages: frontend.messages || [],
    tools: frontend.tools || {},
    memory: frontend.memory || { enabled: false },
    folder_id: frontend.folderId || null,
    school_name: frontend.schoolName || null,
    subject: frontend.subject || null,
  };
};

export const conversationService = {
  // Get all conversations for the authenticated user
  async getConversations(): Promise<Conversation[]> {
    const response = await apiClient.get<BackendConversation[]>("/conversation");
    return response.data.map(mapBackendToFrontend);
  },

  // Get a single conversation by ID
  async getConversation(id: string): Promise<Conversation> {
    const response = await apiClient.get<BackendConversation>(
      `/conversation/${id}`
    );
    return mapBackendToFrontend(response.data);
  },

  // Create a new conversation
  async createConversation(
    conversation: Partial<Conversation>
  ): Promise<Conversation> {
    const backendData = mapFrontendToBackend(conversation);
    const response = await apiClient.post<BackendConversation>(
      "/conversation",
      backendData
    );
    return mapBackendToFrontend(response.data);
  },

  // Update an existing conversation
  async updateConversation(
    id: string,
    updates: Partial<Conversation>
  ): Promise<Conversation> {
    const backendData = mapFrontendToBackend(updates);
    const response = await apiClient.put<BackendConversation>(
      `/conversation/${id}`,
      backendData
    );
    return mapBackendToFrontend(response.data);
  },

  // Delete a conversation
  async deleteConversation(id: string): Promise<void> {
    await apiClient.delete(`/conversation/${id}`);
  },
};

