/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import parse from "html-react-parser";
import axiosInstance from "../api/axios";
import { useAuth } from "../context/AuthContext";
import "../index.css";
import {
  Calendar,
  ChevronLeft,
  User,
  Share2,
  Bookmark,
  MessageSquare,
  X,
  Send,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import toast, { Toaster } from "react-hot-toast";
import Hypher from "hypher";
import ukrainian from "hyphenation.uk";

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
  const { user, isAuthenticated } = useAuth();
  const chatEndRef = useRef(null);

  const hypher = useMemo(() => new Hypher(ukrainian), []);

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
        const res = await axiosInstance.get(`/posts/${id}`);
        setPost(res.data);
        if (res.data.comments) setComments(res.data.comments);

        if (isAuthenticated) {
          const savedRes = await axiosInstance.get(
            `/users/bookmarks/check/${id}`,
          );
          setIsBookmarked(savedRes.data.isBookmarked);
        }
      } catch (err) {
        toast.error("Статтю не знайдено");
        navigate("/blog");
      } finally {
        setLoading(false);
      }
    };

    fetchPostData();
    window.scrollTo(0, 0);
  }, [id, navigate, isAuthenticated]);

  const getHyphenatedHtml = (html) => {
    if (!html) return "";
    return hypher.hyphenateText(html);
  };

  const handleBookmark = async () => {
    if (!isAuthenticated) return toast.error("Будь ласка, увійдіть");
    setSaving(true);
    try {
      await axiosInstance.post(`/users/bookmarks/toggle/${id}`);
      setIsBookmarked(!isBookmarked);
      toast.success(
        isBookmarked ? "Видалено з закладок" : "Збережено в закладки",
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
    setIsSubmitting(true);
    try {
      const res = await axiosInstance.post(`/posts/${id}/comment`, {
        text: newComment.trim(),
      });
      setComments([...comments, res.data]);
      setNewComment("");
    } catch (err) {
      toast.error("Помилка надсилання");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReaction = async (type) => {
    if (!isAuthenticated) return toast.error("Увійдіть для реакції");
    try {
      const res = await axiosInstance.post(`/posts/${id}/react`, { type });
      setPost((prev) => ({ ...prev, reactions: res.data.reactions }));
    } catch (err) {
      toast.error("Помилка при збереженні реакції");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-main)]">
        <div className="w-8 h-8 border-2 border-purple-500/20 border-t-purple-600 rounded-full animate-spin"></div>
      </div>
    );

  if (!post) return null;

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-dark)] flex flex-col justify-between antialiased">
      <Toaster position="bottom-right" />
      <Navbar />

      <main className="flex-grow max-w-4xl mx-auto px-4 py-12 mt-14 relative overflow-hidden w-full">
        <div className="absolute top-0 right-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/[0.03] blur-[120px] rounded-full pointer-events-none" />

        <div className="mb-6 text-left">
          <button
            onClick={() => navigate("/blog")}
            className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[var(--text-gray)] hover:text-[var(--text-dark)] transition-colors mb-8"
          >
            <ChevronLeft
              size={14}
              className="transform group-hover:-translate-x-0.5 transition-transform"
            />
            Назад до блогу
          </button>
        </div>

        {/* СТРУКТУРА КАРТКИ ОДИН В ОДИН З PROGRAM DETAILS */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[32px] shadow-xs overflow-hidden backdrop-blur-xs text-left">
          <div className="p-6 sm:p-10 md:p-12 border-b border-[var(--border-color)] space-y-6 bg-gradient-to-br from-transparent to-purple-600/[0.01]">
            <div className="flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-1.5 px-3 py-1 bg-purple-600/5 dark:bg-purple-500/10 border border-purple-500/15 rounded-xl text-[10px] font-black uppercase text-purple-600 dark:text-purple-400 tracking-wider">
                {post.category || "Публікація"}
              </span>

              <span className="flex items-center gap-1.5 px-3 py-1 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl text-[10px] font-bold text-[var(--text-gray)] uppercase tracking-wider">
                <Calendar
                  size={13}
                  className="text-purple-600 dark:text-purple-400"
                />
                Опубліковано:{" "}
                <strong className="text-[var(--text-dark)]">
                  {new Date(post.createdAt).toLocaleDateString("uk-UA")}
                </strong>
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[var(--text-dark)] uppercase tracking-tight leading-none italic">
              {post.title}
            </h1>
          </div>

          {/* БЛОК МЕТАДАННИХ ПРО АВТОРА */}
          <div className="bg-[var(--bg-main)]/40 border-b border-[var(--border-color)] p-6 sm:px-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl flex items-center gap-3 group hover:border-purple-500/20 transition-all">
                <div className="p-2 bg-[var(--bg-main)] border border-[var(--border-color)] text-purple-600 dark:text-purple-400 rounded-lg group-hover:scale-105 transition-transform shrink-0">
                  <User size={18} />
                </div>
                <div className="min-w-0 flex-grow">
                  <div className="text-[9px] font-mono font-bold text-[var(--text-gray)] uppercase tracking-wider block opacity-70">
                    Автор матеріалу
                  </div>
                  <div className="text-xs font-black text-[var(--text-dark)] uppercase tracking-wide truncate mt-0.5">
                    {post.authorId?.name || "Admin"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* КОНТЕНТ СТАТТІ З ТВОЇМИ ОРИГІНАЛЬНИМИ СТИЛЯМИ КЛАСУ PROSE */}
          <div className="p-6 sm:p-10 md:p-12 space-y-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-purple-600 dark:text-purple-400 font-mono">
              // Текст публікації
            </h3>

            <div
              className="prose dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed text-[var(--text-dark)] opacity-95
                w-full overflow-hidden break-words whitespace-pre-wrap
                [&_p]:mb-4 [&_p]:break-words
                [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4
                [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-4
                [&_li]:mb-1 [&_li]:break-words
                [&_strong]:font-bold [&_strong]:text-purple-600 dark:[&_strong]:text-purple-400
                [&_h1]:text-lg [&_h1]:font-black [&_h1]:uppercase [&_h1]:mt-6 [&_h1]:mb-3
                [&_h2]:text-base [&_h2]:font-black [&_h2]:uppercase [&_h2]:mt-5 [&_h2]:mb-2
                [&_h3]:text-sm [&_h3]:font-bold [&_h3]:uppercase [&_h3]:mt-4 [&_h3]:mb-2"
              dangerouslySetInnerHTML={{
                __html: post.content
                  ? post.content.replace(/&nbsp;/g, " ").replace(/\u00a0/g, " ")
                  : "",
              }}
            />
          </div>

          {/* НИЖНЯ ПАНЕЛЬ: РЕАКЦІЇ ТА КНОПКИ ДІЇ */}
          <div className="p-6 sm:p-10 md:p-12 bg-gradient-to-b from-transparent to-purple-600/[0.03] dark:to-purple-600/[0.01] border-t border-[var(--border-color)] flex flex-col items-center gap-6">
            {/* Панель реакцій */}
            <div className="flex flex-wrap justify-center gap-2 w-full">
              {[
                { e: "🔥", l: "fire" },
                { e: "❤️", l: "heart" },
                { e: "👏", l: "clap" },
                { e: "💡", l: "idea" },
              ].map((item) => (
                <button
                  key={item.l}
                  onClick={() => handleReaction(item.l)}
                  className="flex items-center gap-2 px-4 py-2 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl hover:border-purple-500/30 transition-all active:scale-95 group"
                >
                  <span className="text-base group-hover:scale-110 transition-transform">
                    {item.e}
                  </span>
                  <span className="text-xs font-black text-[var(--text-dark)]">
                    {Array.isArray(post.reactions?.[item.l])
                      ? post.reactions[item.l].length
                      : post.reactions?.[item.l] || 0}
                  </span>
                </button>
              ))}
            </div>

            {/* Системні кнопки дій */}
            <div className="flex flex-col sm:flex-row gap-3 w-full justify-center pt-2">
              <button
                onClick={() => setShowComments(true)}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3.5 rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-purple-600/10 flex items-center justify-center gap-2 italic transition-all"
              >
                <MessageSquare size={14} /> Обговорення ({comments.length})
              </button>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success("Посилання скопійовано");
                }}
                className="px-6 py-3.5 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl text-xs font-bold uppercase tracking-wider text-[var(--text-gray)] hover:text-purple-600 hover:border-purple-500/20 transition-all flex items-center justify-center gap-2"
              >
                <Share2 size={13} /> Поділитись
              </button>

              <button
                onClick={handleBookmark}
                disabled={saving}
                className={`p-3.5 border rounded-xl transition-all flex items-center justify-center ${
                  isBookmarked
                    ? "bg-amber-500 border-amber-500 text-white"
                    : "bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-gray)] hover:border-purple-500/20"
                }`}
              >
                <Bookmark
                  size={14}
                  fill={isBookmarked ? "currentColor" : "none"}
                />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* ШУХЛЯДА ДЛЯ КОМЕНТАРІВ */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-xs z-[999] transition-opacity duration-300 ${showComments ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setShowComments(false)}
      />

      <aside
        className={`sidebar-drawer bg-[var(--bg-card)] border-l border-[var(--border-color)] shadow-2xl ${showComments ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="p-5 border-b border-[var(--border-color)] flex justify-between items-center">
          <h3 className="text-sm font-black text-[var(--text-dark)] uppercase tracking-wider">
            Коментарі ({comments.length})
          </h3>
          <button
            onClick={() => setShowComments(false)}
            className="p-1.5 hover:bg-[var(--bg-main)] rounded-lg text-[var(--text-gray)]"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-5 space-y-4 custom-scrollbar">
          {comments.map((c) => (
            <div key={c._id} className="flex gap-3 text-left">
              <div className="w-7 h-7 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-600 text-[10px] font-black shrink-0 uppercase">
                {(c.user?.name || "U").charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col max-w-[85%] w-full">
                <span className="text-[10px] font-black text-[var(--text-gray)] mb-0.5">
                  {c.user?.name || "Користувач"}
                </span>
                <div className="p-3 rounded-2xl text-xs font-medium bg-[var(--bg-main)] text-[var(--text-dark)] border border-[var(--border-color)] rounded-tl-none leading-relaxed break-words whitespace-pre-wrap">
                  {c.text}
                </div>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        <form
          onSubmit={handleSendComment}
          className="p-4 border-t border-[var(--border-color)] bg-[var(--bg-main)]/30"
        >
          <div className="relative">
            <input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Напишіть коментар..."
              className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl px-4 py-3 pr-10 text-xs font-medium focus:border-purple-600 outline-none transition-all"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 p-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center"
            >
              <Send size={14} />
            </button>
          </div>
        </form>
      </aside>

      <Footer />
    </div>
  );
};

export default PostDetail;
