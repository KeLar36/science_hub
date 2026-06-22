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
    <section className="py-24 px-6 bg-[var(--bg-card)]/20 relative">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="space-y-3">
            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-[#6d28d9] dark:text-[#a78bfa]">
              Infrastructure
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-[var(--text-dark)] tracking-tighter uppercase">
              Етапи роботи
            </h2>
          </div>
          <div className="h-px flex-grow bg-[var(--border-color)] mx-8 hidden md:block mb-4" />
          <p className="max-w-[200px] text-[9px] text-[var(--text-gray)] uppercase tracking-widest leading-relaxed font-bold">
            Повний цикл: від ідеї до отримання сертифіката.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 border border-[var(--border-color)] bg-[var(--bg-main)] rounded-2xl overflow-hidden divide-y sm:divide-y-0 sm:grid-inside-border">
          {steps.map((item, i) => (
            <div
              key={i}
              className="p-8 md:p-10 border-r last:border-r-0 border-[var(--border-color)] group hover:bg-[#6d28d9] transition-all duration-500 flex flex-col h-64"
              data-aos="fade-up"
              data-aos-delay={i * 50}
            >
              <span className="text-2xl font-black text-purple-500/30 group-hover:text-white/20 transition-colors mb-auto">
                {item.step}
              </span>
              <div className="space-y-3">
                <div className="text-[#6d28d9] dark:text-[#a78bfa] group-hover:text-white transition-colors transform group-hover:scale-105 duration-500">
                  {item.icon}
                </div>
                <h4 className="text-sm font-black text-[var(--text-dark)] group-hover:text-white uppercase tracking-wider">
                  {item.title}
                </h4>
                <p className="text-[10px] text-[var(--text-gray)] group-hover:text-white/80 font-bold uppercase tracking-[0.15em]">
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
