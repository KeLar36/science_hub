/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  Globe,
  FlaskConical,
  BookOpen,
  Users2,
  Award,
  Search,
  FileCheck,
  Share2,
  Scale,
  ArrowUpRight,
  CheckCircle2,
  Sparkles,
  Zap,
  Cpu,
  BarChart3,
  Layers,
  Beaker,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AOS from "aos";
import "aos/dist/aos.css";

const AboutPage = () => {
  const navigate = useNavigate();
  const isAuth = !!localStorage.getItem("token");

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg-main)] selection:bg-[var(--purple-main)] selection:text-white font-['Plus_Jakarta_Sans',_sans-serif]">
      <Navbar />

      <main className="relative">
        {/* Анімований фон для всієї сторінки */}
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          <div
            className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px] animate-pulse"
            style={{ animationDuration: "8s" }}
          />
          <div
            className="absolute top-[40%] -right-[5%] w-[30%] h-[30%] bg-purple-500/5 rounded-full blur-[100px] animate-pulse"
            style={{ animationDuration: "12s" }}
          />
        </div>

        {/* --- ENHANCED HERO SECTION --- */}
        <header className="relative pt-40 pb-24 px-6 border-b border-[var(--border-color)] overflow-hidden">
          <div
            className="absolute inset-0 z-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "radial-gradient(var(--border-color) 1px, transparent 1px)",
              backgroundSize: "30px 30px",
            }}
          />

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
              <div className="lg:col-span-8 space-y-10" data-aos="fade-right">
                <div className="inline-flex items-center gap-3 px-4 py-2 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-full backdrop-blur-md">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-600"></span>
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--text-dark)]">
                    SciencePlatform / Mission 2026
                  </span>
                </div>

                <div className="space-y-6">
                  <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-[var(--text-dark)] leading-[0.95]">
                    Майбутнє <br />
                    <span className="relative inline-block">
                      <span className="relative z-10 text-purple-600">
                        науки
                      </span>
                    </span>{" "}
                    у цифрі.
                  </h1>

                  <div className="flex flex-col md:flex-row gap-8 items-start">
                    <div className="w-1 h-24 bg-gradient-to-b from-purple-600 to-transparent hidden md:block"></div>
                    <p className="max-w-xl text-xl text-[var(--text-gray)] font-light leading-relaxed">
                      Ми створюємо інтелектуальний простір, де наукові відкриття
                      трансформуються у цифрові активи. Автоматизація,
                      прозорість та глобальний доступ - наші фундаментальні
                      принципи.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-6 items-center pt-6">
                  <button
                    onClick={() => navigate(isAuth ? "/profile" : "/register")}
                    className="group relative flex items-center gap-6 bg-purple-600 text-white px-10 py-5 text-[11px] font-black uppercase tracking-widest transition-all duration-500 shadow-xl shadow-purple-600/20 hover:bg-[var(--text-dark)] hover:text-purple-400"
                  >
                    <span className="relative z-10">Почати шлях</span>
                    <ArrowUpRight
                      size={16}
                      className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                    />
                  </button>

                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="w-10 h-10 rounded-full border-2 border-[var(--bg-main)] bg-[var(--bg-card)] flex items-center justify-center overflow-hidden"
                      >
                        <div className="w-full h-full bg-purple-600/10 flex items-center justify-center">
                          <Users2 size={14} className="text-purple-600" />
                        </div>
                      </div>
                    ))}
                    <div className="pl-6 flex flex-col justify-center">
                      <span className="text-[10px] font-bold text-[var(--text-dark)] uppercase tracking-tighter">
                        3000+ Дослідників
                      </span>
                      <span className="text-[9px] text-purple-600 font-medium">
                        вже з нами
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="lg:col-span-4 hidden lg:block"
                data-aos="fade-left"
              >
                <div className="relative">
                  {/* Декоративні рамки навколо іконки */}
                  <div className="absolute -top-10 -right-10 w-32 h-32 border-t-2 border-r-2 border-purple-600/30"></div>
                  <div className="absolute -bottom-10 -left-10 w-32 h-32 border-b-2 border-l-2 border-purple-600/30"></div>

                  <div className="aspect-square bg-[var(--bg-card)] border border-[var(--border-color)] backdrop-blur-xl relative z-10 flex items-center justify-center group">
                    <div className="absolute inset-0 bg-purple-600/0 group-hover:bg-purple-600/5 transition-colors duration-700"></div>
                    <FlaskConical
                      size={120}
                      className="text-purple-600 transition-transform duration-700 group-hover:scale-110 group-hover:rotate-6"
                    />

                    {/* Floating elements */}
                    <div className="absolute top-10 right-10 p-3 bg-[var(--bg-main)] border border-[var(--border-color)] animate-bounce shadow-lg">
                      <Zap size={16} className="text-purple-600" />
                    </div>
                    <div className="absolute bottom-12 -left-8 p-4 bg-purple-600 text-white shadow-2xl">
                      <Sparkles size={20} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* --- FEATURES SECTION --- */}
        <section className="border-b border-[var(--border-color)] bg-[var(--bg-main)] relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3">
              {[
                {
                  icon: <Globe size={24} />,
                  title: "Глобальна видимість",
                  desc: "Інтеграція з міжнародними базами Scopus та Web of Science для миттєвої індексації.",
                },
                {
                  icon: <ShieldCheck size={24} />,
                  title: "Академічна етика",
                  desc: "Суворі алгоритми перевірки на плагіат та Double-blind рецензування кожної роботи.",
                },
                {
                  icon: <Scale size={24} />,
                  title: "Відкритий доступ",
                  desc: "Ми підтримуємо Open Access, забезпечуючи вільний обмін знаннями між країнами.",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="p-16 border-r last:border-r-0 border-[var(--border-color)] hover:bg-[var(--bg-card)] transition-all group"
                  data-aos="fade-up"
                  data-aos-delay={i * 100}
                >
                  <div className="text-purple-600 mb-10 transition-transform duration-500 group-hover:-translate-y-2 group-hover:scale-110">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-[var(--text-dark)] mb-5 tracking-tight uppercase italic">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[var(--text-gray)] leading-relaxed opacity-80 group-hover:opacity-100">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- STEPS SECTION --- */}
        <section className="py-28 px-6 bg-[var(--bg-card)]/10 relative overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
              <div className="space-y-4">
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-purple-600">
                  Infrastructure
                </span>
                <h2 className="text-5xl md:text-6xl font-medium text-[var(--text-dark)] tracking-tighter uppercase">
                  Етапи роботи
                </h2>
              </div>
              <div className="h-px flex-grow bg-[var(--border-color)] mx-12 hidden md:block mb-5" />
              <p className="max-w-[220px] text-[10px] text-[var(--text-gray)] uppercase tracking-widest leading-loose font-bold">
                Повний цикл: від ідеї до отримання сертифіката.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 border border-[var(--border-color)]">
              {[
                {
                  step: "01",
                  icon: <Search size={22} />,
                  title: "Аналіз",
                  text: "Підбір видання",
                },
                {
                  step: "02",
                  icon: <BookOpen size={22} />,
                  title: "Подача",
                  text: "Хмарна обробка",
                },
                {
                  step: "03",
                  icon: <FileCheck size={22} />,
                  title: "Огляд",
                  text: "Експертна оцінка",
                },
                {
                  step: "04",
                  icon: <Share2 size={22} />,
                  title: "Вплив",
                  text: "Публікація",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="p-10 border-r last:border-r-0 border-b sm:border-b-0 border-[var(--border-color)] group hover:bg-purple-600 transition-all duration-700 flex flex-col h-72"
                  data-aos="zoom-in"
                  data-aos-delay={i * 100}
                >
                  <span className="text-3xl font-black text-purple-600 group-hover:text-white/20 transition-colors mb-auto">
                    {item.step}
                  </span>
                  <div className="space-y-4">
                    <div className="text-purple-600 group-hover:text-white transition-colors transform group-hover:scale-110 duration-500">
                      {item.icon}
                    </div>
                    <h4 className="text-base font-black text-[var(--text-dark)] group-hover:text-white uppercase tracking-wider">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-[var(--text-gray)] group-hover:text-white/80 font-medium uppercase tracking-[0.2em]">
                      {item.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- TECH STACK SECTION --- */}
        <section className="py-28 px-6 border-b border-[var(--border-color)]">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-24 items-center">
              <div
                className="order-2 lg:order-1 grid grid-cols-2 gap-6"
                data-aos="fade-up"
              >
                {[
                  {
                    icon: <Cpu />,
                    name: "MERN Stack",
                    desc: "React & Node.js",
                  },
                  { icon: <Zap />, name: "Agile", desc: "Continuous Delivery" },
                  {
                    icon: <BarChart3 />,
                    name: "Analytics",
                    desc: "Clarity & Data",
                  },
                  { icon: <Layers />, name: "UI/UX", desc: "Modern Systems" },
                ].map((tech, i) => (
                  <div
                    key={i}
                    className="p-8 border border-[var(--border-color)] bg-[var(--bg-card)]/40 backdrop-blur-md group hover:border-purple-600 transition-all duration-500"
                  >
                    <div className="text-purple-600 mb-6 transform group-hover:rotate-12 transition-transform">
                      {tech.icon}
                    </div>
                    <div className="text-xs font-black uppercase tracking-widest text-[var(--text-dark)] mb-2">
                      {tech.name}
                    </div>
                    <div className="text-[10px] text-[var(--text-gray)] uppercase tracking-tighter">
                      {tech.desc}
                    </div>
                  </div>
                ))}
              </div>
              <div
                className="order-1 lg:order-2 space-y-8"
                data-aos="fade-left"
              >
                <h2 className="text-5xl font-medium text-[var(--text-dark)] tracking-tighter uppercase leading-tight">
                  Побудовано на <br />
                  <span className="text-purple-600 italic">
                    інженерній
                  </span>{" "}
                  досконалості.
                </h2>
                <p className="text-[var(--text-gray)] text-md leading-relaxed font-light uppercase tracking-tight">
                  Ми використовуємо MERN stack для забезпечення максимальної
                  швидкості відгуку системи. Ваша наукова праця заслуговує на
                  найнадійнішу технологічну основу.
                </p>
                <div className="space-y-4">
                  {[
                    "Microservices Architecture",
                    "End-to-End Encryption",
                    "AI-driven Peer Review",
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 text-[11px] font-black uppercase text-[var(--text-dark)]"
                    >
                      <div className="w-2 h-2 bg-purple-600 rotate-45" /> {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- CALL TO ACTION --- */}
        <section className="py-40 px-6 mb-20 relative overflow-hidden">
          <div
            className="max-w-5xl mx-auto text-center relative z-10 space-y-12"
            data-aos="zoom-in"
          >
            <div className="space-y-6">
              <span className="text-[11px] font-black uppercase tracking-[0.6em] text-purple-600">
                Ви готові?
              </span>
              <h2 className="text-6xl md:text-8xl font-medium text-[var(--text-dark)] tracking-tighter uppercase leading-none">
                Час відкрити <br />
                <span className="italic font-light text-purple-600">
                  свій потенціал.
                </span>
              </h2>
            </div>

            <p className="max-w-lg mx-auto text-sm text-[var(--text-gray)] font-medium leading-relaxed uppercase tracking-[0.1em] opacity-80">
              Приєднуйтесь до глобальної спільноти вчених, які вже змінюють світ
              на краще.
            </p>

            <button
              onClick={() => navigate(isAuth ? "/profile" : "/register")}
              className="group relative inline-flex items-center gap-8 bg-transparent border-2 border-purple-600 text-[var(--text-dark)] px-16 py-6 text-[12px] font-black uppercase tracking-[0.4em] overflow-hidden transition-all duration-500 hover:text-white"
            >
              <div className="absolute inset-0 bg-purple-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-0" />
              <span className="relative z-10 flex items-center gap-4">
                {isAuth ? "Мій Кабінет" : "Створити профіль"}
                <ArrowUpRight
                  size={20}
                  className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                />
              </span>
            </button>
          </div>

          {/* Декоративний фон для CTA */}
          <div className="absolute inset-0 z-0 opacity-10">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,var(--purple-main)_0,transparent_70%)] opacity-20"></div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;
