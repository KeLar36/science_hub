import React from "react";
import { Cpu, Zap, BarChart3, Layers } from "lucide-react";

const TechStack = () => {
  const techCards = [
    { icon: <Cpu size={20} />, name: "MERN Stack", desc: "React & Node.js" },
    { icon: <Zap size={20} />, name: "Agile", desc: "Continuous Delivery" },
    {
      icon: <BarChart3 size={20} />,
      name: "Analytics",
      desc: "Clarity & Data",
    },
    { icon: <Layers size={20} />, name: "UI/UX", desc: "Modern Systems" },
  ];

  const standards = [
    "Microservices Architecture",
    "End-to-End Encryption",
    "AI-driven Peer Review",
    "Open Access Standard",
  ];

  return (
    <section className="py-24 px-4 md:px-6 border-b border-[var(--border-color)] overflow-hidden relative">
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-purple-600/[0.02] blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1 grid grid-cols-2 gap-4 md:gap-6 animate-[fadeIn_0.6s_ease-out_forwards]">
            {techCards.map((tech, i) => (
              <div
                key={i}
                className="p-6 md:p-8 border border-[var(--border-color)] bg-[var(--bg-card)]/40 backdrop-blur-sm rounded-2xl group hover:border-purple-600 dark:hover:border-purple-400 transition-all duration-300 shadow-sm"
              >
                <div className="text-purple-600 dark:text-purple-400 mb-5 transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                  {tech.icon}
                </div>
                <div className="text-xs font-bold uppercase tracking-wider text-[var(--text-dark)] mb-1">
                  {tech.name}
                </div>
                <div className="text-[10px] text-[var(--text-gray)] uppercase font-medium tracking-wide opacity-90">
                  {tech.desc}
                </div>
              </div>
            ))}
          </div>

          <div className="order-1 lg:order-2 space-y-6 animate-[fadeIn_0.8s_ease-out_forwards]">
            <h2 className="text-4xl md:text-5xl font-extrabold text-[var(--text-dark)] tracking-tight uppercase leading-tight">
              Побудовано на <br />
              <span className="text-purple-600 dark:text-purple-400">
                інженерній
              </span>{" "}
              досконалості.
            </h2>

            <p className="text-[var(--text-gray)] text-sm md:text-base leading-relaxed font-normal opacity-95">
              Ми використовуємо MERN-стек для забезпечення максимальної
              швидкості відгуку та відмовостійкості системи. Ваша наукова праця
              заслуговує на найнадійнішу технологічну основу.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              {standards.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 text-xs font-bold uppercase text-[var(--text-dark)] tracking-wide group"
                >
                  <div className="w-1.5 h-1.5 bg-purple-600 dark:bg-purple-400 rounded-sm rotate-45 shrink-0 transition-transform duration-300 group-hover:scale-125" />
                  <span className="opacity-90 group-hover:opacity-100 transition-opacity">
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
