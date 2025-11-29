import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface EmailVerificationDialogProps {
  open: boolean;
  onClose: () => void;
  email?: string;
  onCheck?: () => Promise<boolean>;
  onResend?: () => Promise<void>;
}

export default function EmailVerificationDialog({ open, onClose, email, onCheck, onResend }: EmailVerificationDialogProps) {
  const [sending, setSending] = useState(false);
  const [checking, setChecking] = useState(false);

  const handleResend = async () => {
    if (!onResend || !email) return;
    try {
      setSending(true);
      await onResend();
      // eslint-disable-next-line no-alert
      alert("Verification email resent. Please check your inbox.");
    } catch (err) {
      // eslint-disable-next-line no-alert
      alert("Failed to resend verification email.");
    } finally {
      setSending(false);
    }
  };

  const handleCheck = async () => {
    if (!onCheck) return;
    try {
      setChecking(true);
      const ok = await onCheck();
      if (ok) {
        // close handled by parent after finalize
      } else {
        // eslint-disable-next-line no-alert
        alert("Email still not verified. Please check your inbox and click the verification link.");
      }
    } catch (err) {
      // eslint-disable-next-line no-alert
      alert("Failed to verify status.");
    } finally {
      setChecking(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">Email verification</DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          <div className="py-4 text-center">
            <p className="mb-2">Your account email is not verified.</p>
            {email && <p className="mb-2">Please check your inbox <b>{email}</b> to confirm your email address.</p>}
            <p>If you didn't receive the email, check your spam folder or click resend.</p>
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-2 mt-4">
            <button
              type="button"
              className="w-full sm:w-auto inline-flex items-center justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-900 transition-colors disabled:opacity-50"
              onClick={handleCheck}
              disabled={checking}
            >
              {checking ? "Checking..." : "I have verified"}
            </button>
            <button
              type="button"
              className="w-full sm:w-auto inline-flex items-center justify-center py-2.5 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
              onClick={handleResend}
              disabled={sending}
            >
              {sending ? "Sending..." : "Resend email"}
            </button>
            <button
              type="button"
              className="w-full sm:w-auto inline-flex items-center justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
