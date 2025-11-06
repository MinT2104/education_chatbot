import { Button } from "@/components/ui/button";

interface NetworkErrorBannerProps {
  show: boolean;
  onRetry?: () => void;
  onDismiss?: () => void;
  message?: string;
}

const NetworkErrorBanner = ({
  show,
  onRetry,
  onDismiss,
  message = "Connection failed. Please check your internet and try again.",
}: NetworkErrorBannerProps) => {
  if (!show) return null;

  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 w-full max-w-md animate-in slide-in-from-top">
      <div className="mx-4 p-4 rounded-lg bg-destructive/10 border border-destructive/20 shadow-lg backdrop-blur-sm">
        <div className="flex items-start gap-3">
          <svg
            className="w-5 h-5 text-destructive shrink-0 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>

          <div className="flex-1">
            <h4 className="font-medium text-destructive">Network Error</h4>
            <p className="text-sm text-destructive/80 mt-1">{message}</p>
          </div>

          <div className="flex gap-2">
            {onRetry && (
              <Button
                size="sm"
                variant="outline"
                onClick={onRetry}
                className="h-8 px-3"
              >
                Retry
              </Button>
            )}
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="text-muted-foreground hover:text-foreground p-1"
                aria-label="Dismiss"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetworkErrorBanner;

