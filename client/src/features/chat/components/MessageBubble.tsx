import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import remarkGfm from 'remark-gfm'
import { NewMessage } from '../types'

interface MessageBubbleProps {
  message: NewMessage
  onCopy?: (content: string) => void
  onShare?: (messageId: string) => void
  onRegenerate?: (messageId: string) => void
  onLike?: (messageId: string, like: boolean) => void
  onPin?: (messageId: string) => void
  onQuote?: (messageId: string, content: string) => void
}

const MessageBubble = ({
  message,
  onCopy,
  onShare,
  onRegenerate,
  onLike,
  onPin,
  onQuote,
}: MessageBubbleProps) => {
  const [showActions, setShowActions] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showCitations, setShowCitations] = useState(false)

  const isUser = message.role === 'user'
  const content = message.contentMd || message.content || ''

  const handleCopy = async (text?: string) => {
    const textToCopy = text || content
    try {
      await navigator.clipboard.writeText(textToCopy)
      setCopied(true)
      onCopy?.(textToCopy)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getInitials = (text: string) => {
    return text.charAt(0).toUpperCase()
  }

  return (
    <div
      className={`group flex gap-4 px-4 md:px-6 py-6 animate-message-enter ${
        isUser ? 'justify-end' : 'justify-start'
      }`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center flex-shrink-0 academic-glow transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
          <span className="text-sm font-medium text-primary-500">AI</span>
        </div>
      )}

      <div className={`flex-1 max-w-[85%] ${isUser ? 'flex justify-end' : ''}`}>
        <div
          className={`rounded-2xl p-4 transition-all duration-200 ease-out ${
            isUser
              ? 'bg-primary-500/10 shadow-[inset_0_0_0_1px_rgba(124,77,255,.15)] group-hover:bg-primary-500/15 group-hover:shadow-[inset_0_0_0_1px_rgba(124,77,255,.20),0_2px_8px_rgba(124,77,255,.1)] group-hover:-translate-y-0.5'
              : 'bg-surface soft-bubble group-hover:shadow-[inset_0_0_0_1px_rgba(255,255,255,.06),0_2px_8px_rgba(0,0,0,.08)]'
          }`}
        >
          {/* Content */}
          {isUser ? (
            <p className="text-text whitespace-pre-wrap">{content}</p>
          ) : (
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ node, inline, className, children, ...props }: any) {
                    const match = /language-(\w+)/.exec(className || '')
                    const codeString = String(children).replace(/\n$/, '')
                    return !inline && match ? (
                      <div className="relative my-4">
                        <div className="flex items-center justify-between px-4 py-2 bg-surface-muted rounded-t-lg shadow-[inset_0_-1px_0_rgba(255,255,255,.06)]">
                          <span className="text-xs font-mono text-accent-600 font-medium">
                            {match[1]}
                          </span>
                          <button
                            onClick={() => handleCopy(codeString)}
                            className="text-xs text-text-subtle hover:text-text transition-all duration-200 hover:scale-105 flex items-center gap-1"
                          >
                            {copied ? (
                              <>
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
                                Copied
                              </>
                            ) : (
                              <>
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
                                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                  />
                                </svg>
                                Copy
                              </>
                            )}
                          </button>
                        </div>
                        <SyntaxHighlighter
                          style={oneDark}
                          language={match[1]}
                          PreTag="div"
                          className="rounded-b-lg !m-0 shadow-[inset_0_0_0_1px_rgba(255,255,255,.04),0_1px_2px_rgba(0,0,0,.06)]"
                          customStyle={{
                            margin: 0,
                            borderRadius: '0 0 0.75rem 0.75rem',
                          }}
                          {...props}
                        >
                          {codeString}
                        </SyntaxHighlighter>
                      </div>
                    ) : (
                      <code
                        className="px-1.5 py-0.5 bg-muted rounded text-sm font-mono"
                        {...props}
                      >
                        {children}
                      </code>
                    )
                  },
                  h1: ({ children }) => (
                    <h1 className="text-xl font-bold mb-2 mt-4">{children}</h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-lg font-semibold mb-2 mt-3">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-base font-medium mb-1 mt-2">
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p className="mb-2 text-text leading-relaxed">{children}</p>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc pl-5 mb-2 space-y-1">{children}</ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal pl-5 mb-2 space-y-1">
                      {children}
                    </ol>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="pl-4 my-2 italic text-text-muted bg-primary-500/5 rounded-r-lg py-2 shadow-[inset_4px_0_0_rgba(124,77,255,.20)]">
                      {children}
                    </blockquote>
                  ),
                  table: ({ children }) => (
                    <div className="overflow-x-auto my-4">
                      <table className="min-w-full rounded-xl shadow-[inset_0_0_0_1px_rgba(255,255,255,.04),0_1px_2px_rgba(0,0,0,.06)] overflow-hidden">
                        {children}
                      </table>
                    </div>
                  ),
                  th: ({ children }) => (
                    <th className="px-4 py-2 bg-surface-muted text-left font-semibold shadow-[inset_0_-1px_0_rgba(255,255,255,.06)]">
                      {children}
                    </th>
                  ),
                  td: ({ children }) => (
                    <td className="px-4 py-2 text-text shadow-[inset_0_-1px_0_rgba(255,255,255,.04)]">
                      {children}
                    </td>
                  ),
                }}
              >
                {content}
              </ReactMarkdown>
            </div>
          )}

          {/* Citations */}
          {message.citations && message.citations.length > 0 && (
            <div className="mt-4 pt-4">
              <div className="hairline-divider mb-2"></div>
              <button
                onClick={() => setShowCitations(!showCitations)}
                className="text-xs text-secondary-500 hover:text-secondary-600 hover:underline flex items-center gap-1 transition-all duration-200 hover:scale-105"
              >
                Sources ({message.citations.length})
                <svg
                  className={`w-3 h-3 transition-transform duration-200 ${
                    showCitations ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {showCitations && (
                <div className="mt-2 space-y-2 animate-fade-in">
                  {message.citations.map((citation) => (
                    <a
                      key={citation.id}
                      href={citation.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-3 bg-surface-muted rounded-xl shadow-[inset_0_0_0_1px_rgba(255,255,255,.04),0_1px_2px_rgba(0,0,0,.06)] hover:shadow-[inset_0_0_0_1px_rgba(124,77,255,.15),0_2px_8px_rgba(0,0,0,.08)] transition-all duration-200 hover:scale-[1.01] hover:-translate-y-0.5"
                    >
                      <div className="text-sm font-medium text-text">
                        {citation.title}
                      </div>
                      {citation.snippet && (
                        <div className="text-xs text-text-muted mt-1">
                          {citation.snippet}
                        </div>
                      )}
                      <div className="text-xs text-text-subtle mt-1 truncate">
                        {citation.url}
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Timestamp */}
          <div className="mt-2 text-xs text-text-subtle">
            {formatTime(message.timestamp)}
          </div>
        </div>

        {/* Actions Bar */}
        {showActions && !isUser && (
          <div className="flex items-center gap-1 mt-2 px-2 animate-fade-in">
            <button
              onClick={() => handleCopy()}
              className="p-1.5 rounded-lg hover:bg-surface-muted transition-all duration-200 hover:scale-110 active:scale-95"
              title="Copy"
            >
              {copied ? (
                <svg
                  className="w-4 h-4 text-green-500"
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
                <svg
                  className="w-4 h-4 text-text-subtle"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              )}
            </button>

            {onLike && (
              <button
                onClick={() =>
                  onLike(
                    message.id,
                    !message.feedback?.like && message.feedback?.dislike !== true
                  )
                }
                className={`p-1.5 rounded-lg hover:bg-surface-muted transition-all duration-200 hover:scale-110 active:scale-95 ${
                  message.feedback?.like ? 'text-primary-500' : 'text-text-subtle'
                }`}
                title="Like"
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
                    d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                  />
                </svg>
              </button>
            )}

            {onShare && (
              <button
                onClick={() => onShare(message.id)}
                className="p-1.5 rounded-lg hover:bg-surface-muted transition-all duration-200 hover:scale-110 active:scale-95 text-text-subtle"
                title="Share"
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
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  />
                </svg>
              </button>
            )}

            {onRegenerate && (
              <button
                onClick={() => onRegenerate(message.id)}
                className="p-1.5 rounded-lg hover:bg-surface-muted transition-all duration-200 hover:scale-110 active:scale-95 hover:rotate-180 text-text-subtle"
                title="Regenerate"
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
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary-500/30">
          <span className="text-sm font-medium text-primary-500">U</span>
        </div>
      )}
    </div>
  )
}

export default MessageBubble
