import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DOMPurify from "dompurify";
import {
  staticPageService,
  type StaticPage,
} from "../services/staticPageService";

const PrivacyPage = () => {
  const [page, setPage] = useState<StaticPage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const result = await staticPageService.getPage("privacy");
      setPage(result);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-semibold mb-4">
          {loading ? "Loading..." : page?.title || "Privacy Policy"}
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
              Privacy policy content will appear here once configured by the
              administrator.
            </p>
          )}
        </div>
        <div className="mt-8">
          <Link
            to="/app"
            className="text-primary underline hover:text-primary/80"
          >
            Back to App
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
