import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav className="flex items-center justify-center space-x-2 border-t border-border-color pt-6 mt-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-1.5 rounded-md border border-border-color bg-bg-secondary text-text-primary hover:border-brand hover:text-brand disabled:opacity-30 disabled:hover:border-border-color disabled:hover:text-text-primary transition-colors cursor-pointer disabled:cursor-not-allowed"
        aria-label="Попередня сторінка"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`px-3 py-1 text-xs font-mono font-bold rounded-md border transition-all cursor-pointer ${
            currentPage === p
              ? "bg-brand border-brand text-white shadow-sm"
              : "bg-bg-secondary border-border-color text-text-secondary hover:border-brand hover:text-brand"
          }`}
        >
          {p}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-1.5 rounded-md border border-border-color bg-bg-secondary text-text-primary hover:border-brand hover:text-brand disabled:opacity-30 disabled:hover:border-border-color disabled:hover:text-text-primary transition-colors cursor-pointer disabled:cursor-not-allowed"
        aria-label="Наступна сторінка"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </nav>
  );
}
