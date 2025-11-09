import { useState, useEffect } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import {
  mockDocuments,
  mockStatistics,
  mockHomeContent,
} from "../data/mockData";
import { Document as DocumentType, HomePageContent } from "../types";
import { AdminHeader } from "../components/AdminHeader";
import { AdminTabs } from "../components/AdminTabs";
import { AdminDashboard } from "../components/dashboard/AdminDashboard";
import { AdminUsers } from "../components/users/AdminUsers";
import { AdminOrders } from "../components/orders/AdminOrders";
import { AdminDocuments } from "../components/documents/AdminDocuments";
import { AdminSchools } from "../components/schools/AdminSchools";
import { AdminContent } from "../components/content/AdminContent";
import { adminService } from "../services/adminService";

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [documents] = useState<DocumentType[]>(mockDocuments);
  const [homeContent, setHomeContent] =
    useState<HomePageContent>(mockHomeContent);
  const [stats, setStats] = useState(mockStatistics);
  const [users, setUsers] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    // Load real data for dashboard
    const loadDashboardData = async () => {
      try {
        const [usersData, subscriptionsData] = await Promise.all([
          adminService.getAllUsers(),
          adminService.getAllSubscriptions(),
        ]);

        setUsers(usersData);
        setOrders(subscriptionsData.subscriptions || []);

        // Update stats with real data
        setStats({
          ...mockStatistics,
          totalUsers: usersData.length,
          activeSubscriptions:
            subscriptionsData.subscriptions?.filter(
              (s) => s.status === "active"
            ).length || 0,
        });
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      }
    };

    if (activeTab === "dashboard") {
      loadDashboardData();
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />

      <main className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <AdminTabs activeTab={activeTab} onTabChange={setActiveTab} />

          <TabsContent value="dashboard" className="space-y-6">
            <AdminDashboard
              stats={stats}
              documents={documents}
              users={users}
              orders={orders}
            />
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <AdminUsers />
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <AdminOrders />
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            <AdminDocuments documents={documents} schools={[]} />
          </TabsContent>

          <TabsContent value="schools" className="space-y-6">
            <AdminSchools />
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <AdminContent
              homeContent={homeContent}
              onContentChange={setHomeContent}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminPage;
