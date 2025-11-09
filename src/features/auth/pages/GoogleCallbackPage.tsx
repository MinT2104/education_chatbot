import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppDispatch } from "../../../core/store/hooks";
import { setCredentials } from "../store/authSlice";
import { toast } from "react-toastify";
import apiClient from "../../../core/api/axios";
import LoadingScreen from "../../../components/LoadingScreen";
import { setCookie } from "@/core/utils/cookie";

const GoogleCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      const errorParam = searchParams.get("error");
      const accessToken = searchParams.get("access_token");
      const refreshToken = searchParams.get("refresh_token");
      const userParam = searchParams.get("user");

      // Handle OAuth error from backend redirect
      if (errorParam) {
        setError(`OAuth error: ${decodeURIComponent(errorParam)}`);
        toast.error("Google login cancelled or failed");
        setTimeout(() => navigate("/app"), 2000);
        return;
      }

      // If tokens are in URL (from backend redirect), use them directly
      if (accessToken && refreshToken && userParam) {
        try {
          const user = JSON.parse(userParam);

          // Store tokens in cookies
          setCookie("access_token", accessToken, {
            expires: 0.25, // 6 hours
            path: "/",
            secure: import.meta.env.PROD,
            sameSite: "lax",
          });
          setCookie("refresh_token", refreshToken, {
            expires: 7, // 7 days
            path: "/",
            secure: import.meta.env.PROD,
            sameSite: "lax",
          });

          // Set credentials in Redux store
          dispatch(
            setCredentials({
              user,
              accessToken,
              refreshToken,
            })
          );

          toast.success("Login successful!");
          navigate("/app");
        } catch (err: any) {
          setError("Failed to parse user data");
          toast.error("Google login failed");
          setTimeout(() => navigate("/app"), 3000);
        }
        return;
      }

      // Fallback: If no tokens in URL, call backend API (for backward compatibility)
      const code = searchParams.get("code");
      const state = searchParams.get("state");

      if (!code) {
        setError("Authorization code not found");
        toast.error("Google login failed: No authorization code");
        setTimeout(() => navigate("/app"), 2000);
        return;
      }

      try {
        // Call backend callback endpoint
        const response = await apiClient.get(`/auth/google/callback`, {
          params: { code, state },
          withCredentials: true, // Important for session cookies
        });

        const { access_token, refresh_token, user } = response.data;

        if (!access_token || !user) {
          throw new Error("Invalid response from server");
        }

        // Store tokens in cookies
        setCookie("access_token", access_token, {
          expires: 0.25, // 6 hours
          path: "/",
          secure: import.meta.env.PROD,
          sameSite: "lax",
        });
        setCookie("refresh_token", refresh_token, {
          expires: 7, // 7 days
          path: "/",
          secure: import.meta.env.PROD,
          sameSite: "lax",
        });

        // Set credentials in Redux store
        dispatch(
          setCredentials({
            user,
            accessToken: access_token,
            refreshToken: refresh_token,
          })
        );

        toast.success("Login successful!");
        navigate("/app");
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Failed to complete Google login";
        setError(errorMessage);
        toast.error(errorMessage);
        setTimeout(() => navigate("/app"), 3000);
      }
    };

    handleCallback();
  }, [searchParams, navigate, dispatch]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
            Login Failed
          </h1>
          <p className="text-muted-foreground mb-4">{error}</p>
          <p className="text-sm text-muted-foreground">
            Redirecting to home page...
          </p>
        </div>
      </div>
    );
  }

  return <LoadingScreen />;
};

export default GoogleCallbackPage;
