import React, { useState } from "react";
import {
  X,
  Building2,
  Globe,
  FileText,
  Send,
  Loader2,
  MapPin,
  Scale,
  Layers,
} from "lucide-react";

export default function CreateOrganizationModal({
  isOpen,
  onClose,
  onSubmit,
  loadingAction,
}) {
  const [formData, setFormData] = useState({
    name: "",
    edrpou: "",
    type: "Університет",
    legalForm: "ДУ/КЗ",
    city: "",
    website: "",
    logo: "",
    description: "",
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const typeOptions = [
    "Університет",
    "НДІ",
    "Наукове видавництво",
    "Державна структура",
    "Приватна компанія",
    "Інше",
  ];

  const legalFormOptions = [
    "ДУ/КЗ",
    "КНП",
    "ДП",
    "ТОВ",
    "ФОП",
    "ГО",
    "БФ/БО",
    "ПрАТ",
    "АТ",
    "ПП",
    "Інше",
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="w-full max-w-xl bg-[var(--bg-card)] rounded-3xl border border-[var(--border-color)] p-8 overflow-y-auto max-h-[90vh] shadow-xl animate-in fade-in zoom-in-95 duration-150">
        {/* Шапка модалки */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-black tracking-tight text-[var(--text-dark)]">
              Реєстрація <span className="text-purple-600">Організації</span>
            </h2>
            <p className="text-[11px] text-[var(--text-gray)] font-medium mt-1">
              Подайте заявку на верифікацію вашої наукової установи.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[var(--bg-main)] text-[var(--text-gray)] hover:text-[var(--text-dark)] rounded-xl transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Форма */}
        <form onSubmit={handleFormSubmit} className="space-y-5 text-left">
          {/* Назва */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-[var(--text-gray)] uppercase tracking-wider pl-1 flex items-center gap-1.5">
              <Building2 size={12} className="text-purple-500" /> Офіційна назва
              установи *
            </label>
            <input
              type="text"
              name="name"
              required
              placeholder="Напр., Ужгородський національний університет"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-4 py-3 outline-none focus:border-purple-600 transition-all text-sm text-[var(--text-dark)] font-semibold"
            />
          </div>

          {/* ДВА СЕЛЕКТОРИ (Профіль та Юридична форма) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[var(--text-gray)] uppercase tracking-wider pl-1 flex items-center gap-1.5">
                <Layers size={12} className="text-purple-500" /> Науковий
                профіль *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-4 py-3 outline-none focus:border-purple-600 transition-all text-sm text-[var(--text-dark)] font-semibold cursor-pointer"
              >
                {typeOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[var(--text-gray)] uppercase tracking-wider pl-1 flex items-center gap-1.5">
                <Scale size={12} className="text-purple-500" />{" "}
                Організаційно-правова форма *
              </label>
              <select
                name="legalForm"
                value={formData.legalForm}
                onChange={handleChange}
                className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-4 py-3 outline-none focus:border-purple-600 transition-all text-sm text-[var(--text-dark)] font-semibold cursor-pointer"
              >
                {legalFormOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* ЄДРПОУ та Місто */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[var(--text-gray)] uppercase tracking-wider pl-1 flex items-center gap-1.5">
                <FileText size={12} className="text-purple-500" /> Код ЄДРПОУ /
                Ідентифікатор *
              </label>
              <input
                type="text"
                name="edrpou"
                required
                maxLength={12}
                placeholder="Напр., 02071010"
                value={formData.edrpou}
                onChange={handleChange}
                className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-4 py-3 outline-none focus:border-purple-600 transition-all text-sm text-[var(--text-dark)] font-mono font-semibold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[var(--text-gray)] uppercase tracking-wider pl-1 flex items-center gap-1.5">
                <MapPin size={12} className="text-purple-500" /> Місто
                розташування *
              </label>
              <input
                type="text"
                name="city"
                required
                placeholder="Напр., Ужгород"
                value={formData.city}
                onChange={handleChange}
                className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-4 py-3 outline-none focus:border-purple-600 transition-all text-sm text-[var(--text-dark)] font-semibold"
              />
            </div>
          </div>

          {/* Вебсайт та Логотип */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[var(--text-gray)] uppercase tracking-wider pl-1 flex items-center gap-1.5">
                <Globe size={12} className="text-purple-500" /> Вебсайт
              </label>
              <input
                type="url"
                name="website"
                placeholder="https://example.edu.ua"
                value={formData.website}
                onChange={handleChange}
                className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-4 py-3 outline-none focus:border-purple-600 transition-all text-sm text-[var(--text-dark)] font-semibold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[var(--text-gray)] uppercase tracking-wider pl-1">
                URL логотипу
              </label>
              <input
                type="text"
                name="logo"
                placeholder="https://example.com/logo.png"
                value={formData.logo}
                onChange={handleChange}
                className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-4 py-3 outline-none focus:border-purple-600 transition-all text-sm text-[var(--text-dark)] font-semibold"
              />
            </div>
          </div>

          {/* Опис */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-[var(--text-gray)] uppercase tracking-wider pl-1">
              Короткий опис
            </label>
            <textarea
              name="description"
              rows={3}
              placeholder="Наукові напрямки, кафедри або специфіка установи..."
              value={formData.description}
              onChange={handleChange}
              className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl p-4 outline-none focus:border-purple-600 transition-all text-sm text-[var(--text-dark)] font-medium resize-none leading-relaxed"
            />
          </div>

          {/* Кнопка відправки */}
          <button
            type="submit"
            disabled={loadingAction === "createOrg"}
            className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 shadow-md shadow-purple-600/10"
          >
            {loadingAction === "createOrg" ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <>
                <Send size={14} /> Надіслати на верифікацію
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
