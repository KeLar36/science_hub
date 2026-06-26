/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useMemo } from "react";
import axiosInstance from "../api/axios";
import { BookOpen, Terminal } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import UniversalFilters from "../components/UniversalFilters";
import BlogCard from "../components/BlogCard";

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

      <main className="max-w-7xl mx-auto px-4 md:px-6 pt-36 pb-24">
        <header className="mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-purple-500/10 italic">
            <Terminal size={11} /> Блог платформи
          </div>
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight max-w-2xl leading-none">
            Матеріали, інсайти та{" "}
            <span className="text-purple-600 dark:text-purple-400 italic">
              поради для вчених
            </span>
          </h1>
        </header>

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
                  className="bg-[var(--bg-card)] border border-[var(--border-color)] p-6 rounded-3xl h-56 animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <BlogCard key={post._id} post={post} />
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
