import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LayoutDashboard,
  School,
  FileText,
  Users,
  CreditCard,
  List,
  DollarSign,
  PanelsTopLeft,
  MessageSquare,
  ScrollText,
  BookOpen,
} from "lucide-react";

interface AdminTabsProps {
  onTabChange: (value: string) => void;
}

export const AdminTabs = ({ onTabChange }: AdminTabsProps) => {
  return (
    <div className="mb-4 md:mb-8 overflow-x-auto -mx-3 sm:-mx-4 md:-mx-6 px-3 sm:px-4 md:px-6">
      <TabsList className="flex flex-nowrap gap-1.5 sm:gap-2 min-w-max md:flex-wrap md:min-w-0">
        <TabsTrigger
          value="dashboard"
          className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm whitespace-nowrap"
          onClick={() => onTabChange("dashboard")}
        >
          <LayoutDashboard className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">Dashboard</span>
        </TabsTrigger>
        <TabsTrigger
          value="users"
          className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm whitespace-nowrap"
          onClick={() => onTabChange("users")}
        >
          <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">Users</span>
        </TabsTrigger>
        <TabsTrigger
          value="orders"
          className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm whitespace-nowrap"
          onClick={() => onTabChange("orders")}
        >
          <CreditCard className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">Orders & Billing</span>
          <span className="sm:hidden">Orders</span>
        </TabsTrigger>
        <TabsTrigger
          value="documents"
          className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm whitespace-nowrap"
          onClick={() => onTabChange("documents")}
        >
          <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">Documents</span>
        </TabsTrigger>
        <TabsTrigger
          value="schools"
          className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm whitespace-nowrap"
          onClick={() => onTabChange("schools")}
        >
          <School className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">Schools</span>
        </TabsTrigger>
        <TabsTrigger
          value="subjects"
          className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm whitespace-nowrap"
          onClick={() => onTabChange("subjects")}
        >
          <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">Subjects</span>
        </TabsTrigger>
        <TabsTrigger
          value="logs"
          className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm whitespace-nowrap"
          onClick={() => onTabChange("logs")}
        >
          <List className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">Logs</span>
        </TabsTrigger>
        <TabsTrigger
          value="pricing"
          className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm whitespace-nowrap"
          onClick={() => onTabChange("pricing")}
        >
          <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">Pricing</span>
        </TabsTrigger>
        <TabsTrigger
          value="prompts"
          className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm whitespace-nowrap"
          onClick={() => onTabChange("prompts")}
        >
          <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">Prompts</span>
        </TabsTrigger>
        <TabsTrigger
          value="pages"
          className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm whitespace-nowrap"
          onClick={() => onTabChange("pages")}
        >
          <ScrollText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">Policies</span>
        </TabsTrigger>
        <TabsTrigger
          value="spaces"
          className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm whitespace-nowrap"
          onClick={() => onTabChange("spaces")}
        >
          <PanelsTopLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="hidden sm:inline">Spaces</span>
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
    </div>
  );
};
