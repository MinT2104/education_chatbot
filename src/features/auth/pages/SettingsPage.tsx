import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../../core/store/hooks";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import { toast } from "react-toastify";
import { settingsService, UserSettings } from "../services/settingsService";
import { setDarkMode } from "../../ui/store/uiSlice";
import apiClient from "../../../core/api/axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const SettingsPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const userId = user?.email || user?.id || null;

  // Load settings from sessionStorage on mount
  const [settings, setSettings] = useState<UserSettings>(() =>
    settingsService.getSettings(userId)
  );

  // Load preferences from backend on mount
  useEffect(() => {
    if (userId) {
      settingsService.loadPreferencesFromBackend(userId).then(loadedSettings => {
        setSettings(loadedSettings);
        setMemoryEnabled(loadedSettings.memoryEnabled);
        setDataCollection(loadedSettings.dataCollection);
        setAnalyticsEnabled(loadedSettings.analyticsEnabled);
      });
    }
  }, [userId]);

  // General settings
  const [theme, setTheme] = useState<"light" | "dark" | "system">(
    settings.theme
  );

  // Privacy settings
  const [memoryEnabled, setMemoryEnabled] = useState(settings.memoryEnabled);
  const [dataCollection, setDataCollection] = useState(settings.dataCollection);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(
    settings.analyticsEnabled
  );

  // Apply theme when it changes
  useEffect(() => {
    if (theme === "system") {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      dispatch(setDarkMode(prefersDark));
    } else {
      dispatch(setDarkMode(theme === "dark"));
    }
    settingsService.saveSettings({ theme }, userId);
  }, [theme, dispatch, userId]);

  // Save settings whenever they change
  useEffect(() => {
    // Only save theme to settings (not async)
    settingsService.saveSettings({ theme }, userId);
  }, [theme, userId]);

  // Handle theme change
  const handleThemeChange = (value: string) => {
    setTheme(value as "light" | "dark" | "system");
  };

  // Handle memory enabled change
  const handleMemoryEnabledChange = async (checked: boolean) => {
    setMemoryEnabled(checked);
    try {
      await settingsService.saveSettings({ memoryEnabled: checked }, userId);
      toast.success(
        checked ? "Conversation memory enabled" : "Conversation memory disabled"
      );
    } catch (error) {
      toast.error("Failed to save preference");
      setMemoryEnabled(!checked); // Revert on error
    }
  };

  // Handle data collection change
  const handleDataCollectionChange = async (checked: boolean) => {
    setDataCollection(checked);
    try {
      await settingsService.saveSettings({ dataCollection: checked }, userId);
      toast.success(
        checked ? "Data collection enabled" : "Data collection disabled"
      );
    } catch (error) {
      toast.error("Failed to save preference");
      setDataCollection(!checked); // Revert on error
    }
  };

  // Handle analytics change
  const handleAnalyticsChange = async (checked: boolean) => {
    setAnalyticsEnabled(checked);
    try {
      await settingsService.saveSettings({ analyticsEnabled: checked }, userId);
      toast.success(checked ? "Analytics enabled" : "Analytics disabled");
    } catch (error) {
      toast.error("Failed to save preference");
      setAnalyticsEnabled(!checked); // Revert on error
    }
  };

  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const submitCancelSubscription = async () => {
    try {
      await apiClient.post("/payment/cancel");
      toast.success("Subscription cancelled. Plan switched to Free.");
      setShowCancelDialog(false);
      // Optionally navigate or refresh user info
      // Reload current page data
      navigate(0);
    } catch (error: any) {
      const message =
        error?.response?.data?.message || error?.message || "Cancel failed";
      toast.error(message);
      setShowCancelDialog(false);
    }
  };

  const handleClearMemory = () => {
    if (
      window.confirm(
        "Are you sure you want to clear all conversation memory? This cannot be undone."
      )
    ) {
      localStorage.removeItem("conversations");
      toast.success("Memory cleared successfully");
    }
  };

  const handleClearAllData = () => {
    if (
      window.confirm(
        "Are you sure you want to delete all your data? This includes all conversations, settings, and preferences. This cannot be undone."
      )
    ) {
      localStorage.clear();
      toast.success("All data cleared");
      navigate("/");
    }
  };

  type Section = "general" | "privacy" | "subscription" | "danger";
  const [section, setSection] = useState<Section>("general");

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="h-16 border-b border-border flex items-center px-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="mr-4"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </Button>
        <h1 className="text-xl font-semibold">Settings</h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full mx-auto max-w-5xl p-6">
          <div className="grid grid-cols-12 gap-8 h-full">
            <aside className="col-span-12 md:col-span-4 lg:col-span-3">
              <div className="rounded-xl border border-border bg-card">
                <nav className="p-3 space-y-2">
                  {[
                    { key: "general", label: "General" },
                    { key: "privacy", label: "Privacy & Memory" },
                    { key: "subscription", label: "Subscription" },
                    { key: "danger", label: "Danger Zone" },
                  ].map((item) => (
                    <button
                      key={item.key}
                      onClick={() => setSection(item.key as Section)}
                      className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-colors ${
                        section === (item.key as Section)
                          ? "bg-muted text-foreground"
                          : "hover:bg-muted/60 text-muted-foreground"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </nav>
              </div>
            </aside>
            <main className="col-span-12 md:col-span-8 lg:col-span-9">
              <div className="rounded-xl border border-border bg-card p-8 space-y-8">
                {section === "general" && (
                  <div className="space-y-4">
                    <Label>Theme</Label>
                    <div className="flex items-center gap-3">
                      {(["light", "dark", "system"] as const).map((t) => (
                        <Button
                          key={t}
                          variant={theme === t ? "default" : "outline"}
                          onClick={() => handleThemeChange(t)}
                        >
                          {t[0].toUpperCase() + t.slice(1)}
                        </Button>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Choose your preferred color scheme
                    </p>
                  </div>
                )}
                {section === "privacy" && (
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Conversation Memory</Label>
                          <p className="text-sm text-muted-foreground">
                            Allow AI to remember your preferences and context
                            across conversations
                          </p>
                        </div>
                        <Switch
                          checked={memoryEnabled}
                          onCheckedChange={handleMemoryEnabledChange}
                        />
                      </div>
                      <Button
                        variant="outline"
                        onClick={handleClearMemory}
                        className="w-full"
                      >
                        Clear All Conversation History
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Data Collection</Label>
                        <p className="text-sm text-muted-foreground">
                          Help improve the service by sharing usage data
                        </p>
                      </div>
                      <Switch
                        checked={dataCollection}
                        onCheckedChange={handleDataCollectionChange}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Analytics</Label>
                        <p className="text-sm text-muted-foreground">
                          Allow anonymous analytics to improve user experience
                        </p>
                      </div>
                      <Switch
                        checked={analyticsEnabled}
                        onCheckedChange={handleAnalyticsChange}
                      />
                    </div>
                  </div>
                )}
                {section === "subscription" && (
                  <div className="space-y-4">
                    <Label>Subscription</Label>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <p className="text-sm">
                          Current plan:{" "}
                          <span className="font-medium capitalize">
                            {(user?.plan || "free").toString()}
                          </span>
                        </p>
                        <p className="text-xs text-muted-foreground">
                          You can cancel your subscription anytime.
                        </p>
                      </div>
                      <Button
                        variant="destructive"
                        disabled={
                          !user ||
                          (user?.plan || "free").toLowerCase() === "free"
                        }
                        onClick={() => setShowCancelDialog(true)}
                      >
                        Cancel Subscription
                      </Button>
                    </div>
                  </div>
                )}
                {section === "danger" && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-destructive">
                      Danger Zone
                    </h3>
                    <Button
                      variant="destructive"
                      onClick={handleClearAllData}
                      className="w-full"
                    >
                      Delete All Data Permanently
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      This will delete all your conversations, settings, and
                      preferences. This action cannot be undone.
                    </p>
                  </div>
                )}
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Cancel Subscription Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel subscription?</DialogTitle>
            <DialogDescription>
              Your plan will switch to Free and auto-renewal will be stopped.
              You can upgrade again anytime.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCancelDialog(false)}
            >
              Keep Subscription
            </Button>
            <Button variant="destructive" onClick={submitCancelSubscription}>
              Confirm Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SettingsPage;
