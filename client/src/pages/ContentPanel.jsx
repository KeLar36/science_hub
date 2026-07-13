/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";
import {
  Plus,
  Edit3,
  Trash2,
  FileText,
  ExternalLink,
  Calendar,
  Tag,
  Settings2,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import UniversalFilters from "../components/UniversalFilters";
import { CATEGORIES } from "../constants/categories";
import toast, { Toaster } from "react-hot-toast";

const ContentPanel = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Всі");
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/posts");
      setPosts(res.data);
    } catch (err) {
      console.error("💥 Помилка завантаження контенту:", err);
      toast.error(
        err.response?.data?.message || "Не вдалося завантажити контент",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Ви впевнені, що хочете видалити цю статтю?")) return;
    try {
      await axiosInstance.delete(`/posts/${id}`);
      setPosts(postsArray.filter((p) => p._id !== id));
      toast.success("Статтю видалено успішно! 💜");
    } catch (err) {
      console.error("💥 Помилка при видаленні:", err);
      toast.error(err.response?.data?.message || "Помилка при видаленні");
    }
  };

  const postsArray = Array.isArray(posts)
    ? posts
    : posts?.items || posts?.posts || [];

  const filteredPosts = postsArray.filter((p) => {
    const matchesSearch = (p.title || "")
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === "Всі" || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleResetFilters = () => {
    setSearch("");
    setSelectedCategory("Всі");
  };

  const filterDropdowns = [
    {
      value: selectedCategory,
      onChange: setSelectedCategory,
      options: CATEGORIES, // Використовуємо твій масив констант
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-main)] flex flex-col transition-colors duration-500 select-none">
      <Toaster position="bottom-right" />
      <Navbar />

      <main className="flex-grow pt-28 pb-20 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10 text-left">
            <div>
              <div className="flex items-center gap-2 text-purple-600 mb-1">
                <Settings2 size={16} className="stroke-[2.5]" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                  System Manager
                </span>
              </div>
              <h1 className="text-4xl font-black text-[var(--text-dark)] tracking-tight uppercase italic m-0">
                Контент<span className="text-purple-600">.</span>
              </h1>
            </div>

            <button
              onClick={() => navigate("/content-management")}
              className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3.5 rounded-xl font-black uppercase text-xs tracking-wider transition-all hover:bg-purple-700 hover:-translate-y-0.5 shadow-lg shadow-purple-500/10 active:translate-y-0 cursor-pointer"
            >
              <Plus size={16} className="stroke-[3]" />
              Створити пост
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6 items-start">
            <div className="md:col-span-9">
              <UniversalFilters
                searchTerm={search}
                setSearchTerm={setSearch}
                searchPlaceholder="Пошук публікацій за назвою..."
                dropdowns={filterDropdowns}
                onReset={handleResetFilters}
              />
            </div>

            <div className="md:col-span-3 bg-[var(--bg-card)] border border-[var(--border-color)] p-5 h-[62px] rounded-2xl flex items-center justify-between shadow-xs">
              <span className="text-[10px] font-black text-[var(--text-gray)] uppercase tracking-widest">
                Знайдено постів:
              </span>
              <span className="text-xl font-black text-[var(--text-dark)] italic">
                {filteredPosts.length}
              </span>
            </div>
          </div>

          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[24px] overflow-hidden shadow-xs">
            {loading ? (
              <div className="p-24 text-center">
                <div className="w-10 h-10 border-2 border-[var(--border-color)] border-t-purple-600 rounded-full animate-spin mx-auto"></div>
              </div>
            ) : filteredPosts.length > 0 ? (
              <div className="overflow-x-auto text-left">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[var(--bg-main)]/50 border-b border-[var(--border-color)]">
                      <th className="p-5 text-[10px] font-black uppercase text-[var(--text-gray)] tracking-widest">
                        Назва та обкладинка
                      </th>
                      <th className="p-5 text-[10px] font-black uppercase text-[var(--text-gray)] tracking-widest hidden sm:table-cell text-center">
                        Категорія
                      </th>
                      <th className="p-5 text-[10px] font-black uppercase text-[var(--text-gray)] tracking-widest hidden md:table-cell text-center">
                        Дата створення
                      </th>
                      <th className="p-5 text-[10px] font-black uppercase text-[var(--text-gray)] tracking-widest text-right">
                        Дії
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-color)]">
                    {filteredPosts.map((post) => (
                      <tr
                        key={post._id}
                        className="hover:bg-purple-600/[0.01] transition-colors group"
                      >
                        <td className="p-5">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] overflow-hidden shrink-0 shadow-xs">
                              {post.coverImage || post.image ? (
                                <img
                                  src={post.coverImage || post.image}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                  alt=""
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-[var(--text-gray)] opacity-30">
                                  <FileText size={20} />
                                </div>
                              )}
                            </div>
                            <div className="truncate max-w-[220px] sm:max-w-xs md:max-w-md">
                              <h3 className="font-bold text-[var(--text-dark)] text-sm mb-1 truncate group-hover:text-purple-600 transition-colors m-0">
                                {post.title}
                              </h3>
                              <div className="sm:hidden flex items-center gap-2">
                                <span className="text-[9px] font-black text-purple-600 bg-purple-600/10 px-1.5 py-0.5 rounded uppercase tracking-tighter">
                                  {post.category}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-5 hidden sm:table-cell text-center">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] text-[10px] font-black text-[var(--text-dark)] uppercase tracking-tighter group-hover:border-purple-600/30 transition-colors">
                            <Tag size={10} className="text-purple-600" />
                            {post.category}
                          </span>
                        </td>
                        <td className="p-5 hidden md:table-cell text-center">
                          <div className="flex items-center justify-center gap-1.5 text-[var(--text-gray)] text-[11px] font-semibold font-mono">
                            <Calendar
                              size={12}
                              className="opacity-50 text-purple-600"
                            />
                            {post.createdAt
                              ? new Date(post.createdAt).toLocaleDateString(
                                  "uk-UA",
                                )
                              : "—"}
                          </div>
                        </td>
                        <td className="p-5">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => navigate(`/blog/${post._id}`)}
                              className="w-9 h-9 flex items-center justify-center rounded-xl border border-[var(--border-color)] text-[var(--text-gray)] hover:text-purple-600 hover:border-purple-500/30 hover:bg-purple-600/5 transition-all cursor-pointer"
                              title="Відкрити публікацію"
                            >
                              <ExternalLink size={15} />
                            </button>
                            <button
                              onClick={() => navigate(`/edit-post/${post._id}`)}
                              className="w-9 h-9 flex items-center justify-center rounded-xl border border-[var(--border-color)] text-[var(--text-gray)] hover:text-purple-600 hover:border-purple-500/30 hover:bg-purple-600/5 transition-all cursor-pointer"
                              title="Редагувати параметри"
                            >
                              <Edit3 size={15} />
                            </button>
                            <button
                              onClick={() => handleDelete(post._id)}
                              className="w-9 h-9 flex items-center justify-center rounded-xl border border-[var(--border-color)] text-[var(--text-gray)] hover:text-rose-600 hover:border-rose-500/30 hover:bg-rose-600/5 transition-all cursor-pointer"
                              title="Видалити пост"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-20 text-center">
                <FileText
                  className="mx-auto mb-3 text-[var(--border-color)]"
                  size={40}
                />
                <p className="text-xs font-bold text-[var(--text-gray)] uppercase tracking-widest m-0">
                  Немає публікацій за обраними критеріями
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ContentPanel;
