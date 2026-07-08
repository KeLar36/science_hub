import React from "react";
import { Search, ShieldCheck, FileText } from "lucide-react";
import { BentoCard } from "../ui/BentoCard";

const FeaturesSection = () => {
  const features = [
    {
      icon: <Search className="text-purple-600" size={20} />,
      title: "Швидкий розумний пошук",
      desc: "Знаходьте потрібні журнали чи стипендії за лічені секунди завдяки гнучкій системі тегів та миттєвій фільтрації.",
    },
    {
      icon: <ShieldCheck className="text-purple-600" size={20} />,
      title: "Перевірені джерела",
      desc: "Ми збираємо та валідуємо інформацію лише з офіційних баз даних, університетських порталів та фондений фінансування.",
    },
    {
      icon: <FileText className="text-purple-600" size={20} />,
      title: "Зручна аналітика",
      desc: "Переглядайте ключові вимоги, дедлайни подачі та організаційні внески без необхідності вивчати десятки сторонніх сайтів.",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 py-20 border-b border-[var(--border-color)]/30">
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-2">
        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-[var(--text-dark)]">
          Чому саме{" "}
          <span className="text-purple-600 dark:text-purple-400">
            Open Science Platform
          </span>
          ?
        </h2>
        <p className="text-xs text-[var(--text-gray)] font-mono uppercase tracking-wider">
          Інструменти, створені спеціально для української наукової спільноти
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((f, index) => (
          <BentoCard key={index} title={f.title}>
            <div className="flex flex-col gap-4">
              <div className="w-10 h-10 bg-purple-600/10 rounded-xl flex items-center justify-center">
                {f.icon}
              </div>
              <p className="text-xs text-[var(--text-gray)] leading-relaxed font-medium">
                {f.desc}
              </p>
            </div>
          </BentoCard>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;
