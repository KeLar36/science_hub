/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef, useMemo } from "react";
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
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import toast, { Toaster } from "react-hot-toast";
import DOMPurify from "dompurify";

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

  const chatEndRef = useRef(null);
  const isAuth = !!localStorage.getItem("token");
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

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
        toast.error("Статтю не знайдено");
        navigate("/blog");
      } finally {
        setLoading(false);
      }
    };

    fetchPostData();
    window.scrollTo(0, 0);
  }, [id, navigate, apiUrl]);

  const getHyphenatedHtml = (html) => {
    if (!html) return "";
    return hypher.hyphenateText(html);
  };

  const handleBookmark = async () => {
    if (!isAuth) return toast.error("Будь ласка, увійдіть");
    setSaving(true);
    try {
      await axios.post(`${apiUrl}/api/users/bookmarks/toggle/${id}`);
      setIsBookmarked(!isBookmarked);
      toast.success(isBookmarked ? "Видалено" : "Збережено");
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
      const res = await axios.post(`${apiUrl}/api/posts/${id}/comment`, {
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
    if (!isAuth) return toast.error("Увійдіть");
    try {
      const res = await axios.post(`${apiUrl}/api/posts/${id}/react`, { type });
      setPost((prev) => ({ ...prev, reactions: res.data.reactions }));
    } catch (err) {
      toast.error("Помилка");
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
    <div className="min-h-screen bg-[var(--bg-main)] flex flex-col font-['Plus_Jakarta_Sans',_sans-serif]">
      <Toaster position="bottom-right" />
      <Navbar />

      <style>{`
  .post-content-container.prose {
    --tw-prose-body: var(--text-main);
    --tw-prose-headings: var(--text-dark);
    --tw-prose-bold: var(--text-dark);
    --tw-prose-counters: var(--purple-main);
    --tw-prose-bullets: var(--purple-main);
    max-width: none;
  }

  .post-content-container {
    hyphens: auto;
    -webkit-hyphens: auto;
    text-align: justify;
  }

  .post-content-container strong, 
  .post-content-container b {
    font-weight: 700 !important;
  }

  .post-card { background: var(--bg-card); border-radius: 32px; border: 1px solid var(--border-color); }
  .meta-item { background: var(--bg-main); border: 1px solid var(--border-color); border-radius: 16px; padding: 12px 20px; display: flex; align-items: center; gap: 12px; }
  
  .sidebar-anim { 
    transform: translateX(${showComments ? "0" : "100%"}); 
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1); 
  }
`}</style>

      <main className="flex-grow max-w-4xl mx-auto px-4 w-full pt-28 pb-20">
        <button
          onClick={() => navigate("/blog")}
          className="flex items-center gap-2 text-[var(--text-gray)] hover:text-[var(--text-dark)] text-sm font-bold mb-8 transition-colors group"
        >
          <ChevronLeft
            size={18}
            className="group-hover:-translate-x-1 transition-transform"
          />
          Назад до блогу
        </button>

        <article className="post-card overflow-hidden">
          <div className="p-8 md:p-12">
            <span className="inline-block px-3 py-1 bg-purple-500/10 text-[#6d28d9] rounded-lg text-[10px] font-black uppercase tracking-widest mb-6">
              {post.category}
            </span>

            <h1 className="text-4xl md:text-5xl font-black text-[var(--text-dark)] mb-10 tracking-tight leading-[1.1]">
              {post.title}
            </h1>

            <div className="flex flex-wrap gap-4 pt-8 border-t border-[var(--border-color)]">
              <div className="meta-item">
                <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center text-[#6d28d9]">
                  <User size={18} />
                </div>
                <div>
                  <p className="text-[9px] font-black text-[var(--text-gray)] uppercase">
                    Автор
                  </p>
                  <p className="text-sm font-bold text-[var(--text-dark)]">
                    {post.authorId?.name || "Admin"}
                  </p>
                </div>
              </div>
              <div className="meta-item">
                <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500">
                  <Calendar size={18} />
                </div>
                <div>
                  <p className="text-[9px] font-black text-[var(--text-gray)] uppercase">
                    Дата
                  </p>
                  <p className="text-sm font-bold text-[var(--text-dark)]">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="px-8 md:px-12 py-4">
            <div
              className="post-content-container text-lg"
              lang="uk"
              dangerouslySetInnerHTML={{
                __html: getHyphenatedHtml(post.content),
              }}
            />

            <div className="flex flex-wrap gap-3 mt-12 pt-8 border-t border-[var(--border-color)]">
              {[
                { e: "🔥", l: "fire" },
                { e: "❤️", l: "heart" },
                { e: "👏", l: "clap" },
                { e: "💡", l: "idea" },
              ].map((item) => (
                <button
                  key={item.l}
                  onClick={() => handleReaction(item.l)}
                  className="reaction-btn group"
                >
                  <span className="text-xl group-active:scale-125 transition-transform">
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
          </div>

          <div className="mt-8 p-6 md:p-8 bg-[var(--bg-main)]/30 border-t border-[var(--border-color)] flex flex-wrap justify-between items-center gap-4">
            <div className="flex gap-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success("Скопійовано");
                }}
                className="flex items-center gap-2 px-6 py-3 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl text-xs font-bold text-[var(--text-gray)] hover:text-[#6d28d9] transition-all"
              >
                <Share2 size={16} /> Поділитися
              </button>
              <button
                onClick={handleBookmark}
                className={`p-3 border rounded-2xl transition-all ${isBookmarked ? "bg-[#6d28d9] border-[#6d28d9] text-white" : "bg-[var(--bg-card)] border-[var(--border-color)] text-[var(--text-gray)]"}`}
              >
                <Bookmark
                  size={18}
                  fill={isBookmarked ? "currentColor" : "none"}
                />
              </button>
            </div>

            <button
              onClick={() => setShowComments(true)}
              className="flex items-center gap-3 bg-[#6d28d9] text-white px-10 py-4 rounded-2xl font-black text-sm hover:bg-[#5b21b6] transition-all shadow-lg shadow-purple-500/20"
            >
              <MessageSquare size={18} /> Обговорити ({comments.length})
            </button>
          </div>
        </article>
      </main>

      <div
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-[999] transition-opacity ${showComments ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setShowComments(false)}
      />
      <aside
        className={`fixed top-0 right-0 h-screen w-full max-w-[400px] bg-[var(--bg-card)] z-[1000] border-l border-[var(--border-color)] flex flex-col sidebar-anim`}
      >
        <div className="p-6 border-b border-[var(--border-color)] flex justify-between items-center">
          <h3 className="text-lg font-black text-[var(--text-dark)] uppercase tracking-tight">
            Коментарі
          </h3>
          <button
            onClick={() => setShowComments(false)}
            className="p-2 hover:bg-[var(--bg-main)] rounded-xl transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="flex-grow overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {comments.map((c) => (
            <div key={c._id} className="flex gap-3">
              <div className="w-8 h-8 rounded-xl bg-purple-500/10 flex items-center justify-center text-[#6d28d9] text-[10px] font-black shrink-0">
                {(c.user?.name || "U").charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col max-w-[80%]">
                <span className="text-[10px] font-black text-[var(--text-gray)] mb-1">
                  {c.user?.name}
                </span>
                <div className="p-3 rounded-2xl text-xs font-medium bg-[var(--bg-main)] text-[var(--text-dark)] border border-[var(--border-color)] rounded-tl-none">
                  {c.text}
                </div>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
        <form
          onSubmit={handleSendComment}
          className="p-6 border-t border-[var(--border-color)] bg-[var(--bg-main)]/50"
        >
          <div className="relative">
            <input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Напишіть щось..."
              className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl px-4 py-3.5 pr-12 text-xs font-medium focus:border-[#6d28d9] outline-none transition-all"
            />
            <button
              type="submit"
              className="absolute right-2 top-2 p-2 bg-[#6d28d9] text-white rounded-xl hover:bg-[#5b21b6]"
            >
              <Send size={16} />
            </button>
          </div>
        </form>
      </aside>

      <Footer />
    </div>
  );
};

export default PostDetail;
