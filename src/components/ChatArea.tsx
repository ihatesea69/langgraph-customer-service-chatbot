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
  return new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

const quickActions = [
  { icon: "🦴", label: "Tôi bị đau lưng, nên làm gì?" },
  { icon: "🕐", label: "Giờ làm việc của phòng khám" },
  { icon: "📅", label: "Đặt lịch hẹn khám" },
  { icon: "👨‍⚕️", label: "Thông tin các bác sĩ" },
];

export default function ChatArea({
  messages,
  isLoading,
  remainingTokens,
  onSendMessage,
}: ChatAreaProps) {
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState<Record<string, "up" | "down" | null>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 200) + "px";
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

  const copyToClipboard = async (id: string, text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const tokenPct =
    remainingTokens !== null
      ? Math.min((remainingTokens / 10000) * 100, 100)
      : null;

  return (
    <div className="flex-1 flex flex-col bg-[#2f3136] h-full min-w-0">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#3f424a] flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#10a37f] rounded-[10px] flex items-center justify-center shadow-md shadow-[#10a37f]/20">
            <span className="text-white font-bold text-sm leading-none">B</span>
          </div>
          <div>
            <h1 className="text-[#eeeeee] font-bold text-base leading-tight">
              BONEDOC
            </h1>
            <p className="text-[rgba(171,171,171,0.6)] text-xs">
              Tư vấn xương khớp AI
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Search */}
          <button
            title="Tìm kiếm"
            className="w-9 h-9 rounded-[10px] flex items-center justify-center hover:bg-[#3f424a] transition-colors"
          >
            <svg
              className="w-4 h-4 text-[#ababab]"
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
          </button>
          {/* Kebab */}
          <button
            title="Tùy chọn"
            className="w-9 h-9 rounded-[10px] flex items-center justify-center hover:bg-[#3f424a] transition-colors"
          >
            <svg
              className="w-4 h-4 text-[#ababab]"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="5" r="1.5" />
              <circle cx="12" cy="12" r="1.5" />
              <circle cx="12" cy="19" r="1.5" />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          /* ── Welcome Screen ── */
          <div className="h-full flex items-center justify-center px-6">
            <div className="text-center max-w-lg mx-auto w-full">
              <div className="w-20 h-20 mx-auto mb-6 bg-[#10a37f] rounded-[22px] flex items-center justify-center shadow-xl shadow-[#10a37f]/30">
                <span className="text-4xl font-bold text-white leading-none">
                  B
                </span>
              </div>
              <h2 className="text-[#eeeeee] text-2xl font-bold mb-3">
                Xin chào! Tôi có thể giúp gì cho bạn?
              </h2>
              <p className="text-[#ababab] text-sm mb-8 leading-relaxed">
                Tôi là trợ lý AI của Phòng khám BONEDOC. Hãy hỏi tôi về triệu
                chứng, dịch vụ hoặc đặt lịch hẹn.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action) => (
                  <button
                    key={action.label}
                    onClick={() => onSendMessage(action.label)}
                    className="p-4 text-left bg-[#3f424a] hover:bg-[#4b4f5b] border border-[#4b4f5b] hover:border-[#10a37f]/40 rounded-[14px] transition-all duration-150 group"
                  >
                    <span className="block text-xl mb-2">{action.icon}</span>
                    <span className="text-sm text-[#d0d0d0] group-hover:text-[#eeeeee] transition-colors leading-snug">
                      {action.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* ── Message Thread ── */
          <div className="py-4">
            {messages.map((msg, index) => {
              const isUser = msg.role === "user";
              const showDateDivider =
                index === 0 ||
                (messages[index - 1]?.timestamp &&
                  msg.timestamp &&
                  new Date(messages[index - 1].timestamp!).toDateString() !==
                    new Date(msg.timestamp).toDateString());

              return (
                <div key={msg.id}>
                  {/* Date divider */}
                  {showDateDivider && msg.timestamp && (
                    <div className="flex items-center gap-3 px-6 my-4">
                      <div className="flex-1 h-px bg-[#3f424a]" />
                      <span className="text-[rgba(171,171,171,0.6)] text-xs">
                        {new Date(msg.timestamp).toLocaleDateString([], {
                          weekday: "long",
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                      <div className="flex-1 h-px bg-[#3f424a]" />
                    </div>
                  )}

                  <div
                    className={`group px-6 py-3 ${
                      isUser ? "" : "hover:bg-[#282a2e]/40"
                    }`}
                  >
                    <div className="flex gap-4 max-w-3xl mx-auto">
                      {/* Avatar */}
                      <div
                        className={`w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0 ${
                          isUser
                            ? "bg-[#4b4f5b]"
                            : "bg-[#10a37f] shadow-md shadow-[#10a37f]/20"
                        }`}
                      >
                        {isUser ? (
                          <svg
                            className="w-5 h-5 text-[#ababab]"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                          </svg>
                        ) : (
                          <span className="text-white font-bold text-base leading-none">
                            B
                          </span>
                        )}
                      </div>

                      {/* Bubble + content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-sm text-[#eeeeee]">
                            {isUser ? "Bạn" : "BONEDOC"}
                          </span>
                          {msg.timestamp && (
                            <span className="text-[rgba(171,171,171,0.6)] text-xs">
                              {formatTime(msg.timestamp)}
                            </span>
                          )}
                        </div>

                        {/* Message bubble */}
                        <div
                          className={`inline-block max-w-full rounded-[16px] px-4 py-3 ${
                            isUser
                              ? "bg-[#4b4f5b] text-[#eeeeee]"
                              : "bg-[#28303f] text-[#eeeeee]"
                          }`}
                        >
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">
                            {msg.content}
                          </p>
                        </div>

                        {/* Actions (AI messages) */}
                        {!isUser && (
                          <div className="flex items-center gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            {/* Copy */}
                            <button
                              onClick={() =>
                                copyToClipboard(msg.id, msg.content)
                              }
                              title="Sao chép"
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1e1f22] hover:bg-[#3f424a] rounded-[10px] transition-colors"
                            >
                              {copiedId === msg.id ? (
                                <svg
                                  className="w-3.5 h-3.5 text-[#23c69e]"
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
                                  className="w-3.5 h-3.5 text-[#ababab]"
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
                              <span className="text-[#ababab] text-xs">
                                {copiedId === msg.id ? "Đã sao chép" : "Copy"}
                              </span>
                            </button>

                            {/* Thumbs up */}
                            <button
                              onClick={() => handleFeedback(msg.id, "up")}
                              title="Phản hồi tốt"
                              className={`w-8 h-8 rounded-[10px] flex items-center justify-center transition-colors ${
                                feedback[msg.id] === "up"
                                  ? "bg-[#10a37f]/20"
                                  : "bg-[#1e1f22] hover:bg-[#3f424a]"
                              }`}
                            >
                              <svg
                                className={`w-3.5 h-3.5 ${
                                  feedback[msg.id] === "up"
                                    ? "text-[#23c69e]"
                                    : "text-[#ababab]"
                                }`}
                                fill={
                                  feedback[msg.id] === "up"
                                    ? "currentColor"
                                    : "none"
                                }
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

                            {/* Thumbs down */}
                            <button
                              onClick={() => handleFeedback(msg.id, "down")}
                              title="Phản hồi chưa tốt"
                              className={`w-8 h-8 rounded-[10px] flex items-center justify-center transition-colors ${
                                feedback[msg.id] === "down"
                                  ? "bg-red-500/20"
                                  : "bg-[#1e1f22] hover:bg-[#3f424a]"
                              }`}
                            >
                              <svg
                                className={`w-3.5 h-3.5 ${
                                  feedback[msg.id] === "down"
                                    ? "text-red-400"
                                    : "text-[#ababab]"
                                }`}
                                fill={
                                  feedback[msg.id] === "down"
                                    ? "currentColor"
                                    : "none"
                                }
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5"
                                />
                              </svg>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Typing indicator */}
            {isLoading && (
              <div className="px-6 py-3">
                <div className="flex gap-4 max-w-3xl mx-auto">
                  <div className="w-9 h-9 rounded-[10px] bg-[#10a37f] flex items-center justify-center flex-shrink-0 shadow-md shadow-[#10a37f]/20">
                    <span className="text-white font-bold text-base leading-none">
                      B
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold text-sm text-[#eeeeee]">
                        BONEDOC
                      </span>
                    </div>
                    <div className="inline-flex items-center gap-1.5 bg-[#28303f] rounded-[16px] px-4 py-3">
                      <span
                        className="w-2 h-2 bg-[#23c69e] rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      />
                      <span
                        className="w-2 h-2 bg-[#23c69e] rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      />
                      <span
                        className="w-2 h-2 bg-[#23c69e] rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* ── Input Area ── */}
      <div className="px-6 py-4 border-t border-[#3f424a] bg-[#282a2e] flex-shrink-0">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit}>
            <div className="relative bg-[#4b4f5b] rounded-[16px] shadow-lg shadow-[#1e1f22]/40 overflow-hidden">
              {/* Magic wand / attachment icon */}
              <button
                type="button"
                title="Công cụ hỗ trợ"
                className="absolute left-3 bottom-3 w-8 h-8 rounded-[10px] flex items-center justify-center hover:bg-[#3f424a] transition-colors"
              >
                <svg
                  className="w-4 h-4 text-[#ababab]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 3l14 9-14 9V3z"
                  />
                </svg>
              </button>

              {/* Textarea */}
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Nhập câu hỏi của bạn, hoặc nhấn '/' để chọn lệnh..."
                rows={1}
                disabled={isLoading || remainingTokens === 0}
                className="w-full bg-transparent pl-14 pr-14 py-4 text-[#eeeeee] placeholder-[#a0a7bb] text-sm outline-none resize-none disabled:opacity-50 leading-relaxed"
              />

              {/* Send button */}
              <button
                type="submit"
                disabled={!input.trim() || isLoading || remainingTokens === 0}
                title="Gửi"
                className="absolute right-3 bottom-3 w-8 h-8 bg-[#10a37f] hover:bg-[#0e9070] disabled:bg-[#3f424a] disabled:opacity-40 rounded-[10px] flex items-center justify-center transition-all shadow-md shadow-[#10a37f]/30 disabled:shadow-none"
              >
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M5 10l7-7m0 0l7 7m-7-7v18"
                  />
                </svg>
              </button>
            </div>
          </form>

          {/* Token usage */}
          {tokenPct !== null && (
            <div className="flex items-center justify-center gap-2 mt-3">
              <div className="w-20 h-1 bg-[#3f424a] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    tokenPct < 20 ? "bg-red-400" : "bg-[#23c69e]"
                  }`}
                  style={{ width: `${tokenPct}%` }}
                />
              </div>
              <span className="text-[rgba(171,171,171,0.6)] text-xs">
                {remainingTokens!.toLocaleString()} tokens còn lại
              </span>
            </div>
          )}

          <p className="text-center text-[rgba(171,171,171,0.4)] text-[11px] mt-3">
            Hotline: (+84) 090-3931-868 · bonedoc.vn
          </p>
        </div>
      </div>
    </div>
  );
}
