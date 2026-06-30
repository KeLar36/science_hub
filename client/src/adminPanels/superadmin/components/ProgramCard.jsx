import React from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  ArrowUpRight,
  Zap,
  Clock,
  Edit2,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Building2, // 🟢 Додаємо іконку будівлі для установи
} from "lucide-react";

const stripHtmlFast = (html) => {
  if (!html) return "";
  let text = html.replace(/<\/?[^>]+(>|$)/g, " "); // Заміна тегів на пробіли
  text = text
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
  return text.replace(/\s+/g, " ").trim();
};

const ProgramCard = ({
  p,
  index,
  isUrgent,
  onClick,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  // Перевіряємо, чи це режим адмін-панелі (якщо передані функції керування)
  const isAdminMode = !!(onEdit || onDelete || onToggleStatus);

  // 1. ВИГЛЯД ДЛЯ ПАНЕЛІ АДМІНІСТРАТОРА / СУПЕРАДМІНА
  if (isAdminMode) {
    return (
      <div className="group bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-purple-500/30 p-5 rounded-2xl shadow-xs transition-all flex flex-col justify-between gap-4 relative overflow-hidden text-left">
        <div className="flex items-center justify-between gap-2">
          <span className="px-2.5 py-1 bg-purple-500/5 text-purple-600 dark:text-purple-400 border border-purple-500/10 rounded-lg text-[10px] font-black tracking-wider uppercase">
            {p.type}
          </span>
          <div className="flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
            {onToggleStatus && (
              <button
                onClick={() => onToggleStatus(p._id, p.active)}
                title={p.active ? "Деактивувати (в архів)" : "Активувати"}
                className={`p-1.5 rounded-lg transition-colors ${
                  p.active
                    ? "text-emerald-500 hover:bg-emerald-500/5"
                    : "text-[var(--text-gray)] hover:bg-[var(--bg-main)]"
                }`}
              >
                {p.active ? (
                  <ToggleRight size={18} />
                ) : (
                  <ToggleLeft size={18} />
                )}
              </button>
            )}
            {onEdit && (
              <button
                onClick={() => onEdit(p)}
                title="Редагувати"
                className="p-1.5 text-blue-500 hover:bg-blue-500/5 rounded-lg transition-colors"
              >
                <Edit2 size={14} />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(p._id)}
                title="Видалити"
                className="p-1.5 text-red-500 hover:bg-red-500/5 rounded-lg transition-colors"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        </div>

        <div className="space-y-1.5 flex-1">
          {/* 🟢 ВІДОБРАЖЕННЯ УСТАНОВИ ДЛЯ СУПЕРАДМІНА В АДМІН-РЕЖИМІ */}
          {p.organizationId?.name && (
            <div className="flex items-center gap-1.5 px-2 py-1 bg-purple-500/5 border border-purple-500/10 rounded-xl text-[10px] font-black text-purple-600 dark:text-purple-400 w-fit uppercase tracking-wider mb-1">
              <Building2 size={11} />
              <span>{p.organizationId.name}</span>
            </div>
          )}

          <h4 className="text-sm font-black text-[var(--text-dark)] line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors uppercase">
            {p.title}
          </h4>
          <p className="text-xs text-[var(--text-gray)] font-mono uppercase tracking-wider">
            {p.domain}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[var(--border-color)] text-[10px] font-bold uppercase tracking-wider">
          <div className="flex items-center gap-1 text-red-500 bg-red-500/5 px-2 py-0.5 rounded-md">
            <Clock size={11} />
            Дедлайн:{" "}
            {p.deadline
              ? new Date(p.deadline).toLocaleDateString("uk-UA")
              : "—"}
          </div>

          <div className="flex items-center gap-1.5">
            {p.type === "Грант" && p.amount && (
              <span className="px-2 py-0.5 bg-amber-500/5 text-amber-600 dark:text-amber-400 border border-amber-500/10 rounded-md">
                💰 {p.amount}
              </span>
            )}
            {p.type === "Науковий журнал" && p.impactFactor > 0 && (
              <span className="px-2 py-0.5 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 border border-emerald-500/10 rounded-md">
                IF: {p.impactFactor}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  const displayIndex = index + 1 < 10 ? `0${index + 1}` : index + 1;

  // 2. СТАНДАРТНИЙ ПУБЛІЧНИЙ ВИГЛЯД КАРТКИ
  return (
    <article
      onClick={onClick}
      className="group relative p-6 md:p-8 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl cursor-pointer flex flex-col h-[450px] transition-all duration-300 hover:border-purple-500/40 hover:shadow-lg hover:shadow-purple-600/[0.02] will-change-transform hover:-translate-y-1 text-left"
    >
      <div className="absolute top-4 right-6 text-3xl font-extrabold text-[var(--text-gray)] opacity-[0.04] group-hover:opacity-[0.12] transition-opacity select-none">
        {displayIndex}
      </div>

      <div className="flex justify-between items-start mb-6 mt-2">
        <div className="flex flex-col gap-1.5">
          <div className="flex flex-wrap gap-1.5 items-center">
            <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 bg-purple-600/5 px-2 py-0.5 rounded">
              {p.type || "Програма"}
            </span>

            {p.type === "Науковий журнал" && p.impactFactor > 0 && (
              <span className="text-[9px] font-bold bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 border border-emerald-500/10 px-1.5 py-0.5 rounded">
                IF: {p.impactFactor}
              </span>
            )}
            {p.type === "Грант" && p.amount && (
              <span className="text-[9px] font-bold bg-amber-500/5 text-amber-600 dark:text-amber-400 border border-amber-500/10 px-1.5 py-0.5 rounded">
                💰 {p.amount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold text-[var(--text-gray)] uppercase tracking-wide opacity-80">
            {p.domain}
          </span>
        </div>

        <div className="p-2 border border-[var(--border-color)] rounded-xl group-hover:border-purple-500/30 bg-[var(--bg-main)] transition-colors">
          <ArrowUpRight
            size={14}
            className="text-[var(--text-gray)] group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors"
          />
        </div>
      </div>

      <div className="space-y-3 mb-auto">
        {/* 🟢 ПОКАЗ УСТАНОВИ ДЛЯ СУПЕРАДМІНА НА ПУБЛІЧНІЙ КАРТЦІ */}
        {p.organizationId?.name && (
          <div className="flex items-center gap-1.5 px-2 py-1 bg-purple-500/5 border border-purple-500/10 rounded-xl text-[10px] font-black text-purple-600 dark:text-purple-400 w-fit uppercase tracking-wider">
            <Building2 size={11} />
            <span>{p.organizationId.name}</span>
          </div>
        )}

        <h3 className="text-xl font-bold text-[var(--text-dark)] leading-snug uppercase tracking-tight group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-2">
          {p.title}
        </h3>

        <p className="text-xs text-[var(--text-gray)] line-clamp-4 leading-relaxed font-normal opacity-90">
          {stripHtmlFast(p.cleanedDescription || p.description)}
        </p>
      </div>

      <div className="pt-5 border-t border-[var(--border-color)] flex items-center justify-between mt-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] flex items-center justify-center">
            <Calendar
              size={12}
              className="text-purple-600 dark:text-purple-400"
            />
          </div>
          <div>
            <div className="font-mono text-[8px] opacity-50 uppercase font-semibold text-[var(--text-gray)]">
              Дедлайн
            </div>
            <div className="text-xs font-bold text-[var(--text-dark)] uppercase tracking-wide">
              {p.deadline
                ? new Date(p.deadline).toLocaleDateString("uk-UA")
                : "TBA"}
            </div>
          </div>
        </div>

        {isUrgent && (
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 bg-purple-600/5 rounded-full border border-purple-500/10">
            <span className="w-1 h-1 rounded-full bg-purple-600 dark:bg-purple-400 animate-pulse" />
            <span className="text-[8px] font-bold uppercase text-purple-600 dark:text-purple-400 tracking-wider">
              Спливає
            </span>
          </div>
        )}
        <Zap
          size={14}
          className="text-[var(--border-color)] group-hover:text-purple-500 dark:group-hover:text-purple-400 transition-colors"
        />
      </div>
    </article>
  );
};

export default ProgramCard;
