import React, { useState, useEffect, useMemo } from "react";
import parse from "html-react-parser";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  FileText,
  Download,
  Calendar,
  User as UserIcon,
  BookOpen,
  Layers,
  Award,
  Users,
} from "lucide-react";

export default function ArchivePage() {
  const [articles, setArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArchiveData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/projects/archive");
        if (!response.ok) {
          throw new Error("Не вдалося завантажити архів статей");
        }
        const data = await response.json();
        setArticles(data);
      } catch (err) {
        console.error("Error fetching archived projects:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArchiveData();
  }, []);

  const stats = useMemo(() => {
    if (!articles.length) return { total: 0, domains: 0, authors: 0 };

    const uniqueDomains = new Set(
      articles.map((a) => a.domain).filter(Boolean),
    );
    const uniqueAuthors = new Set(
      articles.map((a) => a.authorId?._id || a.authorId?.name).filter(Boolean),
    );

    return {
      total: articles.length,
      domains: uniqueDomains.size,
      authors: uniqueAuthors.size || 1,
    };
  }, [articles]);

  const getDownloadUrl = (path) => {
    if (!path) return "#";
    return path.startsWith("http") ? path : `http://localhost:5000/${path}`;
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-[var(--bg-main)] pt-28 pb-16 px-6 transition-colors duration-300">
        {/* Шапка та статистика */}
        <div className="max-w-7xl mx-auto mb-12" data-aos="fade-down">
          <div className="relative overflow-hidden rounded-3xl border border-[var(--border-color)] bg-[var(--bg-card)] p-8 md:p-12 shadow-xs transition-all duration-300">
            {/* Ефект легкого фіолетового свічення */}
            <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-[var(--purple-main)]/5 blur-3xl rounded-full pointer-events-none" />

            <div className="flex flex-col gap-8 relative z-10">
              <div className="max-w-3xl space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[var(--purple-main)]/10 text-[var(--purple-main)] border border-[var(--purple-main)]/20">
                  🚀 Репозиторій екосистеми
                </div>
                <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-[var(--text-dark)] leading-none">
                  Архів{" "}
                  <span className="text-[var(--purple-main)]">
                    Затверджених Робіт
                  </span>
                </h1>
                <p className="text-sm text-[var(--text-gray)] font-medium leading-relaxed max-w-2xl">
                  Централізована наукова база публікацій, досліджень та
                  інноваційних проєктів, які успішно пройшли незалежне
                  рецензування експертною радою Science Platform.
                </p>
              </div>

              {/* Картки статистики з виправленим колірним фоном іконок */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl w-full">
                <div className="bg-[var(--bg-main)] border border-[var(--border-color)] rounded-2xl p-4 flex items-center gap-4 transition-all duration-300 hover:border-[var(--purple-main)]/40 group/stat">
                  <div className="w-12 h-12 rounded-xl bg-[var(--purple-main)]/10 flex items-center justify-center transition-transform group-hover/stat:scale-105 flex-shrink-0">
                    <Award size={20} className="text-[var(--purple-main)]" />
                  </div>
                  <div>
                    <div className="text-2xl font-black text-[var(--text-dark)] tracking-tight">
                      {loading ? "..." : stats.total}
                    </div>
                    <div className="text-[10px] font-bold text-[var(--text-gray)] uppercase tracking-wider">
                      Публікацій
                    </div>
                  </div>
                </div>

                <div className="bg-[var(--bg-main)] border border-[var(--border-color)] rounded-2xl p-4 flex items-center gap-4 transition-all duration-300 hover:border-[var(--purple-main)]/40 group/stat">
                  <div className="w-12 h-12 rounded-xl bg-[var(--purple-main)]/10 flex items-center justify-center transition-transform group-hover/stat:scale-105 flex-shrink-0">
                    <Layers size={20} className="text-[var(--purple-main)]" />
                  </div>
                  <div>
                    <div className="text-2xl font-black text-[var(--text-dark)] tracking-tight">
                      {loading ? "..." : stats.domains}
                    </div>
                    <div className="text-[10px] font-bold text-[var(--text-gray)] uppercase tracking-wider">
                      Напрямків
                    </div>
                  </div>
                </div>

                <div className="bg-[var(--bg-main)] border border-[var(--border-color)] rounded-2xl p-4 flex items-center gap-4 transition-all duration-300 hover:border-[var(--purple-main)]/40 group/stat">
                  <div className="w-12 h-12 rounded-xl bg-[var(--purple-main)]/10 flex items-center justify-center transition-transform group-hover/stat:scale-105 flex-shrink-0">
                    <Users size={20} className="text-[var(--purple-main)]" />
                  </div>
                  <div>
                    <div className="text-2xl font-black text-[var(--text-dark)] tracking-tight">
                      {loading ? "..." : stats.authors}
                    </div>
                    <div className="text-[10px] font-bold text-[var(--text-gray)] uppercase tracking-wider">
                      Авторів
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Секція карток з матеріалами */}
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="text-center py-20 text-[var(--purple-main)] font-black text-sm uppercase tracking-widest animate-pulse">
              Завантаження матеріалів архіву...
            </div>
          ) : error ? (
            <div className="text-center py-12 bg-rose-500/10 border border-rose-500/20 rounded-2xl p-6 max-w-xl mx-auto">
              <p className="text-rose-500 text-xs font-bold uppercase tracking-widest">
                Помилка: {error}
              </p>
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-16 bg-[var(--bg-card)] border border-dashed border-[var(--border-color)] rounded-2xl p-6">
              <p className="text-[var(--text-gray)] text-xs font-bold uppercase tracking-widest">
                Наразі в архіві немає опублікованих робіт.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {articles.map((article, index) => (
                <div
                  key={article._id}
                  className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] shadow-xs hover:shadow-md hover:border-[var(--purple-main)]/40 transition-all duration-300 p-6 flex flex-col justify-between group"
                  data-aos="fade-up"
                  data-aos-delay={index * 50}
                >
                  <div>
                    {/* Виправлені бейджі з напівпрозорим фоном */}
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-[var(--purple-main)]/10 text-[var(--purple-main)] border border-[var(--purple-main)]/20">
                        ✓ Прийнято рецензентом
                      </span>
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-bold bg-[var(--bg-main)] text-[var(--text-gray)] border border-[var(--border-color)] uppercase tracking-tight">
                        {article.domain}
                      </span>
                    </div>

                    <h2 className="text-lg font-black text-[var(--text-dark)] leading-snug mb-3 uppercase tracking-wide line-clamp-2 transition-colors group-hover:text-[var(--purple-main)]">
                      {article.title}
                    </h2>

                    <div className="flex flex-col gap-2 mb-4 text-[10px] font-bold text-[var(--text-gray)] uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <UserIcon
                          size={12}
                          className="text-[var(--purple-main)]"
                        />
                        <span>
                          Автор:{" "}
                          <span className="text-[var(--text-dark)]">
                            {article.authorId?.name || "Невідомий автор"}
                          </span>
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BookOpen
                          size={12}
                          className="text-[var(--purple-main)]"
                        />
                        <span>
                          Програма:{" "}
                          <span className="text-[var(--text-dark)]">
                            {article.programId?.title || "Загальна"}
                          </span>
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar
                          size={12}
                          className="text-[var(--purple-main)]"
                        />
                        <span>
                          Дата:{" "}
                          <span className="text-[var(--text-dark)]">
                            {new Date(article.createdAt).toLocaleDateString(
                              "uk-UA",
                            )}
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
                      onClick={() => setSelectedArticle(article)}
                      className="text-center py-3 border border-[var(--border-color)] text-[var(--text-dark)] bg-[var(--bg-main)] font-bold text-[10px] uppercase tracking-widest rounded-xl transition-all hover:bg-[var(--purple-main)] hover:text-white hover:border-[var(--purple-main)] active:scale-[0.98]"
                    >
                      Читати деталі
                    </button>
                    <a
                      href={getDownloadUrl(article.fileUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 py-3 bg-[var(--purple-main)] text-white font-bold text-[10px] uppercase tracking-widest rounded-xl transition-all hover:bg-opacity-90 active:scale-[0.98] group/btn"
                    >
                      <Download
                        size={12}
                        className="transition-transform duration-300 group-hover/btn:translate-y-0.5"
                      />
                      Завантажити
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Модальне вікно (Деталі статті) */}
        {selectedArticle && (
          <div className="fixed inset-0 z-[200] overflow-y-auto bg-black/70 flex items-center justify-center p-4 backdrop-blur-xs transition-opacity duration-300">
            <div
              className="bg-[var(--bg-main)] border border-[var(--border-color)] rounded-3xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl scale-100"
              data-aos="zoom-in"
              data-aos-duration="250"
            >
              <div className="p-6 border-b border-[var(--border-color)] flex items-start justify-between bg-[var(--bg-card)] rounded-t-3xl">
                <div className="space-y-1 pr-4">
                  <span className="text-[9px] font-black uppercase tracking-widest text-white bg-[var(--purple-main)] px-2 py-1 rounded">
                    Архівний запис № {selectedArticle._id?.slice(-6)}
                  </span>
                  <h3 className="text-xl font-black text-[var(--text-dark)] mt-3 uppercase tracking-wide leading-tight">
                    {selectedArticle.title}
                  </h3>
                  <p className="text-[10px] font-bold text-[var(--text-gray)] uppercase tracking-widest">
                    Категорія: {selectedArticle.domain} | Програма:{" "}
                    {selectedArticle.programId?.title || "Загальна"}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedArticle(null)}
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
                    {selectedArticle.authorId?.image ? (
                      <img
                        src={selectedArticle.authorId.image}
                        alt={selectedArticle.authorId.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <UserIcon size={20} className="text-[var(--text-gray)]" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[var(--text-dark)]">
                      {selectedArticle.authorId?.name || "Невідомий автор"}
                    </h4>
                    <p className="text-[10px] text-[var(--text-gray)] leading-snug mt-0.5">
                      {selectedArticle.authorId?.bio ||
                        "Науковий співробітник екосистеми Science Platform"}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="text-[9px] font-black text-[var(--text-dark)] uppercase tracking-widest mb-2">
                    Анотація / Опис проєкту
                  </h4>
                  <div className="text-[var(--text-dark)] text-xs leading-relaxed bg-[var(--bg-card)] p-5 rounded-2xl border border-[var(--border-color)] html-content max-h-60 overflow-y-auto">
                    {parse(selectedArticle.description || "")}
                  </div>
                </div>

                {selectedArticle.versions &&
                  selectedArticle.versions.length > 0 && (
                    <div>
                      <h4 className="text-[9px] font-black text-[var(--text-dark)] uppercase tracking-widest mb-2">
                        Документація та версії файлів
                      </h4>
                      <div className="space-y-2">
                        {selectedArticle.versions.map((ver, idx) => (
                          <div
                            key={ver._id || idx}
                            className="flex items-center justify-between p-3 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl text-xs hover:border-[var(--purple-main)] transition-colors"
                          >
                            <div className="flex items-center gap-2 text-[var(--text-dark)] font-medium truncate max-w-[70%]">
                              <FileText
                                size={14}
                                className="text-[var(--purple-main)] flex-shrink-0"
                              />
                              <span className="truncate">
                                {ver.fileName || `Файл_версії_${idx + 1}`}
                              </span>
                            </div>
                            <span className="text-[9px] font-bold text-[var(--text-gray)] uppercase tracking-wider">
                              {new Date(ver.createdAt).toLocaleDateString(
                                "uk-UA",
                              )}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </div>

              <div className="p-4 border-t border-[var(--border-color)] bg-[var(--bg-card)] flex justify-between items-center rounded-b-3xl">
                <a
                  href={getDownloadUrl(selectedArticle.fileUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 py-3 px-5 bg-[var(--purple-main)] text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all hover:bg-opacity-90 active:scale-[0.98] group/modal-btn"
                >
                  <Download
                    size={12}
                    className="transition-transform duration-300 group-hover/modal-btn:translate-y-0.5"
                  />
                  Завантажити головний файл
                </a>
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="py-3 px-6 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] text-[var(--text-dark)] text-[10px] font-black uppercase tracking-widest transition-colors hover:bg-[var(--bg-card)] active:scale-[0.98]"
                >
                  Закрити
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}
