import React from "react";
import parse from "html-react-parser";
import { Download, Calendar, User as UserIcon, BookOpen } from "lucide-react";

export default function ArchiveGrid({
  loading,
  error,
  items,
  onSelectArticle,
  getDownloadUrl,
}) {
  if (loading) {
    return (
      <div className="text-center py-20 text-purple-600 font-black text-sm uppercase tracking-widest animate-pulse">
        Завантаження матеріалів архіву...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 bg-rose-500/10 border border-rose-500/20 rounded-2xl p-6 max-w-xl mx-auto">
        <p className="text-rose-500 text-xs font-bold uppercase tracking-widest">
          Помилка: {error}
        </p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-16 bg-[var(--bg-card)] border border-dashed border-[var(--border-color)] rounded-2xl p-6">
        <p className="text-[var(--text-gray)] text-xs font-bold uppercase tracking-widest">
          Наразі у вибраній галузі немає опублікованих робіт.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {items.map((article, index) => (
        <div
          key={article._id}
          className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] shadow-xs hover:shadow-md hover:border-purple-600/40 transition-all duration-300 p-6 flex flex-col justify-between group"
        >
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-purple-600/10 text-purple-600 border border-purple-600/20">
                ✓ Прийнято рецензентом
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-bold bg-[var(--bg-main)] text-[var(--text-gray)] border border-[var(--border-color)] uppercase tracking-tight">
                {article.domain}
              </span>
            </div>

            <h2 className="text-lg font-black text-[var(--text-dark)] leading-snug mb-3 uppercase tracking-wide line-clamp-2 transition-colors group-hover:text-purple-600">
              {article.title}
            </h2>

            <div className="flex flex-col gap-2 mb-4 text-[10px] font-bold text-[var(--text-gray)] uppercase tracking-wider">
              <div className="flex items-center gap-2">
                <UserIcon size={12} className="text-purple-600" />
                <span>
                  Автор:{" "}
                  <span className="text-[var(--text-dark)]">
                    {article.authorId?.name || "Невідомий автор"}
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen size={12} className="text-purple-600" />
                <span>
                  Програма:{" "}
                  <span className="text-[var(--text-dark)]">
                    {article.programId?.title || "Загальна"}
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={12} className="text-purple-600" />
                <span>
                  Дата:{" "}
                  <span className="text-[var(--text-dark)]">
                    {article.createdAt
                      ? new Date(article.createdAt).toLocaleDateString("uk-UA")
                      : "—"}
                  </span>
                </span>
              </div>
            </div>

            <div className="text-xs text-[var(--text-gray)] leading-relaxed mb-6 max-h-20 overflow-hidden relative html-content group-hover:text-[var(--text-dark)] transition-colors">
              <div className="line-clamp-3">
                {parse(article.description || "")}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-auto pt-2">
            <button
              onClick={() => onSelectArticle(article)}
              className="text-center py-3 border border-[var(--border-color)] text-[var(--text-dark)] bg-[var(--bg-main)] font-bold text-[10px] uppercase tracking-widest rounded-xl transition-all hover:bg-purple-600 hover:text-white hover:border-purple-600 active:scale-[0.98]"
            >
              Читати деталі
            </button>
            <a
              href={getDownloadUrl(article.fileUrl)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3 bg-purple-600 text-white font-bold text-[10px] uppercase tracking-widest rounded-xl transition-all hover:bg-opacity-90 active:scale-[0.98] group/btn"
            >
              <Download
                size={12}
                className="transition-transform duration-300 group-hover/btn:translate-y-0.5"
              />
              Переглянути
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
