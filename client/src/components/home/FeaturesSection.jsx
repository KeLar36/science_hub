import React from "react";
import {
  Search,
  ShieldCheck,
  Building2,
  UserPlus,
  FileCheck,
  Landmark,
} from "lucide-react";
import { BentoCard } from "../ui/BentoCard";

const FeaturesSection = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 py-20 border-b border-[var(--border-color)]/30">
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-2">
        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-[var(--text-dark)]">
          Можливості{" "}
          <span className="text-purple-600 dark:text-purple-400">
            Open Science Platform
          </span>
        </h2>
        <p className="text-xs text-[var(--text-gray)] font-mono uppercase tracking-wider">
          Екосистема взаємодії між науковцями, університетами та грантодавцями
        </p>
      </div>

      <div className="flex flex-wrap gap-6 text-left justify-center">
        <div className="w-full md:w-[calc(33.333%-16px)] flex">
          <BentoCard title="Агрегатор грантів та програм">
            <div className="flex flex-col gap-4">
              <div className="w-10 h-10 bg-purple-600/10 rounded-xl flex items-center justify-center">
                <Search className="text-purple-600" size={20} />
              </div>
              <p className="text-xs text-[var(--text-gray)] leading-relaxed font-medium">
                Шукайте актуальні міжнародні стипендії, наукові гранти та фахові
                видання в єдиній базі з миттєвою фільтрацією за галузями знань.
              </p>
            </div>
          </BentoCard>
        </div>

        <div className="w-full md:w-[calc(33.333%-16px)] flex">
          <BentoCard title="Цифровізація установ (ЗВО та НДІ)">
            <div className="flex flex-col gap-4">
              <div className="w-10 h-10 bg-purple-600/10 rounded-xl flex items-center justify-center">
                <Building2 className="text-purple-600" size={20} />
              </div>
              <p className="text-xs text-[var(--text-gray)] leading-relaxed font-medium">
                Зареєструйте свій університет чи інститут за ЄДРПОУ. Керуйте
                сторінкою установи, додавайте гранти та збирайте реєстр
                дослідників.
              </p>
            </div>
          </BentoCard>
        </div>

        <div className="w-full md:w-[calc(33.333%-16px)] flex">
          <BentoCard title="Профілі науковців та зв'язок з ЗВО">
            <div className="flex flex-col gap-4">
              <div className="w-10 h-10 bg-purple-600/10 rounded-xl flex items-center justify-center">
                <UserPlus className="text-purple-600" size={20} />
              </div>
              <p className="text-xs text-[var(--text-gray)] leading-relaxed font-medium">
                Створюйте персональний профіль, знаходьте свою установу в
                переліку та подавайте електронну заявку на офіційне приєднання
                до штату.
              </p>
            </div>
          </BentoCard>
        </div>

        <div className="w-full md:w-[calc(33.333%-16px)] flex">
          <BentoCard title="Двостороння верифікація">
            <div className="flex flex-col gap-4">
              <div className="w-10 h-10 bg-purple-600/10 rounded-xl flex items-center justify-center">
                <ShieldCheck className="text-purple-600" size={20} />
              </div>
              <p className="text-xs text-[var(--text-gray)] leading-relaxed font-medium">
                Безпека понад усе. Усі організації проходять перевірку
                суперадміном, а науковці верифікуються модераторами своїх
                університетів.
              </p>
            </div>
          </BentoCard>
        </div>

        <div className="w-full md:w-[calc(33.333%-16px)] flex">
          <BentoCard title="Інститут незалежних рецензентів">
            <div className="flex flex-col gap-4">
              <div className="w-10 h-10 bg-purple-600/10 rounded-xl flex items-center justify-center">
                <FileCheck className="text-purple-600" size={20} />
              </div>
              <p className="text-xs text-[var(--text-gray)] leading-relaxed font-medium">
                Експерти з підтвердженим науковим ступенем можуть подавати
                заявки на статус рецензента для аудиту та оцінки поданих
                проектів.
              </p>
            </div>
          </BentoCard>
        </div>

        <div className="w-full md:w-[calc(33.333%-16px)] flex">
          <BentoCard title="Простір Відкритої Науки">
            <div className="flex flex-col gap-4">
              <div className="w-10 h-10 bg-purple-600/10 rounded-xl flex items-center justify-center">
                <Landmark className="text-purple-600" size={20} />
              </div>
              <p className="text-xs text-[var(--text-gray)] leading-relaxed font-medium">
                Взаємодія за європейськими стандартами Open Science. Платформа
                об'єднує реєстри та відкриває доступ до фінансування розробок.
              </p>
            </div>
          </BentoCard>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
