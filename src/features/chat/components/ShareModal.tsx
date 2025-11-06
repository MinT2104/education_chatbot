import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";

interface ShareModalProps {
  open: boolean;
  onClose: () => void;
  messageId: string;
  conversationId?: string;
}

const ShareModal = ({
  open,
  onClose,
  messageId,
  conversationId,
}: ShareModalProps) => {
  const [hideUser, setHideUser] = useState(false);
  const [hideAttachments, setHideAttachments] = useState(false);
  const [hideMetadata, setHideMetadata] = useState(true);
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);

  const generateShareLink = () => {
    const params = new URLSearchParams({
      msg: messageId,
      ...(conversationId && { conv: conversationId }),
      ...(hideUser && { hu: "1" }),
      ...(hideAttachments && { ha: "1" }),
      ...(hideMetadata && { hm: "1" }),
    });
    const url = `${window.location.origin}/share?${params.toString()}`;
    setShareUrl(url);
  };

  const handleGenerateLink = () => {
    generateShareLink();
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Link copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Message</DialogTitle>
          <DialogDescription>
            Create a shareable link for this message. Choose what to include.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Privacy Options */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hide-user"
                checked={hideUser}
                onCheckedChange={(checked) => setHideUser(checked as boolean)}
              />
              <Label
                htmlFor="hide-user"
                className="text-sm font-normal cursor-pointer"
              >
                Hide user information
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="hide-attachments"
                checked={hideAttachments}
                onCheckedChange={(checked) =>
                  setHideAttachments(checked as boolean)
                }
              />
              <Label
                htmlFor="hide-attachments"
                className="text-sm font-normal cursor-pointer"
              >
                Hide attachments
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="hide-metadata"
                checked={hideMetadata}
                onCheckedChange={(checked) =>
                  setHideMetadata(checked as boolean)
                }
              />
              <Label
                htmlFor="hide-metadata"
                className="text-sm font-normal cursor-pointer"
              >
                Hide metadata (timestamp, etc.)
              </Label>
            </div>
          </div>

          {/* Generate Button */}
          {!shareUrl && (
            <Button onClick={handleGenerateLink} className="w-full">
              Generate Share Link
            </Button>
          )}

          {/* Share URL */}
          {shareUrl && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  readOnly
                  value={shareUrl}
                  className="flex-1 h-10 rounded-md bg-muted px-3 text-sm outline-none"
                  onClick={(e) => e.currentTarget.select()}
                />
                <Button onClick={handleCopy} variant="secondary" className="h-10">
                  {copied ? (
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
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    "Copy"
                  )}
                </Button>
              </div>

              {/* QR Code placeholder for mobile */}
              <div className="text-xs text-muted-foreground text-center">
                Share this link with others to view this message
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareModal;

