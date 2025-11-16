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
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await adminService.getAppSettings();
      setSettings(res.settings || {});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSaveAll = async () => {
    try {
      setLoading(true);
      const payload = {
        free_limit_government: settings.free_limit_government || "50",
        free_limit_private: settings.free_limit_private || "25",
        go_price_government_inr: settings.go_price_government_inr || "399",
        go_price_private_inr: settings.go_price_private_inr || "399",
      };
      const res = await adminService.updateAppSettings(payload);
      setSettings(res.settings || (payload as any));
      toast.success("Settings saved");
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Save failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveGovernmentLimit = async () => {
    try {
      setLoading(true);
      const payload = {
        free_limit_government: settings.free_limit_government || "50",
      };
      const res = await adminService.updateAppSettings(payload);
      setSettings((s) => ({ ...s, ...(res.settings || payload) }));
      toast.success("Government limit saved");
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Save failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSavePrivateLimit = async () => {
    try {
      setLoading(true);
      const payload = {
        free_limit_private: settings.free_limit_private || "25",
      };
      const res = await adminService.updateAppSettings(payload);
      setSettings((s) => ({ ...s, ...(res.settings || payload) }));
      toast.success("Private limit saved");
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Save failed");
    } finally {
      setLoading(false);
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
                disabled={loading}
                className="w-full text-xs sm:text-sm"
              >
                Save
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
                disabled={loading}
                className="w-full text-xs sm:text-sm"
              >
                Save
              </Button>
            </div>
          </div>
        </div>

        {/* Go price per category */}
        <div className="rounded-xl border border-border p-3 sm:p-4">
          <div className="text-xs sm:text-sm font-medium mb-3">Go Plan Price (INR)</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="text-xs sm:text-sm mb-1 block">
                Go Price Government (INR)
              </label>
              <Input
                value={settings.go_price_government_inr || ""}
                onChange={(e) =>
                  setSettings((s) => ({
                    ...s,
                    go_price_government_inr: e.target.value,
                  }))
                }
                placeholder="299"
                className="text-sm"
              />
            </div>
            <div>
              <label className="text-xs sm:text-sm mb-1 block">
                Go Price Private (INR)
              </label>
              <Input
                value={settings.go_price_private_inr || ""}
                onChange={(e) =>
                  setSettings((s) => ({
                    ...s,
                    go_price_private_inr: e.target.value,
                  }))
                }
                placeholder="399"
                className="text-sm"
              />
            </div>
          </div>
          <div className="flex justify-end mt-3 sm:mt-4">
            <Button onClick={handleSaveAll} disabled={loading} className="text-xs sm:text-sm">
              Save Prices
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
