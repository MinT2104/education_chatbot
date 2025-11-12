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
  session_id: string | null; // External API session ID
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
    sessionId: backend.session_id || undefined, // Map session_id from backend
  };
};

// Convert frontend format to backend format
// Only include fields that are explicitly provided (not undefined)
const mapFrontendToBackend = (frontend: Partial<Conversation>) => {
  const backend: any = {};

  // Only include fields that are explicitly provided
  if (frontend.title !== undefined) backend.title = frontend.title;
  if (frontend.pinned !== undefined) backend.pinned = frontend.pinned;
  if (frontend.messages !== undefined) backend.messages = frontend.messages;
  if (frontend.tools !== undefined) backend.tools = frontend.tools;
  if (frontend.memory !== undefined) backend.memory = frontend.memory;
  if (frontend.folderId !== undefined)
    backend.folder_id = frontend.folderId || null;
  if (frontend.schoolName !== undefined)
    backend.school_name = frontend.schoolName || null;
  if (frontend.subject !== undefined)
    backend.subject = frontend.subject || null;

  return backend;
};

export const conversationService = {
  // Get all conversations for the authenticated user
  async getConversations(): Promise<Conversation[]> {
    const response = await apiClient.get<BackendConversation[]>(
      "/conversation"
    );
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
