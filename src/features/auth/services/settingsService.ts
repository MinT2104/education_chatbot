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
  theme: "system",
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
   * Get user settings from sessionStorage
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
   * Save user settings to sessionStorage
   */
  saveSettings(settings: Partial<UserSettings>, userId?: string | null): void {
    const key = getSettingsKey(userId);
    try {
      const current = this.getSettings(userId);
      const updated = { ...current, ...settings };
      sessionStorage.setItem(key, JSON.stringify(updated));
    } catch (error) {
      console.error("Error saving settings:", error);
    }
  },

  /**
   * Reset settings to defaults
   */
  resetSettings(userId?: string | null): void {
    const key = getSettingsKey(userId);
    sessionStorage.setItem(key, JSON.stringify(DEFAULT_SETTINGS));
  },
};

