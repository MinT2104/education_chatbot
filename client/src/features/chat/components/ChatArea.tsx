import { useEffect, useRef } from 'react'
import MessageBubble from './MessageBubble'
import { NewMessage } from '../types'

interface ChatAreaProps {
  messages: NewMessage[]
  isStreaming?: boolean
  onCopy?: (content: string) => void
  onShare?: (messageId: string) => void
  onRegenerate?: (messageId: string) => void
  onLike?: (messageId: string, like: boolean) => void
  onPin?: (messageId: string) => void
  onQuote?: (messageId: string, content: string) => void
}

const ChatArea = ({
  messages,
  isStreaming = false,
  onCopy,
  onShare,
  onRegenerate,
  onLike,
  onPin,
  onQuote,
}: ChatAreaProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Auto scroll to bottom when new message arrives
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isStreaming])

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 animate-fade-in">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary-500/10 flex items-center justify-center academic-glow animate-bounce-subtle">
            <svg
              className="w-8 h-8 text-primary-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-text mb-2">
            Start a conversation
          </h2>
          <p className="text-text-muted mb-6">
            Ask me anything you want to know. I'm here to help you!
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            <button className="px-4 py-2 bg-surface-muted hover:bg-primary-500/10 rounded-xl text-sm text-text shadow-[inset_0_0_0_1px_rgba(255,255,255,.04)] hover:shadow-[inset_0_0_0_1px_rgba(124,77,255,.15),0_2px_8px_rgba(124,77,255,.1)] transition-all duration-200 hover:scale-105 hover:-translate-y-1 active:scale-95">
              💡 Explain React Hooks
            </button>
            <button className="px-4 py-2 bg-surface-muted hover:bg-primary-500/10 rounded-xl text-sm text-text shadow-[inset_0_0_0_1px_rgba(255,255,255,.04)] hover:shadow-[inset_0_0_0_1px_rgba(124,77,255,.15),0_2px_8px_rgba(124,77,255,.1)] transition-all duration-200 hover:scale-105 hover:-translate-y-1 active:scale-95">
              🚀 How to create REST API
            </button>
            <button className="px-4 py-2 bg-surface-muted hover:bg-primary-500/10 rounded-xl text-sm text-text shadow-[inset_0_0_0_1px_rgba(255,255,255,.04)] hover:shadow-[inset_0_0_0_1px_rgba(124,77,255,.15),0_2px_8px_rgba(124,77,255,.1)] transition-all duration-200 hover:scale-105 hover:-translate-y-1 active:scale-95">
              📚 TypeScript basics
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto"
      role="log"
      aria-live="polite"
      aria-label="Chat messages"
    >
      <div className="mx-auto max-w-chat-lg px-4 md:px-6 py-6">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            onCopy={onCopy}
            onShare={onShare}
            onRegenerate={onRegenerate}
            onLike={onLike}
            onPin={onPin}
            onQuote={onQuote}
          />
        ))}

        {/* Streaming indicator */}
        {isStreaming && (
          <div className="flex gap-4 px-4 md:px-6 py-6">
            <div className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center flex-shrink-0 academic-glow">
              <span className="text-sm font-medium text-primary-500">AI</span>
            </div>
            <div className="flex-1">
              <div className="rounded-2xl bg-surface border border-border p-4 shadow-sm">
                <div className="flex items-center gap-2 text-text-muted">
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
  )
}

export default ChatArea
