/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useMemo } from "react";
import axiosInstance from "../api/axios";
import { BookOpen, Terminal, Sparkles, SlidersHorizontal } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import UniversalFilters from "../components/UniversalFilters";
import UniversalCard from "../components/UniversalCard";
import { CATEGORIES } from "../constants/categories";

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Всі");

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
        console.error("Помилка при завантаженні постів:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch =
        post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        activeCategory === "Всі" || post.category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [posts, searchQuery, activeCategory]);

  const filterDropdowns = [
    {
      value: activeCategory,
      onChange: setActiveCategory,
      options: CATEGORIES,
    },
  ];

  const handleResetFilters = () => {
    setSearchQuery("");
    setActiveCategory("Всі");
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-dark)] transition-colors duration-300">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 md:px-6 pt-32 pb-24">
        <div className="relative overflow-hidden rounded-[32px] border border-[var(--border-color)] bg-gradient-to-br from-[var(--bg-card)] via-[var(--bg-card)]/90 to-purple-600/[0.02] p-8 md:p-16 lg:p-20 shadow-xs transition-all duration-300 mb-12">
          <div className="absolute top-0 right-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/[0.06] blur-[140px] rounded-full pointer-events-none" />
          <div className="absolute -bottom-40 -left-20 w-[400px] h-[400px] bg-purple-500/[0.03] blur-[100px] rounded-full pointer-events-none" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
          <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-purple-600/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 backdrop-blur-xs animate-pulse">
              <Terminal size={11} />
              <span>База Знань Платформи</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight text-[var(--text-dark)] leading-[1.05]">
              Матеріали, Інсайти та <br />
              <span className="bg-clip-text text-transparent bg-purple-600 dark:bg-purple-400 italic">
                Поради для Вчених
              </span>
            </h1>

            <p className="text-sm md:text-base text-[var(--text-gray)] font-medium leading-relaxed max-w-2xl opacity-90 pt-2">
              Актуальні новини відкритої науки, практичні кейси з підготовки
              досліджень, керівництва з написання грантових заявок та аналітика
              екосистеми{" "}
              <span className="text-purple-600 font-bold dark:text-purple-400">
                Science Platform
              </span>
              .
            </p>

            <div className="pt-4 flex items-center gap-2 font-mono text-[9px] uppercase tracking-wider text-[var(--text-gray)] opacity-60">
              <SlidersHorizontal size={10} />
              <span>Використовуйте фільтри нижче для швидкої навігації</span>
            </div>
          </div>
        </div>

        <UniversalFilters
          searchTerm={searchQuery}
          setSearchTerm={setSearchQuery}
          searchPlaceholder="Шукати публікації за заголовком або контентом..."
          dropdowns={filterDropdowns}
          onReset={handleResetFilters}
        />

        <section className="mt-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="bg-[var(--bg-card)] border border-[var(--border-color)] p-6 rounded-3xl h-96 animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
              {filteredPosts.map((post) => (
                <UniversalCard key={post._id} item={post} variant="blog" />
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
