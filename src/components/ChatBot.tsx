import { useState, useEffect, useRef } from "react";
import { Button, Input } from "./ui/components";
import { Loader2 } from "lucide-react";
import { chatbotAPI } from "../lib/api";
import { useAuth } from "../lib/AuthContext";

interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
}

interface ChatMessageResponse {
  id: string;
  userId: string;
  content: string;
  isUserMessage: boolean;
  createdAt: string;
}

export const ChatBot = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chat history when component mounts
  useEffect(() => {
    const loadChatHistory = async () => {
      if (!user) return;

      try {
        setIsLoading(true);
        const history = await chatbotAPI.getChatHistory();

        if (history && history.length > 0) {
          const formattedMessages: Message[] = history.map(
            (msg: ChatMessageResponse) => ({
              id: msg.id,
              content: msg.content,
              sender: msg.isUserMessage ? "user" : "bot",
              timestamp: new Date(msg.createdAt),
            })
          );
          setMessages(formattedMessages);
        } else {
          // Add welcome message if no history exists
          const welcomeMessage: Message = {
            id: "welcome",
            content:
              "Hi there! I'm your Bucket List Assistant. I can help you with your bucket list, give suggestions, or answer questions about the app. How can I help you today?",
            sender: "bot",
            timestamp: new Date(),
          };
          setMessages([welcomeMessage]);
        }
      } catch (error) {
        console.error("Failed to load chat history:", error);
        // Fallback welcome message on error
        const welcomeMessage: Message = {
          id: "welcome",
          content:
            "Hi there! I'm your Bucket List Assistant. I can help you with your bucket list, give suggestions, or answer questions about the app. How can I help you today?",
          sender: "bot",
          timestamp: new Date(),
        };
        setMessages([welcomeMessage]);
      } finally {
        setIsLoading(false);
        setIsInitialLoad(false);
      }
    };

    loadChatHistory();
  }, [user]);

  useEffect(() => {
    // Scroll to bottom whenever messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !user) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Send message to backend API which connects to Gemini
      const response = await chatbotAPI.sendMessage(input);

      if (response && response.message) {
        const botMessage: Message = {
          id: response.aiMessageId || (Date.now() + 1).toString(),
          content: response.message,
          sender: "bot",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        throw new Error("Invalid response from chatbot API");
      }
    } catch (error) {
      console.error("Failed to get chatbot response:", error);

      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content:
          "Sorry, I'm having trouble connecting right now. Please try again later.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to clear chat history
  const clearChatHistory = async () => {
    if (!user) return;

    try {
      await chatbotAPI.clearChatHistory();

      // Reset to welcome message
      const welcomeMessage: Message = {
        id: "welcome",
        content:
          "Hi there! I'm your Bucket List Assistant. I can help you with your bucket list, give suggestions, or answer questions about the app. How can I help you today?",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    } catch (error) {
      console.error("Failed to clear chat history:", error);
    }
  };

  if (isInitialLoad) {
    return (
      <div className="loading-container">
        <Loader2 className="loader" />
      </div>
    );
  }

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <span className="chatbot-title">Chat History</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearChatHistory}
          className="btn-small-text"
        >
          Clear
        </Button>
      </div>

      <div className="chatbot-messages custom-scrollbar">
        {messages.map((message) => (
          <div
            key={message.id}
            className={
              message.sender === "user"
                ? "chatbot-message user"
                : "chatbot-message bot"
            }
          >
            <div className="message-content">
              <p className="message-text">{message.content}</p>
              <p className="message-time">
                {message.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="chatbot-message bot">
            <div className="message-loading">
              <Loader2 className="loader-small" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSendMessage} className="chatbot-form">
        <div className="chatbot-input-container">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
            className="chatbot-input"
          />
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="chatbot-send-button"
          >
            Send
          </Button>
        </div>
      </form>
    </div>
  );
};
