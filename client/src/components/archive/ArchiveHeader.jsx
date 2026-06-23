import React from "react";
import { Award, Layers, Users } from "lucide-react";

export default function ArchiveHeader({ stats, loading }) {
  const totalStats = stats?.total ?? 0;
  const domainStats = stats?.domains ?? 0;
  const authorStats = stats?.authors ?? 0;

  return (
    <div className="max-w-7xl mx-auto mb-16 px-4 md:px-6">
      <div className="relative overflow-hidden rounded-3xl border border-[var(--border-color)] bg-gradient-to-b from-[var(--bg-card)] to-[var(--bg-card)]/50 p-8 md:p-12 lg:p-16 shadow-sm transition-all duration-300">
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[500px] h-[500px] bg-purple-600/[0.04] blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-purple-500/[0.02] blur-[100px] rounded-full pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10 items-center">
          <div className="lg:col-span-7 space-y-5 text-left animate-[fadeIn_0.5s_ease-out_forwards]">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-purple-600/5 text-purple-600 dark:text-purple-400 border border-purple-500/10">
              ⚡️ Відкрита Наука та Інновації
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold uppercase tracking-tight text-[var(--text-dark)] leading-tight">
              Архів <br />
              <span className="text-purple-600 dark:text-purple-400">
                Затверджених Робіт
              </span>
            </h1>

            <p className="text-sm md:text-base text-[var(--text-gray)] font-normal leading-relaxed max-w-xl opacity-90">
              Глобальний централізований репозиторій наукових публікацій,
              фундаментальних досліджень та стартап-проєктів, які пройшли суворе
              рецензування нашою експертною радою.
            </p>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-4 w-full animate-[fadeIn_0.7s_ease-out_forwards]">
            <div className="bg-[var(--bg-main)]/60 border border-[var(--border-color)] rounded-xl p-4 flex items-center gap-4 transition-all duration-300 hover:border-purple-500/30 group/stat">
              <div className="w-12 h-12 rounded-xl bg-purple-600/5 flex items-center justify-center transition-transform duration-300 group-hover/stat:scale-105 shrink-0">
                <Award
                  size={20}
                  className="text-purple-600 dark:text-purple-400"
                />
              </div>
              <div>
                <div className="text-2xl font-bold text-[var(--text-dark)] tracking-tight">
                  {loading ? (
                    <div className="h-7 w-12 bg-[var(--border-color)] rounded-md animate-pulse" />
                  ) : (
                    totalStats
                  )}
                </div>
                <div className="text-[10px] font-semibold text-[var(--text-gray)] uppercase tracking-wide mt-0.5 opacity-80">
                  Валідованих Публікацій
                </div>
              </div>
            </div>

            <div className="bg-[var(--bg-main)]/60 border border-[var(--border-color)] rounded-xl p-4 flex items-center gap-4 transition-all duration-300 hover:border-purple-500/30 group/stat">
              <div className="w-12 h-12 rounded-xl bg-purple-600/5 flex items-center justify-center transition-transform duration-300 group-hover/stat:scale-105 shrink-0">
                <Layers
                  size={20}
                  className="text-purple-600 dark:text-purple-400"
                />
              </div>
              <div>
                <div className="text-2xl font-bold text-[var(--text-dark)] tracking-tight">
                  {loading ? (
                    <div className="h-7 w-12 bg-[var(--border-color)] rounded-md animate-pulse" />
                  ) : (
                    domainStats
                  )}
                </div>
                <div className="text-[10px] font-semibold text-[var(--text-gray)] uppercase tracking-wide mt-0.5 opacity-80">
                  Наукових Напрямків
                </div>
              </div>
            </div>

            <div className="bg-[var(--bg-main)]/60 border border-[var(--border-color)] rounded-xl p-4 flex items-center gap-4 transition-all duration-300 hover:border-purple-500/30 group/stat">
              <div className="w-12 h-12 rounded-xl bg-purple-600/5 flex items-center justify-center transition-transform duration-300 group-hover/stat:scale-105 shrink-0">
                <Users
                  size={20}
                  className="text-purple-600 dark:text-purple-400"
                />
              </div>
              <div>
                <div className="text-2xl font-bold text-[var(--text-dark)] tracking-tight">
                  {loading ? (
                    <div className="h-7 w-12 bg-[var(--border-color)] rounded-md animate-pulse" />
                  ) : (
                    authorStats
                  )}
                </div>
                <div className="text-[10px] font-semibold text-[var(--text-gray)] uppercase tracking-wide mt-0.5 opacity-80">
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
