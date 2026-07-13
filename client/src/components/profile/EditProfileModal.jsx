import React, { useState, useEffect } from "react";
import {
  X,
  ChevronDown,
  Save,
  Linkedin,
  Github,
  Twitter,
  Upload,
} from "lucide-react";
import { UKRAINIAN_CITIES } from "../../constants/cities";

export default function EditProfileModal({
  isOpen,
  onClose,
  editForm,
  setEditForm,
  onSubmit,
}) {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [isOpen, previewUrl]);

  if (!isOpen) return null;

  const sortedCities = [...UKRAINIAN_CITIES].sort((a, b) =>
    a.localeCompare(b, "uk"),
  );

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("Зображення занадто важке! Максимум — 5 MB");
      return;
    }

    setError("");

    if (previewUrl) URL.revokeObjectURL(previewUrl);

    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);

    setEditForm({
      ...editForm,
      image: file,
    });
  };

  const renderAvatarSource = () => {
    if (previewUrl) return previewUrl;
    if (typeof editForm.image === "string" && editForm.image)
      return editForm.image;
    return null;
  };

  const avatarUrl = renderAvatarSource();

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="w-full max-w-xl bg-[var(--bg-card)] rounded-3xl border border-[var(--border-color)] p-8 overflow-y-auto max-h-[90vh] shadow-xl animate-in fade-in zoom-in-95 duration-150 text-left">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold tracking-tight">
            Редагування профілю
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-[var(--bg-main)] text-[var(--text-gray)] hover:text-[var(--text-dark)] rounded-xl transition-all cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          <div className="flex flex-col sm:flex-row items-center gap-5 bg-[var(--bg-main)] p-4 rounded-2xl border border-[var(--border-color)]">
            <div className="relative shrink-0">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Avatar Preview"
                  className="w-20 h-20 rounded-2xl object-cover border border-purple-600/20 shadow-inner"
                />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-purple-600/10 text-purple-600 flex items-center justify-center font-black text-2xl border border-purple-600/20 uppercase">
                  {editForm.name ? editForm.name[0] : "U"}
                </div>
              )}
            </div>

            <div className="flex-1 w-full text-center sm:text-left space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-gray)] block">
                Фото профілю
              </span>
              <p className="text-[11px] text-[var(--text-gray)] font-medium">
                Підтримуються формати JPG, JPEG або PNG. Максимум 5 MB.
              </p>

              <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm shadow-purple-600/10 mt-1">
                <Upload size={12} />
                Обрати фото
                <input
                  type="file"
                  className="hidden"
                  accept="image/jpeg, image/png, image/jpg"
                  onChange={handleFileChange}
                />
              </label>
            </div>
          </div>

          {error && (
            <div className="text-xs font-bold text-red-500 bg-red-500/5 border border-red-500/10 px-4 py-2 rounded-xl">
              ⚠️ {error}
            </div>
          )}

          {/* Поле: Ваше ім'я */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-gray)] ml-1">
              Ваше ім'я / Установа
            </label>
            <input
              type="text"
              required
              className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-4 py-3 outline-none focus:border-purple-600 transition-all text-sm text-[var(--text-dark)] font-semibold"
              value={editForm.name || ""}
              onChange={(e) =>
                setEditForm({ ...editForm, name: e.target.value })
              }
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-gray)] ml-1">
              Місто
            </label>
            <div className="relative">
              <select
                className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl pl-4 pr-12 py-3 outline-none focus:border-purple-600 transition-all text-sm text-[var(--text-dark)] font-semibold appearance-none cursor-pointer"
                value={editForm.city || ""}
                onChange={(e) =>
                  setEditForm({ ...editForm, city: e.target.value })
                }
              >
                <option value="">Оберіть місто...</option>
                {sortedCities.map((city, index) => (
                  <option key={`${city}-${index}`} value={city}>
                    {city}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={16}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-gray)] pointer-events-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-gray)] ml-1 flex items-center gap-1.5">
              <Linkedin size={14} className="text-blue-500" /> LinkedIn URL
            </label>
            <input
              type="url"
              placeholder="https://linkedin.com/in/username"
              className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-4 py-3 outline-none focus:border-purple-600 transition-all text-sm text-[var(--text-dark)] font-semibold font-mono"
              value={editForm.socials?.linkedIn || ""}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  socials: { ...editForm.socials, linkedIn: e.target.value },
                })
              }
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-gray)] ml-1 flex items-center gap-1.5">
              <Github size={14} className="text-[var(--text-dark)]" /> GitHub
              URL
            </label>
            <input
              type="url"
              placeholder="https://github.com/username"
              className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-4 py-3 outline-none focus:border-purple-600 transition-all text-sm text-[var(--text-dark)] font-semibold font-mono"
              value={editForm.socials?.github || ""}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  socials: { ...editForm.socials, github: e.target.value },
                })
              }
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-gray)] ml-1 flex items-center gap-1.5">
              <Twitter size={14} className="text-sky-500" /> Twitter (X) URL
            </label>
            <input
              type="url"
              placeholder="https://twitter.com/username"
              className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-4 py-3 outline-none focus:border-purple-600 transition-all text-sm text-[var(--text-dark)] font-semibold font-mono"
              value={editForm.socials?.twitter || ""}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  socials: { ...editForm.socials, twitter: e.target.value },
                })
              }
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-gray)] ml-1">
              Про мене
            </label>
            <textarea
              className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl p-4 outline-none focus:border-purple-600 text-sm min-h-[100px] resize-none text-[var(--text-dark)] font-medium leading-relaxed"
              value={editForm.bio || ""}
              onChange={(e) =>
                setEditForm({ ...editForm, bio: e.target.value })
              }
              placeholder="Опишіть вашу наукову діяльність..."
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-black text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 shadow-md shadow-purple-600/10 transition-all cursor-pointer"
          >
            <Save size={16} /> Зберегти налаштування
          </button>
        </form>
      </div>
    </div>
  );
}
