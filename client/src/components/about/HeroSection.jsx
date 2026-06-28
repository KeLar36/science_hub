import React from "react";
import {
  ArrowUpRight,
  FlaskConical,
  Users2,
  Zap,
  Sparkles,
} from "lucide-react";

const HeroSection = ({ isAuth, onNavigate }) => {
  return (
    <header className="relative pt-36 pb-16 px-4 md:px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="relative overflow-hidden rounded-[32px] border border-[var(--border-color)] bg-gradient-to-br from-[var(--bg-card)] via-[var(--bg-card)]/90 to-purple-600/[0.02] p-8 md:p-14 lg:p-16 shadow-xs transition-all duration-300">
          <div className="absolute top-0 right-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/[0.06] blur-[140px] rounded-full pointer-events-none" />
          <div className="absolute -bottom-40 -left-20 w-[400px] h-[400px] bg-purple-500/[0.03] blur-[100px] rounded-full pointer-events-none" />

          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10">
            <div className="lg:col-span-8 space-y-8 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-purple-500/20 bg-purple-600/10 text-purple-600 dark:text-purple-400">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-purple-600"></span>
                </span>
                <span className="font-mono text-[10px] font-black uppercase tracking-widest">
                  SciencePlatform / Mission 2026
                </span>
              </div>

              <div className="space-y-6">
                <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight text-[var(--text-dark)] leading-[1.05] uppercase">
                  Майбутнє <br />
                  <span className="bg-clip-text text-transparent bg-purple-600 dark:bg-purple-400">
                    науки
                  </span>{" "}
                  у цифрі.
                </h1>

                <div className="flex gap-4 items-stretch">
                  <div className="w-0.5 bg-gradient-to-b from-purple-600 to-transparent hidden md:block"></div>
                  <p className="max-w-xl text-sm md:text-base text-[var(--text-gray)] font-medium leading-relaxed opacity-95">
                    Ми створюємо інтелектуальний простір, де наукові відкриття
                    трансформуються у цифрові активи. Автоматизація, прозорість
                    та глобальний доступ — наші фундаментальні принципи.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-8 items-center pt-2">
                <button
                  onClick={() => onNavigate(isAuth ? "/profile" : "/register")}
                  className="group relative flex items-center gap-4 bg-purple-600 text-white px-8 py-4 text-xs font-bold uppercase tracking-wider transition-all duration-300 rounded-xl shadow-md shadow-purple-600/10 hover:bg-purple-700 hover:shadow-lg hover:shadow-purple-600/25 active:scale-[0.98]"
                >
                  <span className="relative z-10">Почати шлях</span>
                  <ArrowUpRight
                    size={14}
                    className="transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                  />
                </button>

                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="w-9 h-9 rounded-xl border-2 border-[var(--bg-card)] bg-[var(--bg-main)] flex items-center justify-center overflow-hidden shadow-sm transition-transform duration-300 hover:-translate-y-0.5"
                      >
                        <div className="w-full h-full bg-purple-600/5 flex items-center justify-center">
                          <Users2
                            size={13}
                            className="text-purple-600 dark:text-purple-400"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col justify-center">
                    <span className="text-[11px] font-bold text-[var(--text-dark)] uppercase tracking-wide">
                      3000+ Дослідників
                    </span>
                    <span className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold uppercase tracking-wider">
                      вже з нами
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 hidden lg:block">
              <div className="relative p-6 max-w-[320px] mx-auto">
                <div className="absolute top-0 right-0 w-20 h-20 border-t border-r border-[var(--border-color)] rounded-tr-2xl"></div>
                <div className="absolute bottom-0 left-0 w-20 h-20 border-b border-l border-[var(--border-color)] rounded-bl-2xl"></div>

                <div className="aspect-square bg-[var(--bg-main)]/50 border border-[var(--border-color)] rounded-2xl backdrop-blur-sm relative z-10 flex items-center justify-center group shadow-sm transition-all duration-500 hover:border-purple-500/30">
                  <div className="absolute inset-0 bg-purple-600/0 group-hover:bg-purple-600/[0.02] transition-colors duration-500 rounded-2xl"></div>

                  <FlaskConical
                    size={90}
                    className="text-purple-600 dark:text-purple-400 transition-all duration-700 ease-out group-hover:scale-102 group-hover:rotate-2 opacity-95"
                  />

                  <div className="absolute top-8 right-8 p-2.5 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl animate-bounce shadow-sm">
                    <Zap size={13} className="text-purple-600" />
                  </div>
                  <div className="absolute bottom-8 -left-4 p-3.5 bg-purple-600 text-white rounded-xl shadow-lg shadow-purple-600/15">
                    <Sparkles size={14} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeroSection;
