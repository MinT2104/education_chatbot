import { Conversation, ConversationTools } from '../types'

interface TopBarProps {
  currentConversation?: Conversation | null
  model?: string
  tools?: ConversationTools
  memoryEnabled?: boolean
  onModelChange?: (model: string) => void
  onToggleTool?: (tool: keyof ConversationTools) => void
  onToggleMemory?: () => void
  onNewChat?: () => void
  onExport?: () => void
  onSettings?: () => void
}

const TopBar = ({
  currentConversation,
  model = 'GPT-4',
  tools,
  memoryEnabled = false,
  onModelChange,
  onToggleTool,
  onToggleMemory,
  onNewChat,
  onExport,
  onSettings,
}: TopBarProps) => {
  return (
    <div className="h-16 bg-surface/60 backdrop-blur-sm sticky top-0 z-10 transition-all duration-200 shadow-[0_1px_0_rgba(255,255,255,.06)_inset,0_1px_2px_rgba(0,0,0,.06)]">
      <div className="h-full px-4 md:px-6 flex items-center justify-between max-w-chat-lg mx-auto">
        <div className="flex items-center gap-2 md:gap-4 flex-wrap">
          {/* Model Selector */}
          <div className="flex items-center gap-2">
            <select
              value={model}
              onChange={(e) => onModelChange?.(e.target.value)}
              className="px-3 py-1.5 bg-surface-muted rounded-xl text-sm font-medium text-text focus:outline-none focus:shadow-[0_0_0_3px_rgba(124,77,255,.12),inset_0_0_0_1px_rgba(124,77,255,.20)] transition-all duration-200"
            >
              <option value="GPT-4">GPT-4</option>
              <option value="GPT-3.5">GPT-3.5</option>
              <option value="Claude">Claude</option>
            </select>
          </div>

          {/* Tools */}
          {tools && (
            <div className="flex items-center gap-2">
              {tools.web && (
                <button
                  onClick={() => onToggleTool?.('web')}
                  className="px-3 py-1.5 bg-primary-500/10 rounded-xl text-xs font-medium text-primary-500 shadow-[inset_0_0_0_1px_rgba(124,77,255,.15)] hover:bg-primary-500/20 hover:shadow-[inset_0_0_0_1px_rgba(124,77,255,.25),0_0_0_3px_rgba(124,77,255,.08)] hover:scale-105 hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
                >
                  🌐 Web
                </button>
              )}
              {tools.code && (
                <button
                  onClick={() => onToggleTool?.('code')}
                  className="px-3 py-1.5 bg-primary-500/10 rounded-xl text-xs font-medium text-primary-500 shadow-[inset_0_0_0_1px_rgba(124,77,255,.15)] hover:bg-primary-500/20 hover:shadow-[inset_0_0_0_1px_rgba(124,77,255,.25),0_0_0_3px_rgba(124,77,255,.08)] hover:scale-105 hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
                >
                  💻 Code
                </button>
              )}
              {tools.vision && (
                <button
                  onClick={() => onToggleTool?.('vision')}
                  className="px-3 py-1.5 bg-primary-500/10 rounded-xl text-xs font-medium text-primary-500 shadow-[inset_0_0_0_1px_rgba(124,77,255,.15)] hover:bg-primary-500/20 hover:shadow-[inset_0_0_0_1px_rgba(124,77,255,.25),0_0_0_3px_rgba(124,77,255,.08)] hover:scale-105 hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
                >
                  👁️ Vision
                </button>
              )}
            </div>
          )}

          {/* Memory Toggle */}
          <button
            onClick={onToggleMemory}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 hover:scale-105 hover:-translate-y-0.5 active:scale-95 ${
              memoryEnabled
                ? 'bg-primary-500/10 text-primary-500 shadow-[inset_0_0_0_1px_rgba(124,77,255,.15)] hover:bg-primary-500/20 hover:shadow-[inset_0_0_0_1px_rgba(124,77,255,.25),0_0_0_3px_rgba(124,77,255,.08)]'
                : 'bg-surface-muted text-text-subtle shadow-[inset_0_0_0_1px_rgba(255,255,255,.04)] hover:bg-surface-muted/80'
            }`}
          >
            🧠 Memory: {memoryEnabled ? 'ON' : 'OFF'}
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {onNewChat && (
            <button
              onClick={onNewChat}
              className="p-2 rounded-lg hover:bg-surface-muted transition-all duration-200 hover:scale-110 hover:rotate-90 active:scale-95"
              aria-label="New chat"
            >
              <svg
                className="w-5 h-5 text-text-muted"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>
          )}

          {onExport && (
            <button
              onClick={onExport}
              className="p-2 rounded-lg hover:bg-surface-muted transition-all duration-200 hover:scale-110 hover:-translate-y-0.5 active:scale-95"
              aria-label="Export"
            >
              <svg
                className="w-5 h-5 text-text-muted"
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
            </button>
          )}

          {onSettings && (
            <button
              onClick={onSettings}
              className="p-2 rounded-lg hover:bg-surface-muted transition-all duration-200 hover:scale-110 hover:rotate-90 active:scale-95"
              aria-label="Settings"
            >
              <svg
                className="w-5 h-5 text-text-muted"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default TopBar
