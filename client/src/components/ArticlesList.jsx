import React, { useState } from "react";
import { FolderOpen, FileUp } from "lucide-react";
import RevisionModal from "./RevisionModal";

export default function ArticlesList({ items, onRefresh }) {
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenRevision = (e, art) => {
    e.stopPropagation();
    setSelectedArticle(art);
    setIsModalOpen(true);
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case "Прийнято":
        return "text-emerald-500 bg-emerald-500/5 border-emerald-500/10";
      case "На доопрацюванні":
        return "text-amber-500 bg-amber-500/5 border-amber-500/10";
      case "Відхилено":
        return "text-red-500 bg-red-500/5 border-red-500/10";
      default:
        return "text-purple-600 bg-purple-500/5 border-purple-500/10";
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.length === 0 ? (
        <div className="col-span-full flex flex-col items-center justify-center py-16 bg-[var(--bg-card)] rounded-3xl border border-[var(--border-color)] border-dashed p-8">
          <FolderOpen
            size={40}
            className="text-[var(--text-gray)] mb-3 opacity-60"
          />
          <span className="text-sm font-bold text-[var(--text-gray)]">
            Наукових публікацій не знайдено
          </span>
          <p className="text-xs text-[var(--text-gray)] opacity-70 mt-1">
            Всі ваші подані роботи відображатимуться тут.
          </p>
        </div>
      ) : (
        items.map((art) => (
          <div
            key={art._id}
            className="bg-[var(--bg-card)] border border-[var(--border-color)] p-6 rounded-2xl flex flex-col justify-between min-h-[240px] hover:border-purple-500/20 hover:shadow-lg hover:shadow-purple-600/[0.02] transition-all"
          >
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="inline-block px-2.5 py-0.5 bg-purple-500/5 text-purple-600 dark:text-purple-400 rounded-md text-[9px] font-bold uppercase tracking-wider">
                  {art.domain}
                </span>

                {/* Компактний бейдж статусу */}
                <span
                  className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider border ${getStatusStyles(art.status)}`}
                >
                  {art.status || "Очікує"}
                </span>
              </div>

              <h3 className="text-base font-bold text-[var(--text-dark)] line-clamp-3 leading-snug">
                {art.title}
              </h3>
            </div>

            <div className="pt-4 border-t border-[var(--border-color)] flex flex-col gap-3">
              <div className="flex items-center justify-between text-xs font-medium text-[var(--text-gray)]">
                <span>
                  {new Date(art.createdAt).toLocaleDateString("uk-UA")}
                </span>
                <span className="text-[10px] opacity-60">
                  Версія: {art.versions?.length || 1}.0
                </span>
              </div>

              {art.status === "На доопрацюванні" && (
                <button
                  onClick={(e) => handleOpenRevision(e, art)}
                  className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-[11px] uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md shadow-amber-500/10 mt-1"
                >
                  <FileUp size={13} /> Переподати роботу
                </button>
              )}
            </div>
          </div>
        ))
      )}

      <RevisionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedArticle(null);
        }}
        article={selectedArticle}
        onUploadSuccess={onRefresh}
      />
    </div>
  );
}
