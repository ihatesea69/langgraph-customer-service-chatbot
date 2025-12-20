interface MessageBubbleProps {
  role: "user" | "assistant";
  content: string;
}

export default function MessageBubble({ role, content }: MessageBubbleProps) {
  const isUser = role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          isUser
            ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
            : "bg-white/10 text-slate-200"
        }`}
      >
        <div className="text-sm whitespace-pre-wrap leading-relaxed">
          {content}
        </div>
      </div>
    </div>
  );
}
