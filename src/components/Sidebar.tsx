"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Conversation {
  id: string;
  title: string;
  updatedAt: number;
}

interface SidebarProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  isCollapsed: boolean;
  onToggle: () => void;
  userName: string;
}

function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  if (days === 1) return "Yesterday";
  if (days < 7)
    return new Date(timestamp).toLocaleDateString([], { weekday: "short" });
  return new Date(timestamp).toLocaleDateString([], {
    day: "numeric",
    month: "short",
  });
}

export default function Sidebar({
  conversations,
  activeId,
  onSelect,
  onNew,
  onDelete,
  isCollapsed,
  onToggle,
  userName,
}: SidebarProps) {
  const router = useRouter();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  };

  const filteredConversations = conversations.filter((conv) =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-full flex-shrink-0">
      {/* ── Left Icon Panel ── */}
      <div className="w-16 bg-[#1e1f22] flex flex-col items-center py-4 gap-1 rounded-tl-[20px] rounded-bl-[20px]">
        {/* Logo */}
        <div className="w-10 h-10 bg-[#10a37f] rounded-[12px] flex items-center justify-center mb-4 shadow-lg shadow-[#10a37f]/20">
          <span className="text-white font-bold text-lg leading-none">B</span>
        </div>

        {/* Nav: Chat (active) */}
        <div className="relative w-full flex justify-center py-1">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#23c69e] rounded-r-full" />
          <button
            onClick={onToggle}
            title={isCollapsed ? "Mở My Chats" : "Thu gọn My Chats"}
            className="w-10 h-10 bg-[#282a2e] rounded-[12px] flex items-center justify-center hover:bg-[#3f424a] transition-colors"
          >
            <svg
              className="w-5 h-5 text-[#23c69e]"
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
          </button>
        </div>

        {/* Nav: New Chat */}
        <button
          onClick={onNew}
          title="Hội thoại mới"
          className="w-10 h-10 rounded-[12px] flex items-center justify-center hover:bg-[#282a2e] transition-colors group"
        >
          <svg
            className="w-5 h-5 text-[#ababab] group-hover:text-[#eeeeee] transition-colors"
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

        {/* Nav: Explore */}
        <button
          title="Khám phá"
          className="w-10 h-10 rounded-[12px] flex items-center justify-center hover:bg-[#282a2e] transition-colors group"
        >
          <svg
            className="w-5 h-5 text-[#ababab] group-hover:text-[#eeeeee] transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
            />
          </svg>
        </button>

        {/* Nav: Settings */}
        <button
          title="Cài đặt"
          className="w-10 h-10 rounded-[12px] flex items-center justify-center hover:bg-[#282a2e] transition-colors group"
        >
          <svg
            className="w-5 h-5 text-[#ababab] group-hover:text-[#eeeeee] transition-colors"
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

        {/* Spacer */}
        <div className="flex-1" />

        {/* Divider */}
        <div className="w-8 h-px bg-[#3f424a] mb-2" />

        {/* User avatar */}
        <div className="relative mb-1">
          <div className="w-10 h-10 bg-[#10a37f] rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">
              {userName.charAt(0).toUpperCase()}
            </span>
          </div>
          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-white text-black text-[8px] font-bold px-1 rounded leading-[14px]">
            PRO
          </span>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          title="Đăng xuất"
          className="w-10 h-10 rounded-[12px] flex items-center justify-center hover:bg-[#282a2e] transition-colors group mt-1"
        >
          <svg
            className="w-5 h-5 text-[#ababab] group-hover:text-red-400 transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
        </button>
      </div>

      {/* ── Conversations Panel ── */}
      <div
        className={`flex flex-col h-full bg-[#282a2e] border-r border-[#3f424a] overflow-hidden transition-all duration-300 ${
          isCollapsed ? "w-0 opacity-0" : "w-72 opacity-100"
        }`}
      >
        {/* Header */}
        <div className="px-5 pt-5 pb-4 flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[#eeeeee] text-xl font-bold">My Chats</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={onNew}
                title="Hội thoại mới"
                className="w-9 h-9 bg-[#10a37f] rounded-[10px] flex items-center justify-center hover:bg-[#0e9070] transition-colors shadow-md shadow-[#10a37f]/20"
              >
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </button>
              <button
                title="Tùy chọn"
                className="w-9 h-9 rounded-[10px] flex items-center justify-center hover:bg-[#3f424a] transition-colors"
              >
                <svg
                  className="w-5 h-5 text-[#ababab]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <circle cx="5" cy="12" r="1.5" />
                  <circle cx="12" cy="12" r="1.5" />
                  <circle cx="19" cy="12" r="1.5" />
                </svg>
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-[#3f424a] rounded-[12px] p-1 flex gap-1">
            <button className="flex-1 bg-[#1e1f22] rounded-[10px] py-2 flex items-center justify-center gap-2 transition-all">
              <svg
                className="w-4 h-4 text-[#23c69e]"
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
              <span className="text-[#23c69e] text-xs font-semibold tracking-wide">
                CHATS
              </span>
              {conversations.length > 0 && (
                <span className="bg-[rgba(16,163,127,0.15)] text-[#23c69e] text-[10px] font-bold px-1.5 py-0.5 rounded-[6px] min-w-[20px] text-center">
                  {conversations.length}
                </span>
              )}
            </button>
            <button className="flex-1 py-2 flex items-center justify-center gap-2 hover:bg-[#3f424a]/50 rounded-[10px] transition-all">
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
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
              <span className="text-[#ababab] text-xs font-semibold tracking-wide">
                SAVED
              </span>
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="px-4 pb-3 flex gap-2 flex-shrink-0">
          <div className="flex-1 relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#575b65]"
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
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-full bg-[#3f424a]/40 border border-[#3f424a] rounded-[12px] py-2.5 pl-10 pr-4 text-[#ababab] placeholder-[#575b65] text-sm outline-none focus:border-[#10a37f] focus:bg-[#3f424a]/60 transition-all"
            />
          </div>
          <button
            title="Lọc"
            className="w-10 h-10 bg-[#3f424a] rounded-[12px] flex items-center justify-center hover:bg-[#4b4f5b] transition-colors flex-shrink-0"
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
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z"
              />
            </svg>
          </button>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto px-3 pb-4">
          {filteredConversations.length === 0 ? (
            <div className="py-10 text-center">
              <div className="w-12 h-12 mx-auto mb-3 bg-[#3f424a] rounded-[14px] flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-[#ababab]"
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
              </div>
              <p className="text-sm text-[#ababab]">
                {searchQuery ? "Không tìm thấy" : "Chưa có cuộc hội thoại"}
              </p>
              {!searchQuery && (
                <p className="text-xs text-[rgba(171,171,171,0.6)] mt-1">
                  Bắt đầu tư vấn ngay!
                </p>
              )}
            </div>
          ) : (
            filteredConversations.map((conv) => (
              <div
                key={conv.id}
                className={`group relative px-4 py-4 rounded-[12px] mb-1 cursor-pointer transition-all duration-150 ${
                  activeId === conv.id
                    ? "bg-[#1e1f22] shadow-sm"
                    : "hover:bg-[#3f424a]/30"
                }`}
                onClick={() => onSelect(conv.id)}
                onMouseEnter={() => setHoveredId(conv.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div className="w-6 h-6 flex-shrink-0 mt-0.5 flex items-center justify-center">
                    <svg
                      className={`w-4 h-4 transition-colors ${
                        activeId === conv.id
                          ? "text-[#23c69e]"
                          : "text-[#575b65]"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                      />
                    </svg>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p
                        className={`text-sm font-semibold leading-tight truncate transition-colors ${
                          activeId === conv.id
                            ? "text-[#eeeeee]"
                            : "text-[#d0d0d0]"
                        }`}
                      >
                        {conv.title}
                      </p>
                      <span className="text-[rgba(171,171,171,0.6)] text-[11px] flex-shrink-0 mt-0.5">
                        {formatRelativeTime(conv.updatedAt)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Delete button on hover */}
                {hoveredId === conv.id && activeId !== conv.id && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(conv.id);
                    }}
                    title="Xóa"
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 bg-[#3f424a] hover:bg-red-500/20 rounded-[8px] flex items-center justify-center transition-colors"
                  >
                    <svg
                      className="w-3.5 h-3.5 text-[#ababab] hover:text-red-400"
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
            ))
          )}
        </div>
      </div>
    </div>
  );
}
