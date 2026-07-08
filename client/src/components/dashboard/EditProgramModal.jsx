/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill-new";
import {
  X,
  Save,
  Calendar as CalendarIcon,
  DollarSign,
  BookOpen,
  BarChart3,
  MapPin,
  AlignLeft,
} from "lucide-react";
import DatePicker from "react-datepicker";
import { Button } from "../ui/Button";
import { SCIENTIFIC_DOMAINS, PROGRAM_TYPES } from "../../constants/domains";
import "react-datepicker/dist/react-datepicker.css";
import "react-quill-new/dist/quill.snow.css";

export const EditProgramModal = ({
  isOpen,
  onClose,
  programData,
  onSave,
  loadingAction,
}) => {
  const [formData, setFormData] = useState(null);

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
        impactFactor: programData.impactFactor || 0,
      });
    } else {
      setFormData(null);
    }
  }, [programData, isOpen]);

  if (!isOpen || !formData) return null;

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
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X size={16} />
          </Button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave(formData);
          }}
          className="flex-grow overflow-y-auto p-6 space-y-5"
        >
          <div className="space-y-1.5">
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
              className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-xs font-semibold text-[var(--text-dark)] outline-none focus:border-purple-500 transition-all uppercase"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-gray)]">
                Тип програми
              </label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-xs font-semibold text-[var(--text-dark)] cursor-pointer outline-none focus:border-purple-500"
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
                className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-xs font-semibold text-[var(--text-dark)] cursor-pointer outline-none focus:border-purple-500"
              >
                {SCIENTIFIC_DOMAINS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {formData.type === "Науковий журнал" && (
            <div className="grid grid-cols-2 gap-4 p-4 bg-[var(--bg-main)] rounded-2xl border border-[var(--border-color)]">
              <input
                type="text"
                placeholder="ISSN"
                value={formData.issn}
                onChange={(e) =>
                  setFormData({ ...formData, issn: e.target.value })
                }
                className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl px-3 py-2 text-xs"
              />
              <input
                type="number"
                step="0.01"
                placeholder="Impact Factor"
                value={formData.impactFactor}
                onChange={(e) =>
                  setFormData({ ...formData, impactFactor: e.target.value })
                }
                className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl px-3 py-2 text-xs"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-gray)]">
              Дедлайн
            </label>
            <DatePicker
              selected={formData.deadline}
              onChange={(date) => setFormData({ ...formData, deadline: date })}
              dateFormat="dd.MM.yyyy"
              className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-xs font-semibold text-[var(--text-dark)] outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-gray)]">
              Короткий опис
            </label>
            <textarea
              rows={3}
              value={formData.shortDescription}
              onChange={(e) =>
                setFormData({ ...formData, shortDescription: e.target.value })
              }
              className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl p-3 text-xs outline-none"
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
        </form>

        <div className="p-4 border-t border-[var(--border-color)] bg-[var(--bg-card)] flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onClose}>
            Скасувати
          </Button>
          <Button
            type="submit"
            isLoading={loadingAction === "editProgram"}
            className="flex-[2]"
            onClick={() => onSave(formData)}
          >
            <Save size={14} /> Зберегти зміни
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditProgramModal;
