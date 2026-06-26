import React from "react";
import { Zap } from "lucide-react";

const HeroSection = () => {
  return (
    <header className="relative pt-44 pb-24 overflow-hidden bg-radial from-purple-500/10 via-transparent to-transparent border-b border-[var(--border-color)]/30">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-6 relative text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-full text-xs font-black uppercase tracking-widest border border-purple-500/10 italic animate-pulse">
          <Zap size={12} className="fill-current" /> Open Science Platform
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-[var(--text-dark)] leading-none max-w-4xl mx-auto">
          Знайдіть фінансування <br /> та журнали для{" "}
          <span className="text-purple-600 dark:text-purple-400 italic bg-clip-text">
            своїх публікацій
          </span>
        </h1>

        <p className="text-sm md:text-base text-[var(--text-gray)] max-w-2xl mx-auto font-medium leading-relaxed">
          Єдиний агрегатор актуальних наукових грантів, міжнародних стипендій та
          провідних фахових видань. Подавайте заявки, публікуйте дослідження та
          розвивайте відкриту науку разом з нами.
        </p>
      </div>
    </header>
  );
};

export default HeroSection;
