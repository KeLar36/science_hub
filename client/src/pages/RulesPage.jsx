/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import {
  ShieldCheck,
  FileText,
  AlertCircle,
  Download,
  Terminal,
  Zap,
  HelpCircle,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const RulesPage = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const updateScroll = () => {
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scanned =
        scrollHeight > 0 ? (window.scrollY / scrollHeight) * 100 : 0;
      setScrollProgress(scanned);
    };

    window.addEventListener("scroll", updateScroll, { passive: true });
    return () => window.removeEventListener("scroll", updateScroll);
  }, []);

  const sections = [
    {
      title: "Кодекс поведінки",
      subtitle: "Академічна етика & Протокол спільноти",
      icon: <ShieldCheck size={24} />,
      rules: [
        {
          label: "Доброчесність",
          text: "Академічна доброчесність: плагіат суворо заборонений.",
        },
        {
          label: "Повага",
          text: "Повага до колег: конструктивна критика замість токсичності.",
        },
        {
          label: "Приватність",
          text: "Конфіденційність: не розголошуйте дані третіх осіб.",
        },
        {
          label: "Перевірка",
          text: "Актуальність: публікуйте лише перевірені дані.",
        },
      ],
    },
    {
      title: "Технічний регламент",
      subtitle: "Стандарти оформлення текстів",
      icon: <FileText size={24} />,
      rules: [
        {
          label: "Заголовок",
          text: "Заголовок має бути чітким та написаним у CAPS/BOLD.",
        },
        {
          label: "Структура",
          text: "Обов'язкова наявність вступу, основної частини та висновків.",
        },
        {
          label: "Медіа",
          text: "Зображення мають бути чіткими, з підписами під файлом.",
        },
        {
          label: "Джерела",
          text: "Список джерел оформлюється згідно з ДСТУ або APA.",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-main)] font-['Plus_Jakarta_Sans',_sans-serif] text-[var(--text-dark)] transition-colors duration-300 overflow-x-hidden selection:bg-purple-600 selection:text-white">
      <div
        className="fixed top-0 left-0 h-1 bg-purple-600 z-[100] transition-all duration-150 will-change-transform"
        style={{ width: `${scrollProgress}%` }}
      />

      <Navbar />

      <main className="flex-grow pt-40 pb-24 px-4 md:px-6 relative">
        <div className="absolute inset-0 opacity-30 pointer-events-none z-0 bg-[radial-gradient(var(--border-color)_1px,transparent_1px)] [background-size:32px_32px]" />
        <div className="absolute top-40 right-0 w-96 h-96 bg-purple-600/[0.03] blur-[120px] rounded-full z-0 pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="mb-20 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-purple-500/10 bg-purple-600/5 text-purple-600 dark:text-purple-400 mb-6">
              <Terminal size={12} />
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest">
                System.Protocols v2.0
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight uppercase text-[var(--text-dark)] leading-tight">
              Правила та{" "}
              <span className="text-purple-600 dark:text-purple-400">
                Регламент
              </span>
            </h1>
            <p className="mt-6 max-w-xl mx-auto text-[var(--text-gray)] text-base md:text-lg font-normal leading-relaxed opacity-90">
              Цей документ визначає стандарти взаємодії та технічні вимоги до
              публікацій на платформі.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 mb-16">
            {sections.map((section, idx) => (
              <div
                key={idx}
                className="bg-[var(--bg-light)] backdrop-blur-md border border-[var(--border-color)] rounded-2xl p-6 md:p-8 flex flex-col transition-all duration-300 hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-600/[0.01] hover:-translate-y-0.5"
              >
                <div className="flex items-start justify-between mb-8">
                  <div>
                    <h2 className="text-xl font-bold text-[var(--text-dark)] uppercase tracking-tight mb-1">
                      {section.title}
                    </h2>
                    <p className="font-mono text-[10px] uppercase tracking-wider text-purple-600 dark:text-purple-400 font-semibold">
                      {section.subtitle}
                    </p>
                  </div>
                  <div className="p-3 bg-purple-600/5 border border-purple-500/10 rounded-xl text-purple-600 dark:text-purple-400">
                    {section.icon}
                  </div>
                </div>

                <ul className="space-y-6 flex-grow">
                  {section.rules.map((rule, rIdx) => (
                    <li key={rIdx} className="group flex gap-4">
                      <div className="mt-1.5 shrink-0">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-600 shadow-[0_0_8px_#7c3aed] group-hover:scale-125 transition-transform" />
                      </div>
                      <div>
                        <span className="font-mono text-[10px] block mb-1 font-bold uppercase tracking-wider text-[var(--text-gray)] group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                          {rule.label}
                        </span>
                        <p className="text-sm text-[var(--text-gray)] group-hover:text-[var(--text-dark)] transition-colors leading-relaxed font-normal opacity-90">
                          {rule.text}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="bg-[var(--bg-light)] backdrop-blur-md border border-[var(--border-color)] rounded-2xl p-6 md:p-8 mb-16">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-1 h-4 bg-purple-600 dark:bg-purple-400 rounded-xs" />
              <h2 className="text-lg font-bold text-[var(--text-dark)] uppercase tracking-wider flex items-center gap-2">
                <Zap
                  size={16}
                  className="text-purple-600 dark:text-purple-400 fill-current"
                />
                Процес верифікації
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  label: "На Розгляді",
                  color: "bg-purple-500",
                  desc: "Матеріал очікує черги на автоматичну перевірку антиплагіатом.",
                },
                {
                  label: "На Доопрацюванні",
                  color: "bg-amber-500",
                  desc: "Модератор надіслав запит на уточнення джерел або виправлення оформлення.",
                },
                {
                  label: "Прийнято",
                  color: "bg-emerald-500",
                  desc: "Публікація пройшла всі етапи перевірки та доступна в базі даних.",
                },
              ].map((status, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl border border-transparent hover:border-[var(--border-color)] hover:bg-purple-600/[0.01] transition-all duration-300"
                >
                  <div className="flex items-center mb-3">
                    <span
                      className={`w-2 h-2 rounded-full ${status.color} mr-2.5 shadow-xs`}
                    />
                    <span className="font-mono text-xs font-bold text-[var(--text-dark)] uppercase tracking-wide">
                      {status.label}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed text-[var(--text-gray)] font-normal opacity-90">
                    {status.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-16 grid md:grid-cols-2 gap-6">
            <div className="bg-[var(--bg-light)] border border-[var(--border-color)] rounded-2xl p-6 border-l-4 border-l-purple-600 transition-colors hover:border-purple-500/20">
              <div className="flex items-center gap-2.5 mb-3 text-purple-600 dark:text-purple-400">
                <HelpCircle size={16} />
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider">
                  FAQ: Терміни
                </span>
              </div>
              <p className="text-xs text-[var(--text-gray)] leading-relaxed font-normal opacity-90">
                Зазвичай перевірка триває до 72 годин, залежно від складності
                технічної частини та завантаженості модераторів.
              </p>
            </div>
            <div className="bg-[var(--bg-light)] border border-[var(--border-color)] rounded-2xl p-6 border-l-4 border-l-purple-600 transition-colors hover:border-purple-500/20">
              <div className="flex items-center gap-2.5 mb-3 text-purple-600 dark:text-purple-400">
                <AlertCircle size={16} />
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider">
                  FAQ: Відмова
                </span>
              </div>
              <p className="text-xs text-[var(--text-gray)] leading-relaxed font-normal opacity-90">
                У разі відмови ви отримаєте детальний звіт на пошту. Ви можете
                подати апеляцію протягом 48 годин після рішення.
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-to-b from-purple-600 to-purple-800 p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl relative overflow-hidden">
            <div className="relative z-10 text-center md:text-left">
              <h3 className="text-2xl md:text-3xl font-extrabold uppercase tracking-tight mb-2">
                Готові розпочати?
              </h3>
              <p className="text-purple-100 text-sm max-w-md opacity-90 leading-relaxed font-normal">
                Використовуйте наш офіційний стартовий шаблон для підготовки
                вашої першої наукової роботи.
              </p>
            </div>
            <button className="relative z-10 flex items-center gap-3 bg-white text-purple-700 px-8 py-4 rounded-xl font-bold uppercase text-xs tracking-widest hover:bg-black hover:text-white transition-all active:scale-98 shrink-0 shadow-md">
              <Download size={14} />
              Шаблон
            </button>

            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-purple-400/10 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RulesPage;
