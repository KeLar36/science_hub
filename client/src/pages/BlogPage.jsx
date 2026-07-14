/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import UniversalFilters from "../components/UniversalFilters";
import { CATEGORIES } from "../constants/categories";
import BlogHeader from "../components/Blog/BlogHeader";
import BlogGrid from "../components/Blog/BlogGrid";

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Фільтри та пагінація
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Всі");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchPosts = async () => {
    try {
      setLoading(true);

      const params = {
        page,
        limit: 6,
        category: activeCategory,
        status: "published",
      };

      if (searchQuery.trim()) {
        params.search = searchQuery.trim();
      }

      const res = await axiosInstance.get("/posts", { params });

      if (res.data && Array.isArray(res.data.posts)) {
        setPosts(res.data.posts);
        setTotalPages(res.data.totalPages || 1);
      } else if (Array.isArray(res.data)) {
        setPosts(res.data);
        setTotalPages(1);
      }
    } catch (err) {
      console.error("💥 Помилка при завантаженні серверних постів блогу:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [activeCategory, page]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setPage(1);
      fetchPosts();
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setActiveCategory("Всі");
    setPage(1);
  };

  const filterDropdowns = [
    {
      value: activeCategory,
      onChange: (val) => {
        setPage(1);
        setActiveCategory(val);
      },
      options: CATEGORIES,
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-main)] flex flex-col transition-colors duration-500 select-none">
      <Navbar />

      <main className="flex-grow pt-28 pb-20 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <BlogHeader />

          <UniversalFilters
            searchTerm={searchQuery}
            setSearchTerm={setSearchQuery}
            searchPlaceholder="Пошук новин та статей за назвою..."
            dropdowns={filterDropdowns}
            onReset={handleResetFilters}
          />

          <BlogGrid posts={posts} loading={loading} />

          {!loading && totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-12">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-10 h-10 rounded-xl font-mono text-xs font-black transition-all border tracking-wider cursor-pointer ${
                    page === p
                      ? "bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-600/20 scale-105"
                      : "bg-[var(--bg-card)] text-[var(--text-dark)] border-[var(--border-color)] hover:border-purple-500/40"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Blog;
