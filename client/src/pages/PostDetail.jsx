/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { ChevronLeft } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import toast, { Toaster } from "react-hot-toast";
import PostContent from "../components/Blog/Detail/PostContent";
import PostActions from "../components/Blog/Detail/PostActions";
import CommentsDrawer from "../components/Blog/Detail/CommentsDrawer";

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentsCount, setCommentsCount] = useState(0);

  const fetchPostData = async () => {
    try {
      setLoading(true);
      const [postRes, bookmarkRes] = await Promise.all([
        axiosInstance.get(`/posts/${id}`),
        isAuthenticated
          ? axiosInstance.get(`/users/bookmarks/check/${id}`)
          : null,
      ]);

      setPost(postRes.data);
      setCommentsCount(postRes.data.commentsCount || 0);

      if (bookmarkRes) {
        setIsBookmarked(bookmarkRes.data.isBookmarked);
      }
    } catch (err) {
      console.error("💥 Статтю не знайдено:", err);
      toast.error("Статтю не знайдено або її видалено з системи");
      navigate("/blog");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPostData();
    window.scrollTo(0, 0);
  }, [id, isAuthenticated]);

  const handleBookmark = async () => {
    if (!isAuthenticated)
      return toast.error("Будь ласка, увійдіть до системи для збереження");
    try {
      setSaving(true);
      await axiosInstance.post(`/users/bookmarks/toggle/${id}`);
      setIsBookmarked(!isBookmarked);
      toast.success(
        isBookmarked ? "Видалено з закладок" : "Збережено в закладки! 💜",
      );
    } catch (err) {
      toast.error("Помилка синхронізації закладок");
    } finally {
      setSaving(false);
    }
  };

  const handleReaction = async (type) => {
    if (!isAuthenticated)
      return toast.error("Будь ласка, увійдіть до системи для реакції");
    try {
      const res = await axiosInstance.post(`/posts/${id}/react`, { type });
      setPost((prev) => ({ ...prev, reactions: res.data.reactions }));
    } catch (err) {
      toast.error("Помилка при збереженні реакції");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-main)]">
        <div className="w-8 h-8 border-2 border-purple-500/20 border-t-purple-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-dark)] flex flex-col justify-between antialiased select-none">
      <Toaster position="bottom-right" />
      <Navbar />

      <main className="flex-grow max-w-4xl mx-auto px-4 py-12 mt-14 relative overflow-hidden w-full">
        <div className="absolute top-0 right-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/[0.02] blur-[120px] rounded-full pointer-events-none" />

        {/* Кнопка «Назад» */}
        <div className="mb-6 text-left">
          <button
            onClick={() => navigate("/blog")}
            className="group flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[var(--text-gray)] hover:text-[var(--text-dark)] transition-colors mb-8 cursor-pointer"
          >
            <ChevronLeft
              size={14}
              className="transform group-hover:-translate-x-0.5 transition-transform"
            />
            Назад до блогу
          </button>
        </div>

        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[32px] shadow-xs overflow-hidden backdrop-blur-xs">
          <PostContent post={post} />

          <PostActions
            post={post}
            commentsCount={commentsCount}
            isBookmarked={isBookmarked}
            saving={saving}
            onReaction={handleReaction}
            onBookmark={handleBookmark}
            onOpenComments={() => setShowComments(true)}
          />
        </div>
      </main>

      <CommentsDrawer
        postId={id}
        isOpen={showComments}
        onClose={() => setShowComments(false)}
        isAuthenticated={isAuthenticated}
        onCommentAdded={() => setCommentsCount((prev) => prev + 1)}
      />

      <Footer />
    </div>
  );
};

export default PostDetail;
