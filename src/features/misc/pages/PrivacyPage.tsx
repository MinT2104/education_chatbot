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
            <div className="space-y-6 text-foreground">
              <div>
                <p className="text-sm text-muted-foreground mb-4">
                  Last updated: {new Date().toLocaleDateString()}
                </p>
              </div>

              <section>
                <h2 className="text-xl font-semibold mb-3">1. Introduction</h2>
                <p className="mb-3">
                  We respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information when you use our service.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">2. Information We Collect</h2>
                <p className="mb-3">We collect information that you provide directly to us, including:</p>
                <ul className="list-disc pl-6 space-y-2 mb-3">
                  <li>Account information (name, email address, password)</li>
                  <li>Profile information you choose to provide</li>
                  <li>Content you create, upload, or share through the service</li>
                  <li>Payment information for subscription services</li>
                  <li>Communications with our support team</li>
                </ul>
                <p className="mb-3">We also automatically collect certain information about your device and usage:</p>
                <ul className="list-disc pl-6 space-y-2 mb-3">
                  <li>Device information (IP address, browser type, operating system)</li>
                  <li>Usage data (pages visited, features used, time spent)</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">3. How We Use Your Information</h2>
                <p className="mb-3">We use the information we collect to:</p>
                <ul className="list-disc pl-6 space-y-2 mb-3">
                  <li>Provide, maintain, and improve our service</li>
                  <li>Process transactions and send related information</li>
                  <li>Send technical notices, updates, and support messages</li>
                  <li>Respond to your comments and questions</li>
                  <li>Monitor and analyze usage patterns and trends</li>
                  <li>Detect, prevent, and address technical issues</li>
                  <li>Personalize your experience</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">4. Information Sharing</h2>
                <p className="mb-3">
                  We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
                </p>
                <ul className="list-disc pl-6 space-y-2 mb-3">
                  <li>With your consent</li>
                  <li>To comply with legal obligations</li>
                  <li>To protect our rights and safety</li>
                  <li>With service providers who assist us in operating our service</li>
                  <li>In connection with a business transfer or merger</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">5. Data Security</h2>
                <p className="mb-3">
                  We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">6. Your Rights</h2>
                <p className="mb-3">You have the right to:</p>
                <ul className="list-disc pl-6 space-y-2 mb-3">
                  <li>Access your personal information</li>
                  <li>Correct inaccurate or incomplete information</li>
                  <li>Request deletion of your personal information</li>
                  <li>Object to processing of your personal information</li>
                  <li>Request restriction of processing</li>
                  <li>Data portability</li>
                  <li>Withdraw consent at any time</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">7. Cookies</h2>
                <p className="mb-3">
                  We use cookies and similar tracking technologies to track activity on our service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">8. Children's Privacy</h2>
                <p className="mb-3">
                  Our service is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">9. Changes to This Policy</h2>
                <p className="mb-3">
                  We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-3">10. Contact Us</h2>
                <p className="mb-3">
                  If you have any questions about this Privacy Policy, please contact us through the support channels provided in the application.
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

export default PrivacyPage;
