import React from "react";
import { Link } from "react-router-dom";
import { Calendar, ArrowUpRight } from "lucide-react";

const stripHtmlFast = (html) => {
  if (!html) return "";
  let text = html.replace(/<\/?[^>]+(>|$)/g, " ");
  text = text
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
  return text.replace(/\s+/g, " ").trim();
};

export default function BlogCard({ post, index }) {
  const previewText = post.excerpt || stripHtmlFast(post.content);

  return (
    <Link
      to={`/blog/${post._id || post.id}`}
      className="group flex flex-col h-full bg-[var(--bg-light)] border border-[var(--border-color)] rounded-2xl transition-all duration-300 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-600/[0.01] hover:-translate-y-0.5 overflow-hidden"
    >
      <div className="relative h-52 overflow-hidden border-b border-[var(--border-color)] bg-[var(--bg-main)]">
        <img
          className="w-full h-full object-cover opacity-90 group-hover:scale-102 group-hover:opacity-100 transition-all duration-500 ease-out"
          src={
            post.coverImage ||
            post.image ||
            "https://images.unsplash.com/photo-1532094349884-543bb11783ac?auto=format&fit=crop&q=80"
          }
          alt={post.title}
        />
        <div className="absolute top-4 left-4">
          <div className="bg-purple-600 text-white rounded-md px-2.5 py-1 font-mono text-[9px] font-bold uppercase tracking-wider shadow-sm">
            {post.category}
          </div>
        </div>
      </div>

      <div className="p-6 md:p-8 flex flex-col flex-grow relative">
        {typeof index === "number" && (
          <div className="absolute top-4 right-6 text-3xl font-extrabold text-[var(--text-gray)] opacity-[0.04] group-hover:opacity-[0.12] transition-opacity select-none">
            {index + 1 < 10 ? `0${index + 1}` : index + 1}
          </div>
        )}

        <div className="flex items-center gap-2 mb-4 text-purple-600 dark:text-purple-400">
          <Calendar size={12} />
          <span className="font-mono text-[9px] font-bold uppercase tracking-wider opacity-80">
            {post.createdAt
              ? new Date(post.createdAt).toLocaleDateString("uk-UA", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : "Дата відсутня"}
          </span>
        </div>

        <h3 className="text-xl font-bold text-[var(--text-dark)] leading-snug uppercase tracking-tight group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors mb-3 line-clamp-2">
          {post.title}
        </h3>

        {previewText && (
          <p className="text-xs text-[var(--text-gray)] line-clamp-3 font-normal leading-relaxed opacity-90 mb-6">
            {previewText}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between pt-4 border-t border-[var(--border-color)]">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-gray)] group-hover:text-[var(--text-dark)] transition-colors">
            Читати статтю
          </span>
          <div className="w-8 h-8 rounded-lg border border-[var(--border-color)] bg-[var(--bg-main)] flex items-center justify-center group-hover:bg-purple-600 group-hover:border-purple-600 transition-all duration-300">
            <ArrowUpRight
              size={14}
              className="text-[var(--text-gray)] group-hover:text-white transition-colors"
            />
          </div>
        </div>
      </div>
    </Link>
  );
}
