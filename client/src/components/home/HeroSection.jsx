/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "../ui/Button";
import { ArrowUpRight, Shield, Search, Award, CheckCircle } from "lucide-react";

const HeroSection = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleStart = () => {
    navigate(isAuthenticated ? "/profile" : "/register");
  };

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden border-b border-[var(--border-color)]/40 bg-[var(--bg-main)] pt-24 pb-16">
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl w-full mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
          {/* ЛІВА ЧАСТИНА */}
          <div className="w-full lg:w-1/2 flex flex-col space-y-6 text-left items-start">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-600/10 border border-purple-500/20 text-purple-600 rounded-full text-[10px] font-black uppercase tracking-widest animate-[pulse_3s_infinite]">
              <span className="flex h-1.5 w-1.5 rounded-full bg-purple-600" />
              Open Science Platform
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight text-[var(--text-dark)] leading-[0.95]">
              Простір <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-indigo-500 to-purple-600 bg-[size:200%] animate-[marquee_5s_linear_infinite]">
                відкритої науки
              </span>{" "}
              <br />в Україні
            </h1>

            <p className="text-xs md:text-sm font-medium text-[var(--text-gray)] leading-relaxed max-w-xl text-left">
              Єдиний цифровий хаб, що об'єднує наукові гранти, фахові видання,
              профільні курси, відкриті датасети та міжнародні конференції в
              єдину екосистему взаємодії.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Button
                onClick={handleStart}
                variant="primary"
                size="lg"
                className="font-black tracking-wider uppercase group rounded-xl"
              >
                <span>Почати шлях</span>
                <ArrowUpRight
                  size={14}
                  className="transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300"
                />
              </Button>

              <Button
                onClick={() => navigate("/programs")}
                variant="outline"
                size="lg"
                className="font-black tracking-wider uppercase rounded-xl border-[var(--border-color)] hover:border-purple-500/50 hover:bg-purple-600/[0.02] text-[var(--text-dark)]"
              >
                Дослідити можливості
              </Button>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-2 pt-6 border-t border-[var(--border-color)]/40 w-full font-mono text-[10px] uppercase tracking-wider text-[var(--text-gray)]">
              <div className="flex items-center gap-1.5">
                <CheckCircle size={12} className="text-purple-600" />
                Реєстрація за ЄДРПОУ
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle size={12} className="text-purple-600" />
                Верифіковані ЗВО
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end relative">
            <div className="relative w-full max-w-[450px] aspect-square rounded-[40px] border border-[var(--border-color)] bg-[var(--bg-card)]/50 p-6 shadow-2xl backdrop-blur-xs flex flex-col justify-between overflow-hidden group hover:border-purple-500/30 transition-all duration-500">
              <div className="absolute -right-10 -bottom-10 text-[180px] font-black font-mono text-purple-600/[0.02] select-none pointer-events-none">
                OS
              </div>

              <div className="flex items-center justify-between border-b border-[var(--border-color)]/60 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-purple-600/10 rounded-xl flex items-center justify-center text-purple-600">
                    <Shield size={18} />
                  </div>
                  <div className="text-left">
                    <div className="text-[11px] font-black uppercase tracking-wide text-[var(--text-dark)]">
                      Екосистема безпеки
                    </div>
                    <div className="text-[9px] font-mono uppercase tracking-wider text-[var(--text-gray)]">
                      Двостороння перевірка
                    </div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[8px] font-black uppercase font-mono tracking-widest">
                  Active
                </span>
              </div>

              <div className="my-auto space-y-3 py-4">
                <div className="p-3 bg-[var(--bg-main)] rounded-2xl border border-[var(--border-color)]/60 flex items-center justify-between text-left transform hover:translate-x-1 transition-transform">
                  <div className="flex items-center gap-2">
                    <Search size={14} className="text-purple-500" />
                    <span className="text-[10px] font-bold text-[var(--text-dark)]">
                      Агрегація відкритих баз даних...
                    </span>
                  </div>
                  <span className="font-mono text-[9px] text-purple-600">
                    100%
                  </span>
                </div>

                <div className="p-3 bg-[var(--bg-main)] rounded-2xl border border-[var(--border-color)]/60 flex items-center justify-between text-left transform hover:translate-x-1 transition-transform">
                  <div className="flex items-center gap-2">
                    <Award size={14} className="text-purple-500" />
                    <span className="text-[10px] font-bold text-[var(--text-dark)]">
                      Доступні європейські гранти
                    </span>
                  </div>
                  <span className="font-mono text-[10px] font-black text-[var(--text-dark)]">
                    Horizon Europe
                  </span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-4 text-white text-left shadow-lg shadow-purple-600/20">
                <div className="text-[9px] font-mono uppercase tracking-widest opacity-80">
                  Поточний статус платформи
                </div>
                <div className="text-xs font-black uppercase tracking-wide mt-1">
                  Науковий простір активовано
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
