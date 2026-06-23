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
    <header className="relative pt-44 pb-24 px-4 md:px-8 border-b border-[var(--border-color)] overflow-hidden bg-gradient-to-b from-purple-600/[0.01] to-transparent">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-purple-600/[0.03] blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-8 space-y-8">
            <div className="inline-flex items-center gap-3 px-3 py-1.5 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl backdrop-blur-sm shadow-sm">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-purple-600"></span>
              </span>
              <span className="label-mono font-bold text-[var(--text-gray)]">
                SciencePlatform / Mission 2026
              </span>
            </div>

            <div className="space-y-6">
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-[var(--text-dark)] leading-[1.05] uppercase">
                Майбутнє <br />
                <span className="text-purple-600">науки</span> у цифрі.
              </h1>

              <div className="flex gap-4 items-stretch">
                <div className="w-0.5 bg-gradient-to-b from-purple-600 to-transparent hidden md:block"></div>
                <p className="max-w-xl text-base md:text-lg text-[var(--text-gray)] font-normal leading-relaxed opacity-95">
                  Ми створюємо інтелектуальний простір, де наукові відкриття
                  трансформуються у цифрові активи. Автоматизація, прозорість та
                  глобальний доступ — наші фундаментальні принципи.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-8 items-center pt-2">
              <button
                onClick={() => onNavigate(isAuth ? "/profile" : "/register")}
                className="group relative flex items-center gap-4 bg-purple-600 text-white px-8 py-4 text-xs font-bold uppercase tracking-wider transition-all duration-300 rounded-xl shadow-md shadow-purple-600/10 hover:bg-[var(--text-dark)] hover:shadow-lg"
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
                      className="w-9 h-9 rounded-xl border-2 border-[var(--bg-main)] bg-[var(--bg-card)] flex items-center justify-center overflow-hidden shadow-sm transition-transform duration-300 hover:-translate-y-0.5"
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
            <div className="relative p-6">
              <div className="absolute top-0 right-0 w-20 h-20 border-t border-r border-[var(--border-color)] rounded-tr-2xl"></div>
              <div className="absolute bottom-0 left-0 w-20 h-20 border-b border-l border-[var(--border-color)] rounded-bl-2xl"></div>

              <div className="aspect-square bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl backdrop-blur-sm relative z-10 flex items-center justify-center group shadow-sm transition-all duration-500 hover:border-purple-500/20">
                <div className="absolute inset-0 bg-purple-600/0 group-hover:bg-purple-600/[0.02] transition-colors duration-500 rounded-2xl"></div>

                <FlaskConical
                  size={90}
                  className="text-purple-600 dark:text-purple-400 transition-all duration-700 ease-out group-hover:scale-102 group-hover:rotate-2 opacity-95"
                />

                <div className="absolute top-8 right-8 p-2.5 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl animate-bounce shadow-sm">
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
    </header>
  );
};

export default HeroSection;
