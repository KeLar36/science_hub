import React from "react";
import { Filter } from "lucide-react";

export default function ArchiveFilter({
  domains,
  selectedDomain,
  onSelectDomain,
}) {
  return (
    <div className="max-w-7xl mx-auto mb-12">
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-4 rounded-2xl flex flex-col md:flex-row items-start md:items-center gap-4 shadow-xs">
        <div className="flex items-center gap-2 text-[var(--text-gray)] font-black text-xs uppercase tracking-wider pl-2 flex-shrink-0">
          <Filter size={14} className="text-purple-600" />
          <span>Фільтр галузей:</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full pb-1 md:pb-0 scrollbar-none snap-x">
          {domains.map((domain) => (
            <button
              key={domain}
              onClick={() => onSelectDomain(domain)}
              className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all snap-shrink whitespace-nowrap border ${
                selectedDomain === domain
                  ? "bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-600/10"
                  : "bg-[var(--bg-main)] text-[var(--text-gray)] border-[var(--border-color)] hover:border-purple-600/40 hover:text-[var(--text-dark)]"
              }`}
            >
              {domain}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
