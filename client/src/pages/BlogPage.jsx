/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../api/axios";
import {
  Search,
  BookOpen,
  Calendar,
  ArrowUpRight,
  Terminal,
  Layers,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const CATEGORIES = [
  "Всі",
  "Новини",
  "Поради",
  "Конференції",
  "Інтерв'ю",
  "Методологія",
];

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("Всі");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get("/posts");
        if (Array.isArray(res.data)) {
          setPosts(res.data);
        } else if (res.data?.posts && Array.isArray(res.data.posts)) {
          setPosts(res.data.posts);
        }
      } catch (err) {
        console.error("Помилка при завантаженні блогу:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const stripHtml = (html) => {
    if (!html) return "";

    let cleanString = html.replace(/&nbsp;/g, " ");

    cleanString = cleanString.replace(
      /<\/p>|<\/div>|<\/li>|<\/h[1-6]>/gi,
      "$& ",
    );

    const doc = new DOMParser().parseFromString(cleanString, "text/html");
    const textContent = doc.body.textContent || "";

    return textContent.replace(/\s+/g, " ").trim();
  };

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesCategory =
        activeCategory === "Всі" || post.category === activeCategory;
      const matchesSearch = (post.title || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery, posts]);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-300 overflow-x-hidden selection:bg-purple-600 selection:text-white">
      <Navbar />

      <main className="flex-grow relative">
        <div className="absolute inset-0 opacity-30 pointer-events-none z-0 bg-[radial-gradient(var(--border-color)_1px,transparent_1px)] [background-size:32px_32px]" />

        <header className="relative pt-44 pb-24 px-4 md:px-6 border-b border-[var(--border-color)] overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/[0.03] blur-[150px] rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
              <div className="lg:col-span-8 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-purple-500/10 bg-purple-600/5 text-purple-600 dark:text-purple-400">
                  <Terminal size={12} />
                  <span className="font-mono text-[10px] font-bold uppercase tracking-widest">
                    Science.Platform / Blog
                  </span>
                </div>

                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-[var(--text-dark)] uppercase leading-tight">
                  Science Platform <br />
                  <span className="text-purple-600 dark:text-purple-400">
                    Блог
                  </span>
                </h1>

                <p className="max-w-md text-base text-[var(--text-gray)] font-normal leading-relaxed border-l-2 border-purple-600 pl-6 opacity-90">
                  Аналітичні статті, методологія та останні тренди світової
                  науки в цифровому форматі.
                </p>
              </div>

              <div className="lg:col-span-4">
                <div className="relative group rounded-xl p-0.5 bg-[var(--bg-light)] border border-[var(--border-color)] focus-within:border-purple-500/50 transition-all duration-300">
                  <Search
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-gray)] group-focus-within:text-purple-600 transition-colors"
                  />
                  <input
                    type="text"
                    placeholder="Пошук новин..."
                    className="w-full pl-11 pr-4 py-3.5 bg-transparent text-xs outline-none placeholder:text-gray-500 font-semibold text-[var(--text-dark)] uppercase tracking-wider"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </header>

        <section className="max-w-7xl mx-auto px-4 md:px-6 py-16">
          <div className="mb-12">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                <Layers size={14} />
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider">
                  Сортування за категоріями:
                </span>
              </div>
              <div className="flex items-center gap-x-8 overflow-x-auto pb-3 max-w-full touch-pan-x [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`text-[10px] font-bold uppercase tracking-widest transition-all relative py-1.5 shrink-0 ${
                      activeCategory === cat
                        ? "text-purple-600 dark:text-purple-400 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-purple-600"
                        : "text-[var(--text-gray)] hover:text-[var(--text-dark)]"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-40">
              <div className="w-10 h-10 border-2 border-purple-600/20 border-t-purple-600 rounded-full animate-spin mb-4" />
              <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--text-gray)] font-bold">
                Синхронізуємо дані...
              </span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post, index) => (
                <Link
                  to={`/blog/${post._id || post.id}`}
                  key={post._id || post.id}
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
                    <div className="absolute top-4 right-6 text-3xl font-extrabold text-[var(--text-gray)] opacity-[0.04] group-hover:opacity-[0.12] transition-opacity select-none">
                      {index + 1 < 10 ? `0${index + 1}` : index + 1}
                    </div>

                    <div className="flex items-center gap-2 mb-4 text-purple-600 dark:text-purple-400">
                      <Calendar size={12} />
                      <span className="font-mono text-[9px] font-bold uppercase tracking-wider opacity-80">
                        {post.createdAt
                          ? new Date(post.createdAt).toLocaleDateString(
                              "uk-UA",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              },
                            )
                          : "Дата відсутня"}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-[var(--text-dark)] leading-snug uppercase tracking-tight group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors mb-3">
                      {post.title}
                    </h3>

                    <p className="text-xs text-[var(--text-gray)] line-clamp-3 font-normal leading-relaxed opacity-90 mb-6">
                      {stripHtml(post.content)}
                    </p>

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
              ))}
            </div>
          )}

          {!loading && filteredPosts.length === 0 && (
            <div className="py-24 text-center border border-dashed border-[var(--border-color)] bg-[var(--bg-light)]/50 backdrop-blur-sm rounded-2xl">
              <BookOpen size={36} className="mx-auto text-purple-600/40 mb-4" />
              <h4 className="text-xl font-bold text-[var(--text-dark)] uppercase tracking-tight mb-1">
                Упс, порожньо
              </h4>
              <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-gray)] opacity-70">
                Спробуйте змінити параметри пошуку або категорію.
              </p>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Blog;
