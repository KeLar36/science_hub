import React from "react";
import { MessageSquare, Share2, Bookmark } from "lucide-react";
import toast from "react-hot-toast";

export default function PostActions({
  post,
  commentsCount,
  isBookmarked,
  saving,
  onReaction,
  onBookmark,
  onOpenComments,
}) {
  return (
    <div className="p-6 sm:p-10 md:p-12 bg-gradient-to-b from-transparent to-purple-600/[0.03] border-t border-[var(--border-color)] flex flex-col items-center gap-6 w-full">
      <div className="flex flex-wrap justify-center gap-2 w-full">
        {[
          { e: "🔥", l: "fire" },
          { e: "❤️", l: "heart" },
          { e: "👏", l: "clap" },
          { e: "💡", l: "idea" },
        ].map((item) => (
          <button
            key={item.l}
            onClick={() => onReaction(item.l)}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl hover:border-purple-500/30 transition-all active:scale-95 group cursor-pointer"
          >
            <span className="text-base group-hover:scale-110 transition-transform">
              {item.e}
            </span>
            <span className="text-xs font-black text-[var(--text-dark)]">
              {Array.isArray(post.reactions?.[item.l])
                ? post.reactions[item.l].length
                : post.reactions?.[item.l] || 0}
            </span>
          </button>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 w-full justify-center pt-2">
        <button
          onClick={onOpenComments}
          className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3.5 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-purple-600/10 flex items-center justify-center gap-2 italic transition-all cursor-pointer"
        >
          <MessageSquare size={14} /> Обговорення ({commentsCount})
        </button>

        <button
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            toast.success("Посилання скопійовано! 💜");
          }}
          className="px-6 py-3.5 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl text-xs font-bold uppercase tracking-wider text-[var(--text-gray)] hover:text-purple-600 hover:border-purple-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Share2 size={13} /> Поділитись
        </button>

        <button
          onClick={onBookmark}
          disabled={saving}
          className={`p-3.5 border rounded-xl transition-all flex items-center justify-center cursor-pointer ${
            isBookmarked
              ? "bg-amber-500 border-amber-500 text-white"
              : "bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-gray)] hover:border-purple-500/20"
          }`}
        >
          <Bookmark size={14} fill={isBookmarked ? "currentColor" : "none"} />
        </button>
      </div>
    </div>
  );
}
