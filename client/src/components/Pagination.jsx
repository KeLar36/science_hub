import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between gap-4 animate-in fade-in duration-150">
      <div className="text-xs font-bold text-[var(--text-gray)] uppercase tracking-wider">
        Сторінка <span className="text-[var(--text-dark)]">{currentPage}</span>{" "}
        з <span className="text-[var(--text-dark)]">{totalPages}</span>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className="p-2 bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-dark)] hover:border-purple-500/50 rounded-xl transition-all disabled:opacity-30 disabled:pointer-events-none active:scale-95"
        >
          <ChevronLeft size={16} />
        </button>

        <button
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="p-2 bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-dark)] hover:border-purple-500/50 rounded-xl transition-all disabled:opacity-30 disabled:pointer-events-none active:scale-95"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
