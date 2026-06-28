import React from "react";
import { Award, Layers, Users, Sparkles } from "lucide-react";

export default function ArchiveHeader({ stats, loading }) {
  const totalStats = stats?.total ?? 0;
  const domainStats = stats?.domainsCount ?? 0;
  const authorStats = stats?.authors ?? 1;

  return (
    <div className="max-w-7xl mx-auto mb-12 px-4 md:px-6">
      <div className="relative overflow-hidden rounded-[32px] border border-[var(--border-color)] bg-gradient-to-br from-[var(--bg-card)] via-[var(--bg-card)]/90 to-purple-600/[0.02] p-8 md:p-16 lg:p-20 shadow-xs transition-all duration-300">
        <div className="absolute top-0 right-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/[0.06] blur-[140px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-40 -left-20 w-[400px] h-[400px] bg-purple-500/[0.03] blur-[100px] rounded-full pointer-events-none" />

        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-purple-600/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 backdrop-blur-xs animate-pulse">
            <Sparkles size={10} />
            <span>Відкрита Наука та Інновації</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight text-[var(--text-dark)] leading-[1.05]">
            Централізований <br />
            <span className="bg-clip-text text-transparent bg-purple-600 dark:bg-purple-400">
              Архів Наукових Робіт
            </span>
          </h1>

          <p className="text-sm md:text-base text-[var(--text-gray)] font-medium leading-relaxed max-w-2xl opacity-90">
            Глобальний репозиторій відкритого доступу (Open Access), що об'єднує
            валідовані наукові статті, рецензовані матеріали конференцій та
            результати фундаментальних досліджень екосистеми{" "}
            <span className="text-purple-600 font-bold">Science Platform</span>.
          </p>

          <div className="w-full max-w-md h-px bg-gradient-to-r from-transparent via-[var(--border-color)] to-transparent pt-4" />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-3xl pt-2">
            <div className="bg-[var(--bg-main)]/50 border border-[var(--border-color)] rounded-2xl p-5 flex flex-col items-center justify-center text-center transition-all duration-300 hover:border-purple-500/30 hover:bg-[var(--bg-main)] group/stat">
              <div className="w-10 h-10 rounded-xl bg-purple-600/5 flex items-center justify-center mb-3 transition-transform duration-300 group-hover/stat:scale-110">
                <Award
                  size={18}
                  className="text-purple-600 dark:text-purple-400"
                />
              </div>
              <div className="text-3xl font-black text-[var(--text-dark)] tracking-tight">
                {loading ? (
                  <div className="h-8 w-16 bg-[var(--border-color)] rounded-md animate-pulse mx-auto" />
                ) : (
                  totalStats
                )}
              </div>
              <div className="text-[9px] font-black text-[var(--text-gray)] uppercase tracking-widest mt-1 opacity-80">
                Публікацій
              </div>
            </div>

            <div className="bg-[var(--bg-main)]/50 border border-[var(--border-color)] rounded-2xl p-5 flex flex-col items-center justify-center text-center transition-all duration-300 hover:border-purple-500/30 hover:bg-[var(--bg-main)] group/stat">
              <div className="w-10 h-10 rounded-xl bg-purple-600/5 flex items-center justify-center mb-3 transition-transform duration-300 group-hover/stat:scale-110">
                <Layers
                  size={18}
                  className="text-purple-600 dark:text-purple-400"
                />
              </div>
              <div className="text-3xl font-black text-[var(--text-dark)] tracking-tight">
                {loading ? (
                  <div className="h-8 w-16 bg-[var(--border-color)] rounded-md animate-pulse mx-auto" />
                ) : (
                  domainStats
                )}
              </div>
              <div className="text-[9px] font-black text-[var(--text-gray)] uppercase tracking-widest mt-1 opacity-80">
                Напрямків
              </div>
            </div>

            <div className="bg-[var(--bg-main)]/50 border border-[var(--border-color)] rounded-2xl p-5 flex flex-col items-center justify-center text-center transition-all duration-300 hover:border-purple-500/30 hover:bg-[var(--bg-main)] group/stat">
              <div className="w-10 h-10 rounded-xl bg-purple-600/5 flex items-center justify-center mb-3 transition-transform duration-300 group-hover/stat:scale-110">
                <Users
                  size={18}
                  className="text-purple-600 dark:text-purple-400"
                />
              </div>
              <div className="text-3xl font-black text-[var(--text-dark)] tracking-tight">
                {loading ? (
                  <div className="h-8 w-16 bg-[var(--border-color)] rounded-md animate-pulse mx-auto" />
                ) : (
                  authorStats
                )}
              </div>
              <div className="text-[9px] font-black text-[var(--text-gray)] uppercase tracking-widest mt-1 opacity-80">
                Дослідників
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
