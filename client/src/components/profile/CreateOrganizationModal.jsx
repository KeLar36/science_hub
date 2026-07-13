/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import {
  X,
  Building2,
  Globe,
  Mail,
  BookOpen,
  FileText,
  Send,
  Loader2,
  MapPin,
  Scale,
  Layers,
  Upload,
  Image as ImageIcon,
} from "lucide-react";
import { SCIENTIFIC_DOMAINS } from "../../constants/domains";
import { UKRAINIAN_CITIES } from "../../constants/cities";

const sortedCities = [...UKRAINIAN_CITIES].sort((a, b) =>
  a.localeCompare(b, "uk"),
);

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
    email: "",
    logo: null,
    description: "",
    scientificDomains: [],
  });

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

  const handleModalClose = () => {
    setPreviewUrl(null);
    setError("");
    onClose();
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("Логотип занадто важкий! Максимум — 5 MB");
      return;
    }

    setError("");

    if (previewUrl) URL.revokeObjectURL(previewUrl);

    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);

    setFormData({
      ...formData,
      logo: file,
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (!formData.city) {
      setError("Будь ласка, оберіть місто розташування установи");
      return;
    }

    const submissionData = new FormData();
    submissionData.append("name", formData.name.trim());
    submissionData.append("edrpou", formData.edrpou.trim());
    submissionData.append("type", formData.type);
    submissionData.append("legalForm", formData.legalForm);
    submissionData.append("city", formData.city);
    submissionData.append("website", formData.website.trim());
    submissionData.append("email", formData.email.trim());
    submissionData.append("description", formData.description.trim());

    submissionData.append(
      "scientificDomains",
      JSON.stringify(formData.scientificDomains),
    );

    // Передаємо файл логотипу, якщо він був обраний
    if (formData.logo instanceof File) {
      submissionData.append("logo", formData.logo);
    } else {
      submissionData.append("logo", "");
    }

    onSubmit(submissionData);
  };

  const handleDomainToggle = (domain) => {
    setFormData((prev) => {
      const current = prev.scientificDomains || [];
      const isSelected = current.includes(domain);
      const updated = isSelected
        ? current.filter((d) => d !== domain)
        : [...current, domain];
      return { ...prev, scientificDomains: updated };
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="w-full max-w-2xl bg-[var(--bg-card)] rounded-3xl border border-[var(--border-color)] p-8 overflow-y-auto max-h-[90vh] shadow-xl animate-in fade-in zoom-in-95 duration-150 text-left">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-purple-600/10 text-purple-600 rounded-xl border border-purple-600/10">
              <Building2 size={20} />
            </div>
            <h2 className="text-xl font-bold tracking-tight text-[var(--text-dark)]">
              Реєстрація наукової установи
            </h2>
          </div>
          <button
            type="button"
            onClick={handleModalClose}
            className="p-2 hover:bg-[var(--bg-main)] text-[var(--text-gray)] hover:text-[var(--text-dark)] rounded-xl transition-all cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="text-xs font-bold text-red-500 bg-red-500/5 border border-red-500/10 px-4 py-2.5 rounded-xl mb-4">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleFormSubmit} className="space-y-5">
          <div className="flex flex-col sm:flex-row items-center gap-5 bg-[var(--bg-main)] p-4 rounded-2xl border border-[var(--border-color)]">
            <div className="relative shrink-0">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Logo Preview"
                  className="w-20 h-20 rounded-2xl object-cover border border-purple-600/20 shadow-inner"
                />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-purple-600/5 text-purple-600/40 flex items-center justify-center border-2 border-dashed border-[var(--border-color)]">
                  <ImageIcon size={28} />
                </div>
              )}
            </div>

            <div className="flex-1 w-full text-center sm:text-left space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-gray)] block">
                Логотип установи
              </span>
              <p className="text-[11px] text-[var(--text-gray)] font-medium">
                Рекомендовано квадратне фото JPG або PNG. Максимум 5 MB.
              </p>

              <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm shadow-purple-600/10 mt-1">
                <Upload size={12} />
                Завантажити лого
                <input
                  type="file"
                  className="hidden"
                  accept="image/jpeg, image/png, image/jpg"
                  onChange={handleLogoChange}
                />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Назва */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-gray)] ml-1">
                Повна назва установи
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Напр. Ужгородський національний університет"
                  className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl pl-4 pr-10 py-3 outline-none focus:border-purple-600 transition-all text-sm text-[var(--text-dark)] font-semibold"
                  value={formData.name}
                  onChange={handleChange}
                />
                <Building2
                  size={16}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-gray)]"
                />
              </div>
            </div>

            {/* ЄДРПОУ */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-gray)] ml-1">
                Код ЄДРПОУ (8 цифр)
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="edrpou"
                  required
                  maxLength={8}
                  pattern="\d{8}"
                  placeholder="00130850"
                  className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl pl-4 pr-10 py-3 outline-none focus:border-purple-600 transition-all text-sm text-[var(--text-dark)] font-semibold font-mono"
                  value={formData.edrpou}
                  onChange={handleChange}
                />
                <FileText
                  size={16}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-gray)]"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-gray)] ml-1 flex items-center gap-1">
                <Layers size={12} /> Тип установи
              </label>
              <select
                name="type"
                className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-3 py-3 outline-none focus:border-purple-600 transition-all text-sm text-[var(--text-dark)] font-semibold cursor-pointer"
                value={formData.type}
                onChange={handleChange}
              >
                <option value="Університет">Університет</option>
                <option value="Інститут">Інститут</option>
                <option value="Академія">Академія</option>
                <option value="Науковий центр">Науковий центр</option>
                <option value="Приватна лабораторія">Лабораторія</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-gray)] ml-1 flex items-center gap-1">
                <Scale size={12} /> Форма власності
              </label>
              <select
                name="legalForm"
                className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-3 py-3 outline-none focus:border-purple-600 transition-all text-sm text-[var(--text-dark)] font-semibold cursor-pointer"
                value={formData.legalForm}
                onChange={handleChange}
              >
                <option value="ДУ/КЗ">Державна (ДУ/КЗ)</option>
                <option value="ТОВ/ПП">Приватна (ТОВ/ПП)</option>
                <option value="ГО/БФ">Громадська (ГО/БФ)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-gray)] ml-1 flex items-center gap-1">
                <MapPin size={12} /> Місто
              </label>
              <select
                name="city"
                required
                className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-3 py-3 outline-none focus:border-purple-600 transition-all text-sm text-[var(--text-dark)] font-semibold cursor-pointer"
                value={formData.city}
                onChange={handleChange}
              >
                <option value="">Оберіть місто...</option>
                {sortedCities.map((city, index) => (
                  <option key={`${city}-${index}`} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-gray)] ml-1">
                Офіційний веб-сайт
              </label>
              <div className="relative">
                <input
                  type="url"
                  name="website"
                  placeholder="https://example.edu.ua"
                  className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl pl-4 pr-10 py-3 outline-none focus:border-purple-600 transition-all text-sm text-[var(--text-dark)] font-semibold font-mono"
                  value={formData.website}
                  onChange={handleChange}
                />
                <Globe
                  size={16}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-gray)]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-gray)] ml-1">
                Контактний Email установи
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  placeholder="info@university.edu.ua"
                  className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl pl-4 pr-10 py-3 outline-none focus:border-purple-600 transition-all text-sm text-[var(--text-dark)] font-semibold"
                  value={formData.email}
                  onChange={handleChange}
                />
                <Mail
                  size={16}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-gray)]"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-gray)] ml-1">
              Про установу (короткий опис, досягнення, напрями досліджень)
            </label>
            <textarea
              name="description"
              placeholder="Розкажіть про науковий потенціал, ключові кафедри чи лабораторні центри..."
              className="w-full bg-[var(--bg-main)] border border border-[var(--border-color)] rounded-xl p-4 outline-none focus:border-purple-600 text-sm min-h-[100px] resize-none text-[var(--text-dark)] font-medium leading-relaxed"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2 border-t border-[var(--border-color)] pt-4">
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-gray)] ml-1 flex items-center gap-1.5">
              <BookOpen size={14} className="text-purple-600" /> Наукові профілі
              та пріоритетні галузі
            </label>
            <div className="flex flex-wrap gap-2 max-h-[160px] overflow-y-auto p-2 border border-[var(--border-color)] rounded-2xl bg-[var(--bg-main)]">
              {SCIENTIFIC_DOMAINS.map((domain) => {
                const isSelected = (formData.scientificDomains || []).includes(
                  domain,
                );
                return (
                  <button
                    key={domain}
                    type="button"
                    onClick={() => handleDomainToggle(domain)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold tracking-tight border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                      isSelected
                        ? "bg-purple-600/10 border-purple-600 text-purple-600 shadow-xs"
                        : "bg-[var(--bg-card)] border-[var(--border-color)] text-[var(--text-gray)] hover:text-[var(--text-dark)] hover:border-[var(--text-dark)]/30"
                    }`}
                  >
                    <span className="truncate">{domain}</span>
                    <div
                      className={`w-3.5 h-3.5 rounded-md border shrink-0 flex items-center justify-center transition-all ${
                        isSelected
                          ? "bg-purple-600 border-purple-600 text-white"
                          : "border-[var(--border-color)]"
                      }`}
                    >
                      {isSelected && <span className="text-[8px]">✓</span>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Кнопка відправки */}
          <button
            type="submit"
            disabled={loadingAction === "createOrg"}
            className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 shadow-md shadow-purple-600/10 cursor-pointer"
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
