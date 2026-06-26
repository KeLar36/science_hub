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
} from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";
import "react-quill-new/dist/quill.snow.css";

import { SCIENTIFIC_DOMAINS, PROGRAM_TYPES } from "../../constants/domains";

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
      setFormData({
        ...programData,
        deadline: programData.deadline
          ? new Date(programData.deadline)
          : new Date(),
        shortDescription: programData.shortDescription || "",
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

  const handleTypeChange = (e) => {
    const selectedType = e.target.value;
    setFormData({
      ...formData,
      type: selectedType,
      amount: selectedType === "Грант" ? formData.amount : "",
      issn: selectedType === "Науковий журнал" ? formData.issn : "",
      impactFactor:
        selectedType === "Науковий журнал" ? formData.impactFactor : 0,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] w-full max-w-2xl rounded-3xl shadow-xl relative z-10 flex flex-col max-h-[90vh] animate-in scale-in duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-color)]">
          <h3 className="text-base font-black text-[var(--text-dark)] uppercase tracking-tight flex items-center gap-2">
            📝 Редагування програми
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 text-[var(--text-gray)] hover:text-[var(--text-dark)] hover:bg-[var(--bg-main)] rounded-xl transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-6 space-y-4"
        >
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-[var(--text-gray)] uppercase tracking-wider pl-1">
              Назва програми / Журналу
            </label>
            <input
              type="text"
              required
              placeholder="Введіть повну назву..."
              className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm text-[var(--text-dark)] outline-none focus:border-purple-500/50 transition-colors"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-[var(--text-gray)] uppercase tracking-wider pl-1">
                Тип програми
              </label>
              <select
                className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-3 py-3 text-sm text-[var(--text-dark)] outline-none focus:border-purple-500/50 cursor-pointer"
                value={formData.type}
                onChange={handleTypeChange}
              >
                {PROGRAM_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-[var(--text-gray)] uppercase tracking-wider pl-1">
                Галузь науки
              </label>
              <select
                className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-3 py-3 text-sm text-[var(--text-dark)] outline-none focus:border-purple-500/50 cursor-pointer"
                value={formData.domain}
                onChange={(e) =>
                  setFormData({ ...formData, domain: e.target.value })
                }
              >
                {SCIENTIFIC_DOMAINS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-[var(--text-gray)] uppercase tracking-wider pl-1">
              Організатор / Засновник
            </label>
            <input
              type="text"
              placeholder="Наприклад, МОН України, НаУКМА, ЗНУ..."
              className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm text-[var(--text-dark)] outline-none focus:border-purple-500/50 transition-colors"
              value={formData.organizer}
              onChange={(e) =>
                setFormData({ ...formData, organizer: e.target.value })
              }
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-[var(--text-gray)] uppercase tracking-wider pl-1">
              Офіційний сайт (URL)
            </label>
            <input
              type="url"
              placeholder="https://example.com/program"
              className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm text-[var(--text-dark)] outline-none focus:border-purple-500/50 transition-colors"
              value={formData.externalLink}
              onChange={(e) =>
                setFormData({ ...formData, externalLink: e.target.value })
              }
            />
          </div>

          {formData.type === "Грант" && (
            <div className="space-y-1 animate-in slide-in-from-top-2 duration-200">
              <label className="text-[11px] font-bold text-[purple-600] dark:text-purple-400 uppercase tracking-wider pl-1 flex items-center gap-1.5">
                <DollarSign size={12} /> Розмір бюджету / Фінансування
              </label>
              <input
                type="text"
                placeholder="Наприклад, до 500 000 грн або $10,000"
                className="w-full bg-[var(--bg-main)] border border-purple-500/20 focus:border-purple-500 rounded-xl px-4 py-3 text-sm text-[var(--text-dark)] outline-none transition-colors"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
              />
            </div>
          )}

          {formData.type === "Науковий журнал" && (
            <div className="grid grid-cols-2 gap-3 animate-in slide-in-from-top-2 duration-200">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-emerald-500 uppercase tracking-wider pl-1 flex items-center gap-1">
                  <BookOpen size={12} /> ISSN
                </label>
                <input
                  type="text"
                  placeholder="2414-9055"
                  className="w-full bg-[var(--bg-main)] border border-emerald-500/20 focus:border-emerald-500 rounded-xl px-4 py-3 text-sm text-[var(--text-dark)] outline-none transition-colors"
                  value={formData.issn}
                  onChange={(e) =>
                    setFormData({ ...formData, issn: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-emerald-500 uppercase tracking-wider pl-1 flex items-center gap-1">
                  <BarChart3 size={12} /> Impact Factor
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="1.45"
                  className="w-full bg-[var(--bg-main)] border border-emerald-500/20 focus:border-emerald-500 rounded-xl px-4 py-3 text-sm text-[var(--text-dark)] outline-none transition-colors"
                  value={formData.impactFactor}
                  onChange={(e) =>
                    setFormData({ ...formData, impactFactor: e.target.value })
                  }
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-[var(--text-gray)] uppercase tracking-wider pl-1 flex items-center gap-1">
              <CalendarIcon size={12} /> Кінцевий термін (Дедлайн)
            </label>
            <div className="relative rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] focus-within:border-purple-500/50 transition-colors px-3 py-1">
              <DatePicker
                selected={formData.deadline}
                onChange={(date) =>
                  setFormData({ ...formData, deadline: date })
                }
                dateFormat="dd.MM.yyyy"
                className="w-full bg-transparent border-none text-sm text-[var(--text-dark)] outline-none py-2 cursor-pointer"
                required
                minDate={new Date()}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-[var(--text-gray)] uppercase tracking-wider pl-1">
              Повний опис та критерії відбору
            </label>
            <div className="quill-wrapper rounded-xl overflow-hidden border border-[var(--border-color)] bg-[var(--bg-main)]">
              <style>{`
                .ql-toolbar.ql-snow { border: none !important; border-bottom: 1px solid var(--border-color) !important; background: var(--bg-card); }
                .ql-container.ql-snow { border: none !important; min-height: 140px; font-family: inherit; }
                .ql-editor { font-size: 0.8rem; color: var(--text-dark); }
              `}</style>
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

          <div className="flex gap-3 pt-4 border-t border-[var(--border-color)] sticky bottom-0 bg-[var(--bg-card)]">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-[var(--border-color)] text-[var(--text-dark)] font-bold text-xs uppercase tracking-wider rounded-xl transition-colors hover:bg-[var(--bg-main)]"
            >
              Скасувати
            </button>
            <button
              type="submit"
              disabled={loadingAction === "editProgram"}
              className="flex-[2] py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md shadow-purple-600/10"
            >
              <Save size={14} />
              {loadingAction === "editProgram"
                ? "Збереження..."
                : "Зберегти зміни"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProgramModal;
