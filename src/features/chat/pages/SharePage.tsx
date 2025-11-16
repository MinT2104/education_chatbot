import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { conversationService } from "../services/conversationService";
import { chatService } from "../services/chatService";
import MessageBubble from "../components/MessageBubble";
import { NewMessage, Conversation } from "../types";
import LoadingScreen from "../../../components/LoadingScreen";
import { Button } from "@/components/ui/button";

const SharePage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<NewMessage[]>([]);
  const [conversation, setConversation] = useState<Conversation | null>(null);

  // Privacy options from URL params
  const hideUser = searchParams.get("hu") === "1";
  const hideAttachments = searchParams.get("ha") === "1";
  const hideMetadata = searchParams.get("hm") === "1";
  const messageId = searchParams.get("msg");
  const conversationId = searchParams.get("conv");

  useEffect(() => {
    const fetchSharedContent = async () => {
      try {
        setLoading(true);
        setError(null);

        if (messageId && conversationId) {
          // Fetch conversation and find the specific message
          const conv = await conversationService.getPublicConversation(conversationId);
          setConversation(conv);

          // Find the specific message
          const message = conv.messages.find((m) => m.id === messageId);
          if (message) {
            // Filter messages to show only up to and including the shared message
            const messageIndex = conv.messages.findIndex((m) => m.id === messageId);
            setMessages(conv.messages.slice(0, messageIndex + 1));
          } else {
            setError("Message not found");
          }
        } else if (conversationId) {
          // Fetch entire conversation
          const conv = await conversationService.getPublicConversation(conversationId);
          setConversation(conv);
          setMessages(conv.messages);
        } else if (messageId) {
          // Try to fetch from chat history
          try {
            const chatHistory = await chatService.getChatDetail(messageId);
            // Convert chat history format to messages format if needed
            // This depends on your chat history structure
            setError("Single message sharing from chat history not yet supported");
          } catch (err) {
            setError("Message not found");
          }
        } else {
          setError("Invalid share link. Missing message or conversation ID.");
        }
      } catch (err: any) {
        console.error("Error fetching shared content:", err);
        setError(
          err.response?.status === 404
            ? "Shared content not found or no longer available"
            : "Failed to load shared content"
        );
      } finally {
        setLoading(false);
      }
    };

    if (messageId || conversationId) {
      fetchSharedContent();
    } else {
      setError("Invalid share link");
      setLoading(false);
    }
  }, [messageId, conversationId]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-4">
          <h1 className="text-2xl font-bold text-foreground">Error</h1>
          <p className="text-muted-foreground">{error}</p>
          <Button onClick={() => navigate("/")} variant="outline">
            Go to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-background/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-foreground">
              {conversation?.title || "Shared Conversation"}
            </h1>
            {!hideMetadata && conversation && (
              <p className="text-sm text-muted-foreground">
                Shared on {new Date(conversation.updatedAt).toLocaleDateString()}
              </p>
            )}
          </div>
          <Button onClick={() => navigate("/")} variant="outline" size="sm">
            Try It Yourself
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-4">
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              hideUser={hideUser}
              hideAttachments={hideAttachments}
              hideMetadata={hideMetadata}
              isSharedView={true}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SharePage;

