import React, { useState } from "react";
import { Bookmark, Lock } from "lucide-react";
import { useAuth } from "@/shared/lib/hooks/useAuth";

const REACTION_TYPES = [
  { key: "fire", emoji: "🔥", label: "Вогонь" },
  { key: "heart", emoji: "❤️", label: "Улюблена" },
  { key: "clap", emoji: "👏", label: "Оплески" },
  { key: "idea", emoji: "💡", label: "Ідея" },
];

export default function PostReactions({
  reactions = {},
  onReactionToggle,
  isBookmarked = false,
  onBookmarkToggle,
  bookmarkLoading = false,
  onRequireAuth,
}) {
  const { user } = useAuth();
  const currentUserId = user?._id;
  const [authTip, setAuthTip] = useState(null);

  const triggerAuthWarning = (actionText) => {
    if (onRequireAuth) {
      onRequireAuth();
      return;
    }
    setAuthTip(`Увійдіть в акаунт, щоб ${actionText}`);
    setTimeout(() => setAuthTip(null), 3000);
  };

  const handleReactionClick = (key) => {
    if (!user) {
      triggerAuthWarning("залишити реакцію");
      return;
    }
    onReactionToggle?.(key, currentUserId);
  };

  const handleBookmarkClick = () => {
    if (!user) {
      triggerAuthWarning("зберегти пост у закладки");
      return;
    }
    onBookmarkToggle?.();
  };

  return (
    <div className="max-w-4xl mx-auto w-full text-left mt-10 pt-6 border-t border-border-color/60 space-y-3">
      {authTip && (
        <div className="p-2.5 px-4 rounded-xl bg-brand/10 border border-brand/30 text-brand text-xs font-medium flex items-center gap-2 animate-reveal">
          <Lock size={14} />
          <span>{authTip}</span>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-3">
          <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-text-muted">
            Оцініть матеріал
          </p>

          <div className="flex flex-wrap items-center gap-2.5">
            {REACTION_TYPES.map(({ key, emoji, label }) => {
              const userList = Array.isArray(reactions[key])
                ? reactions[key]
                : [];
              const count = userList.length;

              const hasReacted =
                currentUserId &&
                userList.some((id) => {
                  const rawId = id?.$oid || id;
                  return rawId === currentUserId;
                });

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleReactionClick(key)}
                  className={`
                    flex items-center gap-2 px-3.5 py-2 rounded-lg border text-xs font-semibold tracking-wide 
                    transition-all duration-200 select-none cursor-pointer active:scale-95
                    ${
                      hasReacted
                        ? "bg-brand/10 border-brand text-brand shadow-xs"
                        : "bg-bg-secondary border-border-color text-text-secondary hover:text-text-primary hover:border-text-muted/40 hover:bg-bg-tertiary/40"
                    }
                  `}
                  title={!user ? "Увійдіть, щоб залишити реакцію" : label}
                >
                  <span
                    className={`text-sm transition-transform ${
                      hasReacted ? "animate-bounce" : ""
                    }`}
                  >
                    {emoji}
                  </span>
                  <span className="font-mono text-[11px]">{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="self-end pt-2 sm:pt-0">
          <button
            type="button"
            onClick={handleBookmarkClick}
            disabled={bookmarkLoading}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg border text-xs font-semibold tracking-wide
              transition-all duration-200 select-none cursor-pointer active:scale-95
              disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100
              ${
                isBookmarked
                  ? "bg-brand/10 border-brand text-brand shadow-xs"
                  : "bg-bg-secondary border-border-color text-text-secondary hover:text-text-primary hover:border-text-muted/40 hover:bg-bg-tertiary/40"
              }
            `}
            title={
              !user
                ? "Увійдіть, щоб зберегти в закладки"
                : isBookmarked
                  ? "Видалити з закладок"
                  : "Зберегти в закладки"
            }
          >
            <Bookmark
              size={16}
              className={`transition-transform duration-200 ${
                isBookmarked ? "fill-brand text-brand" : "text-text-muted"
              }`}
            />
            <span>{isBookmarked ? "У закладках" : "В закладки"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
