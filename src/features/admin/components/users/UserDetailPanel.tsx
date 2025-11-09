import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserCircle, ShieldCheck, Settings2, RefreshCcw } from "lucide-react";
import { AdminUser } from "../../services/adminService";

interface UserDetailPanelProps {
  user: AdminUser | null;
}

export const UserDetailPanel = ({ user }: UserDetailPanelProps) => {
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
      </CardContent>
    </Card>
  );
};
