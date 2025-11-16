import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DOMPurify from "dompurify";
import { Button } from "@/components/ui/button";
import {
  staticPageService,
  type StaticPage,
} from "../services/staticPageService";
import { useCookieConsent } from "@/hooks/use-cookie-consent";

const CookiesPage = () => {
  const [page, setPage] = useState<StaticPage | null>(null);
  const [loading, setLoading] = useState(true);
  const { consent, acceptAll, rejectNonEssential } = useCookieConsent();

  useEffect(() => {
    (async () => {
      const result = await staticPageService.getPage("cookies");
      setPage(result);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-semibold mb-4">
          {loading ? "Loading..." : page?.title || "Cookie Preferences"}
        </h1>
        <div className="prose max-w-none prose-sm dark:prose-invert text-foreground">
          {page?.content ? (
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(page.content),
              }}
            />
          ) : (
            <p className="text-sm text-muted-foreground">
              Cookie policy content will appear here once configured by the
              administrator.
            </p>
          )}
        </div>
        <div className="mt-8 space-y-6">
          <div className="border-t border-border pt-6">
            <h2 className="text-xl font-semibold mb-4">Manage Cookie Preferences</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Current preference:{" "}
              <span className="font-medium text-foreground">
                {consent === "accepted"
                  ? "Accepted all cookies"
                  : consent === "rejected"
                  ? "Rejected non-essential cookies"
                  : "No preference set"}
              </span>
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={acceptAll} variant="default">
                Accept all cookies
              </Button>
              <Button onClick={rejectNonEssential} variant="outline">
                Reject non-essential cookies
              </Button>
            </div>
          </div>
          <div>
            <Link
              to="/app"
              className="text-primary underline hover:text-primary/80"
            >
              Back to App
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookiesPage;
