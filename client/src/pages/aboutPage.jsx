import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Target, Cpu, Layers, Database, Key,
  HardDrive, Zap, CheckCircle2, FlaskConical
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../index.css';

const AboutPage = () => {
  const navigate = useNavigate();
  const isAuth = !!localStorage.getItem('token');

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-main)] transition-colors duration-300 overflow-x-hidden">
      <Navbar />

      <main className="flex-1">
        <section className="py-24 px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <div
              className="flex justify-center items-center gap-5 mb-12"
              data-aos="fade-down"
              data-aos-duration="1000"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-[#6d28d9] to-[#4c1d95] rounded-[24px] flex items-center justify-center shadow-2xl shadow-purple-900/20 transition-transform duration-300 hover:scale-105">
                <FlaskConical size={42} className="text-white ml-0.5" />
              </div>
              <div className="text-left">
                <h2 className="text-4xl font-black text-[var(--text-dark)] tracking-tighter leading-[0.9]">
                  Science<span className="text-[#6d28d9]">Platform</span>
                </h2>
                <p className="text-[11px] font-black text-[var(--text-gray)] uppercase tracking-[0.3em] mt-2">
                  Digital Ecosystem
                </p>
              </div>
            </div>

            <div
              className="inline-block px-5 py-2 mb-8 text-[10px] font-black tracking-widest text-white bg-[#6d28d9] rounded-full uppercase shadow-lg shadow-purple-500/10"
              data-aos="zoom-in"
              data-aos-delay="400"
            >
              НАУКОВА ЕКОСИСТЕМА 2026
            </div>

            <h1
              className="text-5xl md:text-7xl font-black text-[var(--text-dark)] mb-8 leading-tight"
              data-aos="fade-up"
              data-aos-delay="600"
            >
              Майбутнє наукових <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6d28d9] to-indigo-500">публікацій вже тут</span>
            </h1>

            <p
              className="text-[var(--text-main)] text-xl font-medium leading-relaxed max-w-2xl mx-auto opacity-80"
              data-aos="fade-up"
              data-aos-delay="800"
            >
              Ми створили цифрову інфраструктуру, яка об'єднує наукову думку та передові технології.
              Зробіть свій шлях від рукопису до світового визнання прозорим.
            </p>
          </div>
        </section>

        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8" data-aos="fade-right">
              <h2 className="text-3xl font-black text-[var(--text-dark)] flex items-center gap-3">
                <Target className="text-[#6d28d9]" size={32} /> Наша Місія
              </h2>
              <p className="text-[var(--text-main)] text-lg leading-relaxed">
                Science Platform — це інструмент для демократизації науки. Ми підтримуємо
                <span className="text-[#6d28d9] font-bold"> Open Access</span> та забезпечуємо авторів
                інструментами для захисту їхніх прав та глобальної видимості.
              </p>
              <div className="space-y-4">
                {[
                  "Прозоре рецензування (Double-blind)",
                  "Повний контроль над авторськими правами",
                  "Миттєва публікація після апруву"
                ].map((text, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-4 bg-[var(--bg-card)] rounded-2xl border border-[var(--border-color)] shadow-sm"
                    data-aos="fade-up"
                    data-aos-delay={i * 200}
                  >
                    <CheckCircle2 size={20} className="text-[#6d28d9]" />
                    <span className="font-bold text-[var(--text-dark)]">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {[
                { label: "Технологія", val: "Multer" },
                { label: "Спільнота", val: "500+" },
                { label: "Безпека", val: "JWT" },
                { label: "Формат", val: "PDF/DOCX" }
              ].map((stat, i) => (
                <div
                  key={i}
                  className="p-8 bg-[var(--bg-card)] rounded-[32px] border border-[var(--border-color)] shadow-sm text-center hover:-translate-y-2 transition-all"
                  data-aos="zoom-in"
                  data-aos-delay={i * 150}
                >
                  <h2 className="text-2xl font-black text-[#6d28d9] mb-1">{stat.val}</h2>
                  <p className="text-[10px] uppercase font-black text-[var(--text-gray)] tracking-widest">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-[var(--bg-card)] border-y border-[var(--border-color)]">
          <h2
            className="text-3xl font-black text-[var(--text-dark)] text-center mb-12"
            data-aos="fade-up"
          >
            Технологічний стек
          </h2>
          <div className="max-w-5xl mx-auto flex flex-wrap justify-center gap-4 px-4">
            {[
              { icon: <Cpu size={20} />, text: "React 18" },
              { icon: <Layers size={20} />, text: "Node.js & Express" },
              { icon: <Database size={20} />, text: "MongoDB Atlas" },
              { icon: <Key size={20} />, text: "JWT Security" },
              { icon: <HardDrive size={20} />, text: "Multer Engine" },
              { icon: <Zap size={20} />, text: "Tailwind CSS" }
            ].map((tech, i) => (
              <div
                key={i}
                className="flex items-center gap-3 bg-[var(--bg-main)] px-6 py-4 rounded-2xl font-black text-[var(--text-dark)] shadow-sm border border-[var(--border-color)] hover:border-[#6d28d9] transition-all"
                data-aos="flip-up"
                data-aos-delay={i * 100}
              >
                <span className="text-[#6d28d9]">{tech.icon}</span> {tech.text}
              </div>
            ))}
          </div>
        </section>

        <section className="py-24 px-4">
          <div
            className="max-w-5xl mx-auto bg-[#1e1b4b] rounded-[48px] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl shadow-purple-500/20"
            data-aos="zoom-out-up"
          >
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
              <div className="absolute top-10 right-10 w-32 h-32 bg-purple-500 rounded-full blur-3xl"></div>
              <div className="absolute bottom-10 left-10 w-32 h-32 bg-blue-500 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10">
              <div className="flex justify-center mb-8">
                <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                  <FlaskConical size={32} className="text-white" />
                </div>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-8">
                Час виводити вашу науку <br /> на новий рівень
              </h2>
              <button
                onClick={() => navigate(isAuth ? '/profile' : '/register')}
                className="bg-[#6d28d9] text-white px-12 py-5 rounded-2xl font-black text-xl hover:bg-[#5b21b6] transition-all hover:scale-105 shadow-xl shadow-black/20"
              >
                {isAuth ? 'До особистого кабінету' : 'Зареєструватися зараз'}
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