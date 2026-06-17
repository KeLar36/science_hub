import React from "react";
import { Bookmark, Trash2, History, ArrowUpRight } from "lucide-react";

export default function BookmarksList({ items, onToggle, navigate }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.length === 0 ? (
        <div className="col-span-full flex flex-col items-center justify-center py-16 bg-[var(--bg-card)] rounded-3xl border border-[var(--border-color)] border-dashed p-8">
          <Bookmark
            size={40}
            className="text-[var(--text-gray)] mb-3 opacity-60"
          />
          <span className="text-sm font-bold text-[var(--text-gray)]">
            У вас немає збережених закладок
          </span>
        </div>
      ) : (
        items.map((post) => (
          <div
            key={post._id}
            onClick={() => navigate(`/blog/${post._id}`)}
            className="bg-[var(--bg-card)] border border-[var(--border-color)] p-6 rounded-2xl flex flex-col justify-between h-[240px] relative group cursor-pointer hover:border-purple-500/30 hover:shadow-lg transition-all"
          >
            <div>
              <div className="flex justify-between items-start gap-4 mb-3">
                <span className="px-2.5 py-0.5 bg-purple-500/5 text-purple-600 dark:text-purple-400 rounded-md text-[9px] font-bold uppercase tracking-wider">
                  {post.domain}
                </span>
                <button
                  onClick={(e) => onToggle(e, post._id)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg transition-all z-10"
                  title="Видалити з закладок"
                >
                  <Trash2 size={15} />
                </button>
              </div>
              <h3 className="text-base font-bold text-[var(--text-dark)] line-clamp-3 leading-snug group-hover:text-purple-600 transition-colors">
                {post.title}
              </h3>
            </div>
            <div className="pt-4 border-t border-[var(--border-color)] flex items-center justify-between text-xs text-[var(--text-gray)]">
              <span className="flex items-center gap-1">
                <History size={12} />{" "}
                {new Date(post.createdAt).toLocaleDateString("uk-UA")}
              </span>
              <span className="text-purple-600 font-bold text-[10px] uppercase tracking-wider flex items-center gap-0.5">
                Читати <ArrowUpRight size={12} />
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
