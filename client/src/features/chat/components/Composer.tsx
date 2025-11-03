import { useState, useRef, useEffect, KeyboardEvent } from 'react'

interface ComposerProps {
  onSend: (message: string) => void
  onStop?: () => void
  isStreaming?: boolean
  placeholder?: string
  disabled?: boolean
}

const Composer = ({
  onSend,
  onStop,
  isStreaming = false,
  placeholder = 'Type a message...',
  disabled = false,
}: ComposerProps) => {
  const [input, setInput] = useState('')
  const [isComposing, setIsComposing] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        200
      )}px`
    }
  }, [input])

  const handleSend = () => {
    const trimmedInput = input.trim()
    if (trimmedInput && !disabled) {
      onSend(trimmedInput)
      setInput('')
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
    // Cmd/Ctrl + Enter also sends
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleCompositionStart = () => {
    setIsComposing(true)
  }

  const handleCompositionEnd = () => {
    setIsComposing(false)
  }

  return (
    <div className="sticky bottom-0 bg-surface/60 backdrop-blur-sm transition-all duration-200 shadow-[0_-1px_0_rgba(255,255,255,.06)_inset,0_-2px_12px_rgba(0,0,0,.08)]">
      <div className="mx-auto max-w-chat-lg px-4 md:px-6 py-4">
        {/* Prompt suggestions (optional) */}
        {!input && (
          <div className="flex flex-wrap gap-2 mb-3">
            <button
              onClick={() => setInput('Explain React Hooks')}
              className="px-3 py-1.5 text-xs bg-surface-muted hover:bg-primary-500/10 rounded-xl text-text-muted shadow-[inset_0_0_0_1px_rgba(255,255,255,.04)] hover:shadow-[inset_0_0_0_1px_rgba(124,77,255,.15),0_0_0_3px_rgba(124,77,255,.08)] transition-all duration-200 hover:scale-105 hover:-translate-y-0.5 active:scale-95"
            >
              💡 Explain React Hooks
            </button>
            <button
              onClick={() => setInput('How to create REST API')}
              className="px-3 py-1.5 text-xs bg-surface-muted hover:bg-primary-500/10 rounded-xl text-text-muted shadow-[inset_0_0_0_1px_rgba(255,255,255,.04)] hover:shadow-[inset_0_0_0_1px_rgba(124,77,255,.15),0_0_0_3px_rgba(124,77,255,.08)] transition-all duration-200 hover:scale-105 hover:-translate-y-0.5 active:scale-95"
            >
              🚀 How to create REST API
            </button>
          </div>
        )}

        <div className="flex items-end gap-3">
          {/* Attach button */}
          <button
            className="p-2 rounded-lg hover:bg-surface-muted transition-all duration-200 hover:scale-110 hover:rotate-12 active:scale-95 flex-shrink-0 text-text-subtle"
            aria-label="Attach file"
            disabled={disabled}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
              />
            </svg>
          </button>

          {/* Textarea */}
          <div className="flex-1 relative">
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
              className="w-full px-4 py-3 pr-12 bg-surface rounded-2xl resize-none focus:outline-none text-text placeholder:text-text-subtle disabled:opacity-50 disabled:cursor-not-allowed max-h-[200px] overflow-y-auto transition-all duration-200 shadow-[inset_0_0_0_1px_rgba(255,255,255,.06),0_1px_2px_rgba(0,0,0,.06)] focus:shadow-[inset_0_0_0_1px_rgba(124,77,255,.20),0_0_0_4px_rgba(124,77,255,.12)]"
              style={{ minHeight: '52px' }}
            />

            {/* Character count or token estimate (optional) */}
              {input.length > 0 && (
              <div className="absolute bottom-2 right-2 text-xs text-text-subtle">
                {input.length} chars
              </div>
            )}
          </div>

          {/* Send/Stop button */}
          {isStreaming && onStop ? (
            <button
              onClick={onStop}
              className="p-3 rounded-xl bg-red-500 hover:bg-red-600 text-white transition-colors flex-shrink-0"
              aria-label="Stop generating"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M6 6h12v12H6z" />
              </svg>
            </button>
          ) : (
            <button
              onClick={handleSend}
              disabled={!input.trim() || disabled || isComposing}
              className="p-3 rounded-xl bg-primary-500 hover:bg-cta-gradient disabled:opacity-50 disabled:cursor-not-allowed text-white transition-all duration-200 flex-shrink-0 focus:outline-none focus:shadow-[0_0_0_6px_rgba(124,77,255,.12)] hover:shadow-[0_0_0_6px_rgba(124,77,255,.12),0_2px_8px_rgba(124,77,255,.25)] hover:scale-110 hover:-translate-y-0.5 active:scale-95 active:translate-y-0"
              aria-label="Send message"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Helper text */}
        <div className="mt-2 text-xs text-text-subtle text-center">
          Press <kbd className="px-1.5 py-0.5 bg-surface-muted rounded">Enter</kbd> to send,
          <kbd className="px-1.5 py-0.5 bg-surface-muted rounded ml-1">
            Shift+Enter
          </kbd>{' '}
          for new line
        </div>
      </div>
    </div>
  )
}

export default Composer
