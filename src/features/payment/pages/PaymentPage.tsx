import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../core/store/hooks";
import {
  paymentService,
  SubscriptionResponse,
  RazorpayVerifyPayload,
  PaymentError,
} from "../services/paymentService";
import { Plan } from "../types/plan";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";
import { getMe } from "../../auth/store/authSlice";
import { AxiosError } from "axios";
import AuthDialog from "../../auth/components/AuthDialog";

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

const PaymentPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  const user = useAppSelector((s) => s.auth.user);
  const currentUser = useAppSelector((s) => s.user.userData);

  const [subscription, setSubscription] = useState<SubscriptionResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [planActionProcessing, setPlanActionProcessing] = useState(false);
  const [paypalProcessing, setPaypalProcessing] = useState(false);
  const [razorpayProcessing, setRazorpayProcessing] = useState(false);
  const [category, setCategory] = useState<SchoolCategory>("government");
  const [plans, setPlans] = useState<Plan[]>([]);
  const [authModal, setAuthModal] = useState<"login" | "signup" | null>(null);
  const [switchingToFree, setSwitchingToFree] = useState(false);

  // Derived state for checkout processing
  const isCheckoutProcessing = paypalProcessing || razorpayProcessing;

  useEffect(() => {
    loadInitialData();
  }, [isAuthenticated]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      
      // Load plans (public API, no auth required)
      const plansData = await paymentService.getAllPlans();
      const activePlans = plansData
        .filter((p) => p.isActive !== false)
        .sort((a, b) => a.displayOrder - b.displayOrder);
      setPlans(activePlans);

      // Load subscription if authenticated
      if (isAuthenticated) {
        const subData = await paymentService.getSubscription();
        setSubscription(subData);
      }
    } catch (error: any) {
      console.error("Failed to load data:", error);
      if (isAuthenticated) {
        toast.error("Failed to load subscription information");
      }
    } finally {
      setLoading(false);
    }
  };

  const normalizePlanCode = (code?: string | null) =>
    (code || "").toLowerCase().replace(/\s+/g, "");

  const userPlanCode = normalizePlanCode(
    user?.plan ||
      (user as any)?.subscription?.plan ||
      (user as any)?.subscription?.planName
  );

  // Error handling helper
  const handlePaymentError = (error: AxiosError<PaymentError> | Error) => {
    const errorMessages: Record<string, string> = {
      AUTHENTICATION_REQUIRED: "Please login to continue.",
      UNSUPPORTED_PLAN: "This plan is not available.",
      RAZORPAY_NOT_CONFIGURED:
        "Payment system is temporarily unavailable. Please try again later.",
      ORDER_CREATION_FAILED: "Failed to create order. Please try again.",
      INVALID_SIGNATURE:
        "Payment verification failed. Please contact support with your payment ID.",
      SUBSCRIPTION_NOT_FOUND: "Subscription not found. Please try again.",
      VERIFICATION_FAILED:
        "Payment verification failed. Please contact support.",
      MISSING_PAYMENT_DETAILS: "Missing payment details. Please try again.",
    };

    if (error instanceof Error && "response" in error) {
      const axiosError = error as AxiosError<PaymentError>;
      const errorData = axiosError.response?.data;
      const errorCode = errorData?.error;
      const message =
        (errorCode && errorMessages[errorCode]) ||
        errorData?.message ||
        "An error occurred during payment";
      
      toast.error(message);
      console.error("Payment error:", errorData);
      return;
    }

    toast.error("Network error. Please check your connection and try again.");
    console.error("Network error:", error);
  };

  const ensureRazorpayScriptLoaded = () => {
    return new Promise<boolean>((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Retry logic for order creation
  const createOrderWithRetry = async (
    maxRetries = 3
  ): Promise<any | null> => {
    for (let i = 0; i < maxRetries; i++) {
      try {
        const result = await paymentService.createRazorpayOrder("go");
        
        if (result && result.success) {
          return result;
        }
      } catch (error: any) {
        console.error(`Order creation attempt ${i + 1} failed:`, error);
        
        if (i < maxRetries - 1) {
          // Wait before retry (exponential backoff)
          await new Promise((resolve) =>
            setTimeout(resolve, 1000 * (i + 1))
          );
        } else {
          throw error;
        }
      }
    }
    
    return null;
  };

  const handlePayPalCheckout = async () => {
    if (paypalProcessing || razorpayProcessing) return;

    // Require authentication
    if (!isAuthenticated) {
      setAuthModal("login");
      return;
    }

    try {
      setPaypalProcessing(true);
      const response = await paymentService.createSubscription("go");

      if (response.approvalUrl) {
        window.location.href = response.approvalUrl;
      } else {
        throw new Error("No approval URL received");
      }
    } catch (error: any) {
      console.error("Failed to create PayPal subscription:", error);
      handlePaymentError(error);
      setPaypalProcessing(false);
    }
  };

  const handleRazorpayCheckout = async () => {
    if (razorpayProcessing || paypalProcessing) return;

    // Require authentication
    if (!isAuthenticated) {
      setAuthModal("login");
      return;
    }

    try {
      setRazorpayProcessing(true);
      
      // Step 1: Load Razorpay script
      const scriptLoaded = await ensureRazorpayScriptLoaded();
      if (!scriptLoaded || !window.Razorpay) {
        throw new Error("Failed to load Razorpay checkout script");
      }

      // Step 2: Create order with retry logic
      const orderData = await createOrderWithRetry();
      
      if (!orderData || !orderData.success) {
        throw new Error("Failed to create order after multiple attempts");
      }

      // Step 3: Open Razorpay Checkout Modal
      const rzp = new window.Razorpay({
        key: orderData.razorpay_key,
        order_id: orderData.order.id,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: "Education Bot",
        description: orderData.plan.description || "Education Bot Go Plan",
        
        // Step 4: Payment success handler
        handler: async (response: RazorpayVerifyPayload) => {
          try {
            // Verify payment signature on backend
            const verifyResult = await paymentService.verifyRazorpayPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyResult.success) {
              // Success! User is now on "go" plan
              toast.success("Payment successful! Your subscription is now active.");
              
              // Refresh user state and subscription
              await Promise.all([
                loadInitialData(),
                dispatch(getMe())
              ]);
              
              // Optional: Show success message or redirect
              setTimeout(() => {
                toast.info("Welcome to the Go Plan! 🎉");
              }, 500);
            } else {
              // Verification failed
              toast.error(
                `Payment verification failed: ${verifyResult.message || 'Unknown error'}`
              );
              console.error("Verification error:", verifyResult);
            }
          } catch (error: any) {
            console.error("Failed to verify Razorpay payment:", error);
            handlePaymentError(error);
            toast.error(
              "Failed to verify payment. Please contact support with your payment ID: " +
                response.razorpay_payment_id
            );
          } finally {
            setRazorpayProcessing(false);
          }
        },
        
        // User info prefill
        prefill: {
          name: currentUser?.name || "",
          email: currentUser?.email || "",
          contact: currentUser?.phone || "",
        },
        
        // Theme customization
        theme: {
          color: "#3399cc",
        },
        
        // Modal close handler
        modal: {
          ondismiss: () => {
            console.log("Payment cancelled by user");
            toast.info("Payment cancelled. Your subscription was not activated.");
            setRazorpayProcessing(false);
          },
        },
      });

      // Open the Razorpay modal
      rzp.open();
      
    } catch (error: any) {
      console.error("Payment flow error:", error);
      handlePaymentError(error);
      setRazorpayProcessing(false);
    }
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
      if (switchingToFree) return "Switching...";
      return isAuthenticated ? "Switch to Free" : "Get Started";
    }
    if (isCurrent) return "Current plan";
    return isAuthenticated ? `Upgrade to ${plan.name}` : "Sign up to upgrade";
  };

  const getPlanButtonStyle = (plan: Plan) => {
    if (plan.code === "free") {
      return "w-full min-h-[44px] px-4 py-2.5 rounded-2xl bg-surface-muted text-text hover:bg-primary-500/10 disabled:opacity-50 disabled:cursor-not-allowed";
    }
    return "w-full min-h-[44px] px-4 py-2.5 rounded-2xl bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed";
  };

  const handleUpgrade = async (planCode: string) => {
    const targetCode = normalizePlanCode(planCode);
    if (!isAuthenticated) {
      setAuthModal("login");
      return;
    }

    // If already on this plan, nothing to do
    if (userPlanCode && userPlanCode === targetCode) {
      return;
    }

    // Switch to free: cancel current subscription
    if (targetCode === "free") {
      await handleSwitchToFree();
      return;
    }

    // Paid upgrade - scroll to payment buttons
    // No action needed, buttons are already visible in the plan card
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

  const handleSwitchToFree = async () => {
    if (switchingToFree) return;
    
    if (
      !confirm(
        "Are you sure you want to switch to Free plan? Your subscription will be cancelled."
      )
    ) {
      return;
    }

    try {
      setSwitchingToFree(true);
      setPlanActionProcessing(true);
      await paymentService.cancelSubscription();
      toast.success("Switched to Free plan");
      await loadInitialData();
      await dispatch(getMe());
    } catch (error: any) {
      console.error("Failed to switch to Free plan:", error);
      toast.error(
        error.response?.data?.message || "Failed to switch to Free plan"
      );
    } finally {
      setPlanActionProcessing(false);
      setSwitchingToFree(false);
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
      setPlanActionProcessing(true);
      await paymentService.cancelSubscription();
      toast.success("Subscription cancelled successfully");
      await loadInitialData();
      await dispatch(getMe());
    } catch (error: any) {
      console.error("Failed to cancel subscription:", error);
      toast.error(
        error.response?.data?.message || "Failed to cancel subscription"
      );
    } finally {
      setPlanActionProcessing(false);
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
          {displayedPlans.map((plan) => {
            const isCurrent = isAuthenticated && userPlanCode === normalizePlanCode(plan.code);
            const isPaidPlan = plan.code !== "free";

            return (
              <div
                key={plan.id}
                className={`rounded-3xl bg-surface shadow-[inset_0_0_0_1px_var(--border)] p-6 md:p-8 flex flex-col ${
                  isCurrent ? "ring-2 ring-primary-500/30" : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-semibold text-text">{plan.name}</h2>
                    {isCurrent && (
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
                  {plan.description}
                </p>
                
                {/* Action Buttons */}
                <div className="mt-5 flex-shrink-0">
                  {isPaidPlan && isCurrent ? (
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
                        disabled={planActionProcessing}
                        className="w-full min-h-[44px] px-4 py-2.5 rounded-2xl bg-surface-muted text-text hover:bg-red-500/10 hover:text-red-600 disabled:opacity-50 flex items-center justify-center"
                      >
                        {planActionProcessing ? (
                          <span className="flex items-center justify-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Cancelling...
                          </span>
                        ) : (
                          "Cancel subscription"
                        )}
                      </button>
                    </>
                  ) : isPaidPlan && !isCurrent ? (
                    <div className="flex flex-col gap-3">
                      <button
                        onClick={handlePayPalCheckout}
                        disabled={isCheckoutProcessing || !isAuthenticated}
                        className="w-full min-h-[44px] px-4 py-2.5 rounded-2xl bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                      >
                        {paypalProcessing ? (
                          <span className="flex items-center justify-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Redirecting to PayPal...
                          </span>
                        ) : (
                          "Pay with PayPal"
                        )}
                      </button>
                      <button
                        onClick={handleRazorpayCheckout}
                        disabled={isCheckoutProcessing || !isAuthenticated}
                        className="w-full min-h-[44px] px-4 py-2.5 rounded-2xl bg-indigo-500 text-white hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                      >
                        {razorpayProcessing ? (
                          <span className="flex items-center justify-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Opening Razorpay...
                          </span>
                        ) : (
                          "Pay with Razorpay"
                        )}
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleUpgrade(plan.code)}
                      className={getPlanButtonStyle(plan)}
                      disabled={isCurrent || (plan.code === "free" && switchingToFree)}
                    >
                      {getPlanButtonText(plan)}
                    </button>
                  )}
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
            );
          })}
        </div>

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

export default PaymentPage;
