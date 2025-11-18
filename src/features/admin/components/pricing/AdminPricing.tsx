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
  const [loadingGovernment, setLoadingGovernment] = useState(false);
  const [loadingPrivate, setLoadingPrivate] = useState(false);

  const load = async () => {
    try {
      const res = await adminService.getAppSettings();
      setSettings(res.settings || {});
    } finally {
      // no-op
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
