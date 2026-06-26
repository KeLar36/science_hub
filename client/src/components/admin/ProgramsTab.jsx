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
  Globe,
  Link2,
  Award,
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
      organizer: ["Грант", "Конференція"].includes(selectedType)
        ? newProgram.organizer
        : "",
      externalLink: ["Конференція", "Датасет", "Курс"].includes(selectedType)
        ? newProgram.externalLink
        : "",
      location: selectedType === "Конференція" ? newProgram.location : "Онлайн",
    };

    setNewProgram({
      ...newProgram,
      ...clearedFields,
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-200">
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-6 rounded-3xl shadow-xs h-fit">
        <h3 className="text-lg font-black text-[var(--text-dark)] mb-5 uppercase tracking-tight italic flex items-center gap-2">
          <PlusCircle size={18} className="text-purple-600" />
          Створити програму
        </h3>

        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-gray)]">
              Назва програми
            </label>
            <input
              type="text"
              placeholder="Введіть назву..."
              value={newProgram.title || ""}
              onChange={(e) =>
                setNewProgram({ ...newProgram, title: e.target.value })
              }
              className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-4 py-3 outline-none text-sm text-[var(--text-dark)] focus:border-purple-500/50 transition-colors"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-gray)]">
              Короткий опис (до 300 симв.)
            </label>
            <textarea
              placeholder="Короткий анонс для картки..."
              maxLength={300}
              value={newProgram.shortDescription || ""}
              onChange={(e) =>
                setNewProgram({
                  ...newProgram,
                  shortDescription: e.target.value,
                })
              }
              className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-4 py-3 outline-none text-sm text-[var(--text-dark)] focus:border-purple-500/50 transition-colors h-20 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-gray)]">
                Тип
              </label>
              <select
                value={newProgram.type || "Науковий журнал"}
                onChange={handleTypeChange}
                className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-3 py-3 outline-none text-sm text-[var(--text-dark)] focus:border-purple-500/50 transition-colors"
              >
                {PROGRAM_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-gray)]">
                Галузь
              </label>
              <select
                value={newProgram.domain || "Всі галузі"}
                onChange={(e) =>
                  setNewProgram({ ...newProgram, domain: e.target.value })
                }
                className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-3 py-3 outline-none text-sm text-[var(--text-dark)] focus:border-purple-500/50 transition-colors"
              >
                <option value="Всі галузі">Всі галузі</option>
                {SCIENTIFIC_DOMAINS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {newProgram.type === "Науковий журнал" && (
            <div className="grid grid-cols-2 gap-4 animate-in fade-in duration-200">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-gray)]">
                  ISSN
                </label>
                <input
                  type="text"
                  placeholder="1234-567X"
                  value={newProgram.issn || ""}
                  onChange={(e) =>
                    setNewProgram({ ...newProgram, issn: e.target.value })
                  }
                  className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-4 py-3 outline-none text-sm text-[var(--text-dark)] focus:border-purple-500/50 transition-colors"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-gray)]">
                  Impact Factor
                </label>
                <input
                  type="text"
                  placeholder="0.0"
                  value={newProgram.impactFactor || ""}
                  onChange={(e) =>
                    setNewProgram({
                      ...newProgram,
                      impactFactor: e.target.value,
                    })
                  }
                  className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-4 py-3 outline-none text-sm text-[var(--text-dark)] focus:border-purple-500/50 transition-colors"
                />
              </div>
            </div>
          )}

          {newProgram.type === "Грант" && (
            <div className="grid grid-cols-2 gap-4 animate-in fade-in duration-200">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-gray)]">
                  Сума гранту
                </label>
                <input
                  type="text"
                  placeholder="напр., 50 000 UAH"
                  value={newProgram.amount || ""}
                  onChange={(e) =>
                    setNewProgram({ ...newProgram, amount: e.target.value })
                  }
                  className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-4 py-3 outline-none text-sm text-[var(--text-dark)] focus:border-purple-500/50 transition-colors"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-gray)]">
                  Організатор
                </label>
                <input
                  type="text"
                  placeholder="Хто фінансує..."
                  value={newProgram.organizer || ""}
                  onChange={(e) =>
                    setNewProgram({ ...newProgram, organizer: e.target.value })
                  }
                  className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-4 py-3 outline-none text-sm text-[var(--text-dark)] focus:border-purple-500/50 transition-colors"
                />
              </div>
            </div>
          )}

          {newProgram.type === "Конференція" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-gray)]">
                    Організатор
                  </label>
                  <input
                    type="text"
                    placeholder="Назва установи..."
                    value={newProgram.organizer || ""}
                    onChange={(e) =>
                      setNewProgram({
                        ...newProgram,
                        organizer: e.target.value,
                      })
                    }
                    className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-4 py-3 outline-none text-sm text-[var(--text-dark)] focus:border-purple-500/50 transition-colors"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-gray)]">
                    Локація / Платформа
                  </label>
                  <input
                    type="text"
                    placeholder="Онлайн, Zoom або Місто"
                    value={newProgram.location || ""}
                    onChange={(e) =>
                      setNewProgram({ ...newProgram, location: e.target.value })
                    }
                    className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-4 py-3 outline-none text-sm text-[var(--text-dark)] focus:border-purple-500/50 transition-colors"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-gray)]">
                  Зовнішнє посилання
                </label>
                <input
                  type="text"
                  placeholder="https://site.com/conference"
                  value={newProgram.externalLink || ""}
                  onChange={(e) =>
                    setNewProgram({
                      ...newProgram,
                      externalLink: e.target.value,
                    })
                  }
                  className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-4 py-3 outline-none text-sm text-[var(--text-dark)] focus:border-purple-500/50 transition-colors"
                />
              </div>
            </div>
          )}

          {["Курс", "Датасет"].includes(newProgram.type) && (
            <div className="space-y-1 animate-in fade-in duration-200">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-gray)]">
                Посилання на матеріал
              </label>
              <input
                type="text"
                placeholder="https://link-to-resource.com"
                value={newProgram.externalLink || ""}
                onChange={(e) =>
                  setNewProgram({ ...newProgram, externalLink: e.target.value })
                }
                className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-4 py-3 outline-none text-sm text-[var(--text-dark)] focus:border-purple-500/50 transition-colors"
              />
            </div>
          )}

          <div className="space-y-1 relative">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-gray)] block">
              Кінцевий термін (Дедлайн)
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
                className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-4 py-3 pl-10 outline-none text-sm text-[var(--text-dark)] focus:border-purple-500/50 transition-colors"
              />
              <CalendarIcon
                size={14}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-gray)]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-gray)]">
              Повний опис / Умови
            </label>
            <div className="quill-wrapper rounded-xl overflow-hidden border border-[var(--border-color)] bg-[var(--bg-main)]">
              <ReactQuill
                theme="snow"
                value={newProgram.description || ""}
                onChange={(content) =>
                  setNewProgram({ ...newProgram, description: content })
                }
                placeholder="Детальні вимоги, критерії оцінювання..."
              />
            </div>
          </div>

          <button
            onClick={onCreateProgram}
            disabled={loadingAction === "create-program"}
            className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-purple-600/10 active:scale-98 flex items-center justify-center gap-2"
          >
            Зберегти програму
          </button>
        </div>
      </div>

      <div className="lg:col-span-2 space-y-4">
        <h3 className="text-lg font-black text-[var(--text-dark)] mb-5 uppercase tracking-tight italic">
          Активні програми ({programs.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {programs.map((p) => (
            <div
              key={p._id}
              className="bg-[var(--bg-card)] border border-[var(--border-color)] p-5 rounded-2xl flex flex-col justify-between hover:shadow-xs transition-shadow"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2 py-0.5 bg-purple-500/10 text-purple-600 border border-purple-500/10 rounded-md text-[9px] font-black uppercase tracking-wider">
                    {p.type}
                  </span>

                  {p.type === "Грант" && p.amount && (
                    <span className="px-2 py-0.5 bg-amber-500/10 text-amber-600 border border-amber-500/10 rounded-md text-[10px] font-bold">
                      💰 {p.amount}
                    </span>
                  )}
                  {p.type === "Науковий журнал" && p.impactFactor > 0 && (
                    <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/10 rounded-md text-[10px] font-bold">
                      IF: {p.impactFactor}
                    </span>
                  )}
                  {p.type === "Конференція" && p.location && (
                    <span className="px-2 py-0.5 bg-blue-500/10 text-blue-500 border border-blue-500/10 rounded-md text-[10px] font-bold flex items-center gap-1">
                      📍 {p.location}
                    </span>
                  )}
                </div>

                <h4 className="text-base font-black text-[var(--text-dark)] line-clamp-1">
                  {p.title}
                </h4>
                <p className="text-xs text-[var(--text-gray)] mt-1 line-clamp-2">
                  {p.shortDescription || "Без короткого опису."}
                </p>

                {p.organizer && (
                  <div className="text-[10px] text-[var(--text-gray)] font-medium mt-2 flex items-center gap-1">
                    <Award size={11} /> Організатор:{" "}
                    <span className="font-bold text-[var(--text-dark)]">
                      {p.organizer}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4 mt-4 pt-3 border-t border-[var(--border-color)] text-xs font-bold uppercase tracking-wider">
                <div className="flex items-center gap-1.5 text-red-500 bg-red-500/5 px-2.5 py-1 rounded-lg text-[11px]">
                  <Clock size={13} />
                  Дедлайн:{" "}
                  {p.deadline
                    ? new Date(p.deadline).toLocaleDateString("uk-UA")
                    : "—"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgramsTab;
