/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import DatePicker from "react-datepicker";
import ReactQuill from "react-quill-new";
import {
  PlusCircle,
  Calendar as CalendarIcon,
  DollarSign,
  BookOpen,
  BarChart3,
  AlignLeft,
} from "lucide-react";
import "react-datepicker/dist/react-datepicker.css";
import "react-quill-new/dist/quill.snow.css";

import { SCIENTIFIC_DOMAINS, PROGRAM_TYPES } from "../../../constants/domains";

const OrgProgramForm = ({
  newProgram,
  setNewProgram,
  loadingAction,
  onSubmit,
  onTypeChange,
  organizationName,
}) => {
  // 🟢 Ефект автоматичного контролю за полем організатора
  useEffect(() => {
    if (
      organizationName &&
      ["Грант", "Конференція"].includes(newProgram.type)
    ) {
      if (newProgram.organizer !== organizationName) {
        setNewProgram((prev) => ({ ...prev, organizer: organizationName }));
      }
    }
  }, [newProgram.type, organizationName, setNewProgram]);

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-6 rounded-3xl shadow-xs h-fit sticky top-6 text-left">
      <h3 className="text-lg font-black text-[var(--text-dark)] uppercase tracking-tight mb-4 flex items-center gap-2">
        ✨ Створити програму
      </h3>

      <form onSubmit={onSubmit} className="space-y-4">
        {/* НАЗВА ПРОГРАМИ */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-[var(--text-gray)] uppercase tracking-wider pl-1">
            Назва програми / Конкурсу
          </label>
          <input
            type="text"
            required
            placeholder="Напр., Внутрішній грант УжНУ 2026"
            value={newProgram.title}
            onChange={(e) =>
              setNewProgram({ ...newProgram, title: e.target.value })
            }
            className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 outline-none focus:border-purple-600 transition-all text-xs font-bold text-[var(--text-dark)]"
          />
        </div>

        {/* ГАЛУЗЬ ТА ТИП */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-[var(--text-gray)] uppercase tracking-wider pl-1 flex items-center gap-1">
              <BarChart3 size={12} className="text-purple-500" /> Напрямок
            </label>
            <div className="relative">
              <select
                value={newProgram.domain}
                onChange={(e) =>
                  setNewProgram({ ...newProgram, domain: e.target.value })
                }
                className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 outline-none focus:border-purple-600 transition-all text-xs font-bold text-[var(--text-dark)] appearance-none cursor-pointer"
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
            <label className="text-[11px] font-bold text-[var(--text-gray)] uppercase tracking-wider pl-1 flex items-center gap-1">
              <BookOpen size={12} className="text-purple-500" /> Тип конкурсу
            </label>
            <div className="relative">
              <select
                value={newProgram.type}
                onChange={onTypeChange}
                className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 outline-none focus:border-purple-600 transition-all text-xs font-bold text-[var(--text-dark)] appearance-none cursor-pointer"
              >
                {PROGRAM_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* ДИНАМІЧНИЙ БЛОК: НАУКОВИЙ ЖУРНАЛ */}
        {newProgram.type === "Науковий журнал" && (
          <div className="grid grid-cols-2 gap-3 p-3 bg-[var(--bg-main)]/50 border border-[var(--border-color)] rounded-2xl animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-[var(--text-gray)] uppercase pl-1">
                ISSN Номер
              </label>
              <input
                type="text"
                required
                placeholder="0000-0000"
                value={newProgram.issn || ""}
                onChange={(e) =>
                  setNewProgram({ ...newProgram, issn: e.target.value })
                }
                className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl px-3 py-2 outline-none focus:border-purple-600 text-xs font-semibold text-[var(--text-dark)] font-mono"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-[var(--text-gray)] uppercase pl-1">
                Impact Factor
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={newProgram.impactFactor || ""}
                onChange={(e) =>
                  setNewProgram({
                    ...newProgram,
                    impactFactor: e.target.value,
                  })
                }
                className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl px-3 py-2 outline-none focus:border-purple-600 text-xs font-semibold text-[var(--text-dark)] font-mono"
              />
            </div>
          </div>
        )}

        {/* ДИНАМІЧНИЙ БЛОК: ГРАНТ */}
        {newProgram.type === "Грант" && (
          <div className="grid grid-cols-2 gap-3 p-3 bg-[var(--bg-main)]/50 border border-[var(--border-color)] rounded-2xl animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-[var(--text-gray)] uppercase pl-1 flex items-center gap-1">
                <DollarSign size={10} className="text-purple-500" />{" "}
                Фінансування
              </label>
              <input
                type="text"
                required
                placeholder="Напр., 100 000 грн"
                value={newProgram.amount || ""}
                onChange={(e) =>
                  setNewProgram({ ...newProgram, amount: e.target.value })
                }
                className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl px-3 py-2 outline-none focus:border-purple-600 text-xs font-bold text-[var(--text-dark)]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-[var(--text-gray)] uppercase pl-1">
                Організатор установи
              </label>
              <input
                type="text"
                required
                disabled={true}
                value={newProgram.organizer || organizationName || ""}
                className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-3 py-2 outline-none text-xs font-bold text-[var(--text-dark)] opacity-75 cursor-not-allowed"
              />
            </div>
          </div>
        )}

        {/* ДИНАМІЧНИЙ БЛОК: КОНФЕРЕНЦІЯ */}
        {newProgram.type === "Конференція" && (
          <div className="space-y-3 p-3 bg-[var(--bg-main)]/50 border border-[var(--border-color)] rounded-2xl animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-[var(--text-gray)] uppercase pl-1">
                  Організатор
                </label>
                <input
                  type="text"
                  required
                  disabled={true}
                  value={newProgram.organizer || organizationName || ""}
                  className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-3 py-2 outline-none text-xs font-bold text-[var(--text-dark)] opacity-75 cursor-not-allowed"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-[var(--text-gray)] uppercase pl-1">
                  Локація
                </label>
                <input
                  type="text"
                  placeholder="Напр., Ужгород або Онлайн"
                  value={newProgram.location || ""}
                  onChange={(e) =>
                    setNewProgram({ ...newProgram, location: e.target.value })
                  }
                  className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl px-3 py-2 outline-none focus:border-purple-600 text-xs font-semibold text-[var(--text-dark)]"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-[var(--text-gray)] uppercase pl-1">
                Посилання на сайт конференції
              </label>
              <input
                type="url"
                placeholder="https://conference.example.com"
                value={newProgram.externalLink || ""}
                onChange={(e) =>
                  setNewProgram({
                    ...newProgram,
                    externalLink: e.target.value,
                  })
                }
                className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl px-3 py-2 outline-none focus:border-purple-600 text-xs font-semibold text-[var(--text-dark)]"
              />
            </div>
          </div>
        )}

        {/* ІНШІ ТИПИ (ЗОВНІШНЄ ПОСИЛАННЯ) */}
        {["Датасет", "Курс"].includes(newProgram.type) && (
          <div className="space-y-1 p-3 bg-[var(--bg-main)]/50 border border-[var(--border-color)] rounded-2xl animate-in fade-in slide-in-from-top-2 duration-150">
            <label className="text-[10px] font-black text-[var(--text-gray)] uppercase pl-1">
              Зовнішнє посилання на ресурс
            </label>
            <input
              type="url"
              placeholder="https://example.com/resource"
              value={newProgram.externalLink || ""}
              onChange={(e) =>
                setNewProgram({ ...newProgram, externalLink: e.target.value })
              }
              className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl px-3 py-2 outline-none focus:border-purple-600 text-xs font-semibold text-[var(--text-dark)]"
            />
          </div>
        )}

        {/* ДЕДЛАЙН ПОДАЧІ */}
        <div className="space-y-1 flex flex-col">
          <label className="text-[11px] font-bold text-[var(--text-gray)] uppercase tracking-wider pl-1 flex items-center gap-1">
            <CalendarIcon size={12} className="text-purple-500" /> Кінцевий
            дедлайн конкурсу
          </label>
          <DatePicker
            selected={newProgram.deadline}
            onChange={(date) =>
              setNewProgram({ ...newProgram, deadline: date })
            }
            dateFormat="dd.MM.yyyy"
            minDate={new Date()}
            placeholderText="Оберіть дату дедлайну..."
            required
            className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 outline-none focus:border-purple-600 transition-all text-xs font-bold text-[var(--text-dark)] cursor-pointer"
          />
        </div>

        {/* КОРОТКИЙ ТИЗЕР */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-[var(--text-gray)] uppercase tracking-wider pl-1 flex items-center gap-1">
            <AlignLeft size={12} className="text-purple-500" /> Короткий тизер
            (макс. 300 слів)
          </label>
          <textarea
            rows={2}
            maxLength={300}
            placeholder="Напишіть короткий вступ можливості для картки списку..."
            value={newProgram.shortDescription || ""}
            onChange={(e) =>
              setNewProgram({ ...newProgram, shortDescription: e.target.value })
            }
            className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl p-3 outline-none focus:border-purple-600 transition-all text-xs font-semibold text-[var(--text-dark)] resize-none"
          />
        </div>

        {/* ПОВНИЙ ОПИС ТА Quill */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-[var(--text-gray)] uppercase tracking-wider pl-1">
            Детальні умови та регламент
          </label>
          <div className="quill-wrapper rounded-xl overflow-hidden border border-[var(--border-color)] bg-[var(--bg-main)]">
            <style>{`
              .ql-toolbar.ql-snow { border: none !important; border-bottom: 1px solid var(--border-color) !important; background: var(--bg-card); }
              .ql-container.ql-snow { border: none !important; min-height: 140px; font-family: inherit; }
              .ql-editor { font-size: 0.8rem; color: var(--text-dark); }
            `}</style>
            <ReactQuill
              theme="snow"
              value={newProgram.description}
              onChange={(content) =>
                setNewProgram({ ...newProgram, description: content })
              }
              placeholder="Напишіть деталі, вимоги до авторів, етапи оцінювання..."
            />
          </div>
        </div>

        {/* КНОПКА СТВОРЕННЯ */}
        <button
          type="submit"
          disabled={loadingAction === "createProgram"}
          className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all active:scale-[0.99] flex items-center justify-center gap-1.5 italic shadow-md shadow-purple-600/10"
        >
          <PlusCircle size={14} />{" "}
          {loadingAction === "createProgram"
            ? "Запуск конкурсу..."
            : "Опублікувати можливість"}
        </button>
      </form>
    </div>
  );
};

export default OrgProgramForm;
