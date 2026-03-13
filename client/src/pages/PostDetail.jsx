/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import {
  Calendar,
  Clock,
  ChevronLeft,
  User,
  Share2,
  Bookmark,
  MessageSquare,
  X,
  Send,
  MessageCircle,
  Trash2,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import toast, { Toaster } from "react-hot-toast";

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const chatEndRef = useRef(null);
  const isAuth = !!localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (showComments) {
      scrollToBottom();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showComments, comments]);

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/posts/${id}`);
        setPost(res.data);
        if (res.data.comments) setComments(res.data.comments);

        const token = localStorage.getItem("token");
        if (token) {
          const savedRes = await axios.get(
            `${apiUrl}/api/users/bookmarks/check/${id}`,
          );
          setIsBookmarked(savedRes.data.isBookmarked);
        }
      } catch (err) {
        console.error("Помилка завантаження:", err);
        toast.error("Статтю не знайдено");
        navigate("/blog");
      } finally {
        setLoading(false);
      }
    };

    fetchPostData();
    window.scrollTo(0, 0);
  }, [id, navigate, apiUrl]);

  const handleBookmark = async () => {
    if (!isAuth) return toast.error("Будь ласка, увійдіть");
    setSaving(true);
    try {
      await axios.post(`${apiUrl}/api/users/bookmarks/toggle/${id}`);
      setIsBookmarked(!isBookmarked);
      toast.success(
        isBookmarked ? "Видалено з закладок" : "Збережено у профіль",
        {
          icon: "🔖",
          style: { borderRadius: "10px", background: "#1e1b4b", color: "#fff" },
        },
      );
    } catch (err) {
      toast.error("Помилка синхронізації");
    } finally {
      setSaving(false);
    }
  };

  const handleSendComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmitting) return;
    if (!isAuth) return toast.error("Спочатку увійдіть в акаунт");

    setIsSubmitting(true);
    try {
      const res = await axios.post(`${apiUrl}/api/posts/${id}/comment`, {
        text: newComment.trim(),
      });
      setComments([...comments, res.data]);
      setNewComment("");
      toast.success("Опубліковано");
    } catch (err) {
      toast.error(err.response?.data?.message || "Помилка надсилання");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Видалити цей коментар?")) return;
    try {
      await axios.delete(`${apiUrl}/api/posts/${id}/comment/${commentId}`);
      setComments(comments.filter((c) => c._id !== commentId));
      toast.success("Видалено");
    } catch (err) {
      toast.error("Не вдалося видалити");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-main)]">
        <div className="custom-loader border-t-[#6d28d9]"></div>
      </div>
    );

  if (!post) return null;

  return (
    <div className="min-h-screen bg-[var(--bg-main)] flex flex-col overflow-x-hidden transition-colors duration-500">
      <Toaster position="bottom-right" />
      <Navbar />

      <style>{`
        .article-content { text-align: justify; color: var(--text-main); line-height: 1.8; }
        .article-content blockquote { border-left: 4px solid #6d28d9; background: var(--purple-light); padding: 20px; border-radius: 0 20px 20px 0; font-style: italic; }
        .article-content p { margin-bottom: 1.5rem; }
        .article-content strong { color: #6d28d9; }
        
        .chat-sidebar {
          position: fixed; top: 0; right: 0; height: 100vh; width: 100%; max-width: 450px;
          background: var(--bg-card); z-index: 1000; box-shadow: -10px 0 30px rgba(0,0,0,0.1);
          transform: translateX(${showComments ? "0" : "100%"});
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex; flex-direction: column; border-left: 1px solid var(--border-color);
        }
        .chat-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.4); backdrop-filter: blur(4px);
          z-index: 999; opacity: ${showComments ? "1" : "0"};
          pointer-events: ${showComments ? "auto" : "none"}; transition: opacity 0.3s ease;
        }
        .comment-item:hover .delete-btn { opacity: 1; }
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: var(--border-color); border-radius: 10px; }
      `}</style>

      <main className="flex-grow">
        <div className="max-w-5xl mx-auto px-4 md:px-6 pt-12 md:pt-20">
          <button
            onClick={() => navigate("/blog")}
            className="flex items-center gap-2 text-[var(--text-gray)] hover:text-[#6d28d9] font-bold mb-8 group"
          >
            <ChevronLeft
              size={20}
              className="group-hover:-translate-x-1 transition-transform"
            />{" "}
            Назад до блогу
          </button>

          <div className="space-y-6 mb-12">
            <span className="inline-block px-4 py-1.5 bg-[var(--purple-light)] text-[#6d28d9] rounded-full text-xs font-black uppercase tracking-widest border border-[var(--border-color)]">
              {post.category}
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-[var(--text-dark)] leading-tight">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-[var(--text-gray)] border-y border-[var(--border-color)] py-6">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-[var(--purple-light)] rounded-full flex items-center justify-center text-[#6d28d9] font-bold border border-[var(--border-color)]">
                  {post.author?.name?.charAt(0) || <User size={20} />}
                </div>
                <span className="font-bold text-[var(--text-dark)]">
                  Автор платформи
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm font-medium">
                <Calendar size={16} />
                {new Date(post.createdAt).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-2 text-sm font-medium">
                <Clock size={16} />5 хв читання
              </div>
            </div>
          </div>

          <div className="max-w-3xl mx-auto">
            <div
              className="article-content prose prose-purple max-w-none mb-16"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            <div className="mt-20 pt-10 border-t border-[var(--border-color)] flex flex-col sm:flex-row justify-between items-center gap-6 mb-20">
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast.success("Скопійовано!");
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-[var(--bg-card)] border border-[var(--border-color)] hover:bg-[var(--purple-light)] rounded-xl transition-all font-bold text-[var(--text-gray)] hover:text-[#6d28d9]"
                >
                  <Share2 size={18} /> Поділитися
                </button>
                <button
                  onClick={handleBookmark}
                  disabled={saving}
                  className={`p-3 border transition-all rounded-xl ${isBookmarked ? "bg-[#6d28d9] border-[#6d28d9] text-white shadow-lg shadow-purple-500/30" : "bg-[var(--bg-card)] border-[var(--border-color)] text-[var(--text-gray)] hover:bg-[var(--purple-light)] hover:text-[#6d28d9]"}`}
                >
                  <Bookmark
                    size={18}
                    fill={isBookmarked ? "currentColor" : "none"}
                  />
                </button>
              </div>

              <button
                onClick={() => setShowComments(true)}
                className="flex items-center gap-2 bg-[#6d28d9] text-white px-8 py-4 rounded-2xl font-black hover:scale-105 active:scale-95 transition-all shadow-xl shadow-purple-500/25 group"
              >
                <MessageSquare
                  size={20}
                  className="group-hover:rotate-12 transition-transform"
                />
                Обговорити{" "}
                <span className="ml-1 opacity-70">({comments.length})</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      <div
        className="chat-overlay"
        onClick={() => setShowComments(false)}
      ></div>
      <aside className="chat-sidebar">
        <div className="p-6 border-b border-[var(--border-color)] flex justify-between items-center bg-[var(--bg-card)]">
          <div>
            <h3 className="text-xl font-black text-[var(--text-dark)]">
              Коментарі
            </h3>
            <p className="text-[10px] text-[var(--text-gray)] font-bold uppercase truncate max-w-[250px]">
              {post.title}
            </p>
          </div>
          <button
            onClick={() => setShowComments(false)}
            className="p-2 hover:bg-[var(--purple-light)] text-[var(--text-gray)] rounded-xl transition-all"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-6 space-y-8 bg-[var(--bg-main)] custom-scrollbar">
          {comments.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-60">
              <div className="w-20 h-20 bg-[var(--purple-light)] rounded-full flex items-center justify-center text-[#6d28d9] mb-4">
                <MessageCircle size={40} />
              </div>
              <p className="font-black text-[var(--text-dark)] uppercase tracking-tighter">
                Поки що тихо
              </p>
              <p className="text-xs text-[var(--text-gray)] mt-1">
                Будьте першим, хто висловиться!
              </p>
            </div>
          ) : (
            comments.map((c) => {
              const commentName = c.user?.name || "Користувач";
              const commentUserId = c.user?.id || c.user?._id;
              const isMyComment =
                commentUserId === user?.id || commentUserId === user?._id;

              return (
                <div
                  key={c._id}
                  className={`flex gap-3 comment-item ${isMyComment ? "flex-row-reverse" : "flex-row"}`}
                >
                  {/* Аватарка */}
                  <div className="flex-shrink-0 w-9 h-9 rounded-full bg-[var(--purple-light)] border border-[var(--border-color)] flex items-center justify-center text-[#6d28d9] text-xs font-black shadow-sm">
                    {commentName.charAt(0).toUpperCase() || "U"}
                  </div>

                  <div
                    className={`flex flex-col ${isMyComment ? "items-end" : "items-start"} max-w-[75%]`}
                  >
                    <div className="flex items-center gap-2 mb-1 px-1">
                      <span className="text-[12px] font-black text-[var(--text-dark)] tracking-tight">
                        {commentName}
                      </span>
                      {isMyComment && (
                        <button
                          onClick={() => handleDeleteComment(c._id)}
                          className="delete-btn opacity-0 transition-opacity p-1 text-red-400 hover:text-red-600"
                        >
                          <Trash2 size={12} />
                        </button>
                      )}
                    </div>

                    <div
                      className={`p-4 rounded-[22px] text-sm leading-relaxed shadow-sm font-medium ${
                        isMyComment
                          ? "bg-[#6d28d9] text-white rounded-tr-none shadow-purple-500/10"
                          : "bg-[var(--bg-card)] text-[var(--text-dark)] border border-[var(--border-color)] rounded-tl-none"
                      }`}
                    >
                      {c.text}
                    </div>

                    <span className="text-[9px] text-[var(--text-gray)] mt-1.5 font-bold px-1">
                      {new Date(c.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              );
            })
          )}
          <div ref={chatEndRef} />
        </div>

        <form
          onSubmit={handleSendComment}
          className="p-6 bg-[var(--bg-card)] border-t border-[var(--border-color)]"
        >
          <div className="relative flex items-center group">
            <input
              type="text"
              placeholder={
                isAuth ? "Ваша думка..." : "Увійдіть, щоб коментувати"
              }
              disabled={!isAuth || isSubmitting}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full pl-5 pr-14 py-4 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-2xl outline-none focus:border-[#6d28d9] focus:ring-4 focus:ring-purple-500/5 font-medium text-[var(--text-dark)] transition-all placeholder:text-[var(--text-gray)] placeholder:opacity-50"
            />
            <button
              type="submit"
              disabled={!isAuth || !newComment.trim() || isSubmitting}
              className="absolute right-2 p-3 bg-[#6d28d9] text-white rounded-xl hover:bg-[#5b21b6] transition-all disabled:opacity-30 disabled:grayscale shadow-lg shadow-purple-500/20"
            >
              <Send size={18} />
            </button>
          </div>
        </form>
      </aside>

      <Footer />
    </div>
  );
};

export default PostDetail;
