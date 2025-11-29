import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import { toast } from "react-toastify";

export default function EmailVerifyPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      toast.error("Invalid verification link");
      navigate("/app");
      return;
    }

    (async () => {
      try {
        setLoading(true);
        await authService.verifyEmail(token, token);
        toast.success("Email verified successfully. Redirecting to the app.");
        // Redirect to app after short delay
        setTimeout(() => navigate("/app"), 1200);
      } catch (err: any) {
        toast.error(err?.response?.data?.message || err?.message || "Verification failed");
        // Keep user on a helpful page or redirect to the app
        setTimeout(() => navigate("/app"), 1400);
      } finally {
        setLoading(false);
      }
    })();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-lg w-full p-6 bg-white dark:bg-gray-800 rounded shadow text-center">
        {loading ? (
          <div>
            <h3 className="text-lg font-semibold">Verifying your email...</h3>
            <p className="mt-3 text-sm text-gray-600">Please wait while we confirm your email address.</p>
          </div>
        ) : (
          <div>
            <h3 className="text-lg font-semibold">Verification complete</h3>
            <p className="mt-3 text-sm text-gray-600">You will be redirected to the app shortly.</p>
          </div>
        )}
      </div>
    </div>
  );
}
