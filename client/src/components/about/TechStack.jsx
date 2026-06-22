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
    <section className="py-24 px-6 border-b border-[var(--border-color)]">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div
            className="order-2 lg:order-1 grid grid-cols-2 gap-4 md:gap-6"
            data-aos="fade-up"
          >
            {techCards.map((tech, i) => (
              <div
                key={i}
                className="p-6 md:p-8 border border-[var(--border-color)] bg-[var(--bg-card)]/30 backdrop-blur-sm rounded-2xl group hover:border-[#6d28d9] transition-all duration-500 shadow-xs"
              >
                <div className="text-[#6d28d9] dark:text-[#a78bfa] mb-5 transform group-hover:rotate-6 transition-transform">
                  {tech.icon}
                </div>
                <div className="text-[11px] font-black uppercase tracking-widest text-[var(--text-dark)] mb-1">
                  {tech.name}
                </div>
                <div className="text-[9px] text-[var(--text-gray)] uppercase font-bold tracking-tight">
                  {tech.desc}
                </div>
              </div>
            ))}
          </div>

          <div className="order-1 lg:order-2 space-y-6" data-aos="fade-left">
            <h2 className="text-4xl md:text-5xl font-black text-[var(--text-dark)] tracking-tighter uppercase leading-tight">
              Побудовано на <br />
              <span className="text-[#6d28d9] dark:text-[#a78bfa] italic font-light">
                інженерній
              </span>{" "}
              досконалості.
            </h2>
            <p className="text-[var(--text-gray)] text-sm md:text-base leading-relaxed font-normal">
              Ми використовуємо MERN-стек для забезпечення максимальної
              швидкості відгуку та відмовостійкості системи. Ваша наукова праця
              заслуговує на найнадійнішу технологічну основу.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {standards.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 text-[10px] font-black uppercase text-[var(--text-dark)] tracking-wide"
                >
                  <div className="w-1.5 h-1.5 bg-[#6d28d9] rounded-xs rotate-45 shrink-0" />
                  {item}
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
