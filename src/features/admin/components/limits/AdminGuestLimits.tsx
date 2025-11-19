import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";
import { adminService } from "../../services/adminService";
import { Loader2, Users, UserCheck, Infinity } from "lucide-react";

export const AdminGuestLimits = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [limits, setLimits] = useState({
    guest: 10,
    authenticated: 25,
    goPlan: null as number | null,
  });

  const [guestLimit, setGuestLimit] = useState("10");
  const [authLimit, setAuthLimit] = useState("25");

  useEffect(() => {
    loadLimits();
  }, []);

  const loadLimits = async () => {
    try {
      setLoading(true);
      const data = await adminService.getGuestLimits();
      setLimits(data.limits);
      setGuestLimit(data.limits.guest.toString());
      setAuthLimit(data.limits.authenticated.toString());
    } catch (error: any) {
      toast.error(error.message || "Failed to load limits");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveGuestLimit = async () => {
    const newLimit = parseInt(guestLimit);
    if (isNaN(newLimit) || newLimit < 0) {
      toast.error("Please enter a valid number");
      return;
    }

    try {
      setSaving(true);
      const data = await adminService.updateGuestLimit(newLimit);
      setLimits(data.limits);
      toast.success(`Guest limit updated to ${newLimit} messages/day`);
    } catch (error: any) {
      toast.error(error.message || "Failed to update guest limit");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAuthLimit = async () => {
    const newLimit = parseInt(authLimit);
    if (isNaN(newLimit) || newLimit < 0) {
      toast.error("Please enter a valid number");
      return;
    }

    try {
      setSaving(true);
      const data = await adminService.updateAuthLimit(newLimit);
      setLimits(data.limits);
      toast.success(`Authenticated user limit updated to ${newLimit} messages/day`);
    } catch (error: any) {
      toast.error(error.message || "Failed to update authenticated limit");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Rate Limits & Token Management</h2>
        <p className="text-muted-foreground">
          Configure daily message limits for different user types. These limits reset every 24 hours.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Guest Users Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-orange-500" />
              Guest Users
            </CardTitle>
            <CardDescription>
              Users without an account (unauthenticated)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="guest-limit">Daily Message Limit</Label>
              <div className="flex gap-2">
                <Input
                  id="guest-limit"
                  type="number"
                  min="0"
                  value={guestLimit}
                  onChange={(e) => setGuestLimit(e.target.value)}
                  className="flex-1"
                />
                <Button
                  onClick={handleSaveGuestLimit}
                  disabled={saving || guestLimit === limits.guest.toString()}
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
                </Button>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              Current: <span className="font-semibold text-foreground">{limits.guest} messages/day</span>
            </div>
          </CardContent>
        </Card>

        {/* Authenticated Users Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-blue-500" />
              Free Plan Users
            </CardTitle>
            <CardDescription>
              Authenticated users on free plan
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="auth-limit">Daily Message Limit</Label>
              <div className="flex gap-2">
                <Input
                  id="auth-limit"
                  type="number"
                  min="0"
                  value={authLimit}
                  onChange={(e) => setAuthLimit(e.target.value)}
                  className="flex-1"
                />
                <Button
                  onClick={handleSaveAuthLimit}
                  disabled={saving || authLimit === limits.authenticated.toString()}
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
                </Button>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              Current: <span className="font-semibold text-foreground">{limits.authenticated} messages/day</span>
            </div>
          </CardContent>
        </Card>

        {/* Go Plan Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Infinity className="w-5 h-5 text-green-500" />
              Go Plan Users
            </CardTitle>
            <CardDescription>
              Premium subscription users
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Daily Message Limit
            </div>
            <div className="flex items-center gap-2 text-2xl font-bold text-green-600 dark:text-green-400">
              <Infinity className="w-6 h-6" />
              Unlimited
            </div>
            <p className="text-xs text-muted-foreground">
              Go plan users have no daily message limits
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Additional Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5" />
            <div>
              <strong>Guest Bonus:</strong> First-time guests can claim a one-time bonus of 5 additional messages
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5" />
            <div>
              <strong>Reset Time:</strong> All counters reset at midnight UTC (24-hour rolling window)
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5" />
            <div>
              <strong>Rate Limiting:</strong> Limits are tracked per user/session using Redis for accurate counting
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
