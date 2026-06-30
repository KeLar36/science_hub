/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import ReactQuill from "react-quill-new";
import {
  X,
  Save,
  Calendar as CalendarIcon,
  DollarSign,
  BookOpen,
  BarChart3,
  MapPin,
} from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";
import "react-quill-new/dist/quill.snow.css";

import { SCIENTIFIC_DOMAINS, PROGRAM_TYPES } from "../../../constants/domains";

const stripHtmlFast = (html) => {
  if (!html) return "";
  let text = html.replace(/<\/?[^>]+(>|$)/g, " "); // Заміна тегів на пробіли
  text = text
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
  return text.replace(/\s+/g, " ").trim();
};

const EditProgramModal = ({
  isOpen,
  onClose,
  programData,
  onSave,
  loadingAction,
}) => {
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    if (programData && isOpen) {
      const fallbackDescription = programData.description
        ? stripHtmlFast(programData.description).substring(0, 200)
        : "";

      setFormData({
        ...programData,
        deadline: programData.deadline
          ? new Date(programData.deadline)
          : new Date(),
        shortDescription:
          programData.shortDescription ||
          programData.shortDesc ||
          fallbackDescription,
        organizer: programData.organizer || "",
        externalLink: programData.externalLink || "",
        location: programData.location || "Онлайн",
        amount: programData.amount || "",
        issn: programData.issn || "",
        impactFactor: programData.impactFactor || 0,
      });
    }
  }, [programData, isOpen]);

  if (!isOpen || !formData) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const isJournal = formData.type === "Науковий журнал";
  const isGrantOrBudget =
    formData.type === "Грант" || formData.type === "Кошторис";
  const hasLocation = ["Конференція", "Грант", "Курс", "Воркшоп"].includes(
    formData.type,
  );

  return (
    <div className="fixed inset-0 z-150 flex justify-center items-start md:items-start overflow-y-auto bg-black/60 backdrop-blur-xs p-0 md:p-4">
      <div className="w-full h-full min-h-screen md:min-h-0 md:h-auto md:max-h-[85vh] md:max-w-2xl bg-[var(--bg-card)] border-0 md:border border-[var(--border-color)] md:rounded-3xl flex flex-col relative md:mt-12 md:mb-12 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
        <div className="p-6 border-b border-[var(--border-color)] flex items-center justify-between sticky top-0 bg-[var(--bg-card)] z-10">
          <div>
            <h3 className="text-base font-black text-[var(--text-dark)] uppercase tracking-tight">
              Редагувати програму
            </h3>
            <p className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-gray)] mt-0.5">
              ID: {formData._id}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] flex items-center justify-center text-[var(--text-gray)] hover:text-[var(--text-dark)] hover:border-purple-500/30 transition-all"
          >
            <X size={16} />
          </button>
        </div>

        <form
          id="edit-program-form"
          onSubmit={handleSubmit}
          className="flex-grow overflow-y-auto p-6 space-y-5"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-gray)]">
                Назва можливості
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-xs font-semibold text-[var(--text-dark)] outline-none focus:border-purple-500/50 transition-all uppercase tracking-wide"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-gray)]">
                Тип програми
              </label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-xs font-semibold text-[var(--text-dark)] outline-none focus:border-purple-500/50 transition-all cursor-pointer"
              >
                {PROGRAM_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-gray)]">
                Наукова галузь
              </label>
              <select
                value={formData.domain}
                onChange={(e) =>
                  setFormData({ ...formData, domain: e.target.value })
                }
                className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-xs font-semibold text-[var(--text-dark)] outline-none focus:border-purple-500/50 transition-all cursor-pointer"
              >
                {SCIENTIFIC_DOMAINS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-gray)]">
                Організатор / Видавництво
              </label>
              <input
                type="text"
                value={formData.organizer}
                onChange={(e) =>
                  setFormData({ ...formData, organizer: e.target.value })
                }
                className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-xs font-semibold text-[var(--text-dark)] outline-none focus:border-purple-500/50 transition-all"
              />
            </div>

            <div className="space-y-1.5 flex flex-col">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-gray)] mb-0.5">
                Дедлайн подачі
              </label>
              <div className="relative w-full">
                <DatePicker
                  selected={formData.deadline}
                  onChange={(date) =>
                    setFormData({ ...formData, deadline: date })
                  }
                  dateFormat="dd.MM.yyyy"
                  className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl pl-11 pr-4 py-3 text-xs font-semibold text-[var(--text-dark)] outline-none focus:border-purple-500/50 transition-all"
                />
                <CalendarIcon
                  size={14}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-gray)]"
                />
              </div>
            </div>

            {isGrantOrBudget && (
              <div className="space-y-1.5 sm:col-span-2 animate-in fade-in slide-in-from-top-2 duration-200">
                <label className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 flex items-center gap-1">
                  <DollarSign size={12} /> Фінансування / Сума гранту
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Наприклад: 5,000 EUR, Повне фінансування, або Кошторис витрат"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: e.target.value })
                    }
                    className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl pl-10 pr-4 py-3 text-xs font-semibold text-[var(--text-dark)] outline-none focus:border-purple-500/50 transition-all"
                  />
                  <DollarSign
                    size={14}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-gray)]"
                  />
                </div>
              </div>
            )}

            {hasLocation && (
              <div className="space-y-1.5 sm:col-span-2 animate-in fade-in slide-in-from-top-2 duration-200">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-gray)] flex items-center gap-1">
                  <MapPin size={12} /> Локація / Формат проведення
                </label>
                <input
                  type="text"
                  placeholder="Наприклад: Онлайн, Львів (Україна), Гібридний формат"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-xs font-semibold text-[var(--text-dark)] outline-none focus:border-purple-500/50 transition-all"
                />
              </div>
            )}

            {isJournal && (
              <div className="p-4 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-2xl sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 flex items-center gap-1">
                    <BookOpen size={12} /> ISSN / E-ISSN
                  </label>
                  <input
                    type="text"
                    value={formData.issn}
                    onChange={(e) =>
                      setFormData({ ...formData, issn: e.target.value })
                    }
                    className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl px-3 py-2.5 text-xs font-mono font-semibold text-[var(--text-dark)] outline-none focus:border-purple-500/50 transition-all"
                    placeholder="1234-567X"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 flex items-center gap-1">
                    <BarChart3 size={12} /> Impact Factor (SJR / WoS)
                  </label>
                  <input
                    type="number"
                    step="0.001"
                    min="0"
                    value={formData.impactFactor}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        impactFactor: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl px-3 py-2.5 text-xs font-semibold text-[var(--text-dark)] outline-none focus:border-purple-500/50 transition-all"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-gray)]">
                Посилання на офіційну сторінку
              </label>
              <input
                type="url"
                value={formData.externalLink}
                onChange={(e) =>
                  setFormData({ ...formData, externalLink: e.target.value })
                }
                className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-xs font-semibold text-[var(--text-dark)] outline-none focus:border-purple-500/50 transition-all font-mono text-[11px]"
                placeholder="https://example.com/details"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-gray)]">
                Короткий опис (для картки)
              </label>
              <textarea
                rows={3}
                required
                maxLength={250}
                value={formData.shortDescription}
                onChange={(e) =>
                  setFormData({ ...formData, shortDescription: e.target.value })
                }
                placeholder="Короткий опис можливості до 250 символів..."
                className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-xs font-medium text-[var(--text-dark)] outline-none focus:border-purple-500/50 transition-all resize-none leading-relaxed"
              />
              <div className="text-right text-[9px] font-mono text-[var(--text-gray)] opacity-60">
                {formData.shortDescription.length} / 250 символів
              </div>
            </div>

            <div className="space-y-1.5 sm:col-span-2 pb-6">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-gray)]">
                Детальний опис та вимоги
              </label>
              <ReactQuill
                theme="snow"
                value={formData.description}
                onChange={(content) =>
                  setFormData({ ...formData, description: content })
                }
                placeholder="Напишіть деталі, вимоги до кандидатів, етапи подачі..."
              />
            </div>
          </div>
        </form>

        <div className="p-4 border-t border-[var(--border-color)] sticky bottom-0 bg-[var(--bg-card)] z-10 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 border border-[var(--border-color)] text-[var(--text-dark)] font-bold text-xs uppercase tracking-wider rounded-xl transition-colors hover:bg-[var(--bg-main)]"
          >
            Скасувати
          </button>
          <button
            type="submit"
            form="edit-program-form"
            disabled={loadingAction === "editProgram"}
            className="flex-[2] py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md shadow-purple-600/10"
          >
            <Save size={14} />
            {loadingAction === "editProgram"
              ? "Збереження..."
              : "Зберегти зміни"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProgramModal;
