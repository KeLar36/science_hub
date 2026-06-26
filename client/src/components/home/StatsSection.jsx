import React from "react";
import { BookOpen, Award, Globe } from "lucide-react";

const StatsSection = ({ totalCount }) => {
  return (
    <section className="border-y border-[var(--border-color)] bg-[var(--bg-card)]/50 backdrop-blur-xs py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
        <div className="space-y-1">
          <div className="flex justify-center text-purple-600 dark:text-purple-400 mb-2">
            <Award size={24} />
          </div>
          <div className="text-3xl font-black tracking-tight text-[var(--text-dark)] font-mono">
            {totalCount || "15+"}
          </div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-gray)]">
            Активних Програм
          </div>
        </div>

        <div className="space-y-1 border-y sm:border-y-0 sm:border-x border-[var(--border-color)] py-6 sm:py-0">
          <div className="flex justify-center text-purple-600 dark:text-purple-400 mb-2">
            <BookOpen size={24} />
          </div>
          <div className="text-3xl font-black tracking-tight text-[var(--text-dark)] font-mono">
            Діючі
          </div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-gray)]">
            Фахові видання України
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex justify-center text-purple-600 dark:text-purple-400 mb-2">
            <Globe size={24} />
          </div>
          <div className="text-3xl font-black tracking-tight text-[var(--text-dark)] font-mono">
            100%
          </div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-gray)]">
            Відкритий Доступ (Open Access)
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
