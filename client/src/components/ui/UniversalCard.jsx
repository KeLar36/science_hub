/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { Link } from "react-router-dom";
import DOMPurify from "dompurify";
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
} from "lucide-react";
import { BentoCard } from "./BentoCard";
import { Button } from "./Button";

// =============================================================================
// 🟢 ХЕЛПЕРИ ТА СТИЛІ
// =============================================================================
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

const cleanText = (html) => {
  if (!html) return "";
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ["b", "i", "strong", "em", "p", "br", "span"],
  });
};

// =============================================================================
// 📦 1. ВАРІАНТ: КАРТКА БЛОГУ
// =============================================================================
const BlogCardContent = ({ item, previewText }) => {
  const displayImage =
    item.images && Array.isArray(item.images) && item.images.length > 0
      ? item.images.find((img) => img.isHero)?.url || item.images[0].url
      : item.coverImage || item.image || "/placeholder-blog.png";

  return (
    <div className="flex flex-col h-full text-left">
      <div className="relative h-52 overflow-hidden border-b border-[var(--border-color)] bg-[var(--bg-main)] -mx-5 -mt-5 mb-4 w-[calc(100%+2.5rem)]">
        <img
          src={displayImage}
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {item.category && (
          <span className="absolute top-4 left-4 px-2.5 py-0.5 bg-purple-600 text-white rounded-md text-[9px] font-black uppercase tracking-wider font-mono shadow-xs">
            {item.category}
          </span>
        )}
      </div>

      <div className="space-y-2 flex-1 flex flex-col justify-between">
        <div>
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
          <h3 className="text-xl mb-3 font-black tracking-tight text-[var(--text-dark)] transition-colors line-clamp-2 uppercase">
            {item.title}
          </h3>
          {previewText && (
            <p
              className="text-xs text-[var(--text-gray)] line-clamp-2 leading-relaxed font-medium opacity-90"
              dangerouslySetInnerHTML={{ __html: previewText }}
            ></p>
          )}
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// 📦 2. ВАРІАНТ: КАРТКА ПРОГРАМИ / ГРАНТУ / КОНФЕРЕНЦІЇ
// =============================================================================
const ProgramCardContent = ({ item, variant, previewText, displayIndex }) => {
  return (
    <div className="space-y-2 flex-1 text-left flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-[var(--text-gray)] mb-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-purple-600 dark:text-purple-400 text-xs font-black">
              {displayIndex}
            </span>
            {item.type && (
              <span className="px-2 py-0.5 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-md text-[8px] font-black uppercase tracking-widest border border-purple-500/10">
                {item.type}
              </span>
            )}
          </div>
        </div>

        <h3 className="text-base font-black tracking-tight text-[var(--text-dark)] transition-colors line-clamp-2 uppercase mb-2">
          {item.title}
        </h3>

        {item.domain && (
          <p className="text-xs text-[var(--text-gray)] font-mono uppercase tracking-wider mb-2">
            {item.domain}
          </p>
        )}

        {previewText && (
          <p
            className="text-xs text-[var(--text-gray)] line-clamp-2 leading-relaxed font-medium opacity-90"
            dangerouslySetInnerHTML={{ __html: previewText }}
          ></p>
        )}
      </div>

      {/* Рендеринг специфічної інфо (Гранти/Конференції) */}
      {variant === "homeProgram" && (
        <div className="mt-auto pt-2">
          {item.type === "Грант" && item.amount && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600/5 border border-purple-500/10 rounded-xl w-fit">
              <DollarSign
                size={13}
                className="text-purple-600 dark:text-purple-400"
              />
              <span className="text-[10px] font-mono font-black text-purple-600 dark:text-purple-400 uppercase tracking-wide">
                {item.amount}
              </span>
            </div>
          )}
          {item.type === "Конференція" && item.location && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/5 border border-blue-500/10 rounded-xl w-fit">
              <MapPin size={13} className="text-blue-500" />
              <span className="text-[10px] font-mono font-bold text-blue-500 uppercase tracking-wide">
                {item.location}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// =============================================================================
// 📦 3. ВАРІАНТ: ПОДАНИЙ НА РЕЦЕНЗІЮ ПРОЄКТ (ПРОФІЛЬ)
// =============================================================================
const ProfileArticleCardContent = ({ item, onActionClick }) => {
  const programDeadline = item.programId?.deadline || item.deadline;
  const isDeadlinePassed = programDeadline
    ? new Date(programDeadline) <= new Date()
    : false;

  return (
    <div className="w-full flex flex-col gap-3.5 normal-case font-medium text-[var(--text-gray)] text-left">
      <div className="flex items-center justify-between gap-2 mb-1">
        <span
          className={`px-2.5 py-0.5 rounded-md border text-[9px] font-bold ${getStatusStyles(item.status)}`}
        >
          {item.status || "В обробці"}
        </span>
      </div>

      <h3 className="text-base font-black tracking-tight text-[var(--text-dark)] line-clamp-2 uppercase m-0">
        {item.title}
      </h3>

      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border-color)]/60 pb-2 text-[11px] mt-2">
        {item.programId?.type && (
          <span className="font-black uppercase tracking-wider text-purple-600">
            📁 {item.programId.type}
          </span>
        )}
        {item.programId?.organizer && (
          <span
            className="font-bold truncate max-w-[150px]"
            title={item.programId.organizer}
          >
            🏢 {item.programId.organizer}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between text-xs font-semibold">
        <div className="flex items-center gap-1.5">
          <Calendar
            size={12}
            className={isDeadlinePassed ? "text-red-500" : "text-purple-500"}
          />
          {programDeadline ? (
            <div>
              <span className="text-[9px] block opacity-50 uppercase font-bold leading-none mb-0.5">
                {isDeadlinePassed ? "Конкурс завершено" : "Дедлайн програми"}
              </span>
              <span
                className={`font-mono font-black ${isDeadlinePassed ? "text-red-500" : "text-[var(--text-dark)]"}`}
              >
                {new Date(programDeadline).toLocaleDateString("uk-UA")}
              </span>
            </div>
          ) : (
            <span className="opacity-50">Дедлайн відсутній</span>
          )}
        </div>
        <span className="text-[10px] opacity-70 font-mono font-bold bg-[var(--bg-main)] px-2 py-0.5 rounded-md border border-[var(--border-color)]">
          v{item.versions?.length || 1}.0
        </span>
      </div>

      {item.status === "На доопрацюванні" && onActionClick && (
        <Button
          variant="primary"
          size="sm"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onActionClick(e, item);
          }}
          className="w-full gap-1.5 mt-1 bg-amber-500 hover:bg-amber-600 text-[10px] font-black uppercase tracking-wider py-2.5 rounded-xl cursor-pointer"
        >
          <FileUp size={13} /> Переподати роботу
        </Button>
      )}
    </div>
  );
};

// =============================================================================
// 🚀 ГОЛОВНИЙ ЕКСПОРТ КОМПОНЕНТА (Диспетчер рендерингу)
// =============================================================================
export const UniversalCard = ({
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
    ? item.excerpt || cleanText(item.content)
    : item.shortDescription || cleanText(item.description);

  // Кастомні футери під кожну картку
  const renderFooter = () => {
    if (variant === "homeProgram") {
      return (
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
          <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white ml-auto">
            <ArrowUpRight size={14} />
          </div>
        </>
      );
    }
    if (variant === "blog" || variant === "profileBookmark") {
      return (
        <>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-gray)]">
            Читати статтю
          </span>
          <div className="w-8 h-8 rounded-lg border border-[var(--border-color)] bg-[var(--bg-main)] flex items-center justify-center text-[var(--text-gray)]">
            <ArrowUpRight size={14} />
          </div>
        </>
      );
    }
    return (
      <>
        <div className="flex items-center gap-2.5 text-left">
          <div className="w-8 h-8 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] flex items-center justify-center text-purple-600">
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
        {!isAdminMode && (
          <div className="flex flex-col text-right max-w-[140px] normal-case text-xs font-bold text-[var(--text-gray)]">
            <span className="text-[8px] opacity-50 uppercase font-semibold leading-none mb-1">
              Організатор
            </span>
            <span className="truncate" title={item.organizer}>
              {item.organizer || "—"}
            </span>
          </div>
        )}
      </>
    );
  };

  const CardWrapper = ({ children }) => {
    const classes = `h-full ${variant === "homeProgram" ? "min-h-[460px]" : variant === "profileArticle" ? "min-h-[270px]" : variant === "profileBookmark" ? "min-h-[240px]" : ""}`;
    if (variant === "profileArticle")
      return <div className={classes}>{children}</div>;
    if (onClick)
      return (
        <div onClick={onClick} className={classes + " cursor-pointer"}>
          {children}
        </div>
      );
    return (
      <Link to={linkTo} className={classes}>
        {children}
      </Link>
    );
  };

  return (
    <CardWrapper>
      <BentoCard
        footer={renderFooter()}
        className="h-full transition-all duration-300 hover:-translate-y-1 relative group"
      >
        {/* Адмін-дії винесені наверх поверх картки */}
        {isAdminMode && (
          <div
            className="absolute top-4 right-4 flex items-center gap-1.5 z-30"
            onClick={(e) => e.preventDefault()}
          >
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onEdit(item)}
              className="p-1.5 rounded-lg"
            >
              <Edit2 size={13} />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onToggleStatus(item._id, item.isActive)}
              className="p-1.5 rounded-lg"
            >
              {item.isActive ? (
                <ToggleRight size={18} className="text-emerald-500" />
              ) : (
                <ToggleLeft size={18} />
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(item._id)}
              className="p-1.5 rounded-lg border-red-500/20 text-red-500 hover:bg-red-500/5"
            >
              <Trash2 size={13} />
            </Button>
          </div>
        )}

        {/* 🚀 ДИСКУРСИВНИЙ РОУТИНГ ВНУТРІШНЬОГО ВМІСТУ */}
        {variant === "blog" && (
          <BlogCardContent item={item} previewText={previewText} />
        )}
        {variant === "profileArticle" && (
          <ProfileArticleCardContent
            item={item}
            onActionClick={onActionClick}
          />
        )}
        {(variant === "program" || variant === "homeProgram") && (
          <ProgramCardContent
            item={item}
            variant={variant}
            previewText={previewText}
            displayIndex={displayIndex}
          />
        )}
      </BentoCard>
    </CardWrapper>
  );
};

export default UniversalCard;
