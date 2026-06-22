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
  Search,
  Calendar,
  Tag,
  Settings2,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import toast, { Toaster } from "react-hot-toast";

const ContentPanel = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
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
      console.error("Помилка завантаження контенту:", err);
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
      setPosts(posts.filter((p) => p._id !== id));
      toast.success("Статтю видалено успішно");
    } catch (err) {
      console.error("Помилка при видаленні:", err);
      toast.error(err.response?.data?.message || "Помилка при видаленні");
    }
  };

  const filteredPosts = posts.filter((p) =>
    (p.title || "").toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-[var(--bg-main)] flex flex-col transition-colors duration-500">
      <Toaster position="bottom-right" />
      <Navbar />

      <main className="flex-grow pt-28 pb-20 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
            <div>
              <div className="flex items-center gap-2 text-[var(--purple-main)] mb-1">
                <Settings2 size={16} />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                  System Manager
                </span>
              </div>
              <h1 className="text-4xl font-black text-[var(--text-dark)] tracking-tight uppercase italic">
                Контент<span className="text-[var(--purple-main)]">.</span>
              </h1>
            </div>

            <button
              onClick={() => navigate("/content-management")}
              className="flex items-center gap-2 bg-[var(--purple-main)] text-white px-6 py-3 rounded-xl font-bold text-sm transition-all hover:bg-[var(--text-dark)] hover:-translate-y-0.5 shadow-lg shadow-purple-500/10 active:translate-y-0"
            >
              <Plus size={18} />
              Створити пост
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-8">
            <div className="md:col-span-9 relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-gray)] group-focus-within:text-[var(--purple-main)] transition-colors">
                <Search size={18} />
              </div>
              <input
                type="text"
                placeholder="Пошук публікацій за назвою..."
                className="w-full py-4 pl-12 pr-4 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl text-sm font-medium outline-none focus:border-[var(--purple-main)] focus:ring-4 focus:ring-purple-500/5 transition-all text-[var(--text-dark)]"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="md:col-span-3 bg-[var(--bg-card)] border border-[var(--border-color)] p-4 rounded-2xl flex items-center justify-between">
              <span className="text-[10px] font-black text-[var(--text-gray)] uppercase tracking-widest">
                Постів:
              </span>
              <span className="text-xl font-black text-[var(--text-dark)] italic">
                {posts.length}
              </span>
            </div>
          </div>

          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[24px] overflow-hidden">
            {loading ? (
              <div className="p-24 text-center">
                <div className="w-10 h-10 border-2 border-slate-500/10 border-t-[var(--purple-main)] rounded-full animate-spin mx-auto"></div>
              </div>
            ) : filteredPosts.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[var(--bg-main)]/50 border-b border-[var(--border-color)]">
                      <th className="p-5 text-[10px] font-black uppercase text-[var(--text-gray)] tracking-widest">
                        Назва та обкладинка
                      </th>
                      <th className="p-5 text-[10px] font-black uppercase text-[var(--text-gray)] tracking-widest hidden sm:table-cell text-center">
                        Тип
                      </th>
                      <th className="p-5 text-[10px] font-black uppercase text-[var(--text-gray)] tracking-widest hidden md:table-cell text-center">
                        Дата
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
                        className="hover:bg-[var(--purple-main)]/[0.02] transition-colors group"
                      >
                        <td className="p-5">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] overflow-hidden shrink-0 shadow-sm">
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
                            <div>
                              <h3 className="font-bold text-[var(--text-dark)] text-sm mb-1 line-clamp-1 group-hover:text-[var(--purple-main)] transition-colors">
                                {post.title}
                              </h3>
                              <div className="sm:hidden flex items-center gap-2">
                                <span className="text-[9px] font-black text-[var(--purple-main)] uppercase tracking-tighter">
                                  {post.category}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-5 hidden sm:table-cell text-center">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] text-[10px] font-black text-[var(--text-dark)] uppercase tracking-tighter group-hover:border-[var(--purple-main)]/30 transition-colors">
                            <Tag
                              size={10}
                              className="text-[var(--purple-main)]"
                            />
                            {post.category}
                          </span>
                        </td>
                        <td className="p-5 hidden md:table-cell text-center">
                          <div className="flex items-center justify-center gap-1.5 text-[var(--text-gray)] text-[11px] font-medium">
                            <Calendar size={12} className="opacity-50" />
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
                              className="w-9 h-9 flex items-center justify-center rounded-lg border border-[var(--border-color)] text-[var(--text-gray)] hover:text-blue-500 hover:border-blue-200 hover:bg-blue-50 transition-all"
                              title="Відкрити"
                            >
                              <ExternalLink size={16} />
                            </button>
                            <button
                              onClick={() => navigate(`/edit-post/${post._id}`)}
                              className="w-9 h-9 flex items-center justify-center rounded-lg border border-[var(--border-color)] text-[var(--text-gray)] hover:text-amber-500 hover:border-amber-200 hover:bg-amber-50 transition-all"
                              title="Редагувати"
                            >
                              <Edit3 size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(post._id)}
                              className="w-9 h-9 flex items-center justify-center rounded-lg border border-[var(--border-color)] text-[var(--text-gray)] hover:text-rose-500 hover:border-rose-200 hover:bg-rose-50 transition-all"
                              title="Видалити"
                            >
                              <Trash2 size={16} />
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
                <p className="text-xs font-bold text-[var(--text-gray)] uppercase tracking-widest">
                  Немає публікацій
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
