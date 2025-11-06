import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import { NewMessage } from "../types";

interface ChatAreaProps {
  messages: NewMessage[];
  conversationId?: string;
  isStreaming?: boolean;
  onCopy?: (content: string) => void;
  onShare?: (messageId: string) => void;
  onRegenerate?: (messageId: string) => void;
  onLike?: (messageId: string, like: boolean) => void;
  onPin?: (messageId: string) => void;
  onQuote?: (messageId: string, content: string) => void;
  onContinue?: (messageId: string) => void;
  onEdit?: (messageId: string, newContent: string) => void;
  onSelectVariant?: (messageId: string, variantId: string) => void;
  onFeedback?: (messageId: string, feedback: { like?: boolean; dislike?: boolean; note?: string; reason?: string }) => void;
  onSuggestionClick?: (question: string) => void;
  userName?: string;
}

const ChatArea = ({
  messages,
  conversationId,
  isStreaming = false,
  onCopy,
  onShare,
  onRegenerate,
  onLike,
  onPin,
  onQuote,
  onContinue,
  onEdit,
  onSelectVariant,
  onFeedback,
  onSuggestionClick,
  userName = "Student",
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
    const suggestions = [
      {
        title: "📐 Math - Algebra",
        question: "How do I solve the equation: 3x + 7 = 22?",
        icon: "📐",
      },
      {
        title: "⚡ Physics - Motion",
        question: "Explain Newton's second law with a real-world example",
        icon: "⚡",
      },
      {
        title: "🧪 Chemistry - Atoms",
        question: "What's the difference between ionic and covalent bonds?",
        icon: "🧪",
      },
      {
        title: "🌿 Biology - Cells",
        question: "Why are mitochondria called the powerhouse of the cell?",
        icon: "🌿",
      },
      {
        title: "💬 English - Grammar",
        question: "When should I use 'affect' vs 'effect'?",
        icon: "💬",
      },
      {
        title: "🌍 Geography",
        question: "How are mountains formed?",
        icon: "🌍",
      },
      {
        title: "📚 History",
        question: "What were the main causes of World War I?",
        icon: "📚",
      },
      {
        title: "💻 Computer Science",
        question: "Explain what an algorithm is with simple examples",
        icon: "💻",
      },
      {
        title: "🎨 Art & Literature",
        question: "What is the theme of Romeo and Juliet?",
        icon: "🎨",
      },
      {
        title: "🧮 Math - Geometry",
        question: "Calculate the area of a circle with radius 5cm",
        icon: "🧮",
      },
      {
        title: "⚛️ Physics - Energy",
        question: "What is kinetic energy and how is it calculated?",
        icon: "⚛️",
      },
      {
        title: "🔬 Science - Experiments",
        question: "How does photosynthesis work step by step?",
        icon: "🔬",
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

        <h2 className="text-2xl font-semibold text-foreground mb-2">
          Hello {userName}! 👋
        </h2>
        <p className="text-muted-foreground mb-10 text-base max-w-2xl">
          I'm your AI learning assistant. Pick a question below to get started, or type your own question!
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 max-w-6xl w-full px-4">
          {suggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => onSuggestionClick?.(s.question)}
              className="group p-4 text-left rounded-xl border border-border/60 hover:border-primary/70 hover:bg-accent/50 transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
                  {s.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xs font-semibold text-foreground/80 mb-1.5 uppercase tracking-wide">
                    {s.title}
                  </h3>
                  <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors line-clamp-2">
                    {s.question}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-10 text-center">
          <p className="text-xs text-muted-foreground">
            💡 Tip: You can ask me anything about your homework, studies, or learning!
          </p>
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
            conversationId={conversationId}
            onCopy={onCopy}
            onShare={onShare}
            onRegenerate={onRegenerate}
            onLike={onLike}
            onPin={onPin}
            onQuote={onQuote}
            onContinue={onContinue}
            onEdit={onEdit}
            onSelectVariant={onSelectVariant}
            onFeedback={onFeedback}
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
