import apiClient from "@/core/api/axios";

export interface StaticPage {
  id: string;
  slug: string;
  title: string;
  content: string;
  updated_at: string;
}

export const staticPageService = {
  async getPage(slug: string): Promise<StaticPage | null> {
    try {
      const response = await apiClient.get<{ success: boolean; page: StaticPage }>(
        `/pages/${slug}`
      );
      return response.data.page;
    } catch (error) {
      console.error(`Failed to load static page: ${slug}`, error);
      return null;
    }
  },

  async getPages(): Promise<StaticPage[]> {
    const response = await apiClient.get<{ success: boolean; pages: StaticPage[] }>(
      "/pages"
    );
    return response.data.pages || [];
  },

  async updatePage(id: string, payload: Partial<StaticPage>): Promise<StaticPage> {
    const response = await apiClient.put<{ success: boolean; page: StaticPage }>(
      `/pages/${id}`,
      payload
    );
    return response.data.page;
  },

  async createPage(payload: {
    slug: string;
    title: string;
    content: string;
  }): Promise<StaticPage> {
    const response = await apiClient.post<{ success: boolean; page: StaticPage }>(
      "/pages",
      payload
    );
    return response.data.page;
  },
};


