import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../core/store/hooks";
import { paymentService } from "../services/paymentService";
import { Plan } from "../types/plan";
import AuthDialog from "../../auth/components/AuthDialog";
import { getMe } from "../../auth/store/authSlice";
import { toast } from "react-toastify";

type SchoolCategory = "government" | "private";

const Feature = ({ 
  children, 
  enabled = true 
}: { 
  children: string; 
  enabled?: boolean;
}) => (
  <li className={`flex items-start gap-2 text-sm text-text ${!enabled ? 'opacity-50' : ''}`}>
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
        d={enabled ? "M5 13l4 4L19 7" : "M6 18L18 6M6 6l12 12"}
      />
    </svg>
    <span className="text-text-subtle">{children}</span>
  </li>
);

const PricingPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  const user = useAppSelector((s) => s.auth.user);
  const [category, setCategory] = useState<SchoolCategory>("government");
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [authModal, setAuthModal] = useState<"login" | "signup" | null>(null);

  useEffect(() => {
    // Load plans
    (async () => {
      try {
        setLoading(true);
        const data = await paymentService.getAllPlans();
        
        // Service already returns Plan[], just filter and sort
        // Only show active plans, sorted by display order
        const activePlans = data
          .filter((p) => p.isActive !== false)
          .sort((a, b) => a.displayOrder - b.displayOrder);
        setPlans(activePlans);
      } catch (error) {
        console.error("Failed to load plans:", error);
        // Set empty array if loading fails
        setPlans([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const normalizePlanCode = (code?: string | null) =>
    (code || "").toLowerCase().replace(/\s+/g, "");

  const userPlanCode = normalizePlanCode(
    user?.plan ||
      (user as any)?.subscription?.plan ||
      (user as any)?.subscription?.planName
  );

  const handleUpgrade = (planCode: string) => {
    const targetCode = normalizePlanCode(planCode);
    if (!isAuthenticated) {
      setAuthModal("login");
      return;
    }

    // If already on this plan, nothing to do
    if (userPlanCode && userPlanCode === targetCode) {
      return;
    }

    // Switch to free: cancel current subscription, refresh user, stay on page
    if (targetCode === "free") {
      (async () => {
        try {
          await paymentService.cancelSubscription();
          toast.success("Switched to Free plan");
          dispatch(getMe());
        } catch (error: any) {
          console.error("Failed to cancel subscription:", error);
          toast.error("Unable to switch to Free right now");
        }
      })();
      return;
    }

    // Paid upgrade flow
    navigate("/subscription");
  };

  const getPlanPrice = (plan: Plan, cat: SchoolCategory) => {
    const price =
      cat === "government" ? plan.priceGovernment : plan.pricePrivate;
    return `${plan.currency === "USD" ? "$" : "₹"}${price ?? 0}`;
  };

  const getPlanButtonText = (plan: Plan) => {
    const isCurrent =
      isAuthenticated && userPlanCode === normalizePlanCode(plan.code);

    if (plan.code === "free") {
      if (isCurrent) return "Current plan";
      return isAuthenticated ? "Switch to Free" : "Get Started";
    }
    if (isCurrent) return "Current plan";
    return isAuthenticated ? `Upgrade to ${plan.name}` : "Sign up to upgrade";
  };

  const getPlanButtonStyle = (plan: Plan) => {
    if (plan.code === "free") {
      return "w-full min-h-[44px] px-4 py-2.5 rounded-2xl bg-surface-muted text-text hover:bg-primary-500/10";
    }
    return "w-full min-h-[44px] px-4 py-2.5 rounded-2xl bg-primary-500 text-white hover:bg-primary-600";
  };

  const fallbackPlans: Plan[] = [
    {
      id: "free-fallback",
      code: "free",
      name: "Free",
      description: "Intelligence for everyday tasks",
      priceGovernment: 0,
      pricePrivate: 0,
      currency: "INR",
      billingPeriod: "month",
      features: [
        { id: "f1", text: "Access to GPT-5", enabled: true },
        { id: "f2", text: "Limited file uploads", enabled: true },
        { id: "f3", text: "Limited and slower image generation", enabled: true },
        { id: "f4", text: "Limited memory and context", enabled: true },
        { id: "f5", text: "Limited deep research", enabled: true },
      ],
      badge: "",
      isActive: true,
      displayOrder: 0,
    },
    {
      id: "go-fallback",
      code: "go",
      name: "Go",
      description: "More access to popular features",
      priceGovernment: 299,
      pricePrivate: 399,
      currency: "INR",
      billingPeriod: "month",
      features: [
        { id: "g1", text: "Expanded Access to GPT-5", enabled: true },
        { id: "g2", text: "Expanded messaging and uploads", enabled: true },
        { id: "g3", text: "Expanded and faster image creation", enabled: true },
        { id: "g4", text: "Longer memory and context", enabled: true },
        { id: "g5", text: "Limited deep research", enabled: true },
        { id: "g6", text: "Projects, tasks, custom GPTs", enabled: true },
      ],
      badge: "NEW",
      isActive: true,
      displayOrder: 1,
    },
  ];

  const displayedPlans = plans.length > 0 ? plans : fallbackPlans;

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

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {displayedPlans.map((plan) => (
              <div
                key={plan.id}
                className="rounded-3xl bg-surface shadow-[inset_0_0_0_1px_var(--border)] p-6 md:p-8 flex flex-col"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-semibold text-text">{plan.name}</h2>
                    {isAuthenticated &&
                      userPlanCode === normalizePlanCode(plan.code) && (
                        <span className="text-2xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-600">
                          Current plan
                        </span>
                      )}
                  </div>
                  {plan.badge && (
                    <span className="text-2xs px-2 py-0.5 rounded-full bg-primary-500/10 text-primary-600">
                      {plan.badge}
                    </span>
                  )}
                </div>
                <div className="mt-2 text-3xl font-semibold text-text">
                  {getPlanPrice(plan, category)}
                  <span className="text-base font-normal text-text-subtle ml-1">
                    / {plan.billingPeriod || "month"}
                  </span>
                </div>
                <p className="mt-2 text-sm text-text-subtle">
                  {plan.description ||
                    (plan.code === "free"
                      ? "Intelligence for everyday tasks"
                      : "More access to popular features")}
                </p>
                <div className="mt-5 flex-shrink-0">
                  <button
                    onClick={() => handleUpgrade(plan.code)}
                    className={getPlanButtonStyle(plan)}
                    disabled={
                      isAuthenticated &&
                      userPlanCode === normalizePlanCode(plan.code)
                    }
                  >
                    {getPlanButtonText(plan)}
                  </button>
                </div>
                <ul className="mt-6 space-y-3 flex-grow">
                  {(plan.features && plan.features.length > 0
                    ? plan.features
                    : fallbackPlans.find((p) => p.code === plan.code)?.features || []
                  ).map((feature) => (
                    <Feature key={`${plan.id}-${feature.id}`} enabled={feature.enabled}>
                      {feature.text}
                    </Feature>
                  ))}
                </ul>
                {plan.limitGovernment && plan.limitPrivate && (
                  <p className="mt-6 text-xs text-text-subtle">
                    Message limits: {category === "government" ? plan.limitGovernment : plan.limitPrivate} per day
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
        {plans.length === 0 && !loading && (
          <p className="text-xs text-text-subtle mt-3 text-center">
            Showing fallback plans because live plans are unavailable.
          </p>
        )}
        <AuthDialog
          inline
          open={authModal !== null}
          onClose={() => setAuthModal(null)}
          initialMode={authModal || "login"}
        />
      </div>
    </div>
  );
};

export default PricingPage;
