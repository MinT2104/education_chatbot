import { useEffect, useState } from 'react';
import { useAppSelector } from '../../../core/store/hooks';
import { settingsService } from '../../auth/services/settingsService';

/**
 * Hook to access user preferences (memory, data collection, analytics)
 * These preferences are loaded from backend when user is authenticated
 */
export const useUserPreferences = () => {
  const user = useAppSelector((s) => s.auth.user);
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  const userId = user?.email || user?.id || null;

  const [preferences, setPreferences] = useState(() => {
    const settings = settingsService.getSettings(userId);
    return {
      memoryEnabled: settings.memoryEnabled,
      dataCollection: settings.dataCollection,
      analyticsEnabled: settings.analyticsEnabled,
    };
  });

  useEffect(() => {
    if (isAuthenticated && userId) {
      // Load from backend
      settingsService.loadPreferencesFromBackend(userId).then((settings) => {
        setPreferences({
          memoryEnabled: settings.memoryEnabled,
          dataCollection: settings.dataCollection,
          analyticsEnabled: settings.analyticsEnabled,
        });
      });
    } else {
      // Use default for guests
      const settings = settingsService.getSettings(null);
      setPreferences({
        memoryEnabled: settings.memoryEnabled,
        dataCollection: settings.dataCollection,
        analyticsEnabled: settings.analyticsEnabled,
      });
    }
  }, [isAuthenticated, userId]);

  return preferences;
};
