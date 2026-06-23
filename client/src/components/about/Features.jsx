import React from "react";
import { Globe, ShieldCheck, Scale } from "lucide-react";

const Features = () => {
  const items = [
    {
      icon: <Globe size={22} />,
      title: "Глобальна видимість",
      desc: "Інтеграція з міжнародними базами Scopus та Web of Science для миттєвої індексації праць.",
    },
    {
      icon: <ShieldCheck size={22} />,
      title: "Академічна етика",
      desc: "Суворі алгоритми перевірки на плагіат та Double-blind рецензування кожної поданої роботи.",
    },
    {
      icon: <Scale size={22} />,
      title: "Відкритий доступ",
      desc: "Ми підтримуємо Open Access, забезпечуючи вільний та безперешкодний обмін знаннями.",
    },
  ];

  return (
    <section className="border-b border-[var(--border-color)] bg-[var(--bg-main)] relative z-10 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[var(--border-color)]">
          {items.map((item, i) => (
            <div
              key={i}
              className="p-12 md:p-16 bg-transparent hover:bg-[var(--bg-card)]/40 transition-all duration-300 group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/[0.01] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <div className="text-purple-600 dark:text-purple-400 mb-6 transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-105 inline-block">
                {item.icon}
              </div>

              <h3 className="text-lg font-bold text-[var(--text-dark)] mb-3 uppercase tracking-wider">
                {item.title}
              </h3>

              <p className="text-sm text-[var(--text-gray)] leading-relaxed font-normal opacity-90">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
