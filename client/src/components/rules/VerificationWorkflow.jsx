import React from "react";
import { CheckCircle2, Clock, RotateCcw } from "lucide-react";

const VerificationWorkflow = () => {
  const steps = [
    {
      title: "На розгляді",
      subtitle: "Автоматичний скринінг",
      icon: <Clock size={16} className="text-purple-600" />,
      desc: "Первинна перевірка коду ЄДРПОУ, метаданих FAIR та запуск антиплагіату.",
      border: "border-purple-500/20 bg-purple-600/[0.02]",
    },
    {
      title: "Доопрацювання",
      subtitle: "Зворотний зв'язок",
      icon: <RotateCcw size={16} className="text-amber-500" />,
      desc: "Повернення контент-менеджером на виправлення оформлення чи уточнення джерел.",
      border: "border-amber-500/20 bg-amber-500/[0.02]",
    },
    {
      title: "Активовано",
      subtitle: "Публікація в хабі",
      icon: <CheckCircle2 size={16} className="text-emerald-500" />,
      desc: "Успішна верифікація. Матеріал внесено в глобальний реєстр Open Science.",
      border: "border-emerald-500/20 bg-emerald-500/[0.02]",
    },
  ];

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 md:p-8 text-left relative z-10">
      <h3 className="text-base font-black uppercase tracking-wider text-[var(--text-dark)] mb-8 flex items-center gap-2">
        <span className="w-1.5 h-1.5 bg-purple-600 rounded-xs rotate-45" />
        Життєвий цикл верифікації даних
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {steps.map((step, i) => (
          <div
            key={i}
            className={`p-5 border ${step.border} rounded-xl flex flex-col justify-between group hover:shadow-sm transition-all duration-300`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-[9px] font-black uppercase tracking-wider text-[var(--text-gray)]">
                  Етап 0{i + 1}
                </span>
                <div className="p-1.5 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-lg">
                  {step.icon}
                </div>
              </div>
              <h4 className="text-sm font-bold uppercase text-[var(--text-dark)] tracking-tight mb-1">
                {step.title}
              </h4>
              <p className="text-[10px] font-mono uppercase tracking-wider text-purple-600 dark:text-purple-400 font-bold mb-3">
                {step.subtitle}
              </p>
              <p className="text-xs text-[var(--text-gray)] font-medium leading-relaxed opacity-90">
                {step.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VerificationWorkflow;
