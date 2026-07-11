import React from "react";
import { Terminal } from "lucide-react";

const RulesHeader = () => {
  return (
    <div className="mb-20 text-center relative z-10">
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-purple-500/10 bg-purple-600/5 text-purple-600 dark:text-purple-400 mb-6 select-none animate-[pulse_3s_infinite]">
        <Terminal size={12} />
        <span className="font-mono text-[9px] font-black uppercase tracking-widest">
          System.Protocols v2.4
        </span>
      </div>
      <h1 className="text-4xl md:text-6xl font-black tracking-tight uppercase text-[var(--text-dark)] leading-[0.95] mb-6">
        Регламент <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-indigo-500 to-purple-600 bg-[size:200%] animate-[marquee_5s_linear_infinite]">
          відкритої науки
        </span>
      </h1>
      <p className="max-w-2xl mx-auto text-[var(--text-gray)] text-xs md:text-sm font-medium leading-relaxed opacity-95">
        Нормативна база регулює процеси валідації установ за кодом ЄДРПОУ,
        стандарти депонування відкритих датасетів, ліцензування матеріалів та
        критерії рецензування.
      </p>
    </div>
  );
};

export default RulesHeader;
