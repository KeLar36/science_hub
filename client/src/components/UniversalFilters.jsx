import React from "react";
import { Search, ChevronDown, X } from "lucide-react";

export default function UniversalFilters({
  searchTerm,
  setSearchTerm,
  searchPlaceholder = "Пошук...",
  dropdowns = [],
  onReset,
}) {
  return (
    <div className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] p-4 rounded-2xl shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between mb-6 animate-in fade-in duration-200">
      <div className="relative w-full md:flex-grow max-w-md">
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl pl-10 pr-10 py-2.5 text-sm text-[var(--text-dark)] outline-none focus:border-purple-500/50 transition-all placeholder:text-[var(--text-gray)]/50"
        />
        <Search
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-gray)]/60 pointer-events-none"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-gray)] hover:text-[var(--text-dark)] p-0.5 rounded-md transition-colors"
          >
            <X size={14} />
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-start md:justify-end">
        {dropdowns.map((drop, idx) => (
          <div key={idx} className="relative min-w-[140px] w-full sm:w-auto">
            <select
              value={drop.value}
              onChange={(e) => drop.onChange(e.target.value)}
              className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl pl-4 pr-9 py-2.5 text-xs font-semibold text-[var(--text-dark)] outline-none focus:border-purple-500/50 transition-all appearance-none cursor-pointer"
            >
              {drop.options.map((opt, oIdx) => (
                <option key={oIdx} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-gray)] pointer-events-none"
            />
          </div>
        ))}

        {onReset && (
          <button
            onClick={onReset}
            className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline px-2 py-2"
          >
            Скинути
          </button>
        )}
      </div>
    </div>
  );
}
