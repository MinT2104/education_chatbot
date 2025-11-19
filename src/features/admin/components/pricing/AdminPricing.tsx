import { useEffect, useState } from "react";
import { adminService } from "../../services/adminService";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";

export const AdminPricing = () => {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [guestLimit, setGuestLimit] = useState(10);
  const [loadingGovernment, setLoadingGovernment] = useState(false);
  const [loadingPrivate, setLoadingPrivate] = useState(false);
  const [loadingGuest, setLoadingGuest] = useState(false);

  const load = async () => {
    try {
      const [settingsRes, limitsRes] = await Promise.all([
        adminService.getAppSettings(),
        adminService.getGuestLimits(),
      ]);
      setSettings(settingsRes.settings || {});
      setGuestLimit(limitsRes.limits.guest);
    } catch (error) {
      console.error("Failed to load settings:", error);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSaveGovernmentLimit = async () => {
    try {
      setLoadingGovernment(true);
      const payload = {
        free_limit_government: settings.free_limit_government || "50",
      };
      const res = await adminService.updateAppSettings(payload);
      setSettings((s) => ({ ...s, ...(res.settings || payload) }));
      toast.success("Government limit saved");
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Save failed");
    } finally {
      setLoadingGovernment(false);
    }
  };

  const handleSavePrivateLimit = async () => {
    try {
      setLoadingPrivate(true);
      const payload = {
        free_limit_private: settings.free_limit_private || "25",
      };
      const res = await adminService.updateAppSettings(payload);
      setSettings((s) => ({ ...s, ...(res.settings || payload) }));
      toast.success("Private limit saved");
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Save failed");
    } finally {
      setLoadingPrivate(false);
    }
  };

  const handleSaveGuestLimit = async () => {
    try {
      setLoadingGuest(true);
      const res = await adminService.updateGuestLimit(guestLimit);
      setGuestLimit(res.limits.guest);
      toast.success("Guest limit saved");
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Save failed");
    } finally {
      setLoadingGuest(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">Pricing & Limits</CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          Configure free limits per school type and Go plan price
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-8">
        {/* Guest Users limit */}
        <div className="rounded-xl border border-border p-3 sm:p-4">
          <div className="text-xs sm:text-sm font-medium mb-3">
            Guest Users - Free Limit
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="sm:col-span-2">
              <label className="text-xs sm:text-sm mb-1 block">
                Free Limit (messages/day)
              </label>
              <Input
                type="number"
                min="0"
                value={guestLimit}
                onChange={(e) => {
                  const val = e.target.value;
                  // Allow empty string or valid number
                  if (val === '') {
                    setGuestLimit(0);
                  } else {
                    const num = parseInt(val, 10);
                    if (!isNaN(num) && num >= 0) {
                      setGuestLimit(num);
                    }
                  }
                }}
                placeholder="10"
                className="text-sm"
              />
            </div>
            <div className="flex items-end">
              <Button
                onClick={handleSaveGuestLimit}
                disabled={loadingGuest}
                className="w-full text-xs sm:text-sm"
              >
                {loadingGuest ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </div>

        {/* Government free limit */}
        <div className="rounded-xl border border-border p-3 sm:p-4">
          <div className="text-xs sm:text-sm font-medium mb-3">
            Government Schools - Free Limit
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="sm:col-span-2">
              <label className="text-xs sm:text-sm mb-1 block">
                Free Limit (messages/day)
              </label>
              <Input
                value={settings.free_limit_government || ""}
                onChange={(e) =>
                  setSettings((s) => ({
                    ...s,
                    free_limit_government: e.target.value,
                  }))
                }
                placeholder="50"
                className="text-sm"
              />
            </div>
            <div className="flex items-end">
              <Button
                onClick={handleSaveGovernmentLimit}
                disabled={loadingGovernment}
                className="w-full text-xs sm:text-sm"
              >
                {loadingGovernment ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </div>

        {/* Private free limit */}
        <div className="rounded-xl border border-border p-3 sm:p-4">
          <div className="text-xs sm:text-sm font-medium mb-3">
            Private Schools - Free Limit
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="sm:col-span-2">
              <label className="text-xs sm:text-sm mb-1 block">
                Free Limit (messages/day)
              </label>
              <Input
                value={settings.free_limit_private || ""}
                onChange={(e) =>
                  setSettings((s) => ({
                    ...s,
                    free_limit_private: e.target.value,
                  }))
                }
                placeholder="25"
                className="text-sm"
              />
            </div>
            <div className="flex items-end">
              <Button
                onClick={handleSavePrivateLimit}
                disabled={loadingPrivate}
                className="w-full text-xs sm:text-sm"
              >
                {loadingPrivate ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </div>

      </CardContent>
    </Card>
  );
};
