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
  Link2,
} from "lucide-react";
import { Button } from "./ui/Button";
import "react-datepicker/dist/react-datepicker.css";
import "react-quill-new/dist/quill.snow.css";

import { SCIENTIFIC_DOMAINS, PROGRAM_TYPES } from "../constants/domains";

const ProgramForm = ({
  newProgram,
  setNewProgram,
  loadingAction,
  onSubmit,
  organizationName,
}) => {
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
    <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-6 rounded-3xl shadow-xs top-6 text-left">
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
            placeholder="Напр., Міжнародний грант PhD 2026"
            value={newProgram.title}
            onChange={(e) =>
              setNewProgram({ ...newProgram, title: e.target.value })
            }
            className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 outline-none focus:border-purple-600 transition-all text-xs font-bold text-[var(--text-dark)]"
          />
        </div>

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
                onChange={(e) =>
                  setNewProgram({ ...newProgram, type: e.target.value })
                }
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

        {newProgram.type === "Грант" && (
          <div className="grid grid-cols-2 gap-3 p-3 bg-[var(--bg-main)]/50 border border-[var(--border-color)] rounded-2xl animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-[var(--text-gray)] uppercase pl-1 flex items-center gap-1">
                <DollarSign size={10} className="text-purple-500" /> Розмір
                фонду
              </label>
              <input
                type="text"
                required
                placeholder="Напр., 50 000 грн"
                value={newProgram.amount || ""}
                onChange={(e) =>
                  setNewProgram({ ...newProgram, amount: e.target.value })
                }
                className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl px-3 py-2 outline-none focus:border-purple-600 text-xs font-bold text-[var(--text-dark)]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-[var(--text-gray)] uppercase pl-1">
                Хто організатор
              </label>
              <input
                type="text"
                required
                disabled={!!organizationName}
                placeholder="Організатор конкурсу"
                value={newProgram.organizer || ""}
                onChange={(e) =>
                  setNewProgram({ ...newProgram, organizer: e.target.value })
                }
                className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl px-3 py-2 outline-none focus:border-purple-600 text-xs font-bold text-[var(--text-dark)] disabled:opacity-70 disabled:bg-[var(--bg-main)]"
              />
            </div>
          </div>
        )}

        {newProgram.type === "Conference" ||
        newProgram.type === "Конференція" ? (
          <div className="grid grid-cols-2 gap-3 p-3 bg-[var(--bg-main)]/50 border border-[var(--border-color)] rounded-2xl animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-[var(--text-gray)] uppercase pl-1">
                Організатор
              </label>
              <input
                type="text"
                required
                disabled={!!organizationName}
                placeholder="Назва установи"
                value={newProgram.organizer || ""}
                onChange={(e) =>
                  setNewProgram({
                    ...newProgram,
                    organizer: e.target.value,
                  })
                }
                className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl px-3 py-2 outline-none focus:border-purple-600 text-xs font-bold text-[var(--text-dark)] disabled:opacity-70 disabled:bg-[var(--bg-main)]"
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
        ) : null}

        <div className="space-y-1 p-3 bg-purple-600/[0.02] border border-purple-500/15 rounded-2xl">
          <label className="text-[10px] font-black text-purple-600 dark:text-purple-400 uppercase pl-1 flex items-center gap-1">
            <Link2 size={12} /> Зовнішнє посилання на оригінал конкурсу /
            ресурсу (Опціонально)
          </label>
          <input
            type="url"
            placeholder="https://example-university.edu/grant-page"
            value={newProgram.externalLink || ""}
            onChange={(e) =>
              setNewProgram({ ...newProgram, externalLink: e.target.value })
            }
            className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl px-3 py-2 outline-none focus:border-purple-600 text-xs font-semibold text-[var(--text-dark)]"
          />
          <p className="text-[9px] text-[var(--text-gray)] pl-1 pt-0.5 font-medium">
            * Якщо заповнено, кнопка подачі автоматично перенаправлятиме
            користувачів на цей сайт.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <div className="space-y-1 flex flex-col">
            <label className="text-[11px] font-bold text-[var(--text-gray)] uppercase tracking-wider pl-1 flex items-center gap-1">
              <CalendarIcon size={12} className="text-purple-500" /> Кінцевий
              дедлайн
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
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-bold text-[var(--text-gray)] uppercase tracking-wider pl-1 flex items-center gap-1">
            <AlignLeft size={12} className="text-purple-500" /> Короткий тизер
            (макс. 300 слів)
          </label>
          <textarea
            rows={2}
            maxLength={300}
            placeholder="Напишіть привабливе резюме можливості для картки списку..."
            value={newProgram.shortDescription || ""}
            onChange={(e) =>
              setNewProgram({ ...newProgram, shortDescription: e.target.value })
            }
            className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl p-3 outline-none focus:border-purple-600 transition-all text-xs font-semibold text-[var(--text-dark)] resize-none"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-bold text-[var(--text-gray)] uppercase tracking-wider pl-1">
            Повний опис та регламент конкурсу
          </label>
          <div className="rounded-xl overflow-hidden border border-[var(--border-color)] bg-[var(--bg-main)] [&_.ql-toolbar]:border-none [&_.ql-toolbar]:bg-[var(--bg-card)] [&_.ql-toolbar]:border-b [&_.ql-toolbar]:border-[var(--border-color)] [&_.ql-container]:border-none [&_.ql-container]:min-h-[140px] [&_.ql-editor]:text-xs [&_.ql-editor]:text-[var(--text-dark)]">
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

        <div className="pt-2">
          <Button
            type="submit"
            isLoading={loadingAction === "createProgram"}
            className="w-full py-3 text-xs font-black tracking-widest uppercase italic shadow-md shadow-purple-600/10"
            icon={PlusCircle}
          >
            Опублікувати
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProgramForm;
