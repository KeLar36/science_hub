/* eslint-disable no-unused-vars */
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Target,
  ShieldCheck,
  Globe,
  Zap,
  CheckCircle2,
  FlaskConical,
  BookOpen,
  Users2,
  Award,
  ArrowRight,
  Search,
  FileCheck,
  Share2,
  Scale,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../index.css";

const AboutPage = () => {
  const navigate = useNavigate();
  const isAuth = !!localStorage.getItem("token");

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-main)] transition-colors duration-300 overflow-x-hidden">
      <Navbar />

      <main className="flex-1">
        <section className="py-24 px-4 text-center relative">
          <div className="max-w-4xl mx-auto">
            <div
              className="flex justify-center items-center gap-5 mb-12"
              data-aos="fade-down"
              data-aos-duration="1000"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-[#6d28d9] to-[#4c1d95] rounded-[24px] flex items-center justify-center shadow-2xl shadow-purple-900/20">
                <FlaskConical size={42} className="text-white ml-0.5" />
              </div>
              <div className="text-left">
                <h2 className="text-4xl font-black text-[var(--text-dark)] tracking-tighter leading-[0.9]">
                  Science<span className="text-[#6d28d9]">Platform</span>
                </h2>
                <p className="text-[11px] font-black text-[var(--text-gray)] uppercase tracking-[0.3em] mt-2">
                  Інноваційний простір науки
                </p>
              </div>
            </div>

            <h1
              className="text-5xl md:text-7xl font-black text-[var(--text-dark)] mb-8 leading-tight"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              Глобальний центр <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6d28d9] to-indigo-500">
                наукової колаборації
              </span>
            </h1>

            <p
              className="text-[var(--text-main)] text-xl font-medium leading-relaxed max-w-3xl mx-auto opacity-80"
              data-aos="fade-up"
              data-aos-delay="400"
            >
              Science Platform - це не просто сайт для публікацій. Це комплексна
              екосистема, розроблена для підтримки дослідників на кожному етапі:
              від ідеї до міжнародного цитування та визнання спільнотою.
            </p>
          </div>
        </section>

        <section className="py-20 px-4 bg-[var(--bg-card)] border-y border-[var(--border-color)]">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-black text-[var(--text-dark)] uppercase tracking-tighter">
                Ключові пріоритети
              </h2>
              <div className="w-20 h-1.5 bg-[#6d28d9] mx-auto mt-4 rounded-full"></div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Globe size={32} />,
                  title: "Глобальна видимість",
                  desc: "Ваші роботи індексуються провідними науковими базами, забезпечуючи доступ читачам з усього світу.",
                },
                {
                  icon: <ShieldCheck size={32} />,
                  title: "Академічна доброчесність",
                  desc: "Багаторівнева система перевірки та Double-blind рецензування гарантують високу якість контенту.",
                },
                {
                  icon: <Scale size={32} />,
                  title: "Рівні можливості",
                  desc: "Ми надаємо платформу як досвідченим професорам, так і молодим науковцям, що роблять перші кроки.",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="p-10 bg-[var(--bg-main)] rounded-[40px] border border-[var(--border-color)] hover:border-[#6d28d9] transition-all group"
                  data-aos="fade-up"
                  data-aos-delay={i * 200}
                >
                  <div className="text-[#6d28d9] mb-6 group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-black text-[var(--text-dark)] mb-4">
                    {item.title}
                  </h3>
                  <p className="text-[var(--text-main)] font-medium opacity-70">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div className="max-w-xl text-left">
                <h2 className="text-4xl font-black text-[var(--text-dark)] leading-tight">
                  Шлях вашого дослідження
                </h2>
                <p className="text-[var(--text-main)] mt-4 font-medium opacity-70">
                  Ми максимально спростили процес публікації, щоб ви могли
                  зосередитися на головному - на науці.
                </p>
              </div>
              <div className="text-8xl font-black text-[var(--text-dark)] opacity-[0.05] hidden md:block select-none pointer-events-none uppercase">
                Process
              </div>
            </div>

            <div className="grid md:grid-cols-4 gap-4">
              {[
                {
                  step: "01",
                  icon: <Search />,
                  title: "Пошук",
                  text: "Вибір відповідної наукової програми або журналу",
                },
                {
                  step: "02",
                  icon: <BookOpen />,
                  title: "Подача",
                  text: "Завантаження рукопису через зручний кабінет",
                },
                {
                  step: "03",
                  icon: <FileCheck />,
                  title: "Рецензія",
                  text: "Отримання відгуків від профільних експертів",
                },
                {
                  step: "04",
                  icon: <Share2 />,
                  title: "Публікація",
                  text: "Ваша стаття стає доступною для всього світу",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="relative p-8 bg-[var(--bg-card)] rounded-3xl border border-[var(--border-color)] group hover:shadow-xl hover:shadow-purple-500/5 transition-all"
                  data-aos="fade-right"
                  data-aos-delay={i * 150}
                >
                  <span className="absolute top-6 right-8 text-4xl font-black text-[#6d28d9] opacity-10">
                    {item.step}
                  </span>
                  <div className="text-[#6d28d9] mb-6">{item.icon}</div>
                  <h4 className="text-lg font-black text-[var(--text-dark)] mb-2">
                    {item.title}
                  </h4>
                  <p className="text-xs font-medium text-[var(--text-gray)] leading-relaxed">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8" data-aos="fade-right">
              <h2 className="text-3xl font-black text-[var(--text-dark)] flex items-center gap-3">
                <Target className="text-[#6d28d9]" size={32} /> Наша Місія
              </h2>
              <p className="text-[var(--text-main)] text-lg leading-relaxed font-medium">
                Ми віримо, що знання мають бути доступними. Science Platform
                впроваджує стандарти
                <span className="text-[#6d28d9] font-bold"> Open Access</span>,
                дозволяючи дослідникам зберігати права на свої роботи та
                одночасно отримувати максимальне охоплення аудиторії.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  "Прозорий моніторинг статусу заявки",
                  "Цифрові сертифікати публікацій",
                  "Спільнота верифікованих рецензентів",
                  "Підтримка мультимедійних даних",
                ].map((text, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-4 bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)]"
                  >
                    <CheckCircle2
                      size={18}
                      className="text-emerald-500 shrink-0"
                    />
                    <span className="font-bold text-xs text-[var(--text-dark)]">
                      {text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6" data-aos="fade-left">
              {[
                {
                  label: "Наукових робіт",
                  val: "1.2k+",
                  icon: <BookOpen size={20} />,
                },
                {
                  label: "Дослідників",
                  val: "850+",
                  icon: <Users2 size={20} />,
                },
                {
                  label: "Країн-партнерів",
                  val: "12",
                  icon: <Globe size={20} />,
                },
                {
                  label: "Середній h-index",
                  val: "18",
                  icon: <Award size={20} />,
                },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="p-8 bg-gradient-to-br from-[#6d28d9]/5 to-transparent rounded-[32px] border border-[var(--border-color)] relative overflow-hidden group hover:border-[#6d28d9]/30 transition-all"
                >
                  <div className="text-[#6d28d9] mb-3 opacity-40">
                    {stat.icon}
                  </div>
                  <h2 className="text-3xl font-black text-[var(--text-dark)] mb-1">
                    {stat.val}
                  </h2>
                  <p className="text-[10px] uppercase font-black text-[var(--text-gray)] tracking-widest">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-4">
          <div
            className="max-w-5xl mx-auto bg-[#1e1b4b] rounded-[48px] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-purple-500/20"
            data-aos="zoom-out-up"
          >
            {/* Декоративні елементи фону */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
              <div className="absolute top-10 right-10 w-64 h-64 bg-purple-500 rounded-full blur-[100px]"></div>
              <div className="absolute bottom-10 left-10 w-64 h-64 bg-blue-500 rounded-full blur-[100px]"></div>
            </div>

            <div className="relative z-10">
              <div className="flex justify-center mb-8">
                <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                  <Zap size={32} className="text-white" />
                </div>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                Готові поділитися своїм <br /> відкриттям зі світом?
              </h2>
              <p className="text-white/60 mb-10 max-w-xl mx-auto font-medium">
                Приєднуйтесь до тисяч науковців, які вже обрали сучасний підхід
                до публікацій.
              </p>
              <button
                onClick={() => navigate(isAuth ? "/profile" : "/register")}
                className="bg-[#6d28d9] text-white px-12 py-5 rounded-2xl font-black text-xl hover:bg-[#5b21b6] transition-all hover:scale-105 shadow-xl flex items-center gap-3 mx-auto"
              >
                {isAuth ? "До особистого кабінету" : "Почати дослідження"}
                <ArrowRight size={24} />
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;
