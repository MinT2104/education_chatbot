import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { XCircle } from "lucide-react";

const PaymentCancelPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Auto redirect after 5 seconds
    const timer = setTimeout(() => {
      navigate("/app");
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center max-w-md">
        <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-3xl font-bold mb-2">Payment Cancelled</h2>
        <p className="text-muted-foreground mb-6">
          Your payment was cancelled. No charges were made.
        </p>
        <button
          onClick={() => navigate("/app")}
          className="px-4 py-2 rounded-xl bg-primary-500 text-white hover:bg-primary-600"
        >
          Return to App
        </button>
      </div>
    </div>
  );
};

export default PaymentCancelPage;

