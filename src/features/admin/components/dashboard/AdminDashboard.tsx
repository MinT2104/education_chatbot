import { useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart3,
  HardDrive,
  CreditCard,
  Globe,
  ClipboardList,
  Users,
  BookOpen,
  ShieldCheck,
} from "lucide-react";
import { StatisticsCard } from "./StatisticsCard";
import { ActivityItem } from "./ActivityItem";
import {
  Statistics,
  Document as DocumentType,
  AdminUser,
  Order,
} from "../../types";

interface AdminDashboardProps {
  stats: Statistics;
  documents: DocumentType[];
  users: AdminUser[];
  orders: Order[];
}

export const AdminDashboard = ({
  stats,
  documents,
  users = [],
  orders = [],
}: AdminDashboardProps) => {
  // Ensure users and orders are arrays
  const usersArray = Array.isArray(users) ? users : [];
  const ordersArray = Array.isArray(orders) ? orders : [];

  const activePaidOrders = useMemo(
    () =>
      ordersArray.filter(
        (order: any) => order.status === "paid" && order.isActive
      ),
    [ordersArray]
  );

  const refundedAmount = useMemo(
    () =>
      ordersArray
        .filter((order: any) => order.status === "refunded")
        .reduce((total: number, order: any) => total + (order.amount || 0), 0),
    [ordersArray]
  );

  const pastDueSubscriptions = useMemo(
    () =>
      ordersArray.filter((order: any) => order.status === "past_due").length,
    [ordersArray]
  );

  const trialingUsers = useMemo(
    () => ordersArray.filter((order: any) => order.status === "pending").length,
    [ordersArray]
  );

  const locationSummary = useMemo(() => {
    const counts = new Map<string, number>();
    usersArray.forEach((user: any) => {
      if (user.location) {
        const parts = user.location.split(",");
        const country = parts[parts.length - 1]?.trim() || "Unknown";
        counts.set(country, (counts.get(country) ?? 0) + 1);
      }
    });
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
  }, [usersArray]);

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatisticsCard
          title="Total Users"
          value={stats.totalUsers}
          description={`${stats.totalStudents} students, ${stats.totalTeachers} teachers`}
          icon={Users}
        />
        <StatisticsCard
          title="MRR"
          value={`$${stats.monthlyRecurringRevenue.toLocaleString()}`}
          description="Monthly recurring revenue"
          icon={CreditCard}
        />
        <StatisticsCard
          title="Documents"
          value={stats.totalDocuments}
          description="Master training files"
          icon={BookOpen}
        />
        <StatisticsCard
          title="Active Subscriptions"
          value={stats.activeSubscriptions}
          description={`${activePaidOrders.length} active institutional orders`}
          icon={ShieldCheck}
        />
      </div>

      {/* Activity & Storage */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest user and system activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <ActivityItem
                color="green"
                title="New document uploaded"
                description="Grade 10 Physics - 2 mins ago"
              />
              <ActivityItem
                color="blue"
                title="New user registered"
                description="Student - Springfield High - 15 mins ago"
              />
              <ActivityItem
                color="purple"
                title="Document indexed successfully"
                description="Grade 7 Math Algebra - 1 hour ago"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HardDrive className="w-5 h-5" />
              Storage Usage
            </CardTitle>
            <CardDescription>
              Document storage and indexing status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Total Storage</span>
                  <span className="text-sm text-muted-foreground">
                    {(stats.storageUsed / 1024).toFixed(2)} GB / 100 GB
                  </span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className="bg-primary rounded-full h-2"
                    style={{
                      width: `${(stats.storageUsed / 1024 / 100) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
              <div className="pt-4 border-t space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Indexed Documents</span>
                  <span className="font-medium">
                    {documents.filter((d) => d.indexed).length}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Pending Indexing</span>
                  <span className="font-medium text-orange-500">
                    {documents.filter((d) => !d.indexed).length}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Total Files</span>
                  <span className="font-medium">{documents.length}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Billing Snapshot
            </CardTitle>
            <CardDescription>Quick overview of billing health</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span>Refunded (last 30d)</span>
              <span className="font-semibold">
                ${refundedAmount.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Past due accounts</span>
              <span className="font-semibold text-orange-500">
                {pastDueSubscriptions}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Trialing users</span>
              <span className="font-semibold">{trialingUsers}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Top Regions
            </CardTitle>
            <CardDescription>Active users by country</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              {locationSummary.map(([country, count]) => (
                <div
                  key={country}
                  className="flex items-center justify-between"
                >
                  <span>{country}</span>
                  <span className="font-semibold">{count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="w-4 h-4" />
              Subscription Health
            </CardTitle>
            <CardDescription>Live insight into user plans</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span>Go Plan</span>
              <span className="font-semibold">
                {
                  usersArray.filter(
                    (u: any) => u.plan === "go" || u.plan === "Go"
                  ).length
                }
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Free</span>
              <span className="font-semibold">
                {
                  usersArray.filter(
                    (u: any) => u.plan === "free" || u.plan === "Free"
                  ).length
                }
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Active Subscriptions</span>
              <span className="font-semibold">
                {ordersArray.filter((o: any) => o.status === "active").length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Total Subscriptions</span>
              <span className="font-semibold">{ordersArray.length}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
