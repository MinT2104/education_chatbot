import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../../core/store/hooks";
import { toast } from "react-toastify";
import { settingsService } from "../../auth/services/settingsService";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import ChatArea from "../components/ChatArea";
import Composer from "../components/Composer";
import CommandPalette from "../components/CommandPalette";
import OfflineBanner from "../components/OfflineBanner";
import NetworkErrorBanner from "../components/NetworkErrorBanner";
import RateLimitModal from "../components/RateLimitModal";
import ExportModal from "../components/ExportModal";
import { NewMessage, ConversationTools } from "../types";
import UpgradeModal from "../components/UpgradeModal";
import prompts from "../data/prompts.json";
import { chatService } from "../services/chatService";
import SchoolPickerModal from "../components/SchoolPickerModal";
import { sessionService } from "../services/sessionService";
import { useConversations } from "../hooks/useConversations";

const ChatPage = () => {
  const navigate = useNavigate();
  const userName = useAppSelector((s) => s.auth?.user?.name ?? "Guest");
  const user = useAppSelector((s) => s.auth?.user);
  const userId = user?.email || user?.id || null;
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);

  // Use conversations hook for Redux state management
  const {
    conversations,
    selectedConversation,
    selectedConversationId,
    selectConversation,
    create: createConversation,
    update: updateConversation,
    remove: deleteConversation,
    addMessage: addMessageToConversation,
    updateLocal,
  } = useConversations();

  const [enterToSend, setEnterToSend] = useState(true);
  const [currentMessages, setCurrentMessages] = useState<NewMessage[]>([]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [model, setModel] = useState("GPT-4");
  const [tools, setTools] = useState<ConversationTools>({
    web: false,
    code: false,
    vision: false,
  });
  const [memoryEnabled, setMemoryEnabled] = useState(false);
  const [plan, setPlan] = useState<"Free" | "Go">(
    (localStorage.getItem("plan") as any) || "Free"
  );
  const [quotaUsed, setQuotaUsed] = useState<number>(
    parseInt(localStorage.getItem("quota_used") || "0", 10)
  );
  const quotaLimit = plan === "Free" ? 25 : null;
  const quotaRemaining =
    quotaLimit != null ? Math.max(quotaLimit - quotaUsed, 0) : null;
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [showNetworkError, setShowNetworkError] = useState(false);
  const [showRateLimit, setShowRateLimit] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [networkErrorMessage] = useState("");
  const [showSchoolPicker, setShowSchoolPicker] = useState(false);
  const [role, setRole] = useState<"student" | "teacher">("student");
  const [pendingMessage, setPendingMessage] = useState<string | null>(null);
  const [pendingSchoolName, setPendingSchoolName] = useState<string | null>(
    null
  );

  // Workflow state
  const [workflowStep, setWorkflowStep] = useState<1 | 2 | 3 | null>(null);

  // Load settings on mount and when userId changes
  useEffect(() => {
    const settings = settingsService.getSettings(userId);
    setEnterToSend(settings.enterToSend);
  }, [userId]);

  // Listen for settings changes (poll every 2 seconds for simplicity)
  useEffect(() => {
    const interval = setInterval(() => {
      const settings = settingsService.getSettings(userId);
      setEnterToSend(settings.enterToSend);
    }, 2000);
    return () => clearInterval(interval);
  }, [userId]);

  // Update messages when conversation changes (from Redux)
  useEffect(() => {
    if (selectedConversation) {
      setCurrentMessages(selectedConversation.messages);
      setTools(selectedConversation.tools || {});
      setMemoryEnabled(selectedConversation.memory?.enabled || false);
    } else {
      setCurrentMessages([]);
    }
  }, [selectedConversation]);

  // Keyboard shortcut for command palette (Cmd/Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const currentConversation = selectedConversation;

  const deriveConversationTitle = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return "Untitled";
    const singleLine = trimmed.split(/\n+/)[0];
    return singleLine.length > 60 ? `${singleLine.slice(0, 60)}…` : singleLine;
  };

  const handleNewChat = () => {
    // Just clear selection, don't create conversation yet
    // Conversation will be created when user sends first message
    selectConversation(null);
    setCurrentMessages([]);
    setIsStreaming(false);
    setWorkflowStep(null);
    setPendingSchoolName(null);
  };

  const handleSchoolSelect = (
    school: { name: string },
    _remember: boolean // Keep for backward compatibility but not used (school is per conversation now)
  ) => {
    // Store school name for the conversation that will be created
    setPendingSchoolName(school.name);
    setShowSchoolPicker(false);

    // If there's a pending message, send it now with the school name
    if (pendingMessage) {
      const messageToSend = pendingMessage;
      const schoolName = school.name;
      setPendingMessage(null);
      // Small delay to ensure modal is closed
      setTimeout(() => {
        handleSendMessage(messageToSend, schoolName);
      }, 100);
    }
  };

  const handleSelectConversation = (id: string) => {
    selectConversation(id);
    setIsStreaming(false);
  };

  const handleSendMessage = async (content: string, schoolName?: string) => {
    if (!content.trim()) return;
    if (plan === "Free" && quotaUsed >= 25) {
      setShowUpgrade(true);
      return;
    }

    // Create user message
    const userMessage: NewMessage = {
      id: `msg_${Date.now()}`,
      role: "user",
      content: content,
      timestamp: Date.now(),
    };

    // Store conversationId for chat API (will be set if we create a new conversation)
    let conversationIdForChat: string | undefined;
    let finalSchoolName: string | undefined;

    // If no conversation selected, check if school is needed first
    if (!selectedConversationId) {
      // Use pendingSchoolName if available, otherwise use passed schoolName
      finalSchoolName = pendingSchoolName || schoolName;

      // If no school name, show school picker and store pending message
      if (!finalSchoolName) {
        setPendingMessage(content);
        setShowSchoolPicker(true);
        return;
      }

      // Create new conversation with school name (sync with backend)
      try {
        const newConversation = await createConversation({
          title: deriveConversationTitle(content),
          pinned: false,
          messages: [userMessage],
          tools,
          memory: { enabled: memoryEnabled },
          schoolName: finalSchoolName,
        });
        conversationIdForChat = newConversation.id; // Store ID for chat API call
        selectConversation(newConversation.id);
        setCurrentMessages([userMessage]);
        setPendingSchoolName(null); // Clear pending school name
      } catch (error) {
        console.error("Failed to create conversation:", error);
        toast.error("Failed to create conversation. Please try again.");
        return;
      }
    } else {
      // Add to existing conversation (optimistic update + sync with backend)
      setCurrentMessages((prev) => [...prev, userMessage]);
      addMessageToConversation(selectedConversationId, userMessage);

      // Update conversation title if needed
      const currentConv = conversations.find(
        (c) => c.id === selectedConversationId
      );
      if (
        currentConv &&
        (currentConv.messages.length === 0 ||
          !currentConv.title ||
          currentConv.title === "New chat")
      ) {
        updateLocal(selectedConversationId, {
          title: deriveConversationTitle(content),
        });
        // Sync with backend
        updateConversation(selectedConversationId, {
          title: deriveConversationTitle(content),
          messages: [...(currentConv.messages || []), userMessage],
        }).catch((error) => {
          console.error("Failed to update conversation:", error);
        });
      } else {
        // Sync message update with backend
        updateConversation(selectedConversationId, {
          messages: [...(currentConv?.messages || []), userMessage],
        }).catch((error) => {
          console.error("Failed to update conversation:", error);
        });
      }
    }

    // Quota accounting (user message deducts 1)
    if (plan === "Free") {
      const nextUsed = quotaUsed + 1;
      setQuotaUsed(nextUsed);
      localStorage.setItem("quota_used", String(nextUsed));
    }

    // Handle workflow steps
    if (workflowStep === 1) {
      // Step 1: User provides subject and grade
      // Parse user input to extract subject and grade
      const lowerContent = content.toLowerCase();
      const subjects = [
        "math",
        "science",
        "english",
        "physics",
        "chemistry",
        "biology",
        "history",
        "geography",
      ];
      const grades = [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "11",
        "12",
        "grade",
      ];

      let detectedSubject = "";
      let detectedGrade = "";

      for (const subject of subjects) {
        if (lowerContent.includes(subject)) {
          detectedSubject = subject;
          break;
        }
      }

      for (const grade of grades) {
        if (lowerContent.includes(grade)) {
          const match = lowerContent.match(/(grade\s*)?(\d+)/i);
          if (match) {
            detectedGrade = match[2] || match[1];
          }
          break;
        }
      }

      if (detectedSubject || detectedGrade) {
        // Save subject and grade to session (for workflow, not school)
        const currentSession = sessionService.getSession();
        const newSession = {
          ...currentSession,
          subject: detectedSubject || currentSession.subject,
          grade: detectedGrade || currentSession.grade,
        };
        sessionService.saveSession(newSession);
        setWorkflowStep(2);

        // Respond with step 2
        setIsStreaming(true);
        setTimeout(() => {
          const assistantMessage: NewMessage = {
            id: `msg_${Date.now() + 1}`,
            role: "assistant",
            contentMd: prompts.workflow.step2,
            timestamp: Date.now() + 1000,
            streamed: true,
          };
          setCurrentMessages((prev) => [...prev, assistantMessage]);
          setIsStreaming(false);
        }, 600);
        return;
      }
    } else if (workflowStep === 2) {
      // Step 2: User provides chapter/topic
      const currentSession = sessionService.getSession();
      const newSession = {
        ...currentSession,
        topic: content,
      };
      sessionService.saveSession(newSession);
      setWorkflowStep(3);

      // Respond with step 3
      setIsStreaming(true);
      setTimeout(() => {
        const assistantMessage: NewMessage = {
          id: `msg_${Date.now() + 1}`,
          role: "assistant",
          contentMd: prompts.workflow.step3,
          timestamp: Date.now() + 1000,
          streamed: true,
        };
        setCurrentMessages((prev) => [...prev, assistantMessage]);
        setIsStreaming(false);
      }, 600);
      return;
    } else if (workflowStep === 3) {
      // Step 3: User provides specific problem - now generate actual response
      setWorkflowStep(null); // Clear workflow, proceed with normal chat
    }

    // Prepare API call data with role and context
    const session = sessionService.getSession();
    // Use conversationIdForChat if we just created a new conversation, otherwise use selectedConversationId
    const finalConversationId =
      conversationIdForChat || selectedConversationId || undefined;
    const apiData = {
      userInput: content,
      conversationId: finalConversationId, // Send conversationId to backend
      role: role, // Send role to backend
      schoolName: currentConversation?.schoolName || finalSchoolName, // School name from conversation
      grade: session.grade,
      subject: session.subject,
      topic: session.topic,
      previousChat: currentMessages.map((m) => ({
        user: m.role === "user" ? m.content : "",
        gemini: m.role === "assistant" ? m.contentMd : "",
      })),
    };

    // Call backend API to get response
    setIsStreaming(true);

    try {
      const response = await chatService.createChat(apiData);

      const assistantMessage: NewMessage = {
        id: response.message.id || `msg_${Date.now() + 1}`,
        role: "assistant",
        contentMd: response.message.contentMd || response.message.content,
        timestamp: response.message.timestamp || Date.now(),
        streamed: true,
      };

      setCurrentMessages((prev) => [...prev, assistantMessage]);
      if (selectedConversationId && currentConversation) {
        // Optimistic update + sync with backend
        addMessageToConversation(selectedConversationId, assistantMessage);
        updateConversation(selectedConversationId, {
          messages: [...currentConversation.messages, assistantMessage],
        }).catch((error) => {
          console.error(
            "Failed to update conversation with assistant message:",
            error
          );
        });
      }
    } catch (error: any) {
      console.error("Failed to get chat response:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to get response from chat API. Please try again.";

      // Create error message as assistant message
      const errorMessageObj: NewMessage = {
        id: `error_${Date.now()}`,
        role: "assistant",
        content: errorMessage,
        contentMd: errorMessage,
        timestamp: Date.now(),
        isError: true,
      };

      setCurrentMessages((prev) => [...prev, errorMessageObj]);
      toast.error(errorMessage);
    } finally {
      setIsStreaming(false);
    }
  };

  const handleStopStreaming = () => {
    setIsStreaming(false);
    toast.info("Stopped generating response");
  };

  const handleCopy = (_content: string) => {
    toast.success("Copied to clipboard");
  };

  const handleShare = (_messageId: string) => {
    // Share is handled in ShareModal component
  };

  const handleRegenerate = (messageId: string) => {
    const message = currentMessages.find((m) => m.id === messageId);
    if (!message || message.role !== "assistant") return;

    // Create a new variant
    const variantId = `var_${Date.now()}`;
    const newVariant = {
      id: variantId,
      contentMd: `Regenerated response for: "${message.contentMd?.slice(
        0,
        50
      )}..."`,
      timestamp: Date.now(),
    };

    // Update message with new variant
    setCurrentMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId
          ? {
              ...msg,
              variants: [...(msg.variants || []), newVariant],
              selectedVariantId: variantId,
            }
          : msg
      )
    );

    // Update conversation
    if (selectedConversationId && currentConversation) {
      const updatedMessages = currentConversation.messages.map((msg) =>
        msg.id === messageId
          ? {
              ...msg,
              variants: [...(msg.variants || []), newVariant],
              selectedVariantId: variantId,
            }
          : msg
      );
      updateLocal(selectedConversationId, { messages: updatedMessages });
      updateConversation(selectedConversationId, {
        messages: updatedMessages,
      }).catch((error) => console.error("Failed to update variant:", error));
    }

    toast.success("Response regenerated");
  };

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
    );
  };

  const handlePin = (messageId: string) => {
    setCurrentMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, pinned: !msg.pinned } : msg
      )
    );

    if (selectedConversationId && currentConversation) {
      const updatedMessages = currentConversation.messages.map((msg) =>
        msg.id === messageId ? { ...msg, pinned: !msg.pinned } : msg
      );
      updateLocal(selectedConversationId, { messages: updatedMessages });
      updateConversation(selectedConversationId, {
        messages: updatedMessages,
      }).catch((error) => console.error("Failed to update pin:", error));
    }

    toast.success("Message pinned");
  };

  const handleQuote = (_messageId: string, content: string) => {
    // This would insert quoted text into composer
    // For now, just show a toast
    toast.info(`Quoted: ${content.slice(0, 50)}...`);
  };

  const handleContinue = (messageId: string) => {
    const message = currentMessages.find((m) => m.id === messageId);
    if (!message) return;

    // Send a continue prompt
    handleSendMessage("Continue from where you left off");
    toast.info("Continuing response...");
  };

  const handleEdit = (messageId: string, newContent: string) => {
    // Update the message
    setCurrentMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId
          ? {
              ...msg,
              content: newContent,
              isEdited: true,
              originalContent: msg.originalContent || msg.content,
            }
          : msg
      )
    );

    // Resend with new content
    handleSendMessage(newContent);
    toast.success("Message edited and resent");
  };

  const handleSelectVariant = (messageId: string, variantId: string) => {
    setCurrentMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, selectedVariantId: variantId } : msg
      )
    );

    if (selectedConversationId && currentConversation) {
      const updatedMessages = currentConversation.messages.map((msg) =>
        msg.id === messageId ? { ...msg, selectedVariantId: variantId } : msg
      );
      updateLocal(selectedConversationId, { messages: updatedMessages });
      updateConversation(selectedConversationId, {
        messages: updatedMessages,
      }).catch((error) => console.error("Failed to update variant:", error));
    }
  };

  const handleFeedback = (
    messageId: string,
    feedback: {
      like?: boolean;
      dislike?: boolean;
      note?: string;
      reason?: string;
    }
  ) => {
    setCurrentMessages((prev) =>
      prev.map((msg) => (msg.id === messageId ? { ...msg, feedback } : msg))
    );

    if (selectedConversationId && currentConversation) {
      const updatedMessages = currentConversation.messages.map((msg) =>
        msg.id === messageId ? { ...msg, feedback } : msg
      );
      updateLocal(selectedConversationId, { messages: updatedMessages });
      updateConversation(selectedConversationId, {
        messages: updatedMessages,
      }).catch((error) => console.error("Failed to update feedback:", error));
    }

    toast.success("Feedback submitted. Thank you!");
  };

  const handleDeleteConversation = async (id: string) => {
    try {
      await deleteConversation(id);
      if (selectedConversationId === id) {
        handleNewChat();
      }
      toast.success("Conversation deleted");
    } catch (error) {
      console.error("Failed to delete conversation:", error);
      toast.error("Failed to delete conversation. Please try again.");
    }
  };

  const handlePinConversation = async (id: string) => {
    const conversation = conversations.find((c) => c.id === id);
    if (conversation) {
      try {
        await updateConversation(id, { pinned: !conversation.pinned });
      } catch (error) {
        console.error("Failed to pin conversation:", error);
        toast.error("Failed to update conversation. Please try again.");
      }
    }
  };

  const handleExport = () => {
    if (currentConversation) {
      setShowExportModal(true);
    } else {
      toast.error("No conversation to export");
    }
  };

  const handleToggleTool = (tool: keyof ConversationTools) => {
    setTools((prev) => ({
      ...prev,
      [tool]: !prev[tool],
    }));
  };

  const handleToggleMemory = () => {
    setMemoryEnabled((prev) => !prev);
  };

  const handleClearAllCache = () => {
    // Clear all user-related localStorage
    localStorage.removeItem("edu_chat_session");
    localStorage.removeItem("edu_chat_remember_school");
    localStorage.removeItem("conversations");
    localStorage.removeItem("mock_users");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("mock_user_email");
    localStorage.removeItem("plan");
    localStorage.removeItem("quota_used");

    // Clear all user-related sessionStorage
    const email = user?.email || localStorage.getItem("mock_user_email");
    if (email) {
      sessionStorage.removeItem(`user_settings_${email}`);
    }
    sessionStorage.removeItem("user_settings_guest");

    // Clear all sessionStorage keys that start with 'user_settings_'
    Object.keys(sessionStorage).forEach((key) => {
      if (key.startsWith("user_settings_")) {
        sessionStorage.removeItem(key);
      }
    });

    toast.success("All cache cleared! Page will reload.");

    // Clear Redux state by reloading page
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Global Error States */}
      <OfflineBanner />
      <NetworkErrorBanner
        show={showNetworkError}
        message={networkErrorMessage}
        onRetry={() => {
          setShowNetworkError(false);
          // Retry last action
          toast.info("Retrying...");
        }}
        onDismiss={() => setShowNetworkError(false)}
      />

      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar - hidden when not authenticated */}
        {isAuthenticated && (
          <div
            className={`fixed md:relative z-20 md:z-auto left-0 top-0 h-full transition-all duration-300 ease-out ${
              isSidebarCollapsed
                ? "w-[72px] -translate-x-full md:translate-x-0"
                : "w-[280px] translate-x-0"
            }`}
          >
            <Sidebar
              conversations={conversations}
              selectedConversationId={selectedConversationId}
              onSelectConversation={(id) => {
                handleSelectConversation(id);
                if (window.innerWidth < 768) {
                  setIsSidebarCollapsed(true);
                }
              }}
              onNewChat={() => {
                handleNewChat();
                if (window.innerWidth < 768) {
                  setIsSidebarCollapsed(true);
                }
              }}
              onDeleteConversation={handleDeleteConversation}
              onPinConversation={handlePinConversation}
              isCollapsed={isSidebarCollapsed}
              onToggleCollapse={() =>
                setIsSidebarCollapsed(!isSidebarCollapsed)
              }
              userName={userName}
              plan={plan}
            />
          </div>
        )}

        {/* Overlay for mobile */}
        {isAuthenticated && !isSidebarCollapsed && (
          <div
            className="absolute inset-0 bg-black/50 z-10 md:hidden backdrop-blur-sm"
            onClick={() => setIsSidebarCollapsed(true)}
          />
        )}

        {/* Main Chat Area */}
        <div
          className={`flex-1 flex flex-col overflow-hidden bg-background pb-24 md:pb-8 ${
            !isAuthenticated ? "px-4 md:px-6" : ""
          }`}
        >
          {/* Mobile menu button */}
          {isSidebarCollapsed && (
            <button
              onClick={() => setIsSidebarCollapsed(false)}
              className="absolute top-4 left-4 z-30 md:hidden p-2 rounded-lg bg-background border border-border hover:bg-accent transition-colors"
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
            onSettings={() => navigate("/settings")}
          />

          {/* Context selectors removed as requested */}

          {/* Chat Messages */}
          <ChatArea
            messages={currentMessages}
            conversationId={selectedConversationId || undefined}
            isStreaming={isStreaming}
            onCopy={handleCopy}
            onShare={handleShare}
            onRegenerate={handleRegenerate}
            onLike={handleLike}
            onPin={handlePin}
            onQuote={handleQuote}
            onContinue={handleContinue}
            onEdit={handleEdit}
            onSelectVariant={handleSelectVariant}
            onFeedback={handleFeedback}
            userName={userName}
            isAuthenticated={isAuthenticated}
          />

          {/* Composer and bottom elements container */}
          <div
            className="pb-20 md:pb-4"
            style={{
              paddingBottom: "max(5rem, env(safe-area-inset-bottom, 1.25rem))",
            }}
          >
            {/* Composer */}
            <Composer
              onSend={handleSendMessage}
              onStop={handleStopStreaming}
              isStreaming={isStreaming}
              disabled={false}
              tools={tools}
              memoryEnabled={memoryEnabled}
              enterToSend={enterToSend}
              role={role}
              onRoleChange={(newRole) => {
                setRole(newRole);
                // Save role to session for workflow
                const currentSession = sessionService.getSession();
                const updatedSession = { ...currentSession, role: newRole };
                sessionService.saveSession(updatedSession);
              }}
              compact={isAuthenticated && currentMessages.length === 0}
              onNewChat={handleNewChat}
              schoolName={currentConversation?.schoolName}
            />

            {/* Suggestions UNDER the chat box when no messages */}
            {isAuthenticated && currentMessages.length === 0 && (
              <div className="mx-auto max-w-[900px] px-6 mt-3 pb-4">
                <h3 className="text-xs font-medium text-muted-foreground mb-3 tracking-wide">
                  GET STARTED WITH AN EXAMPLE BELOW
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    {
                      text: "Write a to-do list for a personal project",
                      icon: (
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
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      ),
                    },
                    {
                      text: "Generate an email to reply to a job offer",
                      icon: (
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
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      ),
                    },
                    {
                      text: "Summarize this article in one paragraph",
                      icon: (
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
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                          />
                        </svg>
                      ),
                    },
                    {
                      text: "How does AI work in a technical capacity",
                      icon: (
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
                            d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                          />
                        </svg>
                      ),
                    },
                  ].map((suggestion, i) => (
                    <button
                      key={i}
                      onClick={() => handleSendMessage(suggestion.text)}
                      className="group relative p-4 rounded-xl bg-card border border-border hover:bg-accent hover:border-primary/50 transition-all text-left cursor-pointer"
                    >
                      <p className="text-sm text-foreground mb-3 pr-8">
                        {suggestion.text}
                      </p>
                      <div className="absolute bottom-3 left-4 text-muted-foreground group-hover:text-primary transition-colors">
                        {suggestion.icon}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
            {/* Quota indicator (only for authenticated users) */}
            {isAuthenticated && (
              <div className="px-6 py-2 pb-4 md:pb-2 text-xs text-muted-foreground text-center">
                {plan === "Free" ? (
                  <span>
                    {quotaRemaining} / 25 messages left.{" "}
                    <button
                      className="underline text-primary hover:text-primary/80"
                      onClick={() => setShowUpgrade(true)}
                    >
                      Upgrade
                    </button>
                  </span>
                ) : (
                  <span>Plan Go: Unlimited messages</span>
                )}
              </div>
            )}
          </div>
          <UpgradeModal
            open={showUpgrade}
            onClose={() => setShowUpgrade(false)}
            onUpgrade={() => {
              localStorage.setItem("plan", "Go");
              localStorage.removeItem("quota_used");
              setPlan("Go");
              setQuotaUsed(0);
              setShowUpgrade(false);
              toast.success("Upgraded to Go (mock)");
            }}
          />

          {/* Rate Limit Modal */}
          <RateLimitModal
            open={showRateLimit}
            onClose={() => setShowRateLimit(false)}
            onUpgrade={() => {
              setShowRateLimit(false);
              setShowUpgrade(true);
            }}
            plan={plan}
            remainingTime={3600}
          />

          {/* Export Modal */}
          <ExportModal
            open={showExportModal}
            onClose={() => setShowExportModal(false)}
            conversation={currentConversation || null}
          />

          {/* Command Palette */}
          <CommandPalette
            open={commandPaletteOpen}
            onClose={() => setCommandPaletteOpen(false)}
            onModelChange={setModel}
            onToggleTool={(tool: string) =>
              handleToggleTool(tool as keyof ConversationTools)
            }
            onToggleMemory={handleToggleMemory}
            onNewChat={handleNewChat}
            onSettings={() => navigate("/settings")}
            onExport={handleExport}
            conversations={conversations}
            onSelectConversation={handleSelectConversation}
          />

          {/* School Picker Modal */}
          <SchoolPickerModal
            open={showSchoolPicker}
            onClose={() => setShowSchoolPicker(false)}
            onSelect={handleSchoolSelect}
          />

          {/* Test Button - Clear Cache (Bottom Right) */}
          <div
            className="fixed right-4 z-50"
            style={{ bottom: "max(1rem, env(safe-area-inset-bottom, 1rem))" }}
          >
            <button
              onClick={handleClearAllCache}
              className="px-3 py-1.5 text-xs font-medium rounded-md bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-colors shadow-lg"
              title="Clear all cache and reload (for testing)"
            >
              🧪 Clear Cache
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
