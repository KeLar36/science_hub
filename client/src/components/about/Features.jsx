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
    <section className="border-b border-[var(--border-color)] bg-[var(--bg-main)] relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[var(--border-color)]">
          {items.map((item, i) => (
            <div
              key={i}
              className="p-12 md:p-16 hover:bg-[var(--bg-card)]/50 transition-all group"
              data-aos="fade-up"
              data-aos-delay={i * 50}
            >
              <div className="text-[#6d28d9] dark:text-[#a78bfa] mb-8 transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-105">
                {item.icon}
              </div>
              <h3 className="text-lg font-black text-[var(--text-dark)] mb-4 uppercase tracking-tight italic">
                {item.title}
              </h3>
              <p className="text-xs md:text-sm text-[var(--text-gray)] leading-relaxed font-medium">
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
