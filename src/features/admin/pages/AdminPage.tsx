import { useState, useEffect } from "react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { mockDocuments, mockHomeContent } from "../data/mockData";
import { Document as DocumentType, HomePageContent } from "../types";
import { AdminHeader } from "../components/AdminHeader";
import { AdminTabs } from "../components/AdminTabs";
import { AdminDashboard } from "../components/dashboard/AdminDashboard";
import { AdminUsers } from "../components/users/AdminUsers";
import { AdminOrders } from "../components/orders/AdminOrders";
import { AdminDocuments } from "../components/documents/AdminDocuments";
import { AdminSchools } from "../components/schools/AdminSchools";
import { AdminContent } from "../components/content/AdminContent";
import { adminService, School } from "../services/adminService";
import { AdminLogs } from "../components/logs/AdminLogs";
import { AdminPricing } from "../components/pricing/AdminPricing";
import { AdminSpaces } from "../components/spaces/AdminSpaces";
import { AdminPrompts } from "../components/prompts/AdminPrompts";
import { AdminStaticPages } from "../components/pages/AdminStaticPages";

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [documents] = useState<DocumentType[]>(mockDocuments);
  const [homeContent, setHomeContent] =
    useState<HomePageContent>(mockHomeContent);
  const [users, setUsers] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [schools, setSchools] = useState<School[]>([]);

  useEffect(() => {
    // Load real data for dashboard
    const loadDashboardData = async () => {
      try {
        const [usersData, subscriptionsData, schoolsData] = await Promise.all([
          adminService.getAllUsers(),
          adminService.getAllSubscriptions(),
          adminService.getAllSchools(),
        ]);

        setUsers(usersData);
        setOrders(subscriptionsData.subscriptions || []);
        setSchools(Array.isArray(schoolsData) ? schoolsData : []);
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
          <AdminTabs onTabChange={setActiveTab} />

          <TabsContent value="dashboard" className="space-y-6">
            <AdminDashboard
              documents={documents}
              users={users}
              orders={orders}
              schools={schools}
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

          <TabsContent value="logs" className="space-y-6">
            <AdminLogs />
          </TabsContent>

          <TabsContent value="pricing" className="space-y-6">
            <AdminPricing />
          </TabsContent>

          <TabsContent value="prompts" className="space-y-6">
            <AdminPrompts />
          </TabsContent>

          <TabsContent value="pages" className="space-y-6">
            <AdminStaticPages />
          </TabsContent>

          <TabsContent value="spaces" className="space-y-6">
            <AdminSpaces />
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
