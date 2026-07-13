/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";
import { X, Send } from "lucide-react";
import axiosInstance from "../../../api/axios";
import toast from "react-hot-toast";

export default function CommentsDrawer({
  postId,
  isOpen,
  onClose,
  onCommentAdded,
  isAuthenticated,
}) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const chatEndRef = useRef(null);

  const fetchComments = async () => {
    if (!isOpen) return;
    try {
      const res = await axiosInstance.get(`/posts/${postId}/comments`);
      setComments(res.data);
    } catch (err) {
      console.error("💥 Не вдалося завантажити коментарі:", err);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [isOpen, postId]);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen, comments]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated)
      return toast.error("Увійдіть до системи, щоб залишити коментар");
    if (!newComment.trim() || submitting) return;

    try {
      setSubmitting(true);
      const res = await axiosInstance.post(`/posts/${postId}/comment`, {
        text: newComment.trim(),
      });
      setComments([...comments, res.data]);
      setNewComment("");
      onCommentAdded();
    } catch (err) {
      toast.error("Не вдалося надіслати коментар");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-xs z-[999] transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />

      <aside
        className={`sidebar-drawer bg-[var(--bg-card)] border-l border-[var(--border-color)] shadow-2xl z-[1000] ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="p-5 border-b border-[var(--border-color)] flex justify-between items-center">
          <h3 className="text-sm font-black text-[var(--text-dark)] uppercase tracking-wider m-0">
            Коментарі ({comments.length})
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-[var(--bg-main)] rounded-lg text-[var(--text-gray)] cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-5 space-y-4 custom-scrollbar">
          {comments.map((c) => (
            <div
              key={c._id}
              className="flex gap-3 text-left animate-in fade-in duration-200"
            >
              <div className="w-7 h-7 rounded-lg bg-purple-600/10 flex items-center justify-center text-purple-600 text-[10px] font-black shrink-0 uppercase border border-purple-500/10">
                {(c.userId?.name || "U").charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col max-w-[85%] w-full">
                <span className="text-[10px] font-black text-[var(--text-gray)] mb-0.5">
                  {c.userId?.name || "Користувач"}
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
          onSubmit={handleSubmit}
          className="p-4 border-t border-[var(--border-color)] bg-[var(--bg-main)]/30 mt-auto"
        >
          <div className="relative">
            <input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={
                isAuthenticated
                  ? "Напишіть коментар..."
                  : "Авторизуйтесь, щоб коментувати"
              }
              disabled={!isAuthenticated}
              className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl px-4 py-3 pr-10 text-xs font-medium focus:border-purple-600 outline-none transition-all text-[var(--text-dark)]"
            />
            {isAuthenticated && (
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 p-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center cursor-pointer"
              >
                <Send size={14} />
              </button>
            )}
          </div>
        </form>
      </aside>
    </>
  );
}
