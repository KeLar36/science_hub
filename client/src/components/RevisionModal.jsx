import React, { useState } from "react";
import { X, UploadCloud, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import axios from "../api/axios";

export default function RevisionModal({
  isOpen,
  onClose,
  article,
  onUploadSuccess,
}) {
  const [file, setFile] = useState(null);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  if (!isOpen || !article) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return toast.error("Будь ласка, додайте виправлений PDF файл!");

    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "authorComment",
      comment || "Виправлена версія за зауваженнями",
    );

    setLoading(true);
    try {
      await axios.patch(
        `${apiUrl}/api/projects/revision/${article._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      toast.success("Нову версію успішно надіслано!");
      onUploadSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.error || "Помилка оновлення версії");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-[var(--bg-card)] rounded-3xl border border-[var(--border-color)] p-6 md:p-8 shadow-xl animate-in fade-in zoom-in-95 duration-150">
        <div className="flex justify-between items-start gap-4 mb-4">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-[var(--text-dark)]">
              Доопрацювання роботи
            </h2>
            <p className="text-xs text-[var(--text-gray)] font-medium mt-1 line-clamp-1">
              {article.title}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-[var(--bg-main)] text-[var(--text-gray)] hover:text-[var(--text-dark)] rounded-xl transition-all shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        {article.reviewerComments && (
          <div className="mb-5 p-3.5 bg-amber-500/[0.04] border border-amber-500/20 rounded-xl">
            <span className="text-[10px] font-bold tracking-wider uppercase text-amber-600 dark:text-amber-400 block mb-1">
              Зауваження рецензента:
            </span>
            <p className="text-xs text-[var(--text-dark)] font-medium italic leading-relaxed">
              "{article.reviewerComments}"
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[var(--text-gray)] ml-1">
              Нова версія документа (PDF)
            </label>
            <div className="relative h-[48px] group">
              <input
                type="file"
                accept=".pdf"
                className="absolute inset-0 opacity-0 cursor-pointer z-20"
                onChange={(e) => setFile(e.target.files[0])}
                required
              />
              <div
                className={`absolute inset-0 border border-dashed rounded-xl flex items-center px-4 gap-2.5 transition-all ${
                  file
                    ? "border-emerald-500/50 bg-emerald-500/[0.02]"
                    : "border-[var(--border-color)] bg-[var(--bg-main)]"
                }`}
              >
                <UploadCloud
                  size={16}
                  className={file ? "text-emerald-500" : "text-purple-600"}
                />
                <span className="text-xs font-medium truncate text-[var(--text-dark)]">
                  {file ? file.name : "Завантажити виправлену працю..."}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[var(--text-gray)] ml-1">
              Ваш коментар до виправлень
            </label>
            <textarea
              className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl p-3 outline-none focus:border-purple-600 text-xs min-h-[80px] resize-none text-[var(--text-dark)]"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Опишіть, що саме було виправлено згідно із зауваженнями..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md shadow-purple-600/10 transition-all"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            {loading ? "Відправка..." : "Надіслати оновлену версію"}
          </button>
        </form>
      </div>
    </div>
  );
}
