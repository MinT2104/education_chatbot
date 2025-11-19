import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";
import { ArrowLeft } from "lucide-react";
import {
  staticPageService,
  type StaticPage,
} from "../services/staticPageService";

const TermsPage = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState<StaticPage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const result = await staticPageService.getPage("terms");
      setPage(result);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>Back</span>
        </button>

        <h1 className="text-2xl font-semibold mb-4">
          {loading ? "Loading..." : page?.title || "Terms of Service"}
        </h1>
        <div className="prose max-w-none prose-sm dark:prose-invert text-foreground">
          {page?.content ? (
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(page.content),
              }}
            />
          ) : (
            <div className="space-y-6 text-foreground">
              <div>
                <p className="text-sm text-muted-foreground mb-4">
                  Last updated: {new Date().toLocaleDateString()}
                </p>
              </div>

              <section>
                <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
                <p className="mb-3">
                  By accessing and using this service, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">2. Use License</h2>
                <p className="mb-3">
                  Permission is granted to temporarily use this service for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                </p>
                <ul className="list-disc pl-6 space-y-2 mb-3">
                  <li>Modify or copy the materials</li>
                  <li>Use the materials for any commercial purpose or for any public display</li>
                  <li>Attempt to reverse engineer any software contained in the service</li>
                  <li>Remove any copyright or other proprietary notations from the materials</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">3. User Account</h2>
                <p className="mb-3">
                  When you create an account with us, you must provide information that is accurate, complete, and current at all times. You are responsible for safeguarding the password and for all activities that occur under your account.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">4. Acceptable Use</h2>
                <p className="mb-3">You agree not to use the service to:</p>
                <ul className="list-disc pl-6 space-y-2 mb-3">
                  <li>Violate any applicable laws or regulations</li>
                  <li>Infringe upon the rights of others</li>
                  <li>Transmit any harmful or malicious code</li>
                  <li>Interfere with or disrupt the service or servers</li>
                  <li>Harass, abuse, or harm other users</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">5. Subscription and Payment</h2>
                <p className="mb-3">
                  Some features of the service may require payment. By subscribing to a paid plan, you agree to pay all charges associated with your subscription. All fees are non-refundable unless otherwise stated.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">6. Intellectual Property</h2>
                <p className="mb-3">
                  The service and its original content, features, and functionality are and will remain the exclusive property of the service provider and its licensors. The service is protected by copyright, trademark, and other laws.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">7. Termination</h2>
                <p className="mb-3">
                  We may terminate or suspend your account and bar access to the service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">8. Disclaimer</h2>
                <p className="mb-3">
                  The information on this service is provided on an "as is" basis. To the fullest extent permitted by law, we exclude all representations, warranties, and conditions relating to our service and the use of this service.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">9. Limitation of Liability</h2>
                <p className="mb-3">
                  In no event shall we be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the service.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">10. Changes to Terms</h2>
                <p className="mb-3">
                  We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">11. Contact Information</h2>
                <p className="mb-3">
                  If you have any questions about these Terms, please contact us through the support channels provided in the application.
                </p>
              </section>
            </div>
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

export default TermsPage;
