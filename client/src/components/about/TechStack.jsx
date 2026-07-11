import React from "react";
import {
  Database,
  Layers,
  Server,
  ShieldCheck,
  FileJson,
  GitBranch,
  CheckCircle,
} from "lucide-react";

const TechStack = () => {
  const techCards = [
    {
      icon: <Database size={22} />,
      name: "MongoDB Atlas",
      desc: "Хмарна NoSQL база даних, оптимізована через Mongoose Discriminators.",
    },
    {
      icon: <Layers size={22} />,
      name: "React & JSX",
      desc: "Динамічний клієнтський інтерфейс на основі ізольованих компонентів.",
    },
    {
      icon: <Server size={22} />,
      name: "Node.js & Express",
      desc: "Швидкісний REST API бекенд з асинхронною обробкою запитів.",
    },
    {
      icon: <ShieldCheck size={22} />,
      name: "JWT & Bcrypt",
      desc: "Безпечна безсесійна авторизація та ширування паролів на рівні сервера.",
    },
    {
      icon: <FileJson size={22} />,
      name: "Tailwind CSS",
      desc: "Сучасна дизайн-система на CSS-змінних з підтримкою Dark Mode.",
    },
    {
      icon: <GitBranch size={22} />,
      name: "Agile (Scrum/Kanban)",
      desc: "Модульне планування архітектури та ітераційний процес деплою.",
    },
  ];

  const standards = [
    "Перевірка установ за кодом ЄДРПОУ",
    "Гібридна модель подачі матеріалів",
    "Інтеграція Rich Text Editor (RTE)",
    "Пагінація та дебаунс пошуку на сервері",
    "Двостороння рольова верифікація",
    "Стандартизована Open Access архітектура",
  ];

  return (
    <section className="py-24 px-4 md:px-6 border-b border-[var(--border-color)] overflow-hidden relative bg-[var(--bg-main)]">
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-purple-600/[0.03] blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="w-full lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 order-2 lg:order-1">
            {techCards.map((tech, i) => (
              <div
                key={i}
                className="p-6 border border-[var(--border-color)] bg-[var(--bg-card)] rounded-2xl group hover:border-purple-600 dark:hover:border-purple-400 hover:shadow-lg hover:shadow-purple-600/[0.02] transition-all duration-300 flex flex-col items-start text-left"
              >
                <div className="text-purple-600 dark:text-purple-400 mb-4 p-2.5 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shrink-0">
                  {tech.icon}
                </div>
                <div className="text-xs font-black uppercase tracking-wider text-[var(--text-dark)] mb-1.5 font-mono">
                  {tech.name}
                </div>
                <div className="text-[11px] text-[var(--text-gray)] font-medium leading-relaxed">
                  {tech.desc}
                </div>
              </div>
            ))}
          </div>

          <div className="w-full lg:w-1/2 space-y-6 order-1 lg:order-2 text-left flex flex-col items-start">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-600/10 border border-purple-500/20 text-purple-600 rounded-full text-[10px] font-black uppercase tracking-widest">
              <span>✦</span> Технічний стек платформи
            </div>

            <h2 className="text-3xl md:text-5xl font-black text-[var(--text-dark)] tracking-tight uppercase leading-[0.95]">
              Побудовано на <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-500">
                інженерній
              </span>{" "}
              досконалості.
            </h2>

            <p className="text-[var(--text-gray)] text-xs md:text-sm leading-relaxed font-medium max-w-xl">
              Платформа розроблена з використанням сучасного MERN-стеку за
              модульним архітектурним принципом. Кожен компонент клієнтської
              частини та ендпоїнт сервера оптимізовано для швидкісної обробки
              великих масивів наукових даних та захисту конфіденційності
              користувачів.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3.5 pt-4 border-t border-[var(--border-color)] w-full">
              {standards.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2.5 text-[11px] font-bold uppercase text-[var(--text-dark)] tracking-wide group"
                >
                  <CheckCircle
                    size={14}
                    className="text-purple-600 dark:text-purple-400 shrink-0 transform group-hover:scale-110 transition-transform"
                  />
                  <span className="opacity-90 group-hover:opacity-100 transition-opacity font-mono">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechStack;
