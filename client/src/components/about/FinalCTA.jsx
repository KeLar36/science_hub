import React from "react";
import { ArrowUpRight } from "lucide-react";

const FinalCTA = ({ isAuth, onNavigate }) => {
  return (
    <section className="py-36 px-6 relative">
      <div
        className="max-w-4xl mx-auto text-center relative z-10 space-y-10"
        data-aos="fade-up"
      >
        <div className="space-y-4">
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#6d28d9] dark:text-[#a78bfa]">
            Ви готові?
          </span>
          <h2 className="text-5xl md:text-7xl font-black text-[var(--text-dark)] tracking-tighter uppercase leading-none">
            Час відкрити <br />
            <span className="italic font-light text-[#6d28d9] dark:text-[#a78bfa]">
              свій потенціал.
            </span>
          </h2>
        </div>

        <p className="max-w-md mx-auto text-xs text-[var(--text-gray)] font-bold leading-relaxed uppercase tracking-[0.1em]">
          Приєднуйтесь до глобальної спільноти вчених, які вже змінюють цифровий
          ландшафт науки.
        </p>

        <button
          onClick={() => onNavigate(isAuth ? "/profile" : "/register")}
          className="group relative inline-flex items-center gap-6 bg-transparent border-2 border-[#6d28d9] text-[var(--text-dark)] px-12 py-5 text-[11px] font-black uppercase tracking-[0.3em] rounded-xl overflow-hidden transition-all duration-300 hover:text-white hover:shadow-lg hover:shadow-purple-500/10"
        >
          <div className="absolute inset-0 bg-[#6d28d9] translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-0" />
          <span className="relative z-10 flex items-center gap-3">
            {isAuth ? "Мій Кабінет" : "Створити профіль"}
            <ArrowUpRight
              size={16}
              className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
            />
          </span>
        </button>
      </div>
    </section>
  );
};

export default FinalCTA;
