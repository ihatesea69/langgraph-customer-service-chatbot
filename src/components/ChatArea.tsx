"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp?: number;
}

interface ChatAreaProps {
  messages: Message[];
  isLoading: boolean;
  remainingTokens: number | null;
  onSendMessage: (message: string) => void;
}

function formatTime(timestamp?: number) {
  if (!timestamp) return "";
  return new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function ChatArea({
  messages,
  isLoading,
  remainingTokens,
  onSendMessage,
}: ChatAreaProps) {
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState<Record<string, "up" | "down" | null>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + "px";
    }
  }, [input]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input.trim());
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleFeedback = (id: string, type: "up" | "down") => {
    setFeedback((prev) => ({ ...prev, [id]: prev[id] === type ? null : type }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#212121] h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center max-w-lg mx-auto px-6">
              <div className="w-16 h-16 mx-auto mb-8 bg-white rounded-2xl flex items-center justify-center">
                <span className="text-3xl font-bold text-black">H</span>
              </div>
              <h1 className="text-3xl font-bold text-white mb-4">How can I help you today?</h1>
              <p className="text-white/50 text-lg mb-8">
                I can help with coding, debugging, architecture, and more.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  "Explain React hooks",
                  "Debug my code",
                  "Best practices for APIs",
                  "Optimize performance",
                ].map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => onSendMessage(prompt)}
                    className="p-4 text-left text-sm text-white/70 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="py-6">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`group px-4 py-6 ${msg.role === "user" ? "" : "bg-[#2a2a2a]"}`}
              >
                <div className="flex gap-4 max-w-3xl mx-auto">
                  {/* Avatar */}
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    msg.role === "user"
                      ? "bg-gray-600"
                      : "bg-white"
                  }`}>
                    {msg.role === "user" ? (
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                      </svg>
                    ) : (
                      <span className="text-lg font-bold text-black">H</span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-white/90">
                        {msg.role === "user" ? "You" : "HieuNghiGPT"}
                      </span>
                      {msg.timestamp && (
                        <span className="text-xs text-white/30">{formatTime(msg.timestamp)}</span>
                      )}
                    </div>
                    <div className="text-white/80 whitespace-pre-wrap leading-relaxed">{msg.content}</div>

                    {/* Actions for assistant messages */}
                    {msg.role === "assistant" && (
                      <div className="flex items-center gap-1 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => copyToClipboard(msg.content)}
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                          title="Copy"
                        >
                          <svg className="w-4 h-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleFeedback(msg.id, "up")}
                          className={`p-2 hover:bg-white/10 rounded-lg transition-colors ${feedback[msg.id] === "up" ? "bg-white/10" : ""}`}
                          title="Good response"
                        >
                          <svg className={`w-4 h-4 ${feedback[msg.id] === "up" ? "text-emerald-400" : "text-white/50"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleFeedback(msg.id, "down")}
                          className={`p-2 hover:bg-white/10 rounded-lg transition-colors ${feedback[msg.id] === "down" ? "bg-white/10" : ""}`}
                          title="Bad response"
                        >
                          <svg className={`w-4 h-4 ${feedback[msg.id] === "down" ? "text-red-400" : "text-white/50"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isLoading && (
              <div className="px-4 py-6 bg-[#2a2a2a]">
                <div className="flex gap-4 max-w-3xl mx-auto">
                  <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center flex-shrink-0">
                    <span className="text-lg font-bold text-black">H</span>
                  </div>
                  <div className="flex items-center gap-1 py-3">
                    <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="border-t border-white/10 bg-[#212121] p-4">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Message HieuNghiGPT..."
              rows={1}
              disabled={isLoading || remainingTokens === 0}
              className="w-full bg-[#2f2f2f] border border-white/10 rounded-2xl px-5 py-4 pr-14 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent resize-none disabled:opacity-50 transition-all"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading || remainingTokens === 0}
              className="absolute right-3 bottom-3 p-2 bg-white hover:bg-gray-200 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed disabled:bg-white/10 transition-all"
            >
              <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </button>
          </form>
          {remainingTokens !== null && (
            <div className="flex items-center justify-center gap-2 mt-3">
              <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all"
                  style={{ width: `${Math.min((remainingTokens / 10000) * 100, 100)}%` }}
                />
              </div>
              <span className="text-xs text-white/30">{remainingTokens.toLocaleString()} tokens left</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
