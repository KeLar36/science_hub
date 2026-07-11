import React from "react";
import { HelpCircle, AlertCircle } from "lucide-react";

const RulesFaq = () => {
  return (
    <div className="grid md:grid-cols-2 gap-6 text-left relative z-10">
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 border-l-4 border-l-purple-600 hover:border-purple-500/20 transition-all">
        <div className="flex items-center gap-2 mb-3 text-purple-600 dark:text-purple-400">
          <HelpCircle size={15} />
          <span className="font-mono text-[9px] font-black uppercase tracking-wider">
            FAQ: Регламент розгляду
          </span>
        </div>
        <p className="text-xs text-[var(--text-gray)] leading-relaxed font-medium">
          Рецензування та технічна перевірка тривають до 72 годин з моменту
          подачі. Статус обробки автоматично оновлюється в реальному часі у
          вашому кабінеті.
        </p>
      </div>

      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 border-l-4 border-l-purple-600 hover:border-purple-500/20 transition-all">
        <div className="flex items-center gap-2 mb-3 text-purple-600 dark:text-purple-400">
          <AlertCircle size={15} />
          <span className="font-mono text-[9px] font-black uppercase tracking-wider">
            FAQ: Протокол апеляцій
          </span>
        </div>
        <p className="text-xs text-[var(--text-gray)] leading-relaxed font-medium">
          У разі відмови, детальний лог з помилками надсилається на пошту
          установи. Автор має право подати апеляцію суперадміну протягом 48
          годин.
        </p>
      </div>
    </div>
  );
};

export default RulesFaq;
