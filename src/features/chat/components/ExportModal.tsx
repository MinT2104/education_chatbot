import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Conversation } from "../types";
import { toast } from "react-toastify";

interface ExportModalProps {
  open: boolean;
  onClose: () => void;
  conversation: Conversation | null;
}

const ExportModal = ({ open, onClose, conversation }: ExportModalProps) => {
  const [format, setFormat] = useState<"json" | "markdown" | "pdf">("markdown");
  const [range, setRange] = useState<"all" | "from-here">("all");

  const exportAsJSON = () => {
    if (!conversation) return;

    const dataStr = JSON.stringify(conversation, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${conversation.title}-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Conversation exported as JSON");
  };

  const exportAsMarkdown = () => {
    if (!conversation) return;

    let markdown = `# ${conversation.title}\n\n`;
    markdown += `Created: ${new Date(conversation.createdAt).toLocaleString()}\n`;
    markdown += `Updated: ${new Date(conversation.updatedAt).toLocaleString()}\n\n`;
    markdown += `---\n\n`;

    conversation.messages.forEach((msg) => {
      const role = msg.role === "user" ? "**You**" : "**Assistant**";
      const content = msg.contentMd || msg.content || "";
      markdown += `${role}:\n\n${content}\n\n---\n\n`;
    });

    const dataBlob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${conversation.title}-${Date.now()}.md`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Conversation exported as Markdown");
  };

  const exportAsPDF = () => {
    // For MVP, we'll use browser print functionality
    // In production, you'd use a library like jsPDF or @react-pdf/renderer
    toast.info("PDF export: Use your browser's print function (Cmd/Ctrl+P) and select 'Save as PDF'");
    window.print();
  };

  const handleExport = () => {
    if (!conversation) {
      toast.error("No conversation to export");
      return;
    }

    switch (format) {
      case "json":
        exportAsJSON();
        break;
      case "markdown":
        exportAsMarkdown();
        break;
      case "pdf":
        exportAsPDF();
        break;
    }

    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export Conversation</DialogTitle>
          <DialogDescription>
            Choose the format and range for your export
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Format Selection */}
          <div className="space-y-3">
            <Label>Export Format</Label>
            <RadioGroup value={format} onValueChange={(v) => setFormat(v as any)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="markdown" id="markdown" />
                <Label htmlFor="markdown" className="font-normal cursor-pointer">
                  <div>
                    <div className="font-medium">Markdown (.md)</div>
                    <div className="text-xs text-muted-foreground">
                      Plain text with formatting
                    </div>
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <RadioGroupItem value="json" id="json" />
                <Label htmlFor="json" className="font-normal cursor-pointer">
                  <div>
                    <div className="font-medium">JSON (.json)</div>
                    <div className="text-xs text-muted-foreground">
                      Structured data with metadata
                    </div>
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pdf" id="pdf" />
                <Label htmlFor="pdf" className="font-normal cursor-pointer">
                  <div>
                    <div className="font-medium">PDF (.pdf)</div>
                    <div className="text-xs text-muted-foreground">
                      Printable document format
                    </div>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Range Selection */}
          <div className="space-y-3">
            <Label>Export Range</Label>
            <RadioGroup value={range} onValueChange={(v) => setRange(v as any)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="all" />
                <Label htmlFor="all" className="font-normal cursor-pointer">
                  <div>
                    <div className="font-medium">All messages</div>
                    <div className="text-xs text-muted-foreground">
                      Export entire conversation
                    </div>
                  </div>
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <RadioGroupItem value="from-here" id="from-here" />
                <Label htmlFor="from-here" className="font-normal cursor-pointer">
                  <div>
                    <div className="font-medium">From current message</div>
                    <div className="text-xs text-muted-foreground">
                      Export from selected point onwards
                    </div>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Info Box */}
          <div className="p-3 rounded-lg bg-muted/50 border border-border">
            <h4 className="text-sm font-medium mb-2">What's included?</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• All message content</li>
              <li>• Timestamps and metadata</li>
              {format === "json" && <li>• Citations and variants</li>}
              {format === "json" && <li>• Tool usage information</li>}
              {format === "markdown" && <li>• Formatted text and code</li>}
              {format === "pdf" && <li>• Formatted and printable</li>}
            </ul>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleExport} className="flex-1">
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Export
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExportModal;

