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
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <UserCircle className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="truncate">{user.name}</span>
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">Profile, usage, and recent activity</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6">
        <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
          <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
            <span className="text-muted-foreground">Email</span>
            <span className="font-medium truncate text-left sm:text-right">{user.email}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
            <span className="text-muted-foreground">Location</span>
            <span className="font-medium truncate text-left sm:text-right">{user.location || "—"}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
            <span className="text-muted-foreground">Status</span>
            <div className="flex gap-2 items-center flex-wrap">
              <Badge
                variant={user.status === "active" ? "default" : "secondary"}
                className={`text-xs ${user.status === "active" ? "bg-green-500" : ""}`}
              >
                {user.status}
              </Badge>
              {user.subscription && (
                <Badge variant="outline" className="flex items-center gap-1 text-xs">
                  <ShieldCheck className="w-3 h-3" />
                  {user.subscription.status}
                </Badge>
              )}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
            <span className="text-muted-foreground">Plan</span>
            <span className="font-medium text-left sm:text-right">
              {user.plan.charAt(0).toUpperCase() + user.plan.slice(1)}
            </span>
          </div>
          {user.subscription && (
            <>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                <span className="text-muted-foreground">Subscription Status</span>
                <span className="font-medium text-left sm:text-right">{user.subscription.status}</span>
              </div>
              {user.subscription.nextBillingDate && (
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                  <span className="text-muted-foreground">Next Billing</span>
                  <span className="font-medium text-left sm:text-right">
                    {new Date(
                      user.subscription.nextBillingDate
                    ).toLocaleDateString()}
                  </span>
                </div>
              )}
              {user.subscription.startDate && (
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                  <span className="text-muted-foreground">Start Date</span>
                  <span className="font-medium text-left sm:text-right">
                    {new Date(user.subscription.startDate).toLocaleDateString()}
                  </span>
                </div>
              )}
            </>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs sm:text-sm font-medium">Recent Activity</h4>
            {!loading && (
              <span className="text-xs text-muted-foreground">
                {logs.length} items
              </span>
            )}
          </div>
          <div className="rounded-lg border border-border">
            <div className="max-h-48 sm:max-h-64 overflow-y-auto divide-y divide-border">
              {loading ? (
                <div className="p-3 sm:p-4 text-xs sm:text-sm text-muted-foreground">Loading...</div>
              ) : logs.length === 0 ? (
                <div className="p-3 sm:p-4 text-xs sm:text-sm text-muted-foreground">No activity yet</div>
              ) : (
                logs.map((log, idx) => (
                  <div key={idx} className="p-2 sm:p-3 text-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{log.type}</div>
                      {log.metadata && (
                        <div className="text-muted-foreground truncate text-[10px] sm:text-xs">
                          {JSON.stringify(log.metadata).substring(0, 80)}...
                        </div>
                      )}
                    </div>
                    <div className="text-right text-muted-foreground text-[10px] sm:text-xs whitespace-nowrap">
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
