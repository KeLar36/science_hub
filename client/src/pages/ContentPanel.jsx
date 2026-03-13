/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import {
  Plus,
  Edit3,
  Trash2,
  Layout,
  FileText,
  ExternalLink,
  Search,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import toast, { Toaster } from "react-hot-toast";

const ContentPanel = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await axios.get(`${apiUrl}/api/posts`);
      setPosts(res.data);
    } catch (err) {
      toast.error("Не вдалося завантажити контент");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Ви впевнені, що хочете видалити цю статтю?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${apiUrl}/api/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(posts.filter((p) => p._id !== id));
      toast.success("Статтю видалено успішно");
    } catch (err) {
      toast.error("Помилка при видаленні");
    }
  };

  const filteredPosts = posts.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-[var(--bg-main)] flex flex-col transition-colors duration-300">
      <Toaster position="top-center" />
      <Navbar />

      <main className="flex-grow pt-32 pb-20 px-4 md:px-10">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <h1 className="text-5xl font-black text-[var(--text-dark)] tracking-tight flex items-center gap-4">
                <Layout className="text-[#6d28d9]" size={42} />
                Контент
              </h1>
              <p className="text-[var(--text-gray)] font-bold mt-2">
                Керування публікаціями вашої платформи
              </p>
            </div>

            <button
              onClick={() => navigate("/content-management")}
              className="bg-[#6d28d9] text-white px-8 py-4 rounded-2xl font-black hover:scale-105 active:scale-95 transition-all shadow-xl shadow-purple-500/20 flex items-center gap-2 w-fit"
            >
              <Plus size={20} /> Створити пост
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative mb-8">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-gray)] opacity-50"
              size={20}
            />
            <input
              type="text"
              placeholder="Пошук за заголовком..."
              className="w-full p-4 pl-12 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl outline-none focus:border-[#6d28d9] transition-all text-[var(--text-dark)]"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[32px] overflow-hidden shadow-sm transition-colors duration-300">
            {loading ? (
              <div className="p-20 text-center font-black text-[#6d28d9] animate-pulse">
                Завантаження...
              </div>
            ) : filteredPosts.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-[var(--bg-main)] border-b border-[var(--border-color)] transition-colors duration-300">
                    <tr>
                      <th className="p-6 text-[10px] font-black uppercase text-[var(--text-gray)] tracking-widest">
                        Стаття
                      </th>
                      <th className="p-6 text-[10px] font-black uppercase text-[var(--text-gray)] tracking-widest">
                        Категорія
                      </th>
                      <th className="p-6 text-[10px] font-black uppercase text-[var(--text-gray)] tracking-widest">
                        Дата
                      </th>
                      <th className="p-6 text-[10px] font-black uppercase text-[var(--text-gray)] tracking-widest text-right">
                        Дії
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-color)]">
                    {filteredPosts.map((post) => (
                      <tr
                        key={post._id}
                        className="hover:bg-purple-50/10 transition-colors group"
                      >
                        <td className="p-6">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-[var(--bg-main)] border border-[var(--border-color)] overflow-hidden flex-shrink-0 flex items-center justify-center">
                              {post.coverImage ? (
                                <img
                                  src={post.coverImage}
                                  className="w-full h-full object-cover"
                                  alt=""
                                />
                              ) : (
                                <FileText
                                  className="text-[var(--text-gray)] opacity-40"
                                  size={24}
                                />
                              )}
                            </div>
                            <span className="font-bold text-[var(--text-dark)] line-clamp-1 group-hover:text-[#6d28d9] transition-colors">
                              {post.title}
                            </span>
                          </div>
                        </td>
                        <td className="p-6">
                          <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800 rounded-full text-[10px] font-black uppercase text-[#6d28d9]">
                            {post.category}
                          </span>
                        </td>
                        <td className="p-6 text-sm font-bold text-[var(--text-gray)]">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-6">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => navigate(`/blog/${post._id}`)}
                              className="p-2.5 text-blue-500 hover:bg-blue-500/10 rounded-xl transition-all"
                              title="Переглянути"
                            >
                              <ExternalLink size={18} />
                            </button>
                            <button
                              onClick={() => navigate(`/edit-post/${post._id}`)}
                              className="p-2.5 text-amber-500 hover:bg-amber-500/10 rounded-xl transition-all"
                              title="Редагувати"
                            >
                              <Edit3 size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(post._id)}
                              className="p-2.5 text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                              title="Видалити"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-20 text-center font-bold text-[var(--text-gray)]">
                Публікацій не знайдено
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
