import React from "react";
import { Eye, Trash2, Calendar, FileText, Building2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function AdminPostRow({ post, onDelete }) {
  const displayImage =
    post.images && Array.isArray(post.images) && post.images.length > 0
      ? post.images.find((img) => img.isHero)?.url || post.images[0].url
      : post.coverImage || post.image || null;

  const statusStyles = {
    published: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    draft: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    archived: "text-rose-500 bg-rose-500/10 border-rose-500/20",
  };

  return (
    <>
      <td className="px-6 py-4 align-middle max-w-sm">
        <div className="flex items-center gap-3 text-left">
          <div className="w-12 h-8 rounded-lg border border-[var(--border-color)] bg-[var(--bg-main)] overflow-hidden shrink-0 shadow-xs">
            {displayImage ? (
              <img
                src={displayImage}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[var(--text-gray)] opacity-40">
                <FileText size={12} />
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <span className="font-black text-xs text-[var(--text-dark)] uppercase tracking-tight block truncate group-hover:text-purple-600 transition-colors">
              {post.title}
            </span>

            {post.organizationId ? (
              <div className="flex items-center gap-1 mt-0.5 opacity-80">
                <Building2 size={10} className="text-purple-600 shrink-0" />
                <span className="text-[9px] font-mono font-bold text-purple-600 uppercase tracking-wide truncate max-w-[180px]">
                  {post.organizationId.name}
                </span>
              </div>
            ) : (
              <span className="text-[9px] font-mono font-bold text-[var(--text-gray)] uppercase tracking-wide block mt-0.5 opacity-50">
                🌐 Глобальна новина
              </span>
            )}
          </div>
        </div>
      </td>

      <td className="px-6 py-4 align-middle text-left">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-purple-600/10 border border-purple-500/10 flex items-center justify-center text-purple-600 text-[10px] font-black uppercase">
            {(post.authorId?.name || "R").charAt(0).toUpperCase()}
          </div>
          <span className="text-xs font-bold text-[var(--text-dark)] uppercase tracking-wide truncate max-w-[120px]">
            {post.authorId?.name || "Редакція"}
          </span>
        </div>
      </td>

      <td className="px-6 py-4 align-middle text-left">
        <span className="px-2.5 py-0.5 rounded-lg bg-purple-600/5 border border-purple-500/10 text-[9px] font-black uppercase text-purple-600 tracking-wider">
          {post.category}
        </span>
      </td>

      <td className="px-6 py-4 align-middle text-left">
        <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-[var(--text-gray)]">
          <Calendar size={12} className="opacity-60" />
          <span>{new Date(post.createdAt).toLocaleDateString("uk-UA")}</span>
        </div>
      </td>

      <td className="px-6 py-4 align-middle text-left">
        <span
          className={`px-2 py-0.5 rounded-md border text-[9px] font-black uppercase tracking-widest ${statusStyles[post.status] || "text-purple-600 border-purple-500/20"}`}
        >
          {post.status === "published"
            ? "⚡️ Active"
            : post.status === "draft"
              ? "📝 Draft"
              : "📁 Archive"}
        </span>
      </td>

      <td className="px-6 py-4 align-middle text-right">
        <div className="flex items-center justify-end gap-1.5">
          <Link
            to={`/blog/${post._id}`}
            className="p-1.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-gray)] hover:text-purple-600 hover:bg-purple-600/5 transition-all cursor-pointer"
            title="Переглянути публікацію"
          >
            <Eye size={13} />
          </Link>
          <button
            onClick={() => onDelete(post._id)}
            className="p-1.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-gray)] hover:text-rose-600 hover:bg-rose-600/5 transition-all cursor-pointer"
            title="Видалити пост"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </td>
    </>
  );
}
