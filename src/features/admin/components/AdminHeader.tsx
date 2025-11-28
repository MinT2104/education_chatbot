import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GraduationCap, Home } from "lucide-react";

export const AdminHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="border-b bg-card sticky top-0 z-10">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 py-3 md:py-4">
        <div className="flex items-center justify-between gap-2 md:gap-4">
          <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
            <div className="p-1.5 sm:p-2 bg-primary rounded-lg flex-shrink-0">
              <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-primary-foreground" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground truncate">
                Admin Panel
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
                Education Chatbot Management
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1.5 sm:gap-2"
              onClick={() => navigate("/app")}
            >
              <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Back to App</span>
              <span className="sm:hidden">App</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

