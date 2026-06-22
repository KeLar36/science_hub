import React from "react";
import DatePicker from "react-datepicker";
import ReactQuill from "react-quill-new";
import {
  PlusCircle,
  Calendar as CalendarIcon,
  Clock,
  DollarSign,
  BookOpen,
  BarChart3,
} from "lucide-react";

import { SCIENTIFIC_DOMAINS, PROGRAM_TYPES } from "../../constants/domains";

const ProgramsTab = ({
  programs = [],
  newProgram,
  setNewProgram,
  onCreateProgram,
  loadingAction,
}) => {
  const handleTypeChange = (e) => {
    const selectedType = e.target.value;

    const clearedFields = {
      type: selectedType,
      amount: selectedType === "Грант" ? newProgram.amount : "",
      issn: selectedType === "Науковий журнал" ? newProgram.issn : "",
      impactFactor:
        selectedType === "Науковий журнал" ? newProgram.impactFactor : 0,
    };

    setNewProgram({
      ...newProgram,
      ...clearedFields,
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-200">
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-6 rounded-3xl shadow-xs h-fit">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-gray)] mb-6">
          Створити програму конкурсу
        </h3>
        <form onSubmit={onCreateProgram} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-[var(--text-gray)] uppercase tracking-wider block mb-1.5 ml-1">
              Назва програми
            </label>
            <input
              type="text"
              required
              placeholder="Наприклад: Міжнародний грант НАНУ 2026"
              className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-dark)] rounded-xl px-4 py-3 text-sm focus:border-purple-500 outline-none transition-colors"
              value={newProgram.title || ""}
              onChange={(e) =>
                setNewProgram({ ...newProgram, title: e.target.value })
              }
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[var(--text-gray)] uppercase tracking-wider block mb-1.5 ml-1">
              Тип програми
            </label>
            <select
              className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-dark)] rounded-xl px-4 py-3 text-sm focus:border-purple-500 outline-none admin-select-custom cursor-pointer"
              value={newProgram.type || ""}
              required
              onChange={handleTypeChange}
            >
              <option value="" disabled>
                Оберіть тип...
              </option>
              {PROGRAM_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-[var(--text-gray)] uppercase tracking-wider block mb-1.5 ml-1">
              Галузь / Напрямок
            </label>
            <select
              className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-dark)] rounded-xl px-4 py-3 text-sm focus:border-purple-500 outline-none admin-select-custom cursor-pointer"
              value={newProgram.domain || "Всі галузі"}
              onChange={(e) =>
                setNewProgram({ ...newProgram, domain: e.target.value })
              }
            >
              <option value="Всі галузі">Всі галузі</option>
              {SCIENTIFIC_DOMAINS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {newProgram.type === "Грант" && (
            <div className="animate-in slide-in-from-top-2 duration-200">
              <label className="text-xs font-bold text-[var(--text-gray)] uppercase tracking-wider block mb-1.5 ml-1">
                Бюджет / Сума гранту
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="Наприклад: 50 000 USD або до 200 000 ₴"
                  className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-dark)] rounded-xl pl-10 pr-4 py-3 text-sm focus:border-purple-500 outline-none transition-colors"
                  value={newProgram.amount || ""}
                  onChange={(e) =>
                    setNewProgram({ ...newProgram, amount: e.target.value })
                  }
                />
                <DollarSign
                  size={16}
                  className="absolute left-3.5 top-3.5 text-purple-500"
                />
              </div>
            </div>
          )}

          {newProgram.type === "Науковий журнал" && (
            <div className="grid grid-cols-2 gap-3 animate-in slide-in-from-top-2 duration-200">
              <div>
                <label className="text-xs font-bold text-[var(--text-gray)] uppercase tracking-wider block mb-1.5 ml-1">
                  ISSN
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="1234-567X"
                    className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-dark)] rounded-xl pl-10 pr-4 py-3 text-sm focus:border-purple-500 outline-none transition-colors"
                    value={newProgram.issn || ""}
                    onChange={(e) =>
                      setNewProgram({ ...newProgram, issn: e.target.value })
                    }
                  />
                  <BookOpen
                    size={15}
                    className="absolute left-3.5 top-3.5 text-purple-500"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-[var(--text-gray)] uppercase tracking-wider block mb-1.5 ml-1">
                  Impact Factor
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="2.5"
                    className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-dark)] rounded-xl pl-10 pr-4 py-3 text-sm focus:border-purple-500 outline-none transition-colors"
                    value={newProgram.impactFactor ?? ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      setNewProgram({
                        ...newProgram,
                        impactFactor: val === "" ? "" : parseFloat(val) || 0,
                      });
                    }}
                  />
                  <BarChart3
                    size={15}
                    className="absolute left-3.5 top-3.5 text-purple-500"
                  />
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-[var(--text-gray)] uppercase tracking-wider block mb-1.5 ml-1">
              Кінцевий дедлайн подачі
            </label>
            <div className="relative">
              <DatePicker
                selected={newProgram.deadline}
                onChange={(date) =>
                  setNewProgram({ ...newProgram, deadline: date })
                }
                dateFormat="dd.MM.yyyy"
                locale="uk"
                minDate={new Date()}
                required
                className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-dark)] rounded-xl px-4 py-3 text-sm focus:border-purple-500 outline-none transition-colors"
              />
              <CalendarIcon
                size={16}
                className="absolute right-4 top-3.5 text-purple-500 pointer-events-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[var(--text-gray)] uppercase tracking-wider block mb-1.5 ml-1">
              Опис та критерії відбору
            </label>
            <div className="admin-quill rounded-xl overflow-hidden border border-[var(--border-color)]">
              <ReactQuill
                theme="snow"
                value={newProgram.description || ""}
                onChange={(v) =>
                  setNewProgram({ ...newProgram, description: v })
                }
                placeholder="Детальні умови конкурсу, фінансування чи вимоги до публікації..."
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loadingAction === "create-program"}
            className="w-full py-4 bg-purple-600 hover:bg-purple-700 active:scale-[0.99] text-white text-xs font-black uppercase tracking-widest rounded-xl shadow-lg shadow-purple-600/10 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <PlusCircle size={16} />
            {loadingAction === "create-program"
              ? "Створення..."
              : "Опублікувати програму"}
          </button>
        </form>
      </div>

      <div className="lg:col-span-2 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-gray)] mb-2">
          Активні конкурсні програми ({programs.length})
        </h3>
        {programs.length === 0 ? (
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-8 text-center rounded-3xl text-[var(--text-gray)] text-sm font-medium">
            Жодної програми ще не створено
          </div>
        ) : (
          programs.map((p) => (
            <div
              key={p._id}
              className="bg-[var(--bg-card)] border border-[var(--border-color)] p-6 rounded-3xl shadow-xs hover:border-purple-500/30 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            >
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2 py-0.5 bg-purple-500/10 text-purple-500 border border-purple-500/10 rounded-md text-[10px] font-bold tracking-wider uppercase">
                    {p.type || "Програма"}
                  </span>
                  <span className="px-2 py-0.5 bg-blue-500/10 text-blue-500 border border-blue-500/10 rounded-md text-[10px] font-bold tracking-wider uppercase">
                    {p.domain || "Всі галузі"}
                  </span>
                  {p.type === "Грант" && p.amount && (
                    <span className="px-2 py-0.5 bg-amber-500/10 text-amber-500 border border-amber-500/10 rounded-md text-[10px] font-bold tracking-wider uppercase">
                      💰 {p.amount}
                    </span>
                  )}
                  {p.type === "Науковий журнал" && p.impactFactor > 0 && (
                    <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/10 rounded-md text-[10px] font-bold tracking-wider uppercase">
                      IF: {p.impactFactor}
                    </span>
                  )}
                </div>

                <h4 className="text-base font-black text-[var(--text-dark)]">
                  {p.title}
                </h4>

                <div className="flex items-center gap-4 mt-1 text-xs font-bold text-[var(--text-gray)] uppercase tracking-wider">
                  <div className="flex items-center gap-1.5 text-red-500 bg-red-500/5 px-2.5 py-1 rounded-lg">
                    <Clock size={13} />
                    Дедлайн:{" "}
                    {p.deadline
                      ? new Date(p.deadline).toLocaleDateString("uk-UA")
                      : "Не вказано"}
                  </div>
                  <div className="text-[var(--text-gray)] hidden sm:block">
                    Створено:{" "}
                    {p.createdAt
                      ? new Date(p.createdAt).toLocaleDateString("uk-UA")
                      : "—"}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProgramsTab;
