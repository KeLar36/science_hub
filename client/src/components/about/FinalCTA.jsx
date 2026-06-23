import React from "react";
import { ArrowUpRight } from "lucide-react";

const FinalCTA = ({ isAuth = false, onNavigate }) => {
  return (
    <section className="py-36 px-4 md:px-6 relative overflow-hidden bg-gradient-to-t from-purple-600/[0.01] to-transparent">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-purple-600/[0.04] blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center relative z-10 space-y-8">
        <div className="space-y-3">
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400">
            Готові розпочати?
          </span>
          <h2 className="text-4xl md:text-6xl font-extrabold text-[var(--text-dark)] tracking-tight uppercase leading-tight">
            Час відкрити <br />
            <span className="text-purple-600 dark:text-purple-400">
              свій потенціал
            </span>
          </h2>
        </div>

        <p className="max-w-md mx-auto text-sm text-[var(--text-gray)] font-normal leading-relaxed opacity-90">
          Приєднуйтесь до глобальної спільноти вчених, які вже змінюють цифровий
          ландшафт науки та публікують свої праці у відкритому доступі.
        </p>

        <button
          onClick={() => {
            console.log("Поточний стан auth в CTA:", isAuth);
            if (typeof onNavigate === "function") {
              onNavigate(isAuth ? "/profile" : "/register");
            }
          }}
          className="group relative inline-flex items-center gap-4 bg-transparent border-2 border-purple-600 dark:border-purple-500/50 text-[var(--text-dark)] px-10 py-4 text-xs font-bold uppercase tracking-wider rounded-xl overflow-hidden transition-all duration-300 hover:text-white hover:border-purple-600 hover:shadow-xl hover:shadow-purple-600/10"
        >
          <div className="absolute inset-0 bg-purple-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-0" />

          <span className="relative z-10 flex items-center gap-2.5">
            {isAuth ? "Мій Кабінет" : "Створити профіль"}
            <ArrowUpRight
              size={15}
              className="transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
            />
          </span>
        </button>
      </div>
    </section>
  );
};

export default FinalCTA;
