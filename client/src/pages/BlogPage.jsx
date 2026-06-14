/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useMemo } from "react";
import axios from "../api/axios";
import {
  Search,
  BookOpen,
  Calendar,
  ArrowUpRight,
  Sparkles,
  ChevronRight,
  Terminal,
  Newspaper,
  Layers,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AOS from "aos";
import "aos/dist/aos.css";

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
    AOS.init({ duration: 1000, once: true });

    const fetchPosts = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
        const res = await axios.get(`${apiUrl}/api/posts`);
        if (Array.isArray(res.data)) setPosts(res.data);
      } catch (err) {
        console.error("Помилка при завантаженні блогу", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const stripHtml = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    const text = doc.body.textContent || "";
    return text.replace(/\s+/g, " ").trim();
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
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-300 overflow-x-hidden selection:bg-purple-600 selection:text-white">
      <Navbar />

      {/* Вбудовані стилі для сітки та анімацій */}
      <style>{`
        .rules-grid-bg {
          background-image: radial-gradient(var(--border-color) 1px, transparent 1px);
          background-size: 40px 40px;
          position: absolute;
          inset: 0; 
          opacity: 0.4; 
          z-index: 0;
        }
        .label-mono {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.2em;
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <main className="relative">
        {/* --- IMPROVED HERO SECTION --- */}
        <header className="relative pt-44 pb-32 px-6 border-b border-[var(--border-color)] overflow-hidden">
          <div className="rules-grid-bg" />

          {/* М'яке фіолетове сяйво */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-600/10 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none animate-pulse" />

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
              <div className="lg:col-span-8 space-y-8" data-aos="fade-right">
                {/* Технічний бадж */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/5 text-purple-600">
                  <Terminal size={14} />
                  <span className="label-mono font-bold text-purple-600">
                    Science.Platform / Blog
                  </span>
                </div>

                <h1 className="text-6xl md:text-9xl font-black tracking-tighter text-[var(--text-dark)] leading-[0.85] uppercase italic">
                  Science Platform <br />
                  <span className="text-purple-600">Блог</span>
                </h1>

                <div className="flex flex-col md:flex-row gap-8 md:items-center">
                  <p className="max-w-md text-lg text-[var(--text-gray)] font-medium leading-relaxed italic border-l-2 border-purple-600 pl-6">
                    Аналітичні статті, методологія та останні тренди світової
                    науки в цифровому форматі.
                  </p>
                </div>
              </div>

              <div className="lg:col-span-4" data-aos="fade-left">
                <div className="relative group p-1 bg-[var(--bg-card)]/50 backdrop-blur-xl border border-[var(--border-color)] focus-within:border-purple-600 transition-all shadow-xl">
                  <Search
                    size={20}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-gray)] group-focus-within:text-purple-600 transition-colors"
                  />
                  <input
                    type="text"
                    placeholder="Пошук новин..."
                    className="w-full pl-12 pr-4 py-4 bg-transparent text-sm outline-none placeholder:text-gray-500 font-bold text-[var(--text-dark)] uppercase tracking-wider"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </header>

        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="mb-20 overflow-hidden" data-aos="fade-up">
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <Layers size={14} className="text-purple-600" />
                <span className="label-mono font-bold text-purple-600">
                  Сортування за категоріями:
                </span>
              </div>
              <div className="flex items-center gap-x-10 overflow-x-auto no-scrollbar pb-4 max-w-full touch-pan-x">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`text-[11px] font-black uppercase tracking-[0.2em] transition-all relative py-2 shrink-0 ${
                      activeCategory === cat
                        ? "text-purple-600 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-purple-600"
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
              <div className="w-12 h-12 border-2 border-purple-600/20 border-t-purple-600 rounded-full animate-spin mb-4" />
              <span className="label-mono font-bold">Syncing.Archive...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {filteredPosts.map((post, index) => (
                <article
                  key={post._id || post.id}
                  data-aos="fade-up"
                  data-aos-delay={index * 50}
                  className="group relative flex flex-col h-[600px] bg-[var(--bg-card)] border border-[var(--border-color)] transition-all duration-500 hover:border-purple-600/40 hover:shadow-[0_30px_60px_rgba(124,58,237,0.06)] cursor-pointer overflow-hidden"
                  onClick={() =>
                    (window.location.href = `/blog/${post._id || post.id}`)
                  }
                >
                  <div className="relative h-64 overflow-hidden border-b border-[var(--border-color)]">
                    <img
                      className="w-full h-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700 ease-out"
                      src={
                        post.coverImage ||
                        post.image ||
                        "https://images.unsplash.com/photo-1532094349884-543bb11783ac?auto=format&fit=crop&q=80"
                      }
                      alt={post.title}
                    />
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black/20" />
                    <div className="absolute top-6 left-6">
                      <div className="bg-[var(--purple-main)] text-white rounded-xl px-4 py-1.5 label-mono font-bold shadow-xl">
                        {post.category}
                      </div>
                    </div>
                  </div>

                  <div className="p-10 flex flex-col flex-grow relative">
                    {/* Великий номер фоном */}
                    <div className="absolute top-4 right-8 text-7xl font-black text-[var(--text-gray)] opacity-[0.03] pointer-events-none group-hover:opacity-[0.12] transition-all duration-500 italic">
                      {index + 1 < 10 ? `0${index + 1}` : index + 1}
                    </div>

                    <div className="flex items-center gap-3 mb-6 text-purple-600 relative z-10">
                      <Calendar size={14} />
                      <span className="label-mono font-bold !text-[9px]">
                        {new Date(post.createdAt).toLocaleDateString("uk-UA", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>

                    <h3 className="text-2xl font-bold text-[var(--text-dark)] leading-tight uppercase italic group-hover:text-purple-600 transition-colors mb-4 relative z-10">
                      {post.title}
                    </h3>

                    <p className="text-sm text-[var(--text-gray)] line-clamp-4 font-medium leading-relaxed opacity-80 mb-8 relative z-10 italic">
                      {stripHtml(post.content)}
                    </p>

                    <div className="mt-auto flex items-center justify-between pt-8 border-t border-[var(--border-color)] relative z-10">
                      <div className="w-10 h-10 border border-purple-600/20 flex items-center justify-center group-hover:bg-purple-600 group-hover:border-purple-600 transition-all duration-500">
                        <ArrowUpRight
                          size={16}
                          className="text-purple-600 group-hover:text-white transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {!loading && filteredPosts.length === 0 && (
            <div
              className="py-40 text-center border border-dashed border-[var(--border-color)] bg-[var(--bg-card)]/50 backdrop-blur-sm rounded-3xl"
              data-aos="zoom-in"
            >
              <BookOpen size={48} className="mx-auto text-purple-600/50 mb-6" />
              <h4 className="text-2xl font-black text-[var(--text-dark)] uppercase italic tracking-tighter mb-2">
                Упс, порожньо
              </h4>
              <p className="label-mono opacity-60">
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
