import React from "react";
import parse from "html-react-parser";
import { Download, FileText, User as UserIcon } from "lucide-react";

export default function ArticleDetailModal({
  article,
  onClose,
  getDownloadUrl,
}) {
  if (!article) return null;

  return (
    <div className="fixed inset-0 z-[200] overflow-y-auto bg-black/70 flex items-center justify-center p-4 backdrop-blur-xs transition-opacity duration-300">
      <div
        className="bg-[var(--bg-main)] border border-[var(--border-color)] rounded-3xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl scale-100"
        data-aos="zoom-in"
        data-aos-duration="250"
      >
        <div className="p-6 border-b border-[var(--border-color)] flex items-start justify-between bg-[var(--bg-card)] rounded-t-3xl">
          <div className="space-y-1 pr-4">
            <span className="text-[9px] font-black uppercase tracking-widest text-white bg-purple-600 px-2 py-1 rounded">
              Архівний запис № {article._id?.slice(-6)}
            </span>
            <h3 className="text-xl font-black text-[var(--text-dark)] mt-3 uppercase tracking-wide leading-tight">
              {article.title}
            </h3>
            <p className="text-[10px] font-bold text-[var(--text-gray)] uppercase tracking-widest">
              Категорія: {article.domain} | Програма:{" "}
              {article.programId?.title || "Загальна"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[var(--text-gray)] hover:text-[var(--text-dark)] hover:bg-[var(--bg-main)] p-2 transition-all rounded-xl border border-transparent hover:border-[var(--border-color)]"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-8 overflow-y-auto space-y-6">
          <div className="p-4 bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] flex items-center gap-4">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-[var(--bg-main)] border border-[var(--border-color)] flex items-center justify-center flex-shrink-0">
              {article.authorId?.image ? (
                <img
                  src={article.authorId.image}
                  alt={article.authorId.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <UserIcon size={20} className="text-[var(--text-gray)]" />
              )}
            </div>
            <div>
              <h4 className="text-sm font-bold text-[var(--text-dark)]">
                {article.authorId?.name || "Невідомий автор"}
              </h4>
              <p className="text-[10px] text-[var(--text-gray)] leading-snug mt-0.5">
                {article.authorId?.bio ||
                  "Науковий співробітник екосистеми Science Platform"}
              </p>
            </div>
          </div>

          <div>
            <h4 className="text-[9px] font-black text-[var(--text-dark)] uppercase tracking-widest mb-2">
              Анотація / Опис проєкту
            </h4>
            <div className="text-[var(--text-dark)] text-xs leading-relaxed bg-[var(--bg-card)] p-5 rounded-2xl border border-[var(--border-color)] html-content max-h-60 overflow-y-auto">
              {parse(article.description || "")}
            </div>
          </div>

          {article.versions && article.versions.length > 0 && (
            <div>
              <h4 className="text-[9px] font-black text-[var(--text-dark)] uppercase tracking-widest mb-2">
                Документація та версії файлів
              </h4>
              <div className="space-y-2">
                {article.versions.map((ver, idx) => (
                  <div
                    key={ver._id || idx}
                    className="flex items-center justify-between p-3 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl text-xs hover:border-purple-600 transition-colors"
                  >
                    <div className="flex items-center gap-2 text-[var(--text-dark)] font-medium truncate max-w-[70%]">
                      <FileText
                        size={14}
                        className="text-purple-600 flex-shrink-0"
                      />
                      <span className="truncate">
                        {ver.fileName || `Файл_версії_${idx + 1}`}
                      </span>
                    </div>
                    <span className="text-[9px] font-bold text-[var(--text-gray)] uppercase tracking-wider">
                      {ver.createdAt
                        ? new Date(ver.createdAt).toLocaleDateString("uk-UA")
                        : "—"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-[var(--border-color)] bg-[var(--bg-card)] flex justify-between items-center rounded-b-3xl">
          <a
            href={getDownloadUrl(article.fileUrl)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 py-3 px-5 bg-purple-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all hover:bg-opacity-90 active:scale-[0.98] group/modal-btn"
          >
            <Download
              size={12}
              className="transition-transform duration-300 group-hover/modal-btn:translate-y-0.5"
            />
            Завантажити головний файл
          </a>
          <button
            onClick={onClose}
            className="py-3 px-6 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] text-[var(--text-dark)] text-[10px] font-black uppercase tracking-widest transition-colors hover:bg-[var(--bg-card)] active:scale-[0.98]"
          >
            Закрити
          </button>
        </div>
      </div>
    </div>
  );
}
