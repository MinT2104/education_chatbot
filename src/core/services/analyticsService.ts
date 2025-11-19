// Analytics service for tracking user events
import { settingsService } from '../../features/auth/services/settingsService';

interface AnalyticsEvent {
  category: string;
  action: string;
  label?: string;
  value?: number;
}

interface DataCollectionEvent {
  event: string;
  data: Record<string, any>;
  timestamp: number;
}

class AnalyticsService {
  private analyticsQueue: DataCollectionEvent[] = [];
  private flushInterval: number = 30000; // 30 seconds
  private flushTimer: NodeJS.Timeout | null = null;

  constructor() {
    // Start auto-flush timer
    this.startAutoFlush();
  }

  /**
   * Track an analytics event (Google Analytics style)
   */
  trackEvent(event: AnalyticsEvent): void {
    const userId = this.getUserId();
    const settings = settingsService.getSettings(userId);

    // Only track if user has enabled analytics
    if (!settings.analyticsEnabled) {
      return;
    }

    // If Google Analytics is loaded
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
      });
    }

    console.log('[Analytics]', event);
  }

  /**
   * Track page view
   */
  trackPageView(page: string): void {
    const userId = this.getUserId();
    const settings = settingsService.getSettings(userId);

    if (!settings.analyticsEnabled) {
      return;
    }

    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('config', 'GA_MEASUREMENT_ID', {
        page_path: page,
      });
    }

    console.log('[Analytics] Page view:', page);
  }

  /**
   * Collect usage data for service improvement
   */
  collectData(event: string, data: Record<string, any>): void {
    const userId = this.getUserId();
    const settings = settingsService.getSettings(userId);

    // Only collect if user has enabled data collection
    if (!settings.dataCollection) {
      return;
    }

    const collectionEvent: DataCollectionEvent = {
      event,
      data: {
        ...data,
        userId: userId || 'anonymous',
        userAgent: navigator.userAgent,
        language: navigator.language,
      },
      timestamp: Date.now(),
    };

    this.analyticsQueue.push(collectionEvent);

    // If queue is large, flush immediately
    if (this.analyticsQueue.length >= 10) {
      this.flush();
    }
  }

  /**
   * Flush analytics queue to server
   */
  private async flush(): Promise<void> {
    if (this.analyticsQueue.length === 0) {
      return;
    }

    const events = [...this.analyticsQueue];
    this.analyticsQueue = [];

    try {
      // Send to backend analytics endpoint (you can implement this later)
      // await apiClient.post('/analytics/track', { events });
      console.log('[Data Collection] Flushing events:', events.length);
    } catch (error) {
      console.error('[Data Collection] Failed to flush:', error);
      // Re-add events to queue on failure
      this.analyticsQueue.unshift(...events);
    }
  }

  /**
   * Start auto-flush timer
   */
  private startAutoFlush(): void {
    if (typeof window === 'undefined') return;

    this.flushTimer = setInterval(() => {
      this.flush();
    }, this.flushInterval);

    // Flush on page unload
    window.addEventListener('beforeunload', () => {
      this.flush();
    });
  }

  /**
   * Stop auto-flush timer
   */
  stopAutoFlush(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }
  }

  /**
   * Get user ID from localStorage/sessionStorage
   */
  private getUserId(): string | null {
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.user_id || payload.email || null;
      }
    } catch (error) {
      // Ignore
    }
    return null;
  }
}

export const analyticsService = new AnalyticsService();

// Helper functions for common tracking
export const trackChatSent = (chatType: string) => {
  analyticsService.trackEvent({
    category: 'Chat',
    action: 'send_message',
    label: chatType,
  });

  analyticsService.collectData('chat_sent', {
    chatType,
  });
};

export const trackFeatureUsed = (feature: string) => {
  analyticsService.trackEvent({
    category: 'Feature',
    action: 'use_feature',
    label: feature,
  });

  analyticsService.collectData('feature_used', {
    feature,
  });
};

export const trackError = (error: string, context?: string) => {
  analyticsService.trackEvent({
    category: 'Error',
    action: 'error_occurred',
    label: error,
  });

  analyticsService.collectData('error', {
    error,
    context,
  });
};

export const trackSubscription = (action: 'subscribe' | 'cancel', plan: string) => {
  analyticsService.trackEvent({
    category: 'Subscription',
    action,
    label: plan,
  });

  analyticsService.collectData('subscription', {
    action,
    plan,
  });
};
