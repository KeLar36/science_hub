/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill-new";
import {
  X,
  Save,
  Calendar as CalendarIcon,
  DollarSign,
  BookOpen,
  MapPin,
  AlignLeft,
} from "lucide-react";
import DatePicker from "react-datepicker";
import { Button } from "../ui/Button";
import { SCIENTIFIC_DOMAINS, PROGRAM_TYPES } from "../../constants/domains";
import axiosInstance from "../../api/axios";
import toast from "react-hot-toast";
import "react-datepicker/dist/react-datepicker.css";
import "react-quill-new/dist/quill.snow.css";

export const EditProgramModal = ({ isOpen, onClose, programData, onSave }) => {
  const [formData, setFormData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && programData) {
      setFormData({
        ...programData,
        deadline: programData.deadline
          ? new Date(programData.deadline)
          : new Date(),
        shortDescription: programData.shortDescription || "",
        organizer: programData.organizer || "",
        externalLink: programData.externalLink || "",
        location: programData.location || "Online",
        amount: programData.amount || "",
        issn: programData.issn || "",
        impactFactor: programData.impactFactor || "",
      });
    }
  }, [isOpen, programData]);

  if (!isOpen || !formData) return null;

  // Клієнтська функція збереження
  const handleDirectClickSubmit = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (!formData.title || !formData.title.trim()) {
      return toast.error("Назва програми обов'язкова");
    }

    try {
      setIsSubmitting(true);

      if (!formData._id) {
        throw new Error("ID програми відсутній у formData");
      }

      await axiosInstance.put(`/programs/${formData._id}`, formData);

      toast.success("Картку програми успішно оновлено! 💜");
      onSave();
    } catch (err) {
      console.error("💥 Помилка збереження змін:", err);
      toast.error(
        err.response?.data?.error || err.message || "Не вдалося зберегти зміни",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none">
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] w-full max-w-2xl rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden text-left">
        <div className="p-5 border-b border-[var(--border-color)] bg-[var(--bg-card)] flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-purple-600">
            <BookOpen size={18} className="stroke-[2.5]" />
            <h3 className="text-xs font-black uppercase tracking-wider text-[var(--text-dark)] m-0">
              Редагувати параметри програми
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-[var(--bg-main)] border border-transparent hover:border-[var(--border-color)] rounded-xl text-[var(--text-gray)] hover:text-[var(--text-dark)] transition-all cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4 flex-1 scrollbar-none">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-gray)]">
                Назва конкурсу / журналу
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-dark)] rounded-xl p-3 text-xs font-semibold focus:border-purple-500 outline-none transition-colors"
                placeholder="Введіть повну назву..."
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-gray)]">
                Організатор (Установа)
              </label>
              <input
                type="text"
                value={formData.organizer}
                onChange={(e) =>
                  setFormData({ ...formData, organizer: e.target.value })
                }
                className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-dark)] rounded-xl p-3 text-xs font-semibold focus:border-purple-500 outline-none transition-colors"
                placeholder="Введіть назву закладу..."
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
                className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-dark)] rounded-xl p-3 text-xs font-bold focus:border-purple-500 outline-none cursor-pointer"
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
                className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-dark)] rounded-xl p-3 text-xs font-bold focus:border-purple-500 outline-none cursor-pointer"
              >
                {SCIENTIFIC_DOMAINS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {formData.type === "Грантова програма" && (
            <div className="space-y-1.5 animate-[fadeIn_0.2s_ease-out]">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-gray)] flex items-center gap-1">
                <DollarSign size={10} /> Бюджет / Розмір гранту
              </label>
              <input
                type="text"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-dark)] rounded-xl p-3 text-xs font-semibold focus:border-purple-500 outline-none"
                placeholder="Наприклад: 50 000 EUR"
              />
            </div>
          )}

          {formData.type === "Конференція" && (
            <div className="space-y-1.5 animate-[fadeIn_0.2s_ease-out]">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-gray)] flex items-center gap-1">
                <MapPin size={10} /> Локація / Формат проведення
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-dark)] rounded-xl p-3 text-xs font-semibold focus:border-purple-500 outline-none"
              />
            </div>
          )}

          {formData.type === "Науковий журнал" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-[fadeIn_0.2s_ease-out]">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-gray)]">
                  ISSN Код журналу
                </label>
                <input
                  type="text"
                  value={formData.issn}
                  onChange={(e) =>
                    setFormData({ ...formData, issn: e.target.value })
                  }
                  className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-dark)] rounded-xl p-3 text-xs font-mono font-semibold focus:border-purple-500 outline-none"
                  placeholder="0000-0000"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-gray)]">
                  Impact Factor
                </label>
                <input
                  type="text"
                  value={formData.impactFactor}
                  onChange={(e) =>
                    setFormData({ ...formData, impactFactor: e.target.value })
                  }
                  className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-dark)] rounded-xl p-3 text-xs font-mono font-semibold focus:border-purple-500 outline-none"
                  placeholder="2.45"
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5 flex flex-col">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-gray)] flex items-center gap-1">
                <CalendarIcon size={10} /> Кінцевий дедлайн прийому
              </label>
              <DatePicker
                selected={formData.deadline}
                onChange={(date) =>
                  setFormData({ ...formData, deadline: date })
                }
                dateFormat="dd.MM.yyyy"
                className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-dark)] rounded-xl p-3 text-xs font-semibold focus:border-purple-500 outline-none cursor-pointer"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-gray)] flex items-center gap-1">
                <AlignLeft size={10} /> Зовнішнє посилання
              </label>
              <input
                type="text"
                value={formData.externalLink}
                onChange={(e) =>
                  setFormData({ ...formData, externalLink: e.target.value })
                }
                className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-dark)] rounded-xl p-3 text-xs font-semibold focus:border-purple-500 outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-gray)]">
              Короткий опис
            </label>
            <input
              type="text"
              value={formData.shortDescription}
              onChange={(e) =>
                setFormData({ ...formData, shortDescription: e.target.value })
              }
              className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-dark)] rounded-xl p-3 text-xs font-semibold focus:border-purple-500 outline-none"
            />
          </div>

          <div className="space-y-1.5 pb-6">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-gray)]">
              Детальний опис
            </label>
            <div className="rounded-xl overflow-hidden border border-[var(--border-color)] bg-[var(--bg-main)] [&_.ql-toolbar]:border-none [&_.ql-toolbar]:border-b [&_.ql-container]:border-none [&_.ql-container]:min-h-[140px] [&_.ql-editor]:text-xs">
              <ReactQuill
                theme="snow"
                value={formData.description}
                onChange={(content) =>
                  setFormData({ ...formData, description: content })
                }
              />
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-[var(--border-color)] bg-[var(--bg-card)] flex gap-3">
          <Button
            variant="outline"
            className="flex-1 rounded-xl font-bold uppercase text-xs"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Скасувати
          </Button>

          <Button
            type="button"
            isLoading={isSubmitting}
            className="flex-[2] rounded-xl font-black uppercase text-xs bg-purple-600 hover:bg-purple-700 text-white cursor-pointer"
            onClick={handleDirectClickSubmit}
          >
            <Save size={13} /> Зберегти зміни
          </Button>
        </div>
      </div>
    </div>
  );
};
