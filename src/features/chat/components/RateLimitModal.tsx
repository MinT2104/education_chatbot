import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { guestService } from "../services/guestService";
import { toast } from "react-toastify";

interface RateLimitModalProps {
  open: boolean;
  onClose: () => void;
  onUpgrade?: () => void;
  onLogin?: () => void;
  onSignup?: () => void;
  remainingTime?: number; // in seconds
  plan?: "Free" | "Go";
  isAuthenticated?: boolean;
  onBonusClaimed?: () => void;
}

const RateLimitModal = ({
  open,
  onClose,
  onUpgrade,
  onLogin,
  onSignup,
  remainingTime = 3600,
  plan = "Free",
  isAuthenticated = false,
  onBonusClaimed,
}: RateLimitModalProps) => {
  const [isClaimingBonus, setIsClaimingBonus] = useState(false);
  const [bonusClaimed, setBonusClaimed] = useState(false);

  const handleClaimBonus = async () => {
    setIsClaimingBonus(true);
    try {
      const result = await guestService.addUsage();
      
      if (result.success) {
        toast.success(result.message || "Successfully added free messages!");
        setBonusClaimed(true);
        
        // Notify parent component to refresh quota
        if (onBonusClaimed) {
          onBonusClaimed();
        }
        
        // Close modal after 1.5 seconds
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        if (result.alreadyClaimed) {
          toast.info(result.message || "Bonus already claimed");
          setBonusClaimed(true);
        } else {
          toast.error(result.message || "Failed to add free messages");
        }
      }
    } catch (error: any) {
      toast.error("Failed to add free messages. Please try again.");
      console.error("Error claiming bonus:", error);
    } finally {
      setIsClaimingBonus(false);
    }
  };

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
            {plan === "Free" && !isAuthenticated ? (
              <>
                You've reached your message limit as a guest. Please log in or sign up to continue chatting and unlock more features.
              </>
            ) : plan === "Free" ? (
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
          <div className="flex flex-col gap-2">
            {plan === "Free" && !isAuthenticated ? (
              <>
                {/* Bonus Button for Guests */}
                {!bonusClaimed && (
                  <Button
                    onClick={handleClaimBonus}
                    disabled={isClaimingBonus}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  >
                    {isClaimingBonus ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Claiming...
                      </>
                    ) : (
                      <>
                        🎁 Get 5 More Free Messages
                      </>
                    )}
                  </Button>
                )}
                
                {bonusClaimed && (
                  <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 text-sm text-center">
                    ✓ Bonus claimed! Enjoy your free messages.
                  </div>
                )}

                {/* Login/Signup Buttons */}
                <div className="flex gap-2">
                  <Button variant="outline" onClick={onLogin} className="flex-1">
                    Log In
                  </Button>
                  <Button onClick={onSignup} className="flex-1">
                    Sign Up
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={onClose} className="flex-1">
                  Wait
                </Button>
                {plan === "Free" && onUpgrade && (
                  <Button onClick={onUpgrade} className="flex-1">
                    Upgrade to Go
                  </Button>
                )}
              </>
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

