import React from "react";
import { Award, Layers, Users } from "lucide-react";

export default function ArchiveHeader({ stats, loading }) {
  return (
    <div className="max-w-7xl mx-auto mb-16" data-aos="fade-down">
      <div className="relative overflow-hidden rounded-[2.5rem] border border-[var(--border-color)] bg-[var(--bg-card)] p-8 md:p-16 lg:p-20 shadow-xl transition-all duration-300">
        <div className="absolute top-0 right-0 -mt-24 -mr-24 w-[600px] h-[600px] bg-purple-600/10 blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/5 blur-[100px] rounded-full pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10 items-center">
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest bg-purple-600/10 text-purple-600 border border-purple-600/20">
              ⚡️ Відкрита Наука та Інновації
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight text-[var(--text-dark)] leading-[0.95]">
              Архів <br />
              <span className="bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
                Затверджених Робіт
              </span>
            </h1>
            <p className="text-base text-[var(--text-gray)] font-medium leading-relaxed max-w-xl">
              Глобальний централізований репозиторій наукових публікацій,
              фундаментальних досліджень та стартап-проєктів, які пройшли суворе
              рецензування нашою експертною радою.
            </p>
          </div>

          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4 w-full">
            <div className="bg-[var(--bg-main)] border border-[var(--border-color)] rounded-2xl p-5 flex items-center gap-5 transition-all duration-300 hover:border-purple-600/40 group/stat shadow-xs">
              <div className="w-14 h-14 rounded-2xl bg-purple-600/10 flex items-center justify-center transition-transform group-hover/stat:scale-105 flex-shrink-0">
                <Award size={24} className="text-purple-600" />
              </div>
              <div>
                <div className="text-3xl font-black text-[var(--text-dark)] tracking-tight">
                  {loading ? "..." : stats.total}
                </div>
                <div className="text-[10px] font-bold text-[var(--text-gray)] uppercase tracking-widest mt-0.5">
                  Валідованих Публікацій
                </div>
              </div>
            </div>

            <div className="bg-[var(--bg-main)] border border-[var(--border-color)] rounded-2xl p-5 flex items-center gap-5 transition-all duration-300 hover:border-purple-600/40 group/stat shadow-xs">
              <div className="w-14 h-14 rounded-2xl bg-purple-600/10 flex items-center justify-center transition-transform group-hover/stat:scale-105 flex-shrink-0">
                <Layers size={24} className="text-purple-600" />
              </div>
              <div>
                <div className="text-3xl font-black text-[var(--text-dark)] tracking-tight">
                  {loading ? "..." : stats.domains}
                </div>
                <div className="text-[10px] font-bold text-[var(--text-gray)] uppercase tracking-widest mt-0.5">
                  Наукових Напрямків
                </div>
              </div>
            </div>

            <div className="bg-[var(--bg-main)] border border-[var(--border-color)] rounded-2xl p-5 flex items-center gap-5 transition-all duration-300 hover:border-purple-600/40 group/stat shadow-xs">
              <div className="w-14 h-14 rounded-2xl bg-purple-600/10 flex items-center justify-center transition-transform group-hover/stat:scale-105 flex-shrink-0">
                <Users size={24} className="text-purple-600" />
              </div>
              <div>
                <div className="text-3xl font-black text-[var(--text-dark)] tracking-tight">
                  {loading ? "..." : stats.authors}
                </div>
                <div className="text-[10px] font-bold text-[var(--text-gray)] uppercase tracking-widest mt-0.5">
                  Активних Дослідників
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
