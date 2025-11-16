import { Users, BookOpen, CreditCard, School } from "lucide-react";
import { StatisticsCard } from "./StatisticsCard";
import { Document as DocumentType, AdminUser, Order } from "../../types";
import { School as SchoolType } from "../../services/adminService";

interface AdminDashboardProps {
  documents: DocumentType[];
  users: AdminUser[];
  orders: Order[];
  schools: SchoolType[];
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

  // Count active subscriptions
  const activeSubscriptions = ordersArray.filter(
    (order: any) => order.status === "active"
  ).length;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Statistics Cards */}
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
  );
};
