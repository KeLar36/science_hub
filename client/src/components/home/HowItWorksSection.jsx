import React from "react";
import { UserPlus, Search, FileText, Award } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    step: "01",
    title: "Створення профілю",
    desc: "Реєструйтеся як індивідуальний дослідник або представник ЗВО/НДІ за лічені хвилини.",
  },
  {
    icon: Search,
    step: "02",
    title: "Розумний пошук",
    desc: "Фільтруйте сотні грантів за галузями знань, типами фінансування та дедлайнами.",
  },
  {
    icon: FileText,
    step: "03",
    title: "Подача та рецензування",
    desc: "Завантажуйте свої проєкти на платформу та отримуйте прозорий фідбек від експертів.",
  },
  {
    icon: Award,
    step: "04",
    title: "Отримання гранту",
    desc: "Проходьте верифікацію, підписуйте документи та капіталізуйте свої наукові розробки.",
  },
];

const HowItWorksSection = () => {
  return (
    <section className="py-20 bg-purple-600/[0.02] border-y border-[var(--border-color)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        <div className="max-w-2xl mb-12">
          <span className="text-xs font-black uppercase tracking-widest text-purple-600 bg-purple-600/10 px-3 py-1 rounded-full">
            Дорожня карта
          </span>
          <h2 className="text-3xl font-black uppercase tracking-tight text-[var(--text-dark)] mt-3">
            Чотири кроки до{" "}
            <span className="text-purple-600">фінансування</span>
          </h2>
          <p className="text-xs text-[var(--text-gray)] font-semibold mt-2">
            Ми максимально спростили шлях між науковою ідеєю та її реальним
            бюджетом.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="relative bg-[var(--bg-card)] border border-[var(--border-color)] p-6 rounded-[24px] shadow-xs hover:border-purple-500/40 transition-all duration-300 group overflow-hidden"
              >
                <div className="absolute top-4 right-4 text-4xl font-black text-purple-600/10 group-hover:text-purple-600/20 transition-colors font-mono">
                  {item.step}
                </div>
                <div className="p-3 bg-purple-600/5 text-purple-600 rounded-xl w-fit">
                  <Icon size={20} />
                </div>
                <h3 className="text-sm font-black text-[var(--text-dark)] uppercase tracking-wide mt-6">
                  {item.title}
                </h3>
                <p className="text-[11px] font-semibold text-[var(--text-gray)] mt-2 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
