import React from "react";
import { Mail } from "lucide-react";

const DigestSection = () => {
  return (
    <section className="bg-[var(--bg-card)] border-t border-[var(--border-color)] py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div className="space-y-2 max-w-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-600/10 text-purple-600 rounded-xl flex items-center justify-center shadow-md shadow-purple-600/5">
              <Mail size={16} />
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[var(--text-dark)] tracking-tight uppercase leading-tight">
              Науковий <br />
              <span className="text-purple-600 dark:text-purple-400">
                Дайджест
              </span>
            </h2>
          </div>
          <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-gray)] font-medium pl-1">
            Будьте в курсі нових Open Science можливостей.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 items-stretch w-full md:max-w-md">
          <input
            type="email"
            placeholder="Електронна пошта"
            className="flex-grow bg-transparent border-b border-[var(--border-color)] px-2 py-3 text-sm font-medium outline-none focus:border-purple-600 dark:focus:border-purple-400 transition-all text-[var(--text-dark)] placeholder:text-[var(--text-gray)]/40"
          />
          <button className="bg-purple-600 text-white px-8 py-3.5 text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-purple-700 transition-all active:scale-98 shrink-0 shadow-md shadow-purple-600/15">
            Підписатись
          </button>
        </div>
      </div>
    </section>
  );
};

export default DigestSection;
