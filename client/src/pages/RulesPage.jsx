/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import {
  ShieldCheck,
  FileText,
  AlertCircle,
  Download,
  ChevronRight,
  Terminal,
  Zap,
  HelpCircle,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AOS from "aos";
import "aos/dist/aos.css";

const RulesPage = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });

    const updateScroll = () => {
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scanned = (window.scrollY / scrollHeight) * 100;
      setScrollProgress(scanned);
    };

    window.addEventListener("scroll", updateScroll);
    return () => window.removeEventListener("scroll", updateScroll);
  }, []);

  const sections = [
    {
      title: "Кодекс поведінки",
      subtitle: "Академічна етика & Протокол спільноти",
      icon: <ShieldCheck className="text-purple-500" size={28} />,
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
      icon: <FileText className="text-purple-500" size={28} />,
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
    // Додано overflow-x-hidden, щоб прибрати боковий скролл
    <div className="min-h-screen flex flex-col bg-[var(--bg-main)] font-['Plus_Jakarta_Sans',_sans-serif] text-[var(--text-dark)] transition-colors duration-300 overflow-x-hidden">
      {/* Індикатор прогресу читання */}
      <div
        className="fixed top-0 left-0 h-1 bg-purple-600 z-[100] transition-all duration-150"
        style={{ width: `${scrollProgress}%` }}
      />

      <Navbar />

      <style>{`
        .rules-grid-bg {
          background-image: radial-gradient(var(--border-color) 1px, transparent 1px);
          background-size: 40px 40px;
          position: absolute;
          inset: 0; 
          opacity: 0.4; 
          z-index: 0;
        }

        .glass-card {
          background: var(--bg-light);
          backdrop-filter: blur(12px);
          border: 1px solid var(--border-color);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .glass-card:hover {
          border-color: #7c3aed;
          box-shadow: 0 10px 40px -10px rgba(124, 58, 237, 0.2);
          transform: translateY(-4px);
        }

        .label-mono {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: var(--text-gray);
        }

        .status-dot {
          width: 8px; height: 8px; border-radius: 50%;
          display: inline-block; margin-right: 10px;
        }

        .section-title {
          color: var(--text-dark);
          font-weight: 900;
        }
      `}</style>

      <main className="flex-grow pt-32 pb-20 px-6 relative">
        <div className="rules-grid-bg" />

        {/* Сяйво тепер всередині контейнера з обмеженою шириною або з overflow-hidden у батька */}
        <div className="absolute top-40 -right-20 w-96 h-96 bg-purple-600/10 blur-[120px] rounded-full z-0 pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Hero Header */}
          <div className="mb-16 text-center" data-aos="fade-down">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/5 text-purple-600 mb-6">
              <Terminal size={14} />
              <span className="label-mono !text-purple-600 font-bold">
                System.Protocols v2.0
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic mb-6 section-title">
              Правила та <span className="text-purple-600">Регламент</span>
            </h1>
            <p className="max-w-2xl mx-auto text-[var(--text-gray)] font-medium leading-relaxed italic">
              Цей документ визначає стандарти взаємодії та технічні вимоги до
              публікацій на платформі.
            </p>
          </div>

          {/* Основні секції */}
          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {sections.map((section, idx) => (
              <div
                key={idx}
                className="glass-card rounded-3xl p-8 md:p-10 flex flex-col"
                data-aos={idx === 0 ? "fade-right" : "fade-left"}
              >
                <div className="flex items-start justify-between mb-10">
                  <div>
                    <h2 className="text-2xl section-title uppercase italic mb-1">
                      {section.title}
                    </h2>
                    <p className="label-mono text-purple-500 font-bold opacity-80">
                      {section.subtitle}
                    </p>
                  </div>
                  <div className="p-4 bg-purple-500/10 rounded-2xl text-purple-600">
                    {section.icon}
                  </div>
                </div>

                <ul className="space-y-8 flex-grow">
                  {section.rules.map((rule, rIdx) => (
                    <li key={rIdx} className="group flex gap-5">
                      <div className="mt-1.5 shrink-0">
                        <div className="w-2 h-2 rounded-full bg-purple-600 shadow-[0_0_10px_#7c3aed] group-hover:scale-150 transition-transform" />
                      </div>
                      <div>
                        <span className="label-mono block mb-1 font-bold">
                          {rule.label}
                        </span>
                        <p className="text-[15px] text-[var(--text-gray)] group-hover:text-[var(--text-dark)] transition-colors leading-snug font-medium">
                          {rule.text}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Секція статусів */}
          <div
            className="glass-card rounded-[2rem] p-10 mb-16 shadow-sm"
            data-aos="fade-up"
          >
            <div className="flex items-center gap-6 mb-12">
              <div className="h-[1px] flex-grow bg-[var(--border-color)] opacity-50"></div>
              <h2 className="text-2xl section-title uppercase italic flex items-center gap-3 shrink-0">
                <Zap size={24} className="text-purple-600 fill-purple-600" />
                Процес верифікації
              </h2>
              <div className="h-[1px] flex-grow bg-[var(--border-color)] opacity-50"></div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
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
                  className="relative group p-4 rounded-2xl hover:bg-purple-500/5 transition-colors"
                >
                  <div className="flex items-center mb-4">
                    <span
                      className={`${status.color} status-dot shadow-[0_0_10px_currentColor]`}
                    ></span>
                    <span className="label-mono font-black text-xs text-[var(--text-dark)] italic tracking-wider">
                      {status.label}
                    </span>
                  </div>
                  <p className="text-[13px] leading-relaxed text-[var(--text-gray)] font-medium">
                    {status.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* НОВА СЕКЦІЯ: FAQ Міні */}
          <div className="mb-16 grid md:grid-cols-2 gap-6" data-aos="fade-up">
            <div className="glass-card rounded-3xl p-8 border-l-4 border-l-purple-600">
              <div className="flex items-center gap-3 mb-4 text-purple-600">
                <HelpCircle size={20} />
                <span className="label-mono font-bold">FAQ: Терміни</span>
              </div>
              <p className="text-sm text-[var(--text-gray)] leading-relaxed">
                Зазвичай перевірка триває до 72 годин, залежно від складності
                технічної частини та завантаженості модераторів.
              </p>
            </div>
            <div className="glass-card rounded-3xl p-8 border-l-4 border-l-purple-600">
              <div className="flex items-center gap-3 mb-4 text-purple-600">
                <AlertCircle size={20} />
                <span className="label-mono font-bold">FAQ: Відмова</span>
              </div>
              <p className="text-sm text-[var(--text-gray)] leading-relaxed">
                У разі відмови ви отримаєте детальний звіт на пошту. Ви можете
                подати апеляцію протягом 48 годин після рішення.
              </p>
            </div>
          </div>

          {/* CTA / Download */}
          <div
            className="rounded-[2.5rem] bg-gradient-to-br from-purple-600 to-purple-900 p-10 md:p-14 text-white flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl relative overflow-hidden"
            data-aos="zoom-in"
          >
            <div className="relative z-10 text-center md:text-left">
              <h3 className="text-3xl font-black uppercase italic mb-3">
                Готові розпочати?
              </h3>
              <p className="text-purple-100 font-medium max-w-md opacity-90 leading-relaxed">
                Використовуйте наш офіційний стартовий шаблон для підготовки
                вашої першої наукової роботи.
              </p>
            </div>
            <button className="relative z-10 flex items-center gap-4 bg-white text-purple-700 px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-black hover:text-white transition-all shadow-xl active:scale-95 group">
              <Download
                size={20}
                className="group-hover:-translate-y-1 transition-transform"
              />
              Шаблон
            </button>

            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-purple-400/20 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RulesPage;
