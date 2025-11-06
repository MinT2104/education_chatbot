import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface RateLimitModalProps {
  open: boolean;
  onClose: () => void;
  onUpgrade?: () => void;
  remainingTime?: number; // in seconds
  plan?: "Free" | "Go";
}

const RateLimitModal = ({
  open,
  onClose,
  onUpgrade,
  remainingTime = 3600,
  plan = "Free",
}: RateLimitModalProps) => {
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours} hour${hours > 1 ? "s" : ""}`;
    }
    return `${minutes} minute${minutes > 1 ? "s" : ""}`;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <svg
              className="w-5 h-5 text-amber-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Rate Limit Reached
          </DialogTitle>
          <DialogDescription>
            {plan === "Free" ? (
              <>
                You've reached your message limit for the Free plan. You can
                continue in {formatTime(remainingTime)}, or upgrade now for
                unlimited messages.
              </>
            ) : (
              <>
                You're sending messages too quickly. Please wait{" "}
                {formatTime(remainingTime)} before trying again.
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current Plan Info */}
          <div className="p-4 rounded-lg bg-muted/50 border border-border">
            <h4 className="font-medium mb-2">Current Plan: {plan}</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              {plan === "Free" ? (
                <>
                  <li>• 25 messages per day</li>
                  <li>• Basic model access</li>
                  <li>• Standard response time</li>
                </>
              ) : (
                <>
                  <li>• Unlimited messages</li>
                  <li>• Priority access</li>
                  <li>• Faster response time</li>
                </>
              )}
            </ul>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Wait
            </Button>
            {plan === "Free" && onUpgrade && (
              <Button onClick={onUpgrade} className="flex-1">
                Upgrade to Go
              </Button>
            )}
          </div>

          {/* Info */}
          <p className="text-xs text-muted-foreground text-center">
            Rate limits help ensure fair usage and system stability for all users.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RateLimitModal;

