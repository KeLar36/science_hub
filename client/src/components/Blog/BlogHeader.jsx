import React from "react";
import { Terminal, BookOpen, Sparkles } from "lucide-react";

export default function BlogHeader() {
  return (
    <div className="max-w-7xl mx-auto mb-12 px-4 md:px-6 select-none animate-in fade-in duration-500">
      <div className="relative overflow-hidden rounded-[32px] border border-[var(--border-color)] bg-gradient-to-br from-[var(--bg-card)] via-[var(--bg-card)]/95 to-purple-600/[0.02] p-10 md:p-16 lg:p-20 shadow-2xl shadow-purple-500/[0.01] group/header transition-all duration-500 hover:border-purple-500/10">
        <div className="absolute top-0 right-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/[0.06] blur-[130px] rounded-full pointer-events-none group-hover/header:bg-purple-600/[0.08] transition-colors duration-500" />
        <div className="absolute -bottom-40 -left-20 w-[400px] h-[400px] bg-fuchsia-500/[0.01] blur-[100px] rounded-full pointer-events-none" />

        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808007_1px,transparent_1px),linear-gradient(to_bottom,#80808007_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-purple-600/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 backdrop-blur-xs animate-pulse duration-2000">
            <div className="flex h-1.5 w-1.5 rounded-full bg-purple-600" />
            <div className="flex items-center gap-1 font-mono tracking-[0.2em]">
              <Terminal size={10} className="stroke-[2.5]" />
              <span>Science Platform Media Hub</span>
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight text-[var(--text-dark)] leading-[1.05] m-0 italic">
            Наш Науковий <br />
            <span className="text-purple-600 dark:text-purple-400">
              Медіа Блог
            </span>
            <span className="text-purple-600">.</span>
          </h1>

          <p className="text-sm md:text-base text-[var(--text-gray)] font-medium leading-relaxed max-w-2xl opacity-90 m-0">
            Простір інтерактивного обміну знаннями. Актуальні новини освіти,
            практичні поради для молодих дослідників, анонси масштабних подій та
            методологічні матеріали, верифіковані екосистемою{" "}
            <span className="text-purple-600 font-bold">Science Platform</span>.
          </p>

          <div className="pt-4 flex items-center gap-4 font-mono text-[9px] uppercase tracking-widest text-[var(--text-gray)]/40 select-none">
            <div className="flex items-center gap-1.5">
              <BookOpen size={11} className="text-purple-500" />
              <span>Verified Knowledge</span>
            </div>
            <span className="text-[var(--border-color)]">•</span>
            <div className="flex items-center gap-1">
              <Sparkles size={11} className="text-purple-500/70" />
              <span>Open Access Portal</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
