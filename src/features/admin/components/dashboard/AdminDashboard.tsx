import { Users, BookOpen, CreditCard, School, UserPlus, TrendingUp, XCircle } from "lucide-react";
import { StatisticsCard } from "./StatisticsCard";
import { Document as DocumentType, AdminUser, Order } from "../../types";
import { School as SchoolType } from "../../services/adminService";
import { useEffect, useState } from "react";
import { adminService } from "../../services/adminService";

interface AdminDashboardProps {
  documents: DocumentType[];
  users: AdminUser[];
  orders: Order[];
  schools: SchoolType[];
}

interface DashboardStats {
  newUsersToday: number;
  salesToday: number;
  totalRevenueToday: string;
  canceledOrdersToday: number;
}

export const AdminDashboard = ({
  documents = [],
  users = [],
  orders = [],
  schools = [],
}: AdminDashboardProps) => {
  // Ensure arrays
  const usersArray = Array.isArray(users) ? users : [];
  const ordersArray = Array.isArray(orders) ? orders : [];
  const documentsArray = Array.isArray(documents) ? documents : [];
  const schoolsArray = Array.isArray(schools) ? schools : [];

  const [todayStats, setTodayStats] = useState<DashboardStats>({
    newUsersToday: 0,
    salesToday: 0,
    totalRevenueToday: "0.00",
    canceledOrdersToday: 0,
  });

  // Fetch today's statistics
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await adminService.getDashboardStats();
        if (response.success) {
          setTodayStats(response.stats);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      }
    };
    fetchStats();
  }, []);

  // Count active subscriptions
  const activeSubscriptions = ordersArray.filter(
    (order: any) => order.status === "active"
  ).length;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Today's Statistics */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Today's Activity</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <StatisticsCard
            title="New Users Today"
            value={todayStats.newUsersToday}
            description="Registered today"
            icon={UserPlus}
          />
          <StatisticsCard
            title="Sales Today"
            value={`$${todayStats.totalRevenueToday}`}
            description={`${todayStats.salesToday} orders`}
            icon={TrendingUp}
          />
          <StatisticsCard
            title="Canceled Orders"
            value={todayStats.canceledOrdersToday}
            description="Canceled today"
            icon={XCircle}
          />
        </div>
      </div>

      {/* Overall Statistics */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Overall Statistics</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <StatisticsCard
            title="Total Users"
            value={usersArray.length}
            description="Registered users"
            icon={Users}
          />
          <StatisticsCard
            title="Active Subscriptions"
            value={activeSubscriptions}
            description="Active paid subscriptions"
            icon={CreditCard}
          />
          <StatisticsCard
            title="Documents"
            value={documentsArray.length}
            description="Total documents"
            icon={BookOpen}
          />
          <StatisticsCard
            title="Schools"
            value={schoolsArray.length}
            description="Registered schools"
            icon={School}
          />
        </div>
      </div>
    </div>
  );
};
