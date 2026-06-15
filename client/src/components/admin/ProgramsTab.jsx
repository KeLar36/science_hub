import React from "react";
import DatePicker from "react-datepicker";
import ReactQuill from "react-quill-new";
import { PlusCircle, Calendar as CalendarIcon, Clock } from "lucide-react";
import { PROGRAM_CATEGORIES } from "../../constants/adminConstants";

const ProgramsTab = ({
  programs,
  newProgram,
  setNewProgram,
  onCreateProgram,
  loadingAction,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-200">
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-6 rounded-3xl shadow-xs h-fit">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-gray)] mb-6">
          Створити програму
        </h3>
        <form onSubmit={onCreateProgram} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-[var(--text-gray)] uppercase tracking-wider block mb-1.5 ml-1">
              Назва програми
            </label>
            <input
              type="text"
              required
              placeholder="Наприклад: Грант НАНУ 2026"
              className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-dark)] rounded-xl px-4 py-3 text-sm focus:border-purple-500 outline-none transition-colors"
              value={newProgram.title}
              onChange={(e) =>
                setNewProgram({ ...newProgram, title: e.target.value })
              }
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[var(--text-gray)] uppercase tracking-wider block mb-1.5 ml-1">
              Напрямок / Категорія
            </label>
            <select
              className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-dark)] rounded-xl px-4 py-3 text-sm focus:border-purple-500 outline-none admin-select-custom cursor-pointer"
              value={newProgram.category}
              onChange={(e) =>
                setNewProgram({ ...newProgram, category: e.target.value })
              }
            >
              {PROGRAM_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

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
                value={newProgram.description}
                onChange={(v) =>
                  setNewProgram({ ...newProgram, description: v })
                }
                placeholder="Детальні умови конкурсу..."
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
              <div>
                <span className="px-2 py-0.5 bg-purple-500/10 text-purple-500 border border-purple-500/10 rounded-md text-[10px] font-bold tracking-wider uppercase">
                  {p.category}
                </span>
                <h4 className="text-base font-black text-[var(--text-dark)] mt-2">
                  {p.title}
                </h4>
                <div className="flex items-center gap-4 mt-3 text-xs font-bold text-[var(--text-gray)] uppercase tracking-wider">
                  <div className="flex items-center gap-1.5 text-red-500 bg-red-500/5 px-2.5 py-1 rounded-lg">
                    <Clock size={13} />
                    Дедлайн: {new Date(p.deadline).toLocaleDateString("uk-UA")}
                  </div>
                  <div className="text-[var(--text-gray)]">
                    Створено:{" "}
                    {new Date(p.createdAt).toLocaleDateString("uk-UA")}
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
