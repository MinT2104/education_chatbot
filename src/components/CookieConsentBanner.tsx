import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCookieConsent } from "@/hooks/use-cookie-consent";

const CookieConsentBanner = () => {
  const navigate = useNavigate();
  const { acceptAll, rejectNonEssential, showBanner } = useCookieConsent();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show banner if user hasn't given consent yet
    setIsVisible(showBanner);
  }, [showBanner]);

  const handleAcceptAll = () => {
    acceptAll();
    setIsVisible(false);
  };

  const handleRejectNonEssential = () => {
    rejectNonEssential();
    setIsVisible(false);
  };

  const handleManageCookies = () => {
    navigate("/cookies");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 animate-in slide-in-from-bottom">
      <div className="bg-background border-t border-border shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-1">
                We use cookies
              </h3>
              <p className="text-sm text-muted-foreground">
                We use cookies to help this site function, understand service
                usage, and support marketing efforts.{" "}
                <button
                  onClick={handleManageCookies}
                  className="underline text-primary hover:text-primary/80 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 rounded px-0.5"
                >
                  Visit Manage Cookies
                </button>{" "}
                to change preferences.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={handleManageCookies}
                className="w-full sm:w-auto"
              >
                Manage Cookies
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRejectNonEssential}
                className="w-full sm:w-auto"
              >
                Reject non-essential
              </Button>
              <Button
                size="sm"
                onClick={handleAcceptAll}
                className="w-full sm:w-auto"
              >
                Accept all
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsentBanner;

