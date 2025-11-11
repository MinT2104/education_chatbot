import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../core/store/hooks";
import { login, signup } from "../store/authSlice";
import { toast } from "react-toastify";
import apiClient from "../../../core/api/axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AuthDialogProps {
  inline?: boolean;
  open?: boolean;
  onClose?: () => void;
  initialMode?: "login" | "signup";
}

const AuthDialog = ({
  inline = false,
  open = true,
  onClose,
  initialMode = "login",
}: AuthDialogProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useAppSelector((state) => state.auth);
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update mode when initialMode changes (when user clicks different button)
  useEffect(() => {
    if (open && initialMode) {
      setMode(initialMode);
    }
  }, [open, initialMode]);

  // Clear errors when switching modes
  useEffect(() => {
    setLoginErrors({});
    setSignupErrors({});
    setShowPassword(false);
    setEmailCheckResult(null);
  }, [mode]);

  // Login form data
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  // Signup form data
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [signupErrors, setSignupErrors] = useState<Record<string, string>>({});
  const [loginErrors, setLoginErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [emailCheckResult, setEmailCheckResult] = useState<{
    exists: boolean;
    hasPassword: boolean;
    auth_providers?: string;
  } | null>(null);

  const validateSignup = () => {
    const newErrors: Record<string, string> = {};

    if (!signupData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!signupData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(signupData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!signupData.password) {
      newErrors.password = "Password is required";
    } else if (signupData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!signupData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (signupData.password !== signupData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setSignupErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGoogleAuth = async () => {
    try {
      setIsSubmitting(true);
      const response = await apiClient.get("/auth/google/login", {
        withCredentials: true, // Important for session cookies
      });

      if (response.data.authorization_url) {
        // Redirect to Google OAuth page
        window.location.href = response.data.authorization_url;
      } else {
        throw new Error("No authorization URL received");
      }
    } catch (error: any) {
      setIsSubmitting(false);
      const errorMessage =
        error.response?.data?.message || "Failed to initiate Google login";
      toast.error(errorMessage);
    }
  };

  const checkEmail = async (
    email: string
  ): Promise<{
    exists: boolean;
    hasPassword: boolean;
    auth_providers?: string;
  } | null> => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setShowPassword(false);
      setEmailCheckResult(null);
      return null;
    }

    setCheckingEmail(true);
    setEmailCheckResult(null);
    setLoginErrors({});

    try {
      const response = await apiClient.post("/auth/check-email", { email });
      const { exists, hasPassword, auth_providers } = response.data;

      const result = { exists, hasPassword, auth_providers };
      setEmailCheckResult(result);

      if (exists && hasPassword) {
        // Email exists and has password - show password field
        setShowPassword(true);
        setLoginErrors({});
      } else if (exists && !hasPassword) {
        // Email exists but registered with Google/OAuth only
        setShowPassword(false);
        const provider = auth_providers || "Google";
        setLoginErrors({
          email: `This email is registered with ${provider}. Please use ${provider} login.`,
        });
        toast.info(
          `This email is registered with ${provider}. Please use ${provider} login.`
        );
      } else {
        // Email doesn't exist - show message suggesting signup
        setShowPassword(false);
        setLoginErrors({
          email: "This email is not registered. Please sign up first.",
        });
      }

      return result;
    } catch (error: any) {
      // Handle API errors
      const errorMessage =
        error.response?.data?.message || "Failed to check email";
      setLoginErrors({
        email: errorMessage,
      });
      setShowPassword(false);
      setEmailCheckResult(null);
      toast.error(errorMessage);
      return null;
    } finally {
      setCheckingEmail(false);
    }
  };

  // Apple Sign In temporarily disabled

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate email format first
    if (!loginData.email.trim()) {
      setLoginErrors({ email: "Email is required" });
      return;
    }

    if (!/\S+@\S+\.\S+/.test(loginData.email)) {
      setLoginErrors({ email: "Email is invalid" });
      return;
    }

    // If email hasn't been checked yet or password field is not shown, check email first
    if (!emailCheckResult || !showPassword) {
      const checkResult = await checkEmail(loginData.email);

      // If check failed or no result, return
      if (!checkResult) {
        return;
      }

      // If email doesn't exist, suggest signup
      if (!checkResult.exists) {
        // Wait a bit then suggest switching to signup
        setTimeout(() => {
          const shouldSwitch = window.confirm(
            "This email is not registered. Would you like to sign up instead?"
          );
          if (shouldSwitch) {
            setMode("signup");
            setSignupData({
              ...signupData,
              email: loginData.email,
            });
          }
        }, 500);
        return;
      }

      // If email exists but no password (Google only), don't proceed
      if (checkResult.exists && !checkResult.hasPassword) {
        return;
      }

      // If email exists with password, show password field and return (user needs to click again)
      if (checkResult.exists && checkResult.hasPassword) {
        return;
      }
    }

    // Validate password if showing password field
    if (showPassword && !loginData.password) {
      setLoginErrors({ password: "Password is required" });
      return;
    }

    // Proceed with login
    try {
      await dispatch(login(loginData)).unwrap();
      toast.success("Login successful!");
      navigate("/app");
    } catch (err: any) {
      const errorMessage = err || "Login failed";
      toast.error(errorMessage);
      setLoginErrors({ password: errorMessage });
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateSignup()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const { confirmPassword, ...signupPayload } = signupData;
      await dispatch(signup(signupPayload)).unwrap();
      toast.success("Signup successful!");

      // Auto-login after signup
      try {
        await dispatch(
          login({
            email: signupPayload.email,
            password: signupPayload.password,
          })
        ).unwrap();
        toast.success("Login successful!");
        navigate("/app");
      } catch (loginErr: any) {
        toast.error(loginErr || "Auto-login failed. Please login manually.");
        setMode("login");
      }
    } catch (err: any) {
      toast.error(err || "Signup failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) {
          if (inline && onClose) onClose();
          else navigate(-1);
        }
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {mode === "login" ? "Log in or sign up" : "Create your account"}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-6 space-y-3">
          {/* Social Auth Buttons */}
          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={isSubmitting || isLoading}
            className="w-full inline-flex items-center justify-center py-2.5 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span className="ml-2">
              {isSubmitting ? "Redirecting..." : "Continue with Google"}
            </span>
          </button>

          {/* Apple login hidden for now */}

          {/* Separator */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                Or
              </span>
            </div>
          </div>

          {/* Login Form */}
          {mode === "login" && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded">
                  {error}
                </div>
              )}
              <div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={loginData.email}
                  onChange={(e) => {
                    setLoginData({
                      ...loginData,
                      email: e.target.value,
                      password: "",
                    });
                    setShowPassword(false);
                    setEmailCheckResult(null);
                    // Clear email error when user types
                    if (loginErrors.email) {
                      setLoginErrors({ ...loginErrors, email: "" });
                    }
                  }}
                  onBlur={() => {
                    // Validate email on blur
                    if (loginData.email) {
                      if (!/\S+@\S+\.\S+/.test(loginData.email)) {
                        setLoginErrors({
                          ...loginErrors,
                          email: "Email is invalid",
                        });
                      } else {
                        checkEmail(loginData.email);
                      }
                    } else {
                      setLoginErrors({
                        ...loginErrors,
                        email: "Email is required",
                      });
                    }
                  }}
                  className={`w-full text-sm px-3 py-2 border rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 ${
                    loginErrors.email
                      ? "border-red-500 dark:border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                  placeholder="Email address"
                  disabled={checkingEmail}
                />
                {loginErrors.email && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {loginErrors.email}
                  </p>
                )}
              </div>

              {showPassword && (
                <div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    value={loginData.password}
                    onChange={(e) => {
                      setLoginData({ ...loginData, password: e.target.value });
                      // Clear password error when user types
                      if (loginErrors.password) {
                        setLoginErrors({ ...loginErrors, password: "" });
                      }
                    }}
                    onBlur={() => {
                      // Validate password on blur
                      if (!loginData.password) {
                        setLoginErrors({
                          ...loginErrors,
                          password: "Password is required",
                        });
                      }
                    }}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 ${
                      loginErrors.password
                        ? "border-red-500 dark:border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                    placeholder="Password"
                  />
                  {loginErrors.password && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {loginErrors.password}
                    </p>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || checkingEmail}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 transition-colors"
              >
                {checkingEmail
                  ? "Checking..."
                  : isLoading
                  ? "Continuing..."
                  : showPassword
                  ? "Log in"
                  : "Continue"}
              </button>
            </form>
          )}

          {/* Signup Form */}
          {mode === "signup" && (
            <form onSubmit={handleSignupSubmit} className="space-y-4">
              <div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={signupData.name}
                  onChange={(e) => {
                    setSignupData({ ...signupData, name: e.target.value });
                    // Clear name error when user types
                    if (signupErrors.name) {
                      setSignupErrors({ ...signupErrors, name: "" });
                    }
                  }}
                  onBlur={() => {
                    // Validate name on blur
                    if (!signupData.name.trim()) {
                      setSignupErrors({
                        ...signupErrors,
                        name: "Name is required",
                      });
                    }
                  }}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 ${
                    signupErrors.name
                      ? "border-red-500 dark:border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                  placeholder="Full Name"
                />
                {signupErrors.name && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {signupErrors.name}
                  </p>
                )}
              </div>
              <div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={signupData.email}
                  onChange={(e) => {
                    setSignupData({ ...signupData, email: e.target.value });
                    // Clear email error when user types
                    if (signupErrors.email) {
                      setSignupErrors({ ...signupErrors, email: "" });
                    }
                  }}
                  onBlur={() => {
                    // Validate email on blur
                    if (!signupData.email.trim()) {
                      setSignupErrors({
                        ...signupErrors,
                        email: "Email is required",
                      });
                    } else if (!/\S+@\S+\.\S+/.test(signupData.email)) {
                      setSignupErrors({
                        ...signupErrors,
                        email: "Email is invalid",
                      });
                    }
                  }}
                  className={`w-full text-sm px-3 py-2 border rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 ${
                    signupErrors.email
                      ? "border-red-500 dark:border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                  placeholder="Email address"
                />
                {signupErrors.email && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {signupErrors.email}
                  </p>
                )}
              </div>
              <div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  value={signupData.password}
                  onChange={(e) => {
                    setSignupData({ ...signupData, password: e.target.value });
                    // Clear password error when user types
                    if (signupErrors.password) {
                      setSignupErrors({ ...signupErrors, password: "" });
                    }
                    // Clear confirmPassword error if passwords match
                    if (
                      signupData.confirmPassword &&
                      e.target.value === signupData.confirmPassword
                    ) {
                      setSignupErrors({ ...signupErrors, confirmPassword: "" });
                    }
                  }}
                  onBlur={() => {
                    // Validate password on blur
                    if (!signupData.password) {
                      setSignupErrors({
                        ...signupErrors,
                        password: "Password is required",
                      });
                    } else if (signupData.password.length < 6) {
                      setSignupErrors({
                        ...signupErrors,
                        password: "Password must be at least 6 characters",
                      });
                    }
                    // Validate confirmPassword if it exists
                    if (
                      signupData.confirmPassword &&
                      signupData.password !== signupData.confirmPassword
                    ) {
                      setSignupErrors({
                        ...signupErrors,
                        confirmPassword: "Passwords do not match",
                      });
                    }
                  }}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 ${
                    signupErrors.password
                      ? "border-red-500 dark:border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                  placeholder="Password"
                />
                {signupErrors.password && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {signupErrors.password}
                  </p>
                )}
              </div>
              <div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  value={signupData.confirmPassword}
                  onChange={(e) => {
                    setSignupData({
                      ...signupData,
                      confirmPassword: e.target.value,
                    });
                    // Clear confirmPassword error when user types
                    if (signupErrors.confirmPassword) {
                      setSignupErrors({ ...signupErrors, confirmPassword: "" });
                    }
                  }}
                  onBlur={() => {
                    // Validate confirmPassword on blur
                    if (!signupData.confirmPassword) {
                      setSignupErrors({
                        ...signupErrors,
                        confirmPassword: "Please confirm your password",
                      });
                    } else if (
                      signupData.password !== signupData.confirmPassword
                    ) {
                      setSignupErrors({
                        ...signupErrors,
                        confirmPassword: "Passwords do not match",
                      });
                    }
                  }}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 ${
                    signupErrors.confirmPassword
                      ? "border-red-500 dark:border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                  placeholder="Confirm Password"
                />
                {signupErrors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {signupErrors.confirmPassword}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 transition-colors"
              >
                {isSubmitting ? "Creating account..." : "Sign up"}
              </button>
            </form>
          )}

          {/* Switch Mode */}
          <div className="text-center mt-4">
            <button
              type="button"
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
              className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300 transition-colors"
            >
              {mode === "login"
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;
