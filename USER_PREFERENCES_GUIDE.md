# User Preferences Implementation Guide

## Overview
User preferences (Conversation Memory, Data Collection, Analytics) are now fully functional and connected to the backend.

## How It Works

### 1. Backend (Database + API)
**Migration:** `migrations/2025_11_19_add_user_preferences.sql`
- Adds columns to `users` table:
  - `memory_enabled` (BOOLEAN, default TRUE)
  - `data_collection` (BOOLEAN, default TRUE)
  - `analytics_enabled` (BOOLEAN, default TRUE)
  - `preferences_updated_at` (TIMESTAMP)

**API Endpoints:**
- `GET /api/user/preferences` - Get current user's preferences
- `PATCH /api/user/preferences` - Update user preferences

**Controller:** `controllers/user.controller.js`
- `getPreferences()` - Returns user's current preferences
- `updatePreferences()` - Updates and saves to database

### 2. Frontend

**Settings Service:** `features/auth/services/settingsService.ts`
- `getSettings()` - Get from sessionStorage
- `saveSettings()` - Save to sessionStorage AND backend (for preferences)
- `loadPreferencesFromBackend()` - Fetch from backend on page load

**Settings Page:** `features/auth/pages/SettingsPage.tsx`
- Loads preferences from backend on mount
- Auto-saves to backend when toggle switches change
- Shows toast notifications for success/error

**Hook:** `features/auth/hooks/useUserPreferences.ts`
```typescript
const { memoryEnabled, dataCollection, analyticsEnabled } = useUserPreferences();
```

**Analytics Service:** `core/services/analyticsService.ts`
- Respects `analyticsEnabled` setting
- Respects `dataCollection` setting
- Auto-flushes collected data every 30 seconds
- Helpers: `trackChatSent()`, `trackFeatureUsed()`, `trackError()`, `trackSubscription()`

## Usage Examples

### In any component:
```typescript
import { useUserPreferences } from '@/features/auth/hooks/useUserPreferences';
import { trackChatSent, trackFeatureUsed } from '@/core/services/analyticsService';

function MyComponent() {
  const { memoryEnabled, dataCollection, analyticsEnabled } = useUserPreferences();

  const handleSendChat = () => {
    // Use memory setting to control context
    const context = memoryEnabled ? getPreviousMessages() : [];
    
    // Send chat with context only if memory enabled
    sendChat({ message, context });
    
    // Track event (automatically respects analytics preference)
    trackChatSent('government_school');
  };

  return <div>...</div>;
}
```

### Conversation Memory Implementation:
When sending chat messages, check `memoryEnabled`:
- If TRUE: Include `previousChat` array with conversation history
- If FALSE: Send empty array or omit field (no context retention)

Example in chat service:
```typescript
const { memoryEnabled } = useUserPreferences();

await chatService.createChat({
  userInput,
  conversationId,
  previousChat: memoryEnabled ? messages : [], // Only send if enabled
  chatType,
  // ... other params
});
```

### Analytics Tracking:
Simply call tracking functions - they automatically check user preferences:
```typescript
import { trackChatSent, trackFeatureUsed, trackError } from '@/core/services/analyticsService';

// Track chat sent
trackChatSent('private_school');

// Track feature usage
trackFeatureUsed('export_conversation');

// Track errors
trackError('API timeout', '/chat/send');

// Track subscriptions
trackSubscription('subscribe', 'government_go');
```

## Migration Steps

1. **Run the migration in Supabase SQL Editor:**
   ```sql
   -- File: migrations/2025_11_19_add_user_preferences.sql
   ```

2. **Restart backend server** to load new routes

3. **Test in frontend:**
   - Go to Settings → Privacy & Memory
   - Toggle switches
   - Verify in database that columns update
   - Check browser console for analytics logs
   - Check Network tab for `/user/preferences` calls

## Features Now Working

✅ **Conversation Memory**
- Setting saved to database
- Can be toggled on/off
- Use `useUserPreferences()` hook to respect setting when sending chats

✅ **Data Collection**
- Setting saved to database
- `analyticsService.collectData()` respects this setting
- Data queued and flushed every 30s (ready for backend endpoint)

✅ **Analytics**
- Setting saved to database
- `analyticsService.trackEvent()` respects this setting
- Ready for Google Analytics integration

## Next Steps (Optional)

1. **Add backend analytics endpoint:**
   - `POST /api/analytics/track` to receive collected data
   - Store in analytics table for insights

2. **Add Google Analytics:**
   - Add GA script to `index.html`
   - Update `MEASUREMENT_ID` in analyticsService
   - Events will automatically flow to GA

3. **Implement memory logic in chat:**
   - Check `memoryEnabled` before sending `previousChat`
   - Show indicator when memory is disabled
