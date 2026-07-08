import React from "react";
import { Mail } from "lucide-react";
import { Button } from "../ui/Button";

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
            className="flex-grow bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl px-4 py-3.5 text-sm font-medium outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20 transition-all text-[var(--text-dark)] placeholder:text-[var(--text-gray)]/40"
          />
          <Button
            size="lg"
            className="font-bold tracking-wider uppercase shrink-0 shadow-md shadow-purple-600/15"
          >
            Підписатись
          </Button>
        </div>
      </div>
    </section>
  );
};

export default DigestSection;
