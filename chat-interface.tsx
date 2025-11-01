"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Bot, User, Loader2, X, Minimize2 } from "lucide-react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface ChatInterfaceProps {
  onClose?: () => void;
}

export default function EnhancedChatInterface({ onClose }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hi Mohammad Zaid! I'm FitBot, your AI fitness companion. I'm here to help you with workouts, nutrition, form tips, and motivation. What would you like to know?",
      timestamp: new Date(),
    },
    {
      id: "2",
      role: "user",
      content: "What should I eat for muscle gain?",
      timestamp: new Date(),
    },
    {
      id: "3",
      role: "assistant",
      content: "That's an excellent question, Mohammad Zaid! Building muscle on a vegan diet is absolutely achievable, and we'll focus on nutrient-dense, heart-healthy options to support your goal while keeping your heart condition in mind.",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
        }),
      });

      if (!response.ok) throw new Error("Failed to get response");
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          assistantMessage.content += chunk;
          setMessages((prev) =>
            prev.map((msg) => (msg.id === assistantMessage.id ? { ...msg, content: assistantMessage.content } : msg))
          );
        }
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Sorry, I'm having trouble connecting right now. Please try again in a moment.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  const quickQuestions = [
    "Create a workout plan for me",
    "What should I eat for muscle gain?",
    "How do I improve my squat form?",
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="w-full max-w-2xl h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-green-700 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
              <Bot className="w-5 h-5 text-green-700" />
            </div>
            <h2 className="text-lg font-semibold">FitBot</h2>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-white/20 rounded-lg transition-colors">
              <Minimize2 className="w-4 h-4" />
            </button>
            <button className="p-2 hover:bg-white/20 rounded-lg transition-colors" onClick={onClose} aria-label="Close chat">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div 
          ref={scrollAreaRef}
          className="flex-1 overflow-y-auto px-4 py-4 bg-gray-50"
        >
          <div className="space-y-4 max-w-full">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 items-start ${
                  message.role === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                {/* Avatar */}
                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-white shadow-sm">
                  {message.role === "assistant" ? (
                    <Bot className="w-4 h-4 text-green-700" />
                  ) : (
                    <User className="w-4 h-4 text-gray-700" />
                  )}
                </div>

                {/* Message Bubble */}
                <div className="flex flex-col max-w-[75%]">
                  <div
                    className={`rounded-2xl px-4 py-3 shadow-sm ${
                      message.role === "user"
                        ? "bg-green-600 text-white rounded-tr-sm"
                        : "bg-white text-gray-900 rounded-tl-sm"
                    }`}
                  >
                    <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">
                      {message.content}
                    </p>
                  </div>
                  <span className={`text-xs text-gray-500 mt-1 px-2 ${
                    message.role === "user" ? "text-right" : "text-left"
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: "2-digit", 
                      minute: "2-digit" 
                    })}
                  </span>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3 items-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-white shadow-sm">
                  <Bot className="w-4 h-4 text-green-700" />
                </div>
                <div className="bg-white rounded-2xl px-4 py-3 shadow-sm rounded-tl-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Typing...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Questions */}
        {messages.length <= 3 && (
          <div className="px-4 py-3 bg-white border-t border-gray-200">
            <p className="text-xs text-gray-500 mb-2">Quick questions:</p>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((question) => (
                <button
                  key={question}
                  onClick={() => setInput(question)}
                  className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="px-4 py-4 bg-white border-t border-gray-200">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything about fitness..."
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="w-11 h-11 flex-shrink-0 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-full flex items-center justify-center text-white transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}