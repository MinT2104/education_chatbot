import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../core/store/hooks";
import { adminService } from "../../admin/services/adminService";

type SchoolCategory = "government" | "private";

const Feature = ({ children }: { children: string }) => (
  <li className="flex items-start gap-2 text-sm text-text">
    <svg
      className="w-4 h-4 mt-0.5 text-primary-500"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 13l4 4L19 7"
      />
    </svg>
    <span className="text-text-subtle">{children}</span>
  </li>
);

const PricingPage = () => {
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  const [category, setCategory] = useState<SchoolCategory>("government");
  const [appSettings, setAppSettings] = useState<Record<string, string>>({});

  useEffect(() => {
    // Load pricing settings
    (async () => {
      try {
        const res = await adminService.getAppSettings();
        setAppSettings(res.settings || {});
      } catch {
        // ignore
      }
    })();
  }, []);

  const handleUpgrade = () => {
    if (isAuthenticated) {
      navigate("/upgrade");
    } else {
      // Show login modal or navigate to login
      navigate("/app");
    }
  };

  const priceByCategory = (cat: SchoolCategory) => {
    const gov = appSettings.go_price_government_inr || "299";
    const pri = appSettings.go_price_private_inr || "399";
    return cat === "government" ? `₹${gov}` : `₹${pri}`;
  };

  return (
    <div className="min-h-screen bg-bg flex justify-center px-4 py-10">
      <div className="w-full max-w-5xl">
        {/* Back Button */}
        <button
          onClick={() => navigate("/app")}
          className="flex items-center gap-2 text-text-subtle hover:text-text mb-6 transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span>Back</span>
        </button>

        <h1 className="text-2xl md:text-3xl font-semibold mb-8 text-text text-center">
          Plans and Pricing
        </h1>

        {/* Category Tabs */}
        <div className="flex items-center justify-center mb-8">
          <div className="inline-flex rounded-2xl bg-surface shadow-[inset_0_0_0_1px_var(--border)] p-1 border border-border">
            <button
              className={`px-4 py-2 rounded-xl text-sm transition-colors min-w-[160px] ${
                category === "government"
                  ? "bg-primary-500 text-white shadow"
                  : "bg-surface-muted text-text hover:bg-primary-500/10"
              }`}
              onClick={() => setCategory("government")}
              aria-current={category === "government" ? "true" : "false"}
            >
              Government schools
            </button>
            <button
              className={`px-4 py-2 rounded-xl text-sm transition-colors min-w-[160px] ${
                category === "private"
                  ? "bg-primary-500 text-white shadow"
                  : "bg-surface-muted text-text hover:bg-primary-500/10"
              }`}
              onClick={() => setCategory("private")}
              aria-current={category === "private" ? "true" : "false"}
            >
              Private schools
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Free Card */}
          <div className="rounded-3xl bg-surface shadow-[inset_0_0_0_1px_var(--border)] p-6 md:p-8 flex flex-col">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-text">Free</h2>
            </div>
            <div className="mt-2 text-3xl font-semibold text-text">
              ₹0
              <span className="text-base font-normal text-text-subtle ml-1">
                / month
              </span>
            </div>
            <p className="mt-2 text-sm text-text-subtle">
              Intelligence for everyday tasks
            </p>
            <div className="mt-5 flex-shrink-0">
              <button
                onClick={() => navigate("/app")}
                className="w-full min-h-[44px] px-4 py-2.5 rounded-2xl bg-surface-muted text-text hover:bg-primary-500/10"
              >
                Get Started
              </button>
            </div>
            <ul className="mt-6 space-y-3 flex-grow">
              <Feature>Access to GPT-5</Feature>
              <Feature>Limited file uploads</Feature>
              <Feature>Limited and slower image generation</Feature>
              <Feature>Limited memory and context</Feature>
              <Feature>Limited deep research</Feature>
            </ul>
            <p className="mt-6 text-xs text-text-subtle">
              Have an existing plan?{" "}
              <button className="underline hover:text-primary-600">
                See billing help
              </button>
            </p>
          </div>

          {/* Go Card */}
          <div className="rounded-3xl bg-surface shadow-[inset_0_0_0_1px_var(--border)] p-6 md:p-8 relative flex flex-col">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-text">Go</h2>
              <span className="text-2xs px-2 py-0.5 rounded-full bg-primary-500/10 text-primary-600">
                NEW
              </span>
            </div>
            <div className="mt-2 text-3xl font-semibold text-text">
              {priceByCategory(category)}
              <span className="text-base font-normal text-text-subtle ml-1">
                / month
              </span>
            </div>
            <p className="mt-2 text-sm text-text-subtle">
              More access to popular features
            </p>
            <div className="mt-5 flex-shrink-0">
              <button
                onClick={handleUpgrade}
                className="w-full min-h-[44px] px-4 py-2.5 rounded-2xl bg-primary-500 text-white hover:bg-primary-600"
              >
                {isAuthenticated ? "Upgrade to Go" : "Sign up to upgrade"}
              </button>
            </div>
            <ul className="mt-6 space-y-3 flex-grow">
              <Feature>Expanded Access to GPT-5</Feature>
              <Feature>Expanded messaging and uploads</Feature>
              <Feature>Expanded and faster image creation</Feature>
              <Feature>Longer memory and context</Feature>
              <Feature>Limited deep research</Feature>
              <Feature>Projects, tasks, custom GPTs</Feature>
            </ul>
            <p className="mt-6 text-xs text-text-subtle">
              Only available in certain regions.{" "}
              <button className="underline hover:text-primary-600">
                Limits apply
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;

