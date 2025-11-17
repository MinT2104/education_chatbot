import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../core/store/hooks";
import {
  paymentService,
  SubscriptionResponse,
  RazorpayVerifyPayload,
  PaymentError,
} from "../services/paymentService";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";
import { adminService } from "../../admin/services/adminService";
import { getMe } from "../../auth/store/authSlice";
import { AxiosError } from "axios";

type Plan = "Free" | "Go";
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

const PaymentPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  const currentUser = useAppSelector((s) => s.user.userData);

  const [subscription, setSubscription] = useState<SubscriptionResponse | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [planActionProcessing, setPlanActionProcessing] = useState(false);
  const [paypalProcessing, setPaypalProcessing] = useState(false);
  const [razorpayProcessing, setRazorpayProcessing] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<Plan>("Free");
  const [category, setCategory] = useState<SchoolCategory>("government");
  const [appSettings, setAppSettings] = useState<Record<string, string>>({});

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
                loadSubscription(),
                dispatch(getMe())
              ]);
              
              setCurrentPlan("Go");
              
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

  const priceByCategory = (cat: SchoolCategory) => {
    const gov = appSettings.go_price_government_inr || "299";
    const pri = appSettings.go_price_private_inr || "399";
    return cat === "government" ? `₹${gov}` : `₹${pri}`;
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
      setPlanActionProcessing(true);
      // Cancel subscription (which will switch to Free plan)
      await paymentService.cancelSubscription();
      toast.success("Switched to Free plan");
      await loadSubscription();
      setCurrentPlan("Free");
      await dispatch(getMe());
    } catch (error: any) {
      console.error("Failed to switch to Free plan:", error);
      toast.error(
        error.response?.data?.message || "Failed to switch to Free plan"
      );
    } finally {
      setPlanActionProcessing(false);
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
      await loadSubscription();
      setCurrentPlan("Free");
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

  const isCheckoutProcessing = paypalProcessing || razorpayProcessing;

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
                disabled={planActionProcessing || currentPlan === "Free"}
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
              {priceByCategory(category)}
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
              ) : (
                <div className="flex flex-col gap-3">
                  <button
                    onClick={handlePayPalCheckout}
                    disabled={isCheckoutProcessing}
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
                    disabled={isCheckoutProcessing}
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
