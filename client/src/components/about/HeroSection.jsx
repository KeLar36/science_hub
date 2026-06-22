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
    <header className="relative pt-44 pb-24 px-6 border-b border-[var(--border-color)]">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-8 space-y-8" data-aos="fade-right">
            <div className="inline-flex items-center gap-3 px-3 py-1.5 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-full backdrop-blur-sm">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#6d28d9]"></span>
              </span>
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[var(--text-dark)]">
                SciencePlatform / Mission 2026
              </span>
            </div>

            <div className="space-y-6">
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-[var(--text-dark)] leading-[0.95]">
                Майбутнє <br />
                <span className="text-[#6d28d9] dark:text-[#a78bfa] italic font-light">
                  науки
                </span>{" "}
                у цифрі.
              </h1>

              <div className="flex gap-6 items-stretch">
                <div className="w-0.5 bg-gradient-to-b from-[#6d28d9] to-transparent hidden md:block"></div>
                <p className="max-w-xl text-lg text-[var(--text-gray)] font-normal leading-relaxed">
                  Ми створюємо інтелектуальний простір, де наукові відкриття
                  трансформуються у цифрові активи. Автоматизація, прозорість та
                  глобальний доступ — наші фундаментальні принципи.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-6 items-center pt-4">
              <button
                onClick={() => onNavigate(isAuth ? "/profile" : "/register")}
                className="group relative flex items-center gap-5 bg-[#6d28d9] text-white px-8 py-4 text-[10px] font-black uppercase tracking-widest transition-all duration-300 rounded-xl shadow-lg shadow-purple-500/15 hover:bg-[var(--text-dark)] hover:text-[#a78bfa]"
              >
                <span className="relative z-10">Почати шлях</span>
                <ArrowUpRight
                  size={14}
                  className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                />
              </button>

              <div className="flex -space-x-2.5">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-9 h-9 rounded-xl border-2 border-[var(--bg-main)] bg-[var(--bg-card)] flex items-center justify-center overflow-hidden shadow-sm"
                  >
                    <div className="w-full h-full bg-purple-500/10 flex items-center justify-center">
                      <Users2
                        size={13}
                        className="text-[#6d28d9] dark:text-[#a78bfa]"
                      />
                    </div>
                  </div>
                ))}
                <div className="pl-4 flex flex-col justify-center">
                  <span className="text-[10px] font-black text-[var(--text-dark)] uppercase tracking-tight">
                    3000+ Дослідників
                  </span>
                  <span className="text-[9px] text-[#6d28d9] dark:text-[#a78bfa] font-bold uppercase tracking-wider">
                    вже з нами
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 hidden lg:block" data-aos="fade-left">
            <div className="relative p-8">
              <div className="absolute top-0 right-0 w-24 h-24 border-t border-r border-[var(--border-color)] rounded-tr-3xl"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 border-b border-l border-[var(--border-color)] rounded-bl-3xl"></div>

              <div className="aspect-square bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl backdrop-blur-sm relative z-10 flex items-center justify-center group shadow-sm">
                <div className="absolute inset-0 bg-purple-500/0 group-hover:bg-purple-500/5 transition-colors duration-500 rounded-2xl"></div>
                <FlaskConical
                  size={100}
                  className="text-[#6d28d9] dark:text-[#a78bfa] transition-transform duration-700 group-hover:scale-105 group-hover:rotate-3"
                />

                <div className="absolute top-8 right-8 p-2.5 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl animate-bounce shadow-sm">
                  <Zap size={14} className="text-[#6d28d9]" />
                </div>
                <div className="absolute bottom-8 -left-5 p-3.5 bg-[#6d28d9] text-white rounded-xl shadow-xl">
                  <Sparkles size={16} />
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
