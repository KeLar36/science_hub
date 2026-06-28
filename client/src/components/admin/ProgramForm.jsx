import React from "react";
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

import { SCIENTIFIC_DOMAINS, PROGRAM_TYPES } from "../../constants/domains";

const ProgramForm = ({
  newProgram,
  setNewProgram,
  loadingAction,
  onSubmit,
  onTypeChange,
}) => {
  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-6 rounded-3xl shadow-xs h-fit sticky top-6">
      <h3 className="text-lg font-black text-[var(--text-dark)] uppercase tracking-tight mb-4 flex items-center gap-2">
        ✨ Нова можливість
      </h3>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-[var(--text-gray)] uppercase tracking-wider pl-1">
            Назва програми / Журналу
          </label>
          <input
            type="text"
            required
            placeholder="Введіть назву..."
            value={newProgram.title}
            onChange={(e) =>
              setNewProgram({ ...newProgram, title: e.target.value })
            }
            className="w-full px-4 py-3 text-xs border border-[var(--border-color)] rounded-xl bg-[var(--bg-main)] text-[var(--text-dark)] focus:outline-hidden focus:border-purple-500 transition-colors"
          />
        </div>

        {/* КОРОТКИЙ ОПИС (НОВЕ ПОЛЕ) */}
        <div className="space-y-1">
          <div className="flex justify-between items-center pl-1">
            <label className="text-[11px] font-bold text-[var(--text-gray)] uppercase tracking-wider">
              Короткий опис (для картки)
            </label>
            <span className="text-[9px] font-mono text-[var(--text-gray)] opacity-60">
              {newProgram.shortDescription?.length || 0} / 300
            </span>
          </div>
          <textarea
            maxLength={300}
            rows={3}
            placeholder="Стислий опис суті програми для відображення на головній сторінці (до 300 символів)..."
            value={newProgram.shortDescription || ""}
            onChange={(e) =>
              setNewProgram({ ...newProgram, shortDescription: e.target.value })
            }
            className="w-full px-4 py-3 text-xs border border-[var(--border-color)] rounded-xl bg-[var(--bg-main)] text-[var(--text-dark)] focus:outline-hidden focus:border-purple-500 transition-colors resize-none leading-relaxed"
          />
        </div>

        {/* ГАЛУЗЬ ТА ТИП */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-[var(--text-gray)] uppercase tracking-wider pl-1">
              Галузь науки
            </label>
            <select
              value={newProgram.domain}
              onChange={(e) =>
                setNewProgram({ ...newProgram, domain: e.target.value })
              }
              className="w-full px-4 py-3 text-xs border border-[var(--border-color)] rounded-xl bg-[var(--bg-main)] text-[var(--text-dark)] focus:outline-hidden focus:border-purple-500 transition-colors"
            >
              {SCIENTIFIC_DOMAINS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-[var(--text-gray)] uppercase tracking-wider pl-1">
              Тип програми
            </label>
            <select
              value={newProgram.type}
              onChange={(e) => {
                const selectedType = e.target.value;
                setNewProgram({ ...newProgram, type: selectedType });

                if (typeof onTypeChange === "function") {
                  onTypeChange(selectedType);
                }
              }}
              className="w-full px-4 py-3 text-xs border border-[var(--border-color)] rounded-xl bg-[var(--bg-main)] text-[var(--text-dark)] focus:outline-hidden focus:border-purple-500 transition-colors"
            >
              {PROGRAM_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ДИНАМІЧНІ ПОЛЯ ЗАЛЕЖНО ВІД ТИПУ */}
        {newProgram.type === "Науковий журнал" && (
          <div className="grid grid-cols-2 gap-3 p-3 bg-purple-600/[0.02] border border-[var(--border-color)] rounded-2xl animate-[fadeIn_0.2s_ease-out]">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider pl-1">
                ISSN
              </label>
              <input
                type="text"
                required
                placeholder="0000-0000"
                value={newProgram.issn}
                onChange={(e) =>
                  setNewProgram({ ...newProgram, issn: e.target.value })
                }
                className="w-full px-3 py-2 text-xs border border-[var(--border-color)] rounded-lg bg-[var(--bg-main)] text-[var(--text-dark)] focus:outline-hidden focus:border-purple-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider pl-1">
                Impact Factor
              </label>
              <input
                type="number"
                step="0.001"
                min="0"
                placeholder="0.0"
                value={newProgram.impactFactor}
                onChange={(e) =>
                  setNewProgram({
                    ...newProgram,
                    impactFactor: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-full px-3 py-2 text-xs border border-[var(--border-color)] rounded-lg bg-[var(--bg-main)] text-[var(--text-dark)] focus:outline-hidden focus:border-purple-500"
              />
            </div>
          </div>
        )}

        {newProgram.type === "Грант" && (
          <div className="grid grid-cols-2 gap-3 p-3 bg-purple-600/[0.02] border border-[var(--border-color)] rounded-2xl animate-[fadeIn_0.2s_ease-out]">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider pl-1">
                Обсяг ($ / ₴)
              </label>
              <input
                type="text"
                required
                placeholder="напр. до $10,000"
                value={newProgram.amount}
                onChange={(e) =>
                  setNewProgram({ ...newProgram, amount: e.target.value })
                }
                className="w-full px-3 py-2 text-xs border border-[var(--border-color)] rounded-lg bg-[var(--bg-main)] text-[var(--text-dark)] focus:outline-hidden focus:border-purple-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider pl-1">
                Організатор
              </label>
              <input
                type="text"
                required
                placeholder="Назва установи"
                value={newProgram.organizer}
                onChange={(e) =>
                  setNewProgram({ ...newProgram, organizer: e.target.value })
                }
                className="w-full px-3 py-2 text-xs border border-[var(--border-color)] rounded-lg bg-[var(--bg-main)] text-[var(--text-dark)] focus:outline-hidden focus:border-purple-500"
              />
            </div>
          </div>
        )}

        {newProgram.type === "Конференція" && (
          <div className="space-y-3 p-3 bg-purple-600/[0.02] border border-[var(--border-color)] rounded-2xl animate-[fadeIn_0.2s_ease-out]">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider pl-1">
                  Організатор
                </label>
                <input
                  type="text"
                  required
                  placeholder="Назва установи"
                  value={newProgram.organizer}
                  onChange={(e) =>
                    setNewProgram({ ...newProgram, organizer: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs border border-[var(--border-color)] rounded-lg bg-[var(--bg-main)] text-[var(--text-dark)] focus:outline-hidden focus:border-purple-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider pl-1">
                  Локація
                </label>
                <input
                  type="text"
                  placeholder="Онлайн / Місто"
                  value={newProgram.location}
                  onChange={(e) =>
                    setNewProgram({ ...newProgram, location: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs border border-[var(--border-color)] rounded-lg bg-[var(--bg-main)] text-[var(--text-dark)] focus:outline-hidden focus:border-purple-500"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider pl-1">
                Посилання на подію
              </label>
              <input
                type="url"
                placeholder="https://example.com"
                value={newProgram.externalLink}
                onChange={(e) =>
                  setNewProgram({ ...newProgram, externalLink: e.target.value })
                }
                className="w-full px-3 py-2 text-xs border border-[var(--border-color)] rounded-lg bg-[var(--bg-main)] text-[var(--text-dark)] focus:outline-hidden focus:border-purple-500"
              />
            </div>
          </div>
        )}

        {/* КІНЦЕВИЙ ТЕРМІН (DEADLINE) */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-[var(--text-gray)] uppercase tracking-wider pl-1 block">
            Кінцевий термін (Deadline)
          </label>
          <div className="relative">
            <DatePicker
              selected={newProgram.deadline}
              onChange={(date) =>
                setNewProgram({ ...newProgram, deadline: date })
              }
              dateFormat="dd.MM.yyyy"
              minDate={new Date()}
              placeholderText="Оберіть дату"
              required
              className="w-full px-4 py-3 text-xs border border-[var(--border-color)] rounded-xl bg-[var(--bg-main)] text-[var(--text-dark)] focus:outline-hidden focus:border-purple-500 transition-colors pl-10"
            />
            <CalendarIcon
              size={14}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-gray)] pointer-events-none"
            />
          </div>
        </div>

        {/* ПОВНИЙ ОПИС ТА РЕГЛАМЕНТ */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-[var(--text-gray)] uppercase tracking-wider pl-1">
            Повний опис та регламент
          </label>
          <div className="rounded-2xl overflow-hidden border border-[var(--border-color)] bg-[var(--bg-main)]">
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
              placeholder="Напишіть деталі, вимоги до кандидатів, етапи подачі..."
            />
          </div>
        </div>

        {/* КНОПКА ПОДАЧІ */}
        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            disabled={loadingAction === "createProgram"}
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all active:scale-[0.99] flex items-center justify-center gap-1.5 italic shadow-md shadow-purple-600/10"
          >
            <PlusCircle size={14} />
            {loadingAction === "createProgram" ? "Створення..." : "Створити"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProgramForm;
