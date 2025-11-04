import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import { NewMessage } from "../types";

interface ChatAreaProps {
  messages: NewMessage[];
  isStreaming?: boolean;
  onCopy?: (content: string) => void;
  onShare?: (messageId: string) => void;
  onRegenerate?: (messageId: string) => void;
  onLike?: (messageId: string, like: boolean) => void;
  onPin?: (messageId: string) => void;
  onQuote?: (messageId: string, content: string) => void;
}

const ChatArea = ({
  messages,
  isStreaming = false,
  onCopy,
  onShare,
  onRegenerate,
  onLike,
}: ChatAreaProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto scroll to bottom when new message arrives
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isStreaming]);

  if (messages.length === 0) {
    const userName = "Student"; // hoặc lấy từ auth.user.name

    const suggestions = [
      {
        title: "⚡ Physics",
        question: "What is Newton’s second law of motion?",
      },
      {
        title: "📐 Math",
        question: "Solve for x: 2x + 5 = 9",
      },
      {
        title: "🧪 Chemistry",
        question: "Why does ice float on water?",
      },
      {
        title: "🌿 Biology",
        question: "What is the function of mitochondria?",
      },
      {
        title: "💬 English",
        question: "Correct this sentence: She don’t likes coffee.",
      },
      {
        title: "💻 Computer Science",
        question: "What is the difference between a for loop and a while loop?",
      },
      {
        title: "📊 Math (Advanced)",
        question: "What is the derivative of x² + 3x + 2?",
      },
      {
        title: "🌎 Physics (Waves)",
        question: "How does frequency affect the wavelength of sound?",
      },
      {
        title: "🧫 Biology (Genetics)",
        question: "What is the difference between DNA and RNA?",
      },
    ];

    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-5">
          <svg
            className="w-7 h-7 text-primary"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"
            />
          </svg>
        </div>

        <h2 className="text-2xl font-semibold text-foreground mb-1">
          Hello {userName}! 👋
        </h2>
        <p className="text-muted-foreground mb-8 text-base">
          Pick a question to get started — I can help you learn and practice!
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-w-4xl">
          {suggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => {
                const event = new CustomEvent("suggestion-click", {
                  detail: s.question,
                });
                window.dispatchEvent(event);
              }}
              className="p-4 text-left rounded-lg border border-border/50 hover:border-primary/60 hover:bg-muted/40 transition-colors duration-150"
            >
              <h3 className="text-sm font-semibold text-foreground mb-1">
                {s.title}
              </h3>
              <p className="text-sm text-muted-foreground">{s.question}</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto"
      role="log"
      aria-live="polite"
      aria-label="Chat messages"
    >
      <div className="w-full py-4">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            onCopy={onCopy}
            onShare={onShare}
            onRegenerate={onRegenerate}
            onLike={onLike}
          />
        ))}

        {/* Streaming indicator */}
        {isStreaming && (
          <div className="flex gap-4 w-full max-w-[900px] mx-auto px-6 py-4">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0">
              <span className="text-sm font-medium text-primary-foreground">
                AI
              </span>
            </div>
            <div className="flex-1">
              <div className="rounded-lg p-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-current rounded-full animate-pulse [animation-delay:0ms]"></div>
                    <div className="w-2 h-2 bg-current rounded-full animate-pulse [animation-delay:150ms]"></div>
                    <div className="w-2 h-2 bg-current rounded-full animate-pulse [animation-delay:300ms]"></div>
                  </div>
                  <span className="text-sm">Thinking...</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatArea;
