import apiClient from "../../../core/api/axios";

export interface UserSettings {
  language: string;
  fontSize: "small" | "medium" | "large";
  theme: "light" | "dark" | "system";
  enterToSend: boolean;
  memoryEnabled: boolean;
  dataCollection: boolean;
  analyticsEnabled: boolean;
}

const DEFAULT_SETTINGS: UserSettings = {
  language: "en",
  fontSize: "medium",
  theme: "light",
  enterToSend: true,
  memoryEnabled: true,
  dataCollection: true,
  analyticsEnabled: true,
};

const getSettingsKey = (userId?: string | null): string => {
  // Use user email/id if available, otherwise use a default key
  if (userId) {
    return `user_settings_${userId}`;
  }
  // Try to get from localStorage
  const userEmail = localStorage.getItem("mock_user_email");
  if (userEmail) {
    return `user_settings_${userEmail}`;
  }
  return "user_settings_guest";
};

export const settingsService = {
  /**
   * Get user settings from sessionStorage (theme/UI only) and backend (preferences)
   */
  getSettings(userId?: string | null): UserSettings {
    const key = getSettingsKey(userId);
    try {
      const stored = sessionStorage.getItem(key);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Merge with defaults to handle missing fields
        return { ...DEFAULT_SETTINGS, ...parsed };
      }
    } catch (error) {
      console.error("Error loading settings:", error);
    }
    return DEFAULT_SETTINGS;
  },

  /**
   * Save user settings
   * - Theme/UI settings: Save to sessionStorage
   * - Preferences (memory, data, analytics): Save to backend
   */
  async saveSettings(settings: Partial<UserSettings>, userId?: string | null): Promise<void> {
    const key = getSettingsKey(userId);
    try {
      // Always save to sessionStorage for immediate access
      const current = this.getSettings(userId);
      const updated = { ...current, ...settings };
      sessionStorage.setItem(key, JSON.stringify(updated));

      // If user is authenticated and updating preferences, save to backend
      const preferencesFields = ['memoryEnabled', 'dataCollection', 'analyticsEnabled'];
      const hasPreferenceUpdate = Object.keys(settings).some(k => preferencesFields.includes(k));
      
      if (userId && hasPreferenceUpdate) {
        try {
          const payload: any = {};
          if (settings.memoryEnabled !== undefined) payload.memoryEnabled = settings.memoryEnabled;
          if (settings.dataCollection !== undefined) payload.dataCollection = settings.dataCollection;
          if (settings.analyticsEnabled !== undefined) payload.analyticsEnabled = settings.analyticsEnabled;
          
          await apiClient.patch("/user/preferences", payload);
        } catch (error) {
          console.error("Error saving preferences to backend:", error);
          // Don't throw - allow sessionStorage save to succeed
        }
      }
    } catch (error) {
      console.error("Error saving settings:", error);
    }
  },

  /**
   * Load preferences from backend and merge with local settings
   */
  async loadPreferencesFromBackend(userId: string | null): Promise<UserSettings> {
    if (!userId) {
      return this.getSettings(userId);
    }

    try {
      const response = await apiClient.get("/user/preferences");
      if (response.data?.success && response.data?.preferences) {
        const { memoryEnabled, dataCollection, analyticsEnabled } = response.data.preferences;
        const current = this.getSettings(userId);
        const updated = {
          ...current,
          memoryEnabled,
          dataCollection,
          analyticsEnabled
        };
        
        // Save to sessionStorage for quick access
        const key = getSettingsKey(userId);
        sessionStorage.setItem(key, JSON.stringify(updated));
        
        return updated;
      }
    } catch (error) {
      console.error("Error loading preferences from backend:", error);
    }

    return this.getSettings(userId);
  },

  /**
   * Reset settings to defaults
   */
  resetSettings(userId?: string | null): void {
    const key = getSettingsKey(userId);
    sessionStorage.setItem(key, JSON.stringify(DEFAULT_SETTINGS));
  },
};

