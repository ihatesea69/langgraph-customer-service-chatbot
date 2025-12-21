"use client";

import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";

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
}

export default function Sidebar({
  conversations,
  activeId,
  onSelect,
  onNew,
  onDelete,
  isCollapsed,
  onToggle,
}: SidebarProps) {
  const { data: session } = useSession();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  if (isCollapsed) {
    return (
      <div className="w-0 md:w-16 bg-[#171717] border-r border-white/10 flex flex-col items-center py-3 transition-all duration-300">
        <button
          onClick={onToggle}
          className="p-2 hover:bg-white/10 rounded-lg mb-4"
          title="Open sidebar"
        >
          <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <button
          onClick={onNew}
          className="p-2 hover:bg-white/10 rounded-lg"
          title="New chat"
        >
          <svg className="w-5 h-5 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className="w-64 bg-[#171717] border-r border-white/10 flex flex-col h-full transition-all duration-300">
      {/* Header */}
      <div className="p-3 border-b border-white/10 flex items-center justify-between">
        <button
          onClick={onNew}
          className="flex-1 flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-white/90 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New chat
        </button>
        <button
          onClick={onToggle}
          className="ml-2 p-2 hover:bg-white/10 rounded-lg"
          title="Collapse sidebar"
        >
          <svg className="w-4 h-4 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto py-2">
        {conversations.length === 0 ? (
          <p className="px-3 py-4 text-sm text-white/40 text-center">
            No conversations yet
          </p>
        ) : (
          conversations.map((conv) => (
            <div
              key={conv.id}
              className={`group mx-2 mb-1 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                activeId === conv.id
                  ? "bg-white/10"
                  : "hover:bg-white/5"
              }`}
              onClick={() => onSelect(conv.id)}
              onMouseEnter={() => setHoveredId(conv.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/80 truncate flex-1">
                  {conv.title}
                </span>
                {hoveredId === conv.id && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(conv.id);
                    }}
                    className="p-1 hover:bg-white/10 rounded"
                    title="Delete"
                  >
                    <svg className="w-4 h-4 text-white/50 hover:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* User section */}
      {session?.user && (
        <div className="p-3 border-t border-white/10">
          <div className="flex items-center gap-2">
            {session.user.image && (
              <Image
                src={session.user.image}
                alt=""
                width={28}
                height={28}
                className="rounded-full"
              />
            )}
            <span className="flex-1 text-sm text-white/70 truncate">
              {session.user.name || session.user.email}
            </span>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="p-1 hover:bg-white/10 rounded"
              title="Sign out"
            >
              <svg className="w-4 h-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
