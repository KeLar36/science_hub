import React from "react";
import { Zap } from "lucide-react";

export const PageHeader = ({
  badge,
  title,
  highlightedTitle,
  description,
  children,
  animateBadge = false,
}) => {
  return (
    <header className="relative pt-44 pb-24 px-4 md:px-6 overflow-hidden bg-radial from-purple-500/[0.03] via-transparent to-transparent border-b border-[var(--border-color)]/30">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] bg-purple-500/5 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative text-center space-y-8 z-10">
        {badge && (
          <div
            className={`inline-flex items-center gap-2 px-4 py-1.5 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-full text-[11px] font-black uppercase tracking-widest border border-purple-500/10 italic ${animateBadge ? "animate-pulse" : ""}`}
          >
            <Zap size={11} className="fill-current" /> {badge}
          </div>
        )}

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-[var(--text-dark)] leading-[1.05] max-w-4xl mx-auto">
          {title} {highlightedTitle && <br />}
          {highlightedTitle && (
            <span className="dark:text-purple-400 italic bg-gradient-to-r from-purple-600 to-indigo-500 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(147,51,234,0.1)]">
              {highlightedTitle}
            </span>
          )}
        </h1>

        {description && (
          <p className="text-sm md:text-base text-[var(--text-gray)] max-w-2xl mx-auto font-medium leading-relaxed opacity-95">
            {description}
          </p>
        )}

        {children && (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
            {children}
          </div>
        )}
      </div>
    </header>
  );
};
