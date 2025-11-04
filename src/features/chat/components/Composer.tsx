import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ComposerProps {
  onSend: (message: string) => void;
  onStop?: () => void;
  isStreaming?: boolean;
  placeholder?: string;
  disabled?: boolean;
}

const Composer = ({
  onSend,
  onStop,
  isStreaming = false,
  placeholder = "Message...",
  disabled = false,
}: ComposerProps) => {
  const [input, setInput] = useState("");
  const [isComposing, setIsComposing] = useState(false);
  const [role, setRole] = useState<"student" | "teacher">("student");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        200
      )}px`;
    }
  }, [input]);

  useEffect(() => {
    const handleSuggestion = (e: CustomEvent) => {
      const question = e.detail as string;
      if (question && !isStreaming && !disabled) {
        onSend(question);
      }
    };
    window.addEventListener(
      "suggestion-click",
      handleSuggestion as EventListener
    );
    return () =>
      window.removeEventListener(
        "suggestion-click",
        handleSuggestion as EventListener
      );
  }, [onSend, isStreaming, disabled]);

  const handleSend = () => {
    const trimmedInput = input.trim();
    if (trimmedInput && !disabled) {
      onSend(trimmedInput);
      setInput("");
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !isComposing) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCompositionStart = () => {
    setIsComposing(true);
  };

  const handleCompositionEnd = () => {
    setIsComposing(false);
  };

  const hasAnyVisibleCharacter = input.replace(/\s/g, "").length > 0;

  return (
    <div className="bg-background/50 backdrop-blur-sm">
      <div className="mx-auto max-w-[900px] px-4 py-4">
        <div className="flex items-center gap-2">
          {/* Textarea container with inline actions */}
          <div className="flex-1 relative flex items-center">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              onCompositionStart={handleCompositionStart}
              onCompositionEnd={handleCompositionEnd}
              placeholder={placeholder}
              disabled={disabled || isStreaming}
              rows={1}
              className="w-full px-4 py-3 pr-28 bg-muted/50 border border-border rounded-full resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed max-h-[200px] overflow-y-auto transition-all"
              style={{ minHeight: "52px" }}
            />
            {/* Inline controls on the right inside input */}
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              {/* Role dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="h-9 px-3 rounded-full border border-ring bg-background text-xs font-medium"
                    aria-label="Select role"
                  >
                    {role === "student" ? "Student" : "Teacher"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-36">
                  <DropdownMenuItem
                    onClick={() => setRole("student")}
                    className={role === "student" ? "font-medium" : undefined}
                  >
                    Student
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setRole("teacher")}
                    className={role === "teacher" ? "font-medium" : undefined}
                  >
                    Teacher
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Attach button */}
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-full border border-ring bg-background hover:bg-muted"
                aria-label="Attach"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className="lucide lucide-paperclip-icon lucide-paperclip"
                >
                  <path d="m16 6-8.414 8.586a2 2 0 0 0 2.829 2.829l8.414-8.586a4 4 0 1 0-5.657-5.657l-8.379 8.551a6 6 0 1 0 8.485 8.485l8.379-8.551" />
                </svg>
              </Button>

              {/* Send/Stop button inside input */}
              {isStreaming && onStop ? (
                <Button
                  onClick={onStop}
                  variant="destructive"
                  size="icon"
                  className="h-9 w-9 rounded-full"
                  aria-label="Stop generating"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M6 6h12v12H6z" />
                  </svg>
                </Button>
              ) : (
                <Button
                  onClick={handleSend}
                  disabled={!hasAnyVisibleCharacter || disabled}
                  size="icon"
                  className="h-9 w-9 rounded-full bg-primary hover:bg-primary/90 disabled:opacity-50"
                  aria-label="Send message"
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
                      d="M5 12h14"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 5l7 7-7 7"
                    />
                  </svg>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Composer;
