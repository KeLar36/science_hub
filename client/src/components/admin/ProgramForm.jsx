import React from "react";
import DatePicker from "react-datepicker";
import ReactQuill from "react-quill-new";
import {
  PlusCircle,
  Calendar as CalendarIcon,
  DollarSign,
  BookOpen,
  BarChart3,
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
            placeholder="Введіть повну назву..."
            className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm text-[var(--text-dark)] outline-none focus:border-purple-500/50 transition-colors"
            value={newProgram.title}
            onChange={(e) =>
              setNewProgram({ ...newProgram, title: e.target.value })
            }
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-[var(--text-gray)] uppercase tracking-wider pl-1">
              Тип програми
            </label>
            <select
              className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-3 py-3 text-sm text-[var(--text-dark)] outline-none focus:border-purple-500/50 cursor-pointer"
              value={newProgram.type}
              onChange={onTypeChange}
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
              value={newProgram.domain}
              onChange={(e) =>
                setNewProgram({ ...newProgram, domain: e.target.value })
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
            placeholder="Наприклад, МОН України, НаУКМА..."
            className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm text-[var(--text-dark)] outline-none focus:border-purple-500/50 transition-colors"
            value={newProgram.organizer}
            onChange={(e) =>
              setNewProgram({ ...newProgram, organizer: e.target.value })
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
            value={newProgram.externalLink}
            onChange={(e) =>
              setNewProgram({ ...newProgram, externalLink: e.target.value })
            }
          />
        </div>

        {newProgram.type === "Грант" && (
          <div className="space-y-1 animate-in slide-in-from-top-2 duration-200">
            <label className="text-[11px] font-bold text-[purple-600] dark:text-purple-400 uppercase tracking-wider pl-1 flex items-center gap-1.5">
              <DollarSign size={12} /> Розмір бюджету / Фінансування
            </label>
            <input
              type="text"
              placeholder="Наприклад, до 500 000 грн або $10,000"
              className="w-full bg-[var(--bg-main)] border border-purple-500/20 focus:border-purple-500 rounded-xl px-4 py-3 text-sm text-[var(--text-dark)] outline-none transition-colors"
              value={newProgram.amount}
              onChange={(e) =>
                setNewProgram({ ...newProgram, amount: e.target.value })
              }
            />
          </div>
        )}

        {newProgram.type === "Науковий журнал" && (
          <div className="grid grid-cols-2 gap-3 animate-in slide-in-from-top-2 duration-200">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-emerald-500 uppercase tracking-wider pl-1 flex items-center gap-1">
                <BookOpen size={12} /> ISSN
              </label>
              <input
                type="text"
                placeholder="2414-9055"
                className="w-full bg-[var(--bg-main)] border border-emerald-500/20 focus:border-emerald-500 rounded-xl px-4 py-3 text-sm text-[var(--text-dark)] outline-none transition-colors"
                value={newProgram.issn}
                onChange={(e) =>
                  setNewProgram({ ...newProgram, issn: e.target.value })
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
                value={newProgram.impactFactor}
                onChange={(e) =>
                  setNewProgram({
                    ...newProgram,
                    impactFactor: parseFloat(e.target.value) || 0,
                  })
                }
              />
            </div>
          </div>
        )}

        <div className="space-y-1">
          <label className="text-[11px] font-bold text-[var(--text-gray)] uppercase tracking-wider pl-1 flex items-center gap-1">
            <CalendarIcon size={11} /> Кінцевий термін (Дедлайн)
          </label>
          <div className="relative rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] focus-within:border-purple-500/50 transition-colors px-3 py-1">
            <DatePicker
              selected={newProgram.deadline}
              onChange={(date) =>
                setNewProgram({ ...newProgram, deadline: date })
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
              value={newProgram.description}
              onChange={(content) =>
                setNewProgram({ ...newProgram, description: content })
              }
              placeholder="\Напишіть деталі, вимоги до кандидатів, етапи подачі...\"
            />
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            disabled={loadingAction === "createProgram"}
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all active:scale-[0.99] flex items-center justify-center gap-1.5 italic shadow-md shadow-purple-600/10"
          >
            <PlusCircle size={14} />
            {loadingAction === "createProgram"
              ? "Зберігання..."
              : "Створити програму"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProgramForm;
