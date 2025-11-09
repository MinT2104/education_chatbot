import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../core/store/hooks";
import {
  paymentService,
  SubscriptionResponse,
} from "../services/paymentService";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";

type Plan = "Free" | "Go";

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

const PaymentPage = () => {
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);

  const [subscription, setSubscription] = useState<SubscriptionResponse | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<Plan>("Free");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/app");
      return;
    }

    loadSubscription();
  }, [isAuthenticated, navigate]);

  const loadSubscription = async () => {
    try {
      const data = await paymentService.getSubscription();
      setSubscription(data);
      // Update current plan based on subscription
      if (data.plan) {
        const planName = data.plan.toLowerCase();
        if (planName === "go") {
          setCurrentPlan("Go");
        } else {
          setCurrentPlan("Free");
        }
      }
    } catch (error: any) {
      console.error("Failed to load subscription:", error);
      toast.error("Failed to load subscription information");
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async () => {
    if (processing) return;

    try {
      setProcessing(true);
      // Create PayPal subscription for Go plan
      const response = await paymentService.createSubscription("go");

      // Redirect to PayPal approval page
      if (response.approvalUrl) {
        window.location.href = response.approvalUrl;
      } else {
        throw new Error("No approval URL received");
      }
    } catch (error: any) {
      console.error("Failed to create subscription:", error);
      toast.error(
        error.response?.data?.message || "Failed to create subscription"
      );
      setProcessing(false);
    }
  };

  const handleSwitchToFree = async () => {
    if (
      !confirm(
        "Are you sure you want to switch to Free plan? Your subscription will be cancelled."
      )
    ) {
      return;
    }

    try {
      setProcessing(true);
      // Cancel subscription (which will switch to Free plan)
      await paymentService.cancelSubscription();
      toast.success("Switched to Free plan");
      await loadSubscription();
      setCurrentPlan("Free");
      // Refresh after a moment to update UI
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error: any) {
      console.error("Failed to switch to Free plan:", error);
      toast.error(
        error.response?.data?.message || "Failed to switch to Free plan"
      );
      setProcessing(false);
    }
  };

  const handleCancel = async () => {
    if (
      !confirm(
        "Are you sure you want to cancel your subscription? You will be downgraded to Free plan."
      )
    ) {
      return;
    }

    try {
      setProcessing(true);
      await paymentService.cancelSubscription();
      toast.success("Subscription cancelled successfully");
      await loadSubscription();
      setCurrentPlan("Free");
      // Refresh after a moment to update UI
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error: any) {
      console.error("Failed to cancel subscription:", error);
      toast.error(
        error.response?.data?.message || "Failed to cancel subscription"
      );
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    );
  }

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
          Upgrade your plan
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Free Card */}
          <div
            className={`rounded-3xl bg-surface shadow-[inset_0_0_0_1px_var(--border)] p-6 md:p-8 flex flex-col`}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-text">Free</h2>
            </div>
            <div className="mt-2 text-3xl font-semibold text-text">
              $0
              <span className="text-base font-normal text-text-subtle ml-1">
                / month
              </span>
            </div>
            <p className="mt-2 text-sm text-text-subtle">
              Intelligence for everyday tasks
            </p>
            <div className="mt-5 flex-shrink-0">
              <button
                onClick={currentPlan === "Go" ? handleSwitchToFree : undefined}
                disabled={processing || currentPlan === "Free"}
                className="w-full min-h-[44px] px-4 py-2.5 rounded-2xl bg-surface-muted text-text hover:bg-primary-500/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {currentPlan === "Free"
                  ? "Your current plan"
                  : "Switch to Free"}
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
          <div
            className={`rounded-3xl bg-surface shadow-[inset_0_0_0_1px_var(--border)] p-6 md:p-8 relative flex flex-col ${
              currentPlan === "Go" ? "ring-2 ring-primary-500/30" : ""
            }`}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-text">Go</h2>
              <span className="text-2xs px-2 py-0.5 rounded-full bg-primary-500/10 text-primary-600">
                NEW
              </span>
            </div>
            <div className="mt-2 text-3xl font-semibold text-text">
              ₹399
              <span className="text-base font-normal text-text-subtle ml-1">
                / month
              </span>
            </div>
            <p className="mt-2 text-sm text-text-subtle">
              More access to popular features
            </p>
            <div className="mt-5 flex-shrink-0">
              {currentPlan === "Go" ? (
                <>
                  {subscription?.subscription?.nextBillingDate && (
                    <p className="mb-3 text-xs text-text-subtle">
                      Next billing:{" "}
                      {new Date(
                        subscription.subscription.nextBillingDate
                      ).toLocaleDateString()}
                    </p>
                  )}
                  <button
                    onClick={handleCancel}
                    disabled={processing}
                    className="w-full min-h-[44px] px-4 py-2.5 rounded-2xl bg-surface-muted text-text hover:bg-red-500/10 hover:text-red-600 disabled:opacity-50 flex items-center justify-center"
                  >
                    {processing ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Cancelling...
                      </span>
                    ) : (
                      "Cancel subscription"
                    )}
                  </button>
                </>
              ) : (
                <button
                  onClick={handleUpgrade}
                  disabled={processing}
                  className="w-full min-h-[44px] px-4 py-2.5 rounded-2xl bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {processing ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processing...
                    </span>
                  ) : (
                    "Upgrade to Go"
                  )}
                </button>
              )}
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

export default PaymentPage;
