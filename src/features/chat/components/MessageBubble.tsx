import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";
import { NewMessage } from "../types";

interface MessageBubbleProps {
  message: NewMessage;
  onCopy?: (content: string) => void;
  onShare?: (messageId: string) => void;
  onRegenerate?: (messageId: string) => void;
  onLike?: (messageId: string, like: boolean) => void;
}

const MessageBubble = ({ message, onCopy }: MessageBubbleProps) => {
  // Keep actions always mounted; visibility handled via CSS hover
  const [copied, setCopied] = useState(false);

  const isUser = message.role === "user";
  const content = message.contentMd || message.content || "";

  const handleCopy = async (text?: string) => {
    const textToCopy = text || content;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      onCopy?.(textToCopy);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div
      className={`group flex gap-4 w-full max-w-[900px] mx-auto px-6 py-3 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {/* No avatar for AI to match ChatGPT's simple style */}
      {!isUser && null}

      <div className={`flex-1 max-w-[85%] ${isUser ? "flex justify-end" : ""}`}>
        <div
          className={`${
            isUser
              ? "rounded-2xl p-4 bg-primary/10 text-foreground shadow-sm"
              : "rounded-none p-0 bg-transparent shadow-none border-0"
          }`}
        >
          {/* Content */}
          {isUser ? (
            <p className="text-foreground whitespace-pre-wrap leading-relaxed">
              {content}
            </p>
          ) : (
            <div className="prose prose-sm dark:prose-invert max-w-none leading-relaxed">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ node, inline, className, children, ...props }: any) {
                    const match = /language-(\w+)/.exec(className || "");
                    const codeString = String(children).replace(/\n$/, "");
                    return !inline && match ? (
                      <div className="relative my-4 rounded-xl overflow-hidden border border-border/60">
                        <div className="flex items-center justify-between px-4 py-2 bg-muted/60 border-b border-border/60">
                          <span className="text-xs font-mono text-muted-foreground font-medium">
                            {match[1]}
                          </span>
                          <button
                            onClick={() => handleCopy(codeString)}
                            className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                          >
                            {copied ? "Copied" : "Copy"}
                          </button>
                        </div>
                        <SyntaxHighlighter
                          style={oneDark}
                          language={match[1]}
                          PreTag="div"
                          className="!m-0"
                          customStyle={{
                            margin: 0,
                            borderTopLeftRadius: 0,
                            borderTopRightRadius: 0,
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
                    );
                  },
                  h1: ({ children }) => (
                    <h1 className="text-xl font-bold mb-2 mt-4 text-foreground">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-lg font-semibold mb-2 mt-3 text-foreground">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-base font-medium mb-1 mt-2 text-foreground">
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p className="mb-2 text-foreground leading-relaxed">
                      {children}
                    </p>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc pl-5 mb-2 space-y-1">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal pl-5 mb-2 space-y-1">
                      {children}
                    </ol>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="pl-4 my-2 italic text-muted-foreground border-l-4 border-primary/60">
                      {children}
                    </blockquote>
                  ),
                  table: ({ children }) => (
                    <div className="overflow-x-auto my-4 rounded-xl border border-border/60">
                      <table className="min-w-full">{children}</table>
                    </div>
                  ),
                  th: ({ children }) => (
                    <th className="px-4 py-2 bg-muted/60 text-left font-semibold border-b border-border/60">
                      {children}
                    </th>
                  ),
                  td: ({ children }) => (
                    <td className="px-4 py-2 border-b border-border/60">
                      {children}
                    </td>
                  ),
                }}
              >
                {content}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {/* Actions Bar */}
        {!isUser && (
          <div className="flex items-center gap-1 mt-2 px-4 invisible group-hover:visible transition-opacity">
            <button
              onClick={() => handleCopy()}
              className="p-1.5 rounded hover:bg-muted transition-colors"
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
                  className="w-4 h-4 text-muted-foreground"
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
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
