import { useState } from 'react'
import { Conversation } from '../types'

interface SidebarProps {
  conversations: Conversation[]
  selectedConversationId: string | null
  onSelectConversation: (id: string) => void
  onNewChat: () => void
  onDeleteConversation?: (id: string) => void
  onPinConversation?: (id: string) => void
  isCollapsed?: boolean
  onToggleCollapse?: () => void
}

const Sidebar = ({
  conversations,
  selectedConversationId,
  onSelectConversation,
  onNewChat,
  onDeleteConversation,
  onPinConversation,
  isCollapsed = false,
  onToggleCollapse,
}: SidebarProps) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const filteredConversations = conversations.filter((conv) =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} min ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const sortedConversations = [...filteredConversations].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1
    if (!a.pinned && b.pinned) return 1
    return b.updatedAt - a.updatedAt
  })

  if (isCollapsed && onToggleCollapse) {
    return (
      <div className="w-14 md:w-16 bg-surface/70 backdrop-blur-md border-r border-border rounded-r-2xl flex flex-col items-center py-4 shadow-[1px_0_0_rgba(255,255,255,.06)_inset,0_8px_24px_rgba(0,0,0,.18)]">
        <button
          onClick={onToggleCollapse}
          className="p-2.5 rounded-xl hover:bg-primary-500/10 transition-all duration-200 hover:scale-110 active:scale-95 focus:outline-none focus:shadow-[0_0_0_6px_rgba(124,77,255,.12)]"
          aria-label="Expand sidebar"
          title="Expand"
        >
          <svg
            className="w-5 h-5 text-text"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
        <div className="hairline-divider w-8 my-4" />
        <button
          onClick={onNewChat}
          className="p-2.5 rounded-xl hover:bg-primary-500/10 transition-all duration-200 hover:scale-110 active:scale-95 focus:outline-none focus:shadow-[0_0_0_6px_rgba(124,77,255,.12)]"
          aria-label="New chat"
          title="New chat"
        >
          <svg
            className="w-5 h-5 text-primary-500"
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
      </div>
    )
  }

  return (
    <div className="w-80 bg-surface flex flex-col h-full shadow-[1px_0_0_rgba(255,255,255,.06)_inset]">
      {/* Header */}
      <div className="p-4">
        <div className="hairline-divider mb-4"></div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-text">Conversations</h2>
          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className="p-1.5 rounded-lg hover:bg-surface-muted transition-colors"
              aria-label="Collapse sidebar"
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          )}
        </div>

        {/* New Chat Button */}
        <button
          onClick={onNewChat}
          className="w-full px-4 py-2.5 bg-primary-500 text-white rounded-xl font-medium hover:bg-primary-600 focus:outline-none focus:shadow-[0_0_0_6px_rgba(124,77,255,.12)] transition-all duration-200 ease-out hover:shadow-[0_0_0_6px_rgba(124,77,255,.12),0_2px_8px_rgba(124,77,255,.2)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] flex items-center justify-center gap-2"
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
              d="M12 4v16m8-8H4"
            />
          </svg>
          <span>New Chat</span>
        </button>

        {/* Search */}
        <div className="mt-3 relative">
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 pl-10 bg-surface-muted rounded-xl text-sm focus:outline-none focus:shadow-[0_0_0_3px_rgba(124,77,255,.12),inset_0_0_0_1px_rgba(124,77,255,.20)] transition-all duration-200"
          />
          <svg
            className="absolute left-3 top-2.5 w-4 h-4 text-text-subtle"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {sortedConversations.length === 0 ? (
          <div className="p-4 text-center text-text-muted text-sm">
            {searchQuery ? 'No conversations found' : 'No conversations yet'}
          </div>
        ) : (
          <div className="p-2">
            {sortedConversations.map((conv) => (
              <div
                key={conv.id}
                className={`group relative p-3 rounded-2xl mb-2 cursor-pointer transition-all duration-200 ease-out ${
                  selectedConversationId === conv.id
                    ? 'bg-primary-500/8 shadow-[inset_0_0_0_1px_rgba(124,77,255,.12)]'
                    : 'bg-surface hover:bg-surface-muted/80 hover:shadow-[0_1px_2px_rgba(0,0,0,.06)] hover:-translate-y-0.5'
                }`}
                onClick={() => onSelectConversation(conv.id)}
                onMouseEnter={() => setHoveredId(conv.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary-500/20 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-200 group-hover:bg-primary-500/30 group-hover:scale-110">
                    <span className="text-sm font-medium text-primary-500 transition-colors group-hover:text-primary-600">
                      {conv.title.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0 pr-16">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-medium text-text truncate">
                        {conv.title}
                      </h3>
                      {conv.pinned && hoveredId !== conv.id && (
                        <svg
                          className="w-4 h-4 text-primary-500 flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                        </svg>
                      )}
                    </div>
                    <p className="text-xs text-text-subtle">
                      {formatDate(conv.updatedAt)}
                    </p>
                  </div>
                </div>

                {/* Actions on hover */}
                {hoveredId === conv.id && (
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5 bg-surface/95 backdrop-blur-sm rounded-xl p-1 shadow-[0_4px_12px_rgba(0,0,0,.15),inset_0_0_0_1px_rgba(255,255,255,.06)] animate-scale-in z-20">
                    {onPinConversation && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onPinConversation(conv.id)
                        }}
                        className="p-1.5 rounded hover:bg-surface-muted transition-all duration-200 hover:scale-110 active:scale-95 flex-shrink-0"
                        aria-label={conv.pinned ? 'Unpin' : 'Pin'}
                      >
                        <svg
                          className={`w-4 h-4 ${
                            conv.pinned ? 'text-primary-500' : 'text-text-subtle'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                        </svg>
                      </button>
                    )}
                    {onDeleteConversation && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          if (window.confirm('Delete this conversation?')) {
                            onDeleteConversation(conv.id)
                          }
                        }}
                        className="p-1.5 rounded hover:bg-red-500/10 transition-all duration-200 hover:scale-110 active:scale-95 flex-shrink-0"
                        aria-label="Delete"
                      >
                        <svg
                          className="w-4 h-4 text-red-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Sidebar
