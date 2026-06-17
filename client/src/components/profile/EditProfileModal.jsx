import React from "react";
import { X, ChevronDown, Save } from "lucide-react";
import { UKRAINIAN_CITIES } from "../../constants/cities";

export default function EditProfileModal({
  isOpen,
  onClose,
  editForm,
  setEditForm,
  onSubmit,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="w-full max-w-xl bg-[var(--bg-card)] rounded-3xl border border-[var(--border-color)] p-8 overflow-y-auto max-h-[90vh] shadow-xl animate-in fade-in zoom-in-95 duration-150">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold tracking-tight">
            Редагування профілю
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[var(--bg-main)] text-[var(--text-gray)] hover:text-[var(--text-dark)] rounded-xl transition-all"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[var(--text-gray)] ml-1">
              Ваше ім'я / Установа
            </label>
            <input
              className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-4 py-3 outline-none focus:border-purple-600 transition-all text-sm text-[var(--text-dark)]"
              value={editForm.name || ""}
              onChange={(e) =>
                setEditForm({ ...editForm, name: e.target.value })
              }
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[var(--text-gray)] ml-1">
              Місто
            </label>
            <div className="relative">
              <select
                className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-4 py-3 outline-none focus:border-purple-600 transition-all text-sm appearance-none cursor-pointer"
                value={editForm.city}
                onChange={(e) =>
                  setEditForm({ ...editForm, city: e.target.value })
                }
              >
                <option value="">Оберіть місто...</option>
                {UKRAINIAN_CITIES.map((city) => (
                  <option key={city} value={city}>
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
            <label className="text-xs font-semibold text-[var(--text-gray)] ml-1">
              LinkedIn URL
            </label>
            <input
              className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-4 py-3 outline-none focus:border-purple-600 transition-all text-sm text-[var(--text-dark)]"
              value={editForm.socials.linkedin || ""}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  socials: { ...editForm.socials, linkedin: e.target.value },
                })
              }
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[var(--text-gray)] ml-1">
              GitHub URL
            </label>
            <input
              className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-4 py-3 outline-none focus:border-purple-600 transition-all text-sm text-[var(--text-dark)]"
              value={editForm.socials.github || ""}
              onChange={(e) =>
                setEditForm({
                  ...editForm,
                  socials: { ...editForm.socials, github: e.target.value },
                })
              }
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[var(--text-gray)] ml-1">
              Про мене
            </label>
            <textarea
              className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl p-4 outline-none focus:border-purple-600 text-sm min-h-[100px] resize-none"
              value={editForm.bio}
              onChange={(e) =>
                setEditForm({ ...editForm, bio: e.target.value })
              }
              placeholder="Опишіть вашу наукову діяльність..."
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-md shadow-purple-600/10 transition-all"
          >
            <Save size={16} /> Зберегти налаштування
          </button>
        </form>
      </div>
    </div>
  );
}
