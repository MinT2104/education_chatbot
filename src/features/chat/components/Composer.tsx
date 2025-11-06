import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SlashCommandMenu from "./SlashCommandMenu";

interface ComposerProps {
  onSend: (message: string) => void;
  onStop?: () => void;
  isStreaming?: boolean;
  placeholder?: string;
  disabled?: boolean;
  tools?: { web?: boolean; code?: boolean; vision?: boolean };
  memoryEnabled?: boolean;
  enterToSend?: boolean;
  role?: "student" | "teacher";
  onRoleChange?: (role: "student" | "teacher") => void;
}

const Composer = ({
  onSend,
  onStop,
  isStreaming = false,
  placeholder = "Message...",
  disabled = false,
  tools,
  memoryEnabled,
  enterToSend = true,
  role: externalRole,
  onRoleChange,
}: ComposerProps) => {
  const [input, setInput] = useState("");
  const [isComposing, setIsComposing] = useState(false);
  const [internalRole, setInternalRole] = useState<"student" | "teacher">("student");
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Use external role if provided, otherwise use internal state
  const role = externalRole !== undefined ? externalRole : internalRole;
  const handleRoleChange = (newRole: "student" | "teacher") => {
    if (onRoleChange) {
      onRoleChange(newRole);
    } else {
      setInternalRole(newRole);
    }
  };

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

  // Detect slash command
  useEffect(() => {
    const shouldShowMenu = input.startsWith("/") && input.length > 0 && input.indexOf(" ") === -1;
    setShowSlashMenu(shouldShowMenu);
  }, [input]);

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
    // Don't send if slash menu is open
    if (showSlashMenu && (e.key === "Enter" || e.key === "Tab")) {
      return; // Let SlashCommandMenu handle it
    }

    if (enterToSend && e.key === "Enter" && !e.shiftKey && !isComposing) {
      e.preventDefault();
      handleSend();
    } else if (!enterToSend && e.key === "Enter" && e.shiftKey && !isComposing) {
      // If enterToSend is false, Shift+Enter sends
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

  const handleSlashCommandSelect = (command: string) => {
    setInput(command + " ");
    setShowSlashMenu(false);
    textareaRef.current?.focus();
  };

  const hasAnyVisibleCharacter = input.replace(/\s/g, "").length > 0;

  // Calculate token count (rough estimate)
  const tokenCount = Math.ceil(input.length / 4);
  const maxTokens = 4000;
  const tokenPercentage = (tokenCount / maxTokens) * 100;

  return (
    <div className="bg-background/50 backdrop-blur-sm relative">
      {/* Context Chips */}
      {(tools?.web || tools?.code || tools?.vision || memoryEnabled) && (
        <div className="mx-auto max-w-[900px] px-4 pt-2">
          <div className="flex items-center gap-2 flex-wrap">
            {tools?.web && (
              <div className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                Web
              </div>
            )}
            {tools?.code && (
              <div className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                Code
              </div>
            )}
            {tools?.vision && (
              <div className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Vision
              </div>
            )}
            {memoryEnabled && (
              <div className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
                Memory
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mx-auto max-w-[900px] px-4 py-4 relative">
        {/* Slash Command Menu */}
        <SlashCommandMenu
          show={showSlashMenu}
          onSelect={handleSlashCommandSelect}
          onClose={() => setShowSlashMenu(false)}
        />

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
                    onClick={() => handleRoleChange("student")}
                    className={role === "student" ? "font-medium" : undefined}
                  >
                    Student
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleRoleChange("teacher")}
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
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
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

        {/* Token Counter */}
        {hasAnyVisibleCharacter && (
          <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <span>~{tokenCount} tokens</span>
              {tokenPercentage > 80 && (
                <span className="text-amber-500">
                  ⚠️ Approaching limit
                </span>
              )}
            </div>
            <div className="text-xs text-muted-foreground">
              Type <kbd className="px-1 py-0.5 bg-muted rounded border border-border">/</kbd> for commands
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Composer;
