import React from "react";
import { Search, BookOpen, FileCheck, Share2 } from "lucide-react";

const Steps = () => {
  const steps = [
    {
      step: "01",
      icon: <Search size={20} />,
      title: "Аналіз",
      text: "Підбір видання",
    },
    {
      step: "02",
      icon: <BookOpen size={20} />,
      title: "Подача",
      text: "Хмарна обробка",
    },
    {
      step: "03",
      icon: <FileCheck size={20} />,
      title: "Огляд",
      text: "Експертна оцінка",
    },
    {
      step: "04",
      icon: <Share2 size={20} />,
      title: "Вплив",
      text: "Публікація",
    },
  ];

  return (
    <section className="py-24 px-4 md:px-6 bg-[var(--bg-card)]/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-3">
            <span className="label-mono text-xs font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400">
              Infrastructure
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-[var(--text-dark)] tracking-tight uppercase">
              Етапи роботи
            </h2>
          </div>
          <div className="h-px flex-grow bg-[var(--border-color)] mx-8 hidden md:block mb-4" />
          <p className="max-w-[240px] text-xs text-[var(--text-gray)] uppercase tracking-wider leading-relaxed font-medium opacity-90">
            Повний цикл: від первинної ідеї до отримання фінального сертифіката.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 bg-[var(--border-color)] border border-[var(--border-color)] rounded-2xl overflow-hidden gap-px">
          {steps.map((item, i) => (
            <div
              key={i}
              className="p-8 md:p-10 bg-[var(--bg-main)] group hover:bg-purple-600 transition-all duration-300 flex flex-col h-64 relative"
            >
              <span className="text-3xl font-extrabold text-purple-600/15 dark:text-purple-400/10 group-hover:text-white/20 transition-colors duration-300 mb-auto select-none">
                {item.step}
              </span>

              <div className="space-y-4 relative z-10">
                <div className="text-purple-600 dark:text-purple-400 group-hover:text-white transition-colors duration-300 inline-block transform group-hover:scale-105">
                  {item.icon}
                </div>

                <h4 className="text-base font-bold text-[var(--text-dark)] group-hover:text-white uppercase tracking-wide transition-colors duration-300">
                  {item.title}
                </h4>

                <p className="text-xs text-[var(--text-gray)] group-hover:text-purple-100/90 font-medium uppercase tracking-wider transition-colors duration-300">
                  {item.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Steps;
