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
    <div className="min-h-screen bg-[var(--bg-main)] flex flex-col font-['Plus_Jakarta_Sans',_sans-serif] transition-colors duration-300">
      <Toaster position="bottom-right" />
      <Navbar />

      <main className="flex-grow max-w-4xl mx-auto px-4 w-full pt-28 pb-20 flex flex-col gap-5">
        <div data-aos="fade-right">
          <button
            onClick={() => navigate("/blog")}
            className="flex items-center gap-2 text-[var(--text-gray)] hover:text-[var(--text-dark)] text-xs font-bold transition-colors group"
          >
            <ChevronLeft
              size={16}
              className="group-hover:-translate-x-0.5 transition-transform"
            />
            Назад до блогу
          </button>
        </div>

        <header
          className="bento-card p-6 md:p-10 rounded-3xl flex flex-col gap-4 animate-reveal"
          data-aos="fade-up"
        >
          <div>
            <span className="inline-block px-2.5 py-1 bg-purple-500/10 text-[#6d28d9] dark:text-[#a78bfa] rounded-lg text-[10px] font-black uppercase tracking-wider mb-4">
              {post.category}
            </span>
            <h1 className="text-3xl md:text-4xl font-black text-[var(--text-dark)] tracking-tight leading-tight">
              {post.title}
            </h1>
          </div>

          <div className="flex flex-wrap gap-3 pt-4 border-t border-[var(--border-color)]">
            <div className="flex items-center gap-2 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-4 py-2 text-xs font-bold text-[var(--text-main)]">
              <User size={14} className="text-[#6d28d9]" />
              <span className="text-[var(--text-gray)] font-medium">
                Автор:
              </span>{" "}
              {post.authorId?.name || "Admin"}
            </div>
            <div className="flex items-center gap-2 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-4 py-2 text-xs font-bold text-[var(--text-main)]">
              <Calendar size={14} className="text-purple-500" />
              <span className="text-[var(--text-gray)] font-medium">
                Опубліковано:
              </span>{" "}
              {new Date(post.createdAt).toLocaleDateString()}
            </div>
          </div>
        </header>

        <article
          className="bento-card p-6 md:p-10 rounded-3xl animate-reveal"
          data-aos="fade-up"
          data-aos-delay="50"
        >
          <div className="post-content-container" lang="uk">
            {parse(getHyphenatedHtml(post.content || ""))}
          </div>
        </article>

        <footer
          className="bento-card p-4 md:p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4 animate-reveal"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-center sm:justify-start">
            {[
              { e: "🔥", l: "fire" },
              { e: "❤️", l: "heart" },
              { e: "👏", l: "clap" },
              { e: "💡", l: "idea" },
            ].map((item) => (
              <button
                key={item.l}
                onClick={() => handleReaction(item.l)}
                className="flex items-center gap-2 px-3 py-1.5 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl hover:border-[#6d28d9] transition-all active:scale-95 group"
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

          <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-end">
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast.success("Посилання скопійовано");
              }}
              className="flex items-center gap-2 px-4 py-2.5 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl text-xs font-bold text-[var(--text-gray)] hover:text-[#6d28d9] hover:border-[#6d28d9] transition-all"
            >
              <Share2 size={14} /> Поділитись
            </button>

            <button
              onClick={handleBookmark}
              className={`p-2.5 border rounded-xl transition-all ${
                isBookmarked
                  ? "bg-[#6d28d9] border-[#6d28d9] text-white"
                  : "bg-[var(--bg-main)] border-[var(--border-color)] text-[var(--text-gray)] hover:border-[#6d28d9] hover:text-[#6d28d9]"
              }`}
            >
              <Bookmark
                size={14}
                fill={isBookmarked ? "currentColor" : "none"}
              />
            </button>

            <button
              onClick={() => setShowComments(true)}
              className="flex items-center gap-2 bg-[#6d28d9] hover:bg-[#5b21b6] text-white px-5 py-2.5 rounded-xl font-black text-xs transition-all shadow-md shadow-purple-500/10"
            >
              <MessageSquare size={14} /> Обговорення ({comments.length})
            </button>
          </div>
        </footer>
      </main>

      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-xs z-[999] transition-opacity duration-300 ${showComments ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setShowComments(false)}
      />

      <aside
        className={`sidebar-drawer bg-[var(--bg-card)] border-l border-[var(--border-color)] shadow-2xl ${
          showComments ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-5 border-b border-[var(--border-color)] flex justify-between items-center">
          <h3 className="text-sm font-black text-[var(--text-dark)] uppercase tracking-wider">
            Коментарі ({comments.length})
          </h3>
          <button
            onClick={() => setShowComments(false)}
            className="p-1.5 hover:bg-[var(--bg-main)] rounded-lg transition-colors text-[var(--text-gray)] hover:text-[var(--text-dark)]"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-5 space-y-4 custom-scrollbar">
          {comments.map((c) => (
            <div key={c._id} className="flex gap-3 animate-reveal">
              <div className="w-7 h-7 rounded-lg bg-purple-500/10 flex items-center justify-center text-[#6d28d9] text-[10px] font-black shrink-0">
                {(c.user?.name || "U").charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col max-w-[85%] w-full">
                {" "}
                <span className="text-[10px] font-black text-[var(--text-gray)] mb-0.5">
                  {c.user?.name || "Користувач"}
                </span>
                <div className="p-3 rounded-2xl text-xs font-medium bg-[var(--bg-main)] text-[var(--text-dark)] border border-[var(--border-color)] rounded-tl-none leading-relaxed break-words break-all whitespace-pre-wrap">
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
              className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl px-4 py-3 pr-10 text-xs font-medium focus:border-[#6d28d9] outline-none transition-all"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 p-1.5 bg-[#6d28d9] text-white rounded-lg hover:bg-[#5b21b6] transition-colors flex items-center justify-center"
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
