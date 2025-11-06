import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface FeedbackDialogProps {
  open: boolean;
  onClose: () => void;
  feedbackType: "like" | "dislike";
  onSubmit: (note: string, reason?: string) => void;
}

const FeedbackDialog = ({
  open,
  onClose,
  feedbackType,
  onSubmit,
}: FeedbackDialogProps) => {
  const [note, setNote] = useState("");
  const [reason, setReason] = useState("");

  const dislikeReasons = [
    { value: "incorrect", label: "Incorrect information" },
    { value: "unclear", label: "Unclear or confusing" },
    { value: "incomplete", label: "Incomplete answer" },
    { value: "harmful", label: "Harmful or inappropriate" },
    { value: "other", label: "Other" },
  ];

  const likeReasons = [
    { value: "accurate", label: "Accurate and helpful" },
    { value: "clear", label: "Clear and easy to understand" },
    { value: "complete", label: "Complete and thorough" },
    { value: "creative", label: "Creative solution" },
    { value: "other", label: "Other" },
  ];

  const reasons = feedbackType === "dislike" ? dislikeReasons : likeReasons;

  const handleSubmit = () => {
    onSubmit(note, reason);
    setNote("");
    setReason("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {feedbackType === "dislike"
              ? "What went wrong?"
              : "What did you like?"}
          </DialogTitle>
          <DialogDescription>
            Your feedback helps us improve the AI responses
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Reason Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              {feedbackType === "dislike"
                ? "Why didn't you like this response?"
                : "What made this response great?"}
            </Label>
            <RadioGroup value={reason} onValueChange={setReason}>
              {reasons.map((r) => (
                <div key={r.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={r.value} id={r.value} />
                  <Label
                    htmlFor={r.value}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {r.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Additional Notes */}
          <div className="space-y-2">
            <Label htmlFor="note" className="text-sm font-medium">
              Additional feedback (optional)
            </Label>
            <Textarea
              id="note"
              placeholder="Tell us more about your experience..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Submit Feedback</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackDialog;

