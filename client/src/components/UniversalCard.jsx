/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  ArrowUpRight,
  Edit2,
  Trash2,
  ToggleLeft,
  ToggleRight,
  History,
  FileUp,
  DollarSign,
  MapPin,
  Hash,
  Activity,
  Award,
} from "lucide-react";

const stripHtmlFast = (html) => {
  if (!html) return "";

  let text = html;

  text = text.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "");
  text = text.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "");

  text = text.replace(/<\/?[^>]+(>|$)/g, " ");

  text = text
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&ldquo;/g, '"')
    .replace(/&rdquo;/g, '"')
    .replace(/&bull;/g, "•")
    .replace(/&ndash;/g, "–")
    .replace(/&mdash;/g, "—");

  text = text.replace(/\s+/g, " ").trim();

  return text === "" ? "" : text;
};
const getStatusStyles = (status) => {
  switch (status) {
    case "Прийнято":
      return "text-emerald-500 bg-emerald-500/5 border-emerald-500/10";
    case "На доопрацюванні":
      return "text-amber-500 bg-amber-500/5 border-amber-500/10";
    case "Відхилено":
      return "text-red-500 bg-red-500/5 border-red-500/10";
    default:
      return "text-purple-600 bg-purple-500/5 border-purple-500/10";
  }
};

const UniversalCard = ({
  item,
  variant = "program",
  index,
  isUrgent = false,
  onClick,
  onEdit,
  onDelete,
  onToggleStatus,
  onRemoveBookmark,
  onActionClick,
}) => {
  if (!item) return null;

  const isAdminMode = !!(onEdit || onDelete || onToggleStatus);
  const displayIndex =
    index !== undefined && index + 1 < 10 ? `0${index + 1}` : index + 1;

  const isBlogRelated = variant === "blog" || variant === "profileBookmark";
  const linkTo = isBlogRelated
    ? `/blog/${item._id || item.id}`
    : `/program/${item._id}`;

  const previewText = isBlogRelated
    ? item.excerpt || stripHtmlFast(item.content || "")
    : item.shortDescription || stripHtmlFast(item.description || "");

  let cardStyles =
    "group bg-[var(--bg-card)] border border-[var(--border-color)] p-6 rounded-3xl transition-all flex flex-col justify-between hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/[0.02]";

  if (variant === "homeProgram") {
    cardStyles =
      "group relative p-6 md:p-8 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl cursor-pointer flex flex-col h-[460px] transition-all duration-300 hover:border-purple-500/40 hover:shadow-lg hover:shadow-purple-600/[0.02] will-change-transform hover:-translate-y-1";
  } else if (variant === "blog") {
    cardStyles =
      "group flex flex-col h-full bg-[var(--bg-light)] border border-[var(--border-color)] rounded-2xl transition-all duration-300 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-600/[0.01] hover:-translate-y-0.5 overflow-hidden";
  } else if (variant === "profileArticle") {
    cardStyles =
      "bg-[var(--bg-card)] border border-[var(--border-color)] p-6 rounded-2xl flex flex-col justify-between h-[270px] relative group hover:border-purple-500/30 hover:shadow-lg transition-all";
  } else if (variant === "profileBookmark") {
    cardStyles =
      "bg-[var(--bg-card)] border border-[var(--border-color)] p-6 rounded-2xl flex flex-col justify-between h-[240px] relative group cursor-pointer hover:border-purple-500/30 hover:shadow-lg transition-all";
  } else if (variant === "program" && !isAdminMode) {
    cardStyles += " min-h-[230px]";
  }

  const RenderTypeSpecificInfo = () => {
    if (variant !== "homeProgram") return null;

    switch (item.type) {
      case "Грант":
        return item.amount ? (
          <div className="mt-3 flex items-center gap-1.5 px-3 py-1.5 bg-purple-600/5 border border-purple-500/10 rounded-xl w-fit">
            <DollarSign
              size={13}
              className="text-purple-600 dark:text-purple-400"
            />
            <span className="text-[10px] font-mono font-black text-purple-600 dark:text-purple-400 uppercase tracking-wide">
              {item.amount}
            </span>
          </div>
        ) : null;

      case "Конференція":
        return item.location ? (
          <div className="mt-3 flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/5 border border-blue-500/10 rounded-xl w-fit">
            <MapPin size={13} className="text-blue-500" />
            <span className="text-[10px] font-mono font-bold text-blue-500 uppercase tracking-wide">
              {item.location}
            </span>
          </div>
        ) : null;

      case "Науковий журнал":
        return item.issn || item.impactFactor ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {item.issn && (
              <div className="flex items-center gap-1 px-2.5 py-1 bg-amber-500/5 border border-amber-500/10 rounded-lg">
                <Hash
                  size={11}
                  className="text-amber-600 dark:text-amber-400"
                />
                <span className="text-[9px] font-mono font-bold text-amber-600 dark:text-amber-400">
                  ISSN: {item.issn}
                </span>
              </div>
            )}
            {item.impactFactor !== undefined && (
              <div className="flex items-center gap-1 px-2.5 py-1 bg-emerald-500/5 border border-emerald-500/10 rounded-lg">
                <Activity
                  size={11}
                  className="text-emerald-600 dark:text-emerald-400"
                />
                <span className="text-[9px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  IF: {item.impactFactor || "0.0"}
                </span>
              </div>
            )}
          </div>
        ) : null;

      default:
        return null;
    }
  };

  const CardContent = () => (
    <>
      {variant === "blog" && (
        <div className="relative h-52 overflow-hidden border-b border-[var(--border-color)] bg-[var(--bg-main)] w-full">
          <img
            src={item.coverImage || "/placeholder-blog.png"}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {item.category && (
            <span className="absolute top-4 left-4 px-2.5 py-0.5 bg-purple-600 text-white rounded-md text-[9px] font-black uppercase tracking-wider font-mono shadow-sm">
              {item.category}
            </span>
          )}
        </div>
      )}

      <div
        className={`flex-1 flex flex-col ${variant === "blog" ? "p-6" : ""}`}
      >
        {variant !== "blog" && (
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-[var(--text-gray)] mb-3">
            {variant === "homeProgram" ? (
              <div className="flex items-center gap-2">
                <span className="font-mono text-purple-600 dark:text-purple-400 text-xs font-black tracking-normal">
                  {displayIndex}
                </span>
                {item.type && (
                  <span className="px-2 py-0.5 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-md text-[8px] font-black uppercase tracking-widest border border-purple-500/10">
                    {item.type}
                  </span>
                )}
              </div>
            ) : variant === "profileArticle" ? (
              <span
                className={`px-2.5 py-0.5 rounded-md border text-[9px] font-bold ${getStatusStyles(item.status)}`}
              >
                {item.status || "В обробці"}
              </span>
            ) : (
              <span className="px-2.5 py-0.5 bg-purple-500/5 text-purple-600 dark:text-purple-400 rounded-md text-[9px] font-bold tracking-wider">
                {item.domain || item.type || "Наука"}
              </span>
            )}

            {isAdminMode && (
              <div
                className="flex items-center gap-1.5 z-10"
                onClick={(e) => e.preventDefault()}
              >
                <button
                  onClick={() => onEdit(item)}
                  className="p-1.5 text-[var(--text-gray)] hover:text-purple-600 hover:bg-purple-500/5 rounded-lg transition-all"
                  title="Редагувати"
                >
                  <Edit2 size={13} />
                </button>
                <button
                  onClick={() => onToggleStatus(item._id, item.isActive)}
                  className="p-1.5 text-[var(--text-gray)] hover:text-blue-600 hover:bg-blue-500/5 rounded-lg transition-all"
                  title={item.isActive ? "Деактивувати" : "Активувати"}
                >
                  {item.isActive ? (
                    <ToggleRight size={18} className="text-emerald-500" />
                  ) : (
                    <ToggleLeft size={18} />
                  )}
                </button>
                <button
                  onClick={() => onDelete(item._id)}
                  className="p-1.5 text-red-400 hover:text-red-500 hover:bg-red-500/5 rounded-lg transition-all"
                  title="Видалити"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            )}

            {variant === "profileBookmark" && onRemoveBookmark && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onRemoveBookmark(e, item._id || item.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg transition-all z-10"
                title="Видалити з закладок"
              >
                <Trash2 size={15} />
              </button>
            )}
          </div>
        )}

        <div className="space-y-1.5 flex-1">
          {variant === "blog" && (
            <div className="flex items-center gap-2 text-[10px] font-mono text-[var(--text-gray)] uppercase tracking-wider mb-1">
              <Calendar size={11} />
              <span>
                {item.createdAt
                  ? new Date(item.createdAt).toLocaleDateString("uk-UA", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : "Дата відсутня"}
              </span>
            </div>
          )}

          <h3
            className={`${variant === "blog" ? "text-xl mb-3" : "text-base"} font-black tracking-tight text-[var(--text-dark)] group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-2 uppercase`}
          >
            {item.title}
          </h3>

          {variant === "homeProgram" && item.domain && (
            <p className="text-xs text-[var(--text-gray)] font-mono uppercase tracking-wider">
              {item.domain}
            </p>
          )}

          {previewText && (
            <p className="text-xs text-[var(--text-gray)] line-clamp-2 leading-relaxed font-medium opacity-90">
              {previewText}
            </p>
          )}

          {/* Вбудовуємо вивід специфічних даних для карток головної сторінки */}
          <RenderTypeSpecificInfo />
        </div>

        <div className="pt-4 border-t border-[var(--border-color)] flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[var(--text-dark)] mt-4">
          {variant === "homeProgram" ? (
            <>
              <div className="flex flex-col text-left max-w-[150px] normal-case font-medium text-[var(--text-gray)]">
                {item.organizer && (
                  <>
                    <span className="text-[8px] font-mono uppercase opacity-50 tracking-wider mb-0.5">
                      Організатор
                    </span>
                    <span
                      className="text-[11px] font-bold text-[var(--text-dark)] truncate"
                      title={item.organizer}
                    >
                      {item.organizer}
                    </span>
                  </>
                )}
              </div>
              <div className="w-8 h-8 rounded-full bg-purple-600 border border-purple-600 flex items-center justify-center group-hover:bg-purple-700 transition-all duration-300 ml-auto text-white">
                <ArrowUpRight size={14} />
              </div>
            </>
          ) : variant === "blog" ? (
            <>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-gray)] group-hover:text-[var(--text-dark)] transition-colors">
                Читати статтю
              </span>
              <div className="w-8 h-8 rounded-lg border border-[var(--border-color)] bg-[var(--bg-main)] flex items-center justify-center group-hover:bg-purple-600 group-hover:border-purple-600 transition-all duration-300 text-[var(--text-gray)] group-hover:text-white">
                <ArrowUpRight size={14} />
              </div>
            </>
          ) : variant === "profileBookmark" ? (
            <>
              <span className="flex items-center gap-1 text-[var(--text-gray)] font-medium normal-case">
                <History size={12} />{" "}
                {item.createdAt
                  ? new Date(item.createdAt).toLocaleDateString("uk-UA")
                  : "—"}
              </span>
              <span className="text-purple-600 font-black text-[10px] uppercase tracking-wider">
                Читати
              </span>
            </>
          ) : variant === "profileArticle" ? (
            <div className="w-full flex flex-col gap-3 normal-case font-medium text-[var(--text-gray)]">
              <div className="flex items-center justify-between text-xs">
                <span>
                  {item.createdAt
                    ? new Date(item.createdAt).toLocaleDateString("uk-UA")
                    : "—"}
                </span>
                <span className="text-[10px] opacity-60 font-mono">
                  Версія: {item.versions?.length || 1}.0
                </span>
              </div>
              {item.status === "На доопрацюванні" && onActionClick && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onActionClick(e, item);
                  }}
                  className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-[11px] uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-md shadow-amber-500/10 mt-1 z-10"
                >
                  <FileUp size={13} /> Переподати роботу
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] flex items-center justify-center text-purple-600 dark:text-purple-400">
                  <Calendar size={12} />
                </div>
                <div>
                  <div className="font-mono text-[8px] opacity-50 uppercase font-semibold text-[var(--text-gray)] leading-none mb-0.5">
                    Дедлайн
                  </div>
                  <div className="text-xs font-bold text-[var(--text-dark)] uppercase tracking-wide">
                    {item.deadline
                      ? new Date(item.deadline).toLocaleDateString("uk-UA")
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

              {!isAdminMode && (
                <div className="flex flex-col text-right max-w-[140px]">
                  <span className="text-[9px] text-[var(--text-gray)] font-medium normal-case leading-none mb-1">
                    Організатор
                  </span>
                  <span
                    className="text-[var(--text-gray)] truncate"
                    title={item.organizer}
                  >
                    {item.organizer || "—"}
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );

  if (onClick) {
    return (
      <div onClick={onClick} className={cardStyles}>
        <CardContent />
      </div>
    );
  }

  return (
    <Link to={linkTo} className={cardStyles}>
      <CardContent />
    </Link>
  );
};

export default UniversalCard;
