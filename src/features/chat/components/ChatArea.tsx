import { useEffect, useRef, useState } from "react";
import aiAvatarDark from "../../../public/dark_theme.png";
import aiAvatarLight from "../../../public/light_theme.png";
import MessageBubble from "./MessageBubble";
import SpaceStarter from "./SpaceStarter";
import { NewMessage } from "../types";
import { useAppSelector } from "../../../core/store/hooks";

interface ChatAreaProps {
  messages: NewMessage[];
  conversationId?: string;
  isStreaming?: boolean;
  onCopy?: (content: string) => void;
  onShare?: (messageId: string) => void;
  onRegenerate?: (messageId: string) => void;
  onLike?: (messageId: string, like: boolean) => void;
  onContinue?: (messageId: string) => void;
  onEdit?: (messageId: string, newContent: string) => void;
  onSelectVariant?: (messageId: string, variantId: string) => void;
  onFeedback?: (
    messageId: string,
    feedback: {
      like?: boolean;
      dislike?: boolean;
      note?: string;
      reason?: string;
    }
  ) => void;
  userName?: string;
  isAuthenticated?: boolean;
}

const ChatArea = ({
  messages,
  conversationId,
  isStreaming = false,
  onCopy,
  onShare,
  onRegenerate,
  onLike,
  onContinue,
  onEdit,
  onSelectVariant,
  onFeedback,
  userName,
  isAuthenticated,
}: ChatAreaProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const initialIsCompactHeight =
    typeof window !== "undefined" ? window.innerHeight <= 900 : false;
  const isDark = useAppSelector((s) => s.ui.isDark);
  // Dark theme -> dark avatar, Light theme -> light avatar
  const thinkingAvatar = isDark ? aiAvatarDark : aiAvatarLight;
  const heroAvatar = isDark ? aiAvatarDark : aiAvatarLight;
  const computeHeroScale = () => {
    if (typeof window === "undefined") return 1;
    const { innerWidth, innerHeight } = window;

    if (innerWidth <= 640) {
      return 1;
    }

    if (innerWidth >= 1200) {
      const widthAdjusted = innerWidth / 1700;
      const heightAdjusted = innerHeight / 1040;
      const ratio = Math.min(widthAdjusted, heightAdjusted);
      return Math.min(0.9, Math.max(0.78, ratio));
    }

    if (innerWidth >= 992) {
      const widthAdjusted = innerWidth / 1250;
      const heightAdjusted = innerHeight / 880;
      return Math.min(1, Math.max(0.86, Math.min(widthAdjusted, heightAdjusted)));
    }

    const heightRatio = innerHeight / 900;
    const widthRatio = innerWidth / 1152;
    return Math.min(1, Math.max(0.78, Math.min(heightRatio, widthRatio)));
  };
  const [heroScale, setHeroScale] = useState(computeHeroScale);
  const [isCompactHeight, setIsCompactHeight] = useState(
    initialIsCompactHeight
  );

  useEffect(() => {
    const handleResize = () => {
      setHeroScale((prev) => {
        const next = computeHeroScale();
        return Math.abs(next - prev) > 0.01 ? next : prev;
      });
      setIsCompactHeight(window.innerHeight <= 900);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // Auto scroll to bottom when new message arrives
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isStreaming]);

  if (messages.length === 0) {
    return (
      <div
        ref={containerRef}
        className={`flex-1 min-h-0 ${
          isAuthenticated ? "overflow-y-auto" : "overflow-hidden"
        }`}
        role="log"
        aria-live="polite"
        aria-label="Chat messages"
      >
        <div
        className={`flex flex-col items-center ${
            isAuthenticated
              ? "justify-start min-h-full pb-2 sm:pb-3 md:pb-4 px-3 sm:px-4"
            : `${
                isCompactHeight ? "justify-start lg:justify-center" : "justify-center"
              } ${
                isCompactHeight
                  ? "gap-3 sm:gap-4 md:gap-5 lg:gap-6"
                  : "gap-3 sm:gap-6 md:gap-9 lg:gap-10"
              } pb-0 px-3 sm:px-4 md:px-8`
        } pt-2 sm:pt-4 md:pt-5 lg:pt-6 text-center w-full max-w-[1650px] mx-auto`}
        style={
          heroScale < 0.98
            ? {
                transform: `scale(${heroScale})`,
                transformOrigin: "top center",
                zoom: heroScale,
              }
            : undefined
        }
        >
          {/* removed decorative icon above header */}
          <div className="flex flex-col items-center">
            <img
              src={heroAvatar}
              alt="Cute assistant"
              style={{
                willChange: 'transform',
                backfaceVisibility: 'hidden',
              }}
              className={`${
                !isAuthenticated && isCompactHeight
                  ? "w-16 h-16 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 xl:w-36 xl:h-36"
                  : "w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 lg:w-40 lg:h-40 xl:w-48 xl:h-48"
              } mb-0.5 sm:mb-1 mx-auto rounded-full flex-shrink-0 avatar-float hover:scale-105 transition-transform duration-500`}
            />
            <div
              className={`-mt-1 sm:-mt-1.5 md:-mt-2 lg:-mt-4 xl:-mt-5 ${
                isAuthenticated
                  ? "mb-3 sm:mb-4 md:mb-6 lg:mb-8"
                  : "mb-2 sm:mb-3 md:mb-4 lg:mb-6"
              } leading-tight relative z-10 px-2 sm:px-3 md:px-6 w-full`}
            >
              <p className="text-[0.75rem] sm:text-[1rem] md:text-[1.45rem] lg:text-[1.85rem] xl:text-[2.45rem] font-bold leading-tight text-foreground">
                {(() => {
                  const hour = new Date().getHours();
                  const partOfDay =
                    hour < 12 ? "Morning" : hour < 18 ? "Afternoon" : "Evening";
                  const name =
                    userName && userName !== "Guest" ? userName : "there";
                  return `Good ${partOfDay}, ${name}`;
                })()}
              </p>
              <p className="text-[0.75rem] sm:text-[1rem] md:text-[1.45rem] lg:text-[1.85rem] xl:text-[2.45rem] font-bold leading-tight text-foreground">
                What's on <span className="gradient-text">your mind?</span>
              </p>
            </div>
          </div>

          {!isAuthenticated && (
            <div className="w-full pt-2 sm:pt-3 md:pt-5 lg:pt-6 px-1.5 sm:px-3 md:px-6">
              <SpaceStarter />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto min-h-0"
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
            onContinue={onContinue}
            onEdit={onEdit}
            onSelectVariant={onSelectVariant}
            onFeedback={onFeedback}
          />
        ))}

        {/* Streaming indicator */}
        {isStreaming && (
          <div className="flex gap-4 w-full max-w-[900px] mx-auto px-6 py-4">
            <div className="w-10 h-10 rounded-full shrink-0 overflow-hidden">
              <img
                src={thinkingAvatar}
                alt="Assistant avatar - thinking"
                className="w-full h-full object-cover"
              />
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
