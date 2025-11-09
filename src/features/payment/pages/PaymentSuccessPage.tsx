import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { paymentService } from "../services/paymentService";
import { toast } from "react-toastify";
import { Loader2, CheckCircle } from "lucide-react";

const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const subscriptionId = searchParams.get("subscription_id");

    if (!subscriptionId) {
      toast.error("Invalid payment response");
      navigate("/app");
      return;
    }

    // Verify subscription status
    verifySubscription(subscriptionId);
  }, [searchParams, navigate]);

  const verifySubscription = async (subscriptionId: string) => {
    try {
      // Wait a bit for PayPal webhook to process
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Check subscription status
      const subscription = await paymentService.getSubscription();

      if (subscription.subscription?.status === "active") {
        setSuccess(true);
        toast.success("Subscription activated successfully!");

        // Redirect to app after 3 seconds
        setTimeout(() => {
          navigate("/app");
        }, 3000);
      } else {
        // Still pending, wait a bit more
        setTimeout(() => verifySubscription(subscriptionId), 2000);
      }
    } catch (error: any) {
      console.error("Failed to verify subscription:", error);
      toast.error("Failed to verify subscription. Please check your account.");
      setTimeout(() => navigate("/app"), 3000);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <h2 className="text-2xl font-bold mb-2">Processing Payment...</h2>
          <p className="text-muted-foreground">
            Please wait while we confirm your subscription
          </p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-2">Payment Successful!</h2>
          <p className="text-muted-foreground mb-6">
            Your subscription has been activated. You now have access to all
            premium features.
          </p>
          <button
            onClick={() => navigate("/app")}
            className="px-4 py-2 rounded-xl bg-primary-500 text-white hover:bg-primary-600"
          >
            Go to App
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Verifying Payment...</h2>
        <p className="text-muted-foreground">This may take a few moments</p>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
