import { useState, useEffect } from 'react'
import { useAppSelector } from '../../../core/store/hooks'
import { toast } from 'react-toastify'
import Sidebar from '../components/Sidebar'
import TopBar from '../components/TopBar'
import ChatArea from '../components/ChatArea'
import Composer from '../components/Composer'
import { Conversation, NewMessage, ConversationTools } from '../types'
import { mockConversations } from '../data/mockData'
import UpgradeModal from '../components/UpgradeModal'
import SchoolPickerModal from '../components/SchoolPickerModal'
import RoleToggle from '../components/RoleToggle'
import AccountMenu from '../components/AccountMenu'
import prompts from '../data/prompts.json'

const ChatPage = () => {
  const userName = useAppSelector((s) => s.auth?.user?.name ?? 'Guest')
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null)
  const [currentMessages, setCurrentMessages] = useState<NewMessage[]>([])
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const [model, setModel] = useState('GPT-4')
  const [tools, setTools] = useState<ConversationTools>({
    web: false,
    code: false,
    vision: false,
  })
  const [memoryEnabled, setMemoryEnabled] = useState(false)
  const [plan, setPlan] = useState<'Free' | 'Go'>((localStorage.getItem('plan') as any) || 'Free')
  const [quotaUsed, setQuotaUsed] = useState<number>(parseInt(localStorage.getItem('quota_used') || '0', 10))
  const quotaLimit = plan === 'Free' ? 25 : null
  const quotaRemaining = quotaLimit != null ? Math.max(quotaLimit - quotaUsed, 0) : null
  const [showUpgrade, setShowUpgrade] = useState(false)
  const [showSchoolPicker, setShowSchoolPicker] = useState(false)
  const [currentSchool, setCurrentSchool] = useState<{ id: string; name: string } | null>(null)
  const [role, setRole] = useState<'student' | 'teacher'>('student')
  const [flowStep, setFlowStep] = useState<1 | 2 | 3 | null>(null)

  // Load from localStorage or mock on mount
  useEffect(() => {
    const stored = localStorage.getItem('conversations')
    const seed = stored ? (JSON.parse(stored) as Conversation[]) : mockConversations
    setConversations(seed)
    if (seed.length > 0) {
      setSelectedConversationId(seed[0].id)
      setCurrentMessages(seed[0].messages)
      setTools(seed[0].tools || {})
      setMemoryEnabled(seed[0].memory?.enabled || false)
    }
  }, [])

  // Persist conversations
  useEffect(() => {
    localStorage.setItem('conversations', JSON.stringify(conversations))
  }, [conversations])

  // Update messages when conversation changes
  useEffect(() => {
    if (selectedConversationId) {
      const conv = conversations.find((c) => c.id === selectedConversationId)
      if (conv) {
        setCurrentMessages(conv.messages)
        setTools(conv.tools || {})
        setMemoryEnabled(conv.memory?.enabled || false)
      }
    } else {
      setCurrentMessages([])
    }
  }, [selectedConversationId, conversations])

  const currentConversation = conversations.find(
    (c) => c.id === selectedConversationId
  )

  const handleNewChat = () => {
    setSelectedConversationId(null)
    setCurrentMessages([])
    setIsStreaming(false)
    setFlowStep(null)
  }

  const handleSelectConversation = (id: string) => {
    setSelectedConversationId(id)
    setIsStreaming(false)
  }

  const handleSendMessage = (content: string) => {
    if (!content.trim()) return
    if (plan === 'Free' && quotaUsed >= 25) {
      setShowUpgrade(true)
      return
    }

    // Create user message
    const userMessage: NewMessage = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: content,
      timestamp: Date.now(),
    }

    // If no conversation selected, create new one
    if (!selectedConversationId) {
      const newConversation: Conversation = {
        id: `conv_${Date.now()}`,
        title: content.slice(0, 50),
        pinned: false,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        messages: [userMessage],
        tools,
        memory: { enabled: memoryEnabled },
      }
      setConversations([newConversation, ...conversations])
      setSelectedConversationId(newConversation.id)
      setCurrentMessages([userMessage])
    } else {
      // Add to existing conversation
      setCurrentMessages((prev) => [...prev, userMessage])
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === selectedConversationId
            ? {
                ...conv,
                messages: [...conv.messages, userMessage],
                updatedAt: Date.now(),
              }
            : conv
        )
      )
    }

    // Quota accounting (user message deducts 1)
    if (plan === 'Free') {
      const nextUsed = quotaUsed + 1
      setQuotaUsed(nextUsed)
      localStorage.setItem('quota_used', String(nextUsed))
    }

    // Simulate streaming response
    setIsStreaming(true)
    setTimeout(() => {
      let reply = ''
      if (!flowStep) {
        reply = `Bạn học môn gì & khối/lớp mấy?\n\n- Math, Science, English\n- Grade 1–12`
        setFlowStep(1)
      } else if (flowStep === 1) {
        reply = `Perfect — noted! Giờ bạn muốn học chương/chủ đề nào?`
        setFlowStep(2)
      } else if (flowStep === 2) {
        reply = `Hãy gửi bài toán/câu hỏi cụ thể. Mình sẽ giải thích từng bước.`
        setFlowStep(3)
      } else {
        reply = `${role === 'student' ? prompts.student : prompts.teacher}\n\nTrả lời cho: "${content}"\n\n1) ...\n2) ...\n3) ...`
      }

      const assistantMessage: NewMessage = {
        id: `msg_${Date.now() + 1}`,
        role: 'assistant',
        contentMd: reply,
        timestamp: Date.now() + 1000,
        streamed: true,
      }

      setCurrentMessages((prev) => [...prev, assistantMessage])
      if (selectedConversationId) {
        setConversations((prev) =>
          prev.map((conv) =>
            conv.id === selectedConversationId
              ? {
                  ...conv,
                  messages: [...conv.messages, assistantMessage],
                  updatedAt: Date.now(),
                }
              : conv
          )
        )
      }
      setIsStreaming(false)
    }, 600)
  }

  const handleStopStreaming = () => {
    setIsStreaming(false)
    toast.info('Stopped generating response')
  }

  const handleCopy = (_content: string) => {
    toast.success('Copied to clipboard')
  }

  const handleShare = (_messageId: string) => {
    toast.info('Share feature is under development')
  }

  const handleRegenerate = (_messageId: string) => {
    toast.info('Regenerating response...')
    // Implementation would regenerate the message
  }

  const handleLike = (messageId: string, like: boolean) => {
    setCurrentMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId
          ? {
              ...msg,
              feedback: { ...msg.feedback, like, dislike: !like },
            }
          : msg
      )
    )
  }

  const handleDeleteConversation = (id: string) => {
    setConversations((prev) => prev.filter((conv) => conv.id !== id))
    if (selectedConversationId === id) {
      handleNewChat()
    }
    toast.success('Conversation deleted')
  }

  const handlePinConversation = (id: string) => {
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === id ? { ...conv, pinned: !conv.pinned } : conv
      )
    )
  }

  const handleExport = () => {
    if (currentConversation) {
      const dataStr = JSON.stringify(currentConversation, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${currentConversation.title}.json`
      link.click()
      toast.success('Conversation exported')
    }
  }

  const handleToggleTool = (tool: keyof ConversationTools) => {
    setTools((prev) => ({
      ...prev,
      [tool]: !prev[tool],
    }))
  }

  const handleToggleMemory = () => {
    setMemoryEnabled((prev) => !prev)
  }

  return (
    <div className="h-screen flex flex-col bg-bg overflow-hidden">
      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar */}
        <div
          className={`fixed md:relative z-20 md:z-auto left-0 top-0 h-full transition-all duration-300 ease-out ${
            isSidebarCollapsed
              ? 'w-14 md:w-16 -translate-x-full md:translate-x-0'
              : 'w-80 translate-x-0'
          }`}
        >
          <Sidebar
            conversations={conversations}
            selectedConversationId={selectedConversationId}
            onSelectConversation={(id) => {
              handleSelectConversation(id)
              // Auto-collapse sidebar on mobile after selection
              if (window.innerWidth < 768) {
                setIsSidebarCollapsed(true)
              }
            }}
            onNewChat={() => {
              handleNewChat()
              // Auto-collapse sidebar on mobile
              if (window.innerWidth < 768) {
                setIsSidebarCollapsed(true)
              }
            }}
            onDeleteConversation={handleDeleteConversation}
            onPinConversation={handlePinConversation}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          />
        </div>

        {/* Overlay for mobile */}
        {!isSidebarCollapsed && (
          <div
            className="absolute inset-0 bg-black/50 z-10 md:hidden animate-fade-in backdrop-blur-sm"
            onClick={() => setIsSidebarCollapsed(true)}
          />
        )}

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Mobile menu button */}
          {isSidebarCollapsed && (
            <button
              onClick={() => setIsSidebarCollapsed(false)}
              className="absolute top-4 left-4 z-30 md:hidden p-2 rounded-lg bg-surface border border-border shadow-lg transition-all duration-200 hover:scale-110 hover:shadow-xl hover:bg-primary-500/10 hover:border-primary-400/30 active:scale-95"
              aria-label="Toggle sidebar"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          )}

          {/* Top Bar */}
          <TopBar
            currentConversation={currentConversation || null}
            model={model}
            tools={tools}
            memoryEnabled={memoryEnabled}
            onModelChange={setModel}
            onToggleTool={handleToggleTool}
            onToggleMemory={handleToggleMemory}
            onNewChat={handleNewChat}
            onExport={handleExport}
            onSettings={() => toast.info('Settings feature is under development')}
          />
          <div className="flex items-center justify-between px-4 md:px-6 py-2">
            <button className="px-3 py-1.5 rounded-xl bg-surface-muted hover:bg-primary-500/10" onClick={() => setShowSchoolPicker(true)}>
              {currentSchool ? currentSchool.name : 'Select School'}
            </button>
            <RoleToggle role={role} onChange={setRole} />
            <AccountMenu userName={userName} plan={plan} />
          </div>

          {/* Chat Messages */}
          <ChatArea
            messages={currentMessages}
            isStreaming={isStreaming}
            onCopy={handleCopy}
            onShare={handleShare}
            onRegenerate={handleRegenerate}
            onLike={handleLike}
          />

          {/* Composer */}
          {/* Quick chips for step 1 */}
          {flowStep === 1 && (
            <div className="mx-auto max-w-chat-lg px-4 md:px-6 py-2 flex flex-wrap gap-2">
              {['Math','Science','English'].map((s) => (
                <button key={s} className="px-3 py-1.5 text-xs bg-surface-muted rounded-xl" onClick={() => handleSendMessage(s)}>{s}</button>
              ))}
              {Array.from({ length: 12 }, (_, i) => i + 1).map((g) => (
                <button key={g} className="px-3 py-1.5 text-xs bg-surface-muted rounded-xl" onClick={() => handleSendMessage(`Grade ${g}`)}>Grade {g}</button>
              ))}
            </div>
          )}
          <Composer
            onSend={handleSendMessage}
            onStop={handleStopStreaming}
            isStreaming={isStreaming}
            disabled={plan === 'Free' && quotaUsed >= 25}
          />
          {/* Quota indicator */}
          <div className="px-4 md:px-6 py-2 text-xs text-text-subtle text-center">
            {plan === 'Free' ? (
              <span>
                {quotaRemaining} / 25 messages left.{' '}
                <button className="underline text-primary-500" onClick={() => setShowUpgrade(true)}>Upgrade</button>
              </span>
            ) : (
              <span>Plan Go: Unlimited messages</span>
            )}
          </div>
          <UpgradeModal
            open={showUpgrade}
            onClose={() => setShowUpgrade(false)}
            onUpgrade={() => {
              localStorage.setItem('plan', 'Go')
              localStorage.removeItem('quota_used')
              setPlan('Go')
              setQuotaUsed(0)
              setShowUpgrade(false)
              toast.success('Upgraded to Go (mock)')
            }}
          />
          <SchoolPickerModal
            open={showSchoolPicker}
            onClose={() => setShowSchoolPicker(false)}
            onSelect={(s) => {
              setCurrentSchool(s)
              handleNewChat()
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default ChatPage


