import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserCircle, ShieldCheck } from "lucide-react";
import { AdminUser, adminService } from "../../services/adminService";
import { useEffect, useState } from "react";

interface UserDetailPanelProps {
  user: AdminUser | null;
}

export const UserDetailPanel = ({ user }: UserDetailPanelProps) => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLogs = async () => {
      if (!user?.id) {
        setLogs([]);
        return;
      }
      try {
        setLoading(true);
        const res = await adminService.getUserLogs(user.id, { limit: 20 });
        setLogs(res.logs || []);
      } catch (e) {
        setLogs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [user?.id]);
  if (!user) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCircle className="w-5 h-5" />
            Select a user
          </CardTitle>
          <CardDescription>Profile, usage, and recent activity</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Select a user to inspect their profile.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserCircle className="w-5 h-5" />
          {user.name}
        </CardTitle>
        <CardDescription>Profile, usage, and recent activity</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span>Email</span>
            <span className="font-medium">{user.email}</span>
          </div>
          <div className="flex justify-between">
            <span>Location</span>
            <span className="font-medium">{user.location || "—"}</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Status</span>
            <div className="flex gap-2 items-center">
              <Badge
                variant={user.status === "active" ? "default" : "secondary"}
                className={user.status === "active" ? "bg-green-500" : ""}
              >
                {user.status}
              </Badge>
              {user.subscription && (
                <Badge variant="outline" className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  {user.subscription.status}
                </Badge>
              )}
            </div>
          </div>
          <div className="flex justify-between">
            <span>Plan</span>
            <span className="font-medium">
              {user.plan.charAt(0).toUpperCase() + user.plan.slice(1)}
            </span>
          </div>
          {user.subscription && (
            <>
              <div className="flex justify-between">
                <span>Subscription Status</span>
                <span className="font-medium">{user.subscription.status}</span>
              </div>
              {user.subscription.nextBillingDate && (
                <div className="flex justify-between">
                  <span>Next Billing</span>
                  <span className="font-medium">
                    {new Date(
                      user.subscription.nextBillingDate
                    ).toLocaleDateString()}
                  </span>
                </div>
              )}
              {user.subscription.startDate && (
                <div className="flex justify-between">
                  <span>Start Date</span>
                  <span className="font-medium">
                    {new Date(user.subscription.startDate).toLocaleDateString()}
                  </span>
                </div>
              )}
            </>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">Recent Activity</h4>
            {!loading && (
              <span className="text-xs text-muted-foreground">
                {logs.length} items
              </span>
            )}
          </div>
          <div className="rounded-lg border border-border">
            <div className="max-h-64 overflow-y-auto divide-y divide-border">
              {loading ? (
                <div className="p-4 text-sm text-muted-foreground">Loading...</div>
              ) : logs.length === 0 ? (
                <div className="p-4 text-sm text-muted-foreground">No activity yet</div>
              ) : (
                logs.map((log, idx) => (
                  <div key={idx} className="p-3 text-xs flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium">{log.type}</div>
                      {log.metadata && (
                        <div className="text-muted-foreground truncate">
                          {JSON.stringify(log.metadata)}
                        </div>
                      )}
                    </div>
                    <div className="text-right text-muted-foreground min-w-[140px]">
                      {new Date(log.created_at).toLocaleString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
