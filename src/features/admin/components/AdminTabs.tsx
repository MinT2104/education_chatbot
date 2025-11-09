import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LayoutDashboard,
  School,
  FileText,
  Users,
  CreditCard,
} from "lucide-react";

interface AdminTabsProps {
  onTabChange: (value: string) => void;
}

export const AdminTabs = ({ onTabChange }: AdminTabsProps) => {
  return (
    <TabsList className="flex flex-wrap gap-2 mb-8">
      <TabsTrigger
        value="dashboard"
        className="flex items-center gap-2"
        onClick={() => onTabChange("dashboard")}
      >
        <LayoutDashboard className="w-4 h-4" />
        Dashboard
      </TabsTrigger>
      <TabsTrigger
        value="users"
        className="flex items-center gap-2"
        onClick={() => onTabChange("users")}
      >
        <Users className="w-4 h-4" />
        Users
      </TabsTrigger>
      <TabsTrigger
        value="orders"
        className="flex items-center gap-2"
        onClick={() => onTabChange("orders")}
      >
        <CreditCard className="w-4 h-4" />
        Orders & Billing
      </TabsTrigger>
      <TabsTrigger
        value="documents"
        className="flex items-center gap-2"
        onClick={() => onTabChange("documents")}
      >
        <FileText className="w-4 h-4" />
        Documents
      </TabsTrigger>
      <TabsTrigger
        value="schools"
        className="flex items-center gap-2"
        onClick={() => onTabChange("schools")}
      >
        <School className="w-4 h-4" />
        Schools
      </TabsTrigger>
      {/* <TabsTrigger
        value="content"
        className="flex items-center gap-2"
        onClick={() => onTabChange("content")}
      >
        <Settings2 className="w-4 h-4" />
        Home Content
      </TabsTrigger> */}
    </TabsList>
  );
};
