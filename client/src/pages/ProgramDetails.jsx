/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";
import {
  Calendar,
  ArrowLeft,
  Send,
  CheckCircle,
  Info,
  Target,
  Award,
  BookOpen,
  Layers,
  Activity,
  DollarSign,
  Hash,
  Globe,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import "../index.css";

const ProgramDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgramDetails = async () => {
      try {
        const res = await axiosInstance.get(`/programs/${id}`);
        setProgram(res.data);
      } catch (err) {
        toast.error("Не вдалося завантажити деталі програми");
      } finally {
        setLoading(false);
      }
    };
    fetchProgramDetails();
    window.scrollTo(0, 0);
  }, [id]);

  const handleApply = () => {
    if (!isAuthenticated) {
      toast.error("Будь ласка, увійдіть у систему");
      setTimeout(() => navigate("/login"), 1500);
      return;
    }
    navigate("/profile", {
      state: {
        programId: id,
        programTitle: program?.title,
        domain: program?.domain || "Наука",
      },
    });
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-main)]">
        <div className="w-12 h-12 border-2 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
      </div>
    );

  if (!program)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--bg-main)] p-4 text-center">
        <h2 className="text-2xl font-black text-[var(--text-dark)] mb-4 uppercase italic tracking-tighter">
          Програму не знайдено
        </h2>
        <button
          onClick={() => navigate("/")}
          className="text-purple-600 font-black hover:underline uppercase tracking-widest text-sm"
        >
          Повернутися на головну
        </button>
      </div>
    );
  const isGrant = program.type === "Грант";
  const hasMetrics =
    program.type === "Науковий журнал" || program.type === "Стаття";

  const getButtonText = () => {
    if (isGrant) return "Подати заявку на грант";
    if (program.type === "Курс") return "Зареєструватися на курс";
    if (program.type === "Конференція") return "Подати тези доповідей";
    return "Надіслати матеріал";
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-main)] font-['Plus_Jakarta_Sans',_sans-serif] transition-colors duration-300 selection:bg-[var(--purple-main)] selection:text-white">
      <Toaster position="top-right" />
      <Navbar />

      <style>{`
        .rich-content { color: var(--text-main); line-height: 1.8; font-size: 1.05rem; }
        .rich-content h2, .rich-content h3 { color: var(--text-dark); font-weight: 800; margin: 2rem 0 1rem; font-size: 1.4rem; text-transform: uppercase; font-style: italic; }
        .rich-content p { margin-bottom: 1.25rem; }
        .rich-content ul { margin: 1.5rem 0; padding-left: 1.5rem; }
        .rich-content li { margin-bottom: 0.75rem; position: relative; list-style: none; }
        .rich-content li::before { content: "→"; position: absolute; left: -1.5rem; color: var(--purple-main); font-weight: bold; }
        .rich-content strong { color: var(--text-dark); }
        
        .label-mono {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.2em;
        }

        .animate-reveal {
          animation: reveal 0.6s cubic-bezier(0.23, 1, 0.32, 1) forwards;
        }

        @keyframes reveal {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <main className="max-w-5xl mx-auto px-6 py-12 md:py-20 w-full flex-grow mt-24">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-3 mb-10 text-[var(--text-gray)] hover:text-[var(--purple-main)] transition-all text-xs font-black uppercase tracking-widest group"
        >
          <ArrowLeft
            size={18}
            className="group-hover:-translate-x-2 transition-transform"
          />
          Назад до списку
        </button>

        <div className="bg-[var(--bg-card)] rounded-[40px] border border-[var(--border-color)] shadow-2xl overflow-hidden animate-reveal">
          <div className="p-8 md:p-16">
            <div className="flex flex-wrap items-center gap-3 mb-10">
              <span className="bg-[var(--purple-main)]/10 text-[var(--purple-main)] px-4 py-1.5 rounded-xl label-mono font-bold border border-[var(--purple-main)]/20">
                {program.domain}
              </span>
              <span className="bg-amber-500/10 text-amber-500 dark:text-amber-400 px-4 py-1.5 rounded-xl label-mono font-bold border border-amber-500/20 flex items-center gap-2">
                <Layers size={12} />
                {program.type}
              </span>
              <span className="flex items-center gap-2 bg-emerald-500/10 text-emerald-500 px-4 py-1.5 rounded-xl label-mono font-bold border border-emerald-500/20">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                Активно
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-black text-[var(--text-dark)] mb-12 leading-[1.1] tracking-tighter uppercase italic">
              {program.title}
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-16">
              {isGrant && !!program.amount && (
                <div className="sm:col-span-2 flex flex-col justify-between p-8 bg-gradient-to-br from-[var(--purple-main)]/10 to-transparent rounded-3xl border border-[var(--purple-main)]/30 group transition-all duration-300 hover:border-[var(--purple-main)] shadow-sm">
                  <div className="p-3 bg-[var(--purple-main)] rounded-2xl text-white w-fit mb-6 shadow-md shadow-[var(--purple-main)]/20">
                    <DollarSign size={28} />
                  </div>
                  <div>
                    <div className="label-mono text-[var(--purple-main)] font-black tracking-widest mb-1">
                      Обсяг фінансування гранту
                    </div>
                    <div className="text-2xl md:text-3xl font-black text-[var(--text-dark)] uppercase italic tracking-tight">
                      {program.amount}
                    </div>
                  </div>
                </div>
              )}

              <div
                className={`flex flex-col justify-between p-6 bg-[var(--bg-main)]/50 rounded-3xl border border-[var(--border-color)] group hover:border-[var(--purple-main)]/40 transition-all duration-300 ${!isGrant && !hasMetrics ? "md:col-span-3" : ""}`}
              >
                <div className="p-3 bg-[var(--purple-main)]/10 rounded-xl text-[var(--purple-main)] w-fit mb-6">
                  <Calendar size={22} />
                </div>
                <div>
                  <div className="label-mono opacity-50 mb-1">
                    Кінцевий термін
                  </div>
                  <div className="text-lg font-black text-[var(--text-dark)] uppercase">
                    {program.deadline
                      ? new Date(program.deadline).toLocaleDateString("uk-UA")
                      : "Не обмежено"}
                  </div>
                </div>
              </div>

              {hasMetrics && !!program.issn && (
                <div className="flex flex-col justify-between p-6 bg-[var(--bg-main)]/50 rounded-3xl border border-[var(--border-color)] group hover:border-blue-500/40 transition-all duration-300">
                  <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500 w-fit mb-6">
                    <Hash size={22} />
                  </div>
                  <div>
                    <div className="label-mono opacity-50 mb-1">
                      ISSN Індекс
                    </div>
                    <div className="text-lg font-black text-[var(--text-dark)] uppercase">
                      {program.issn}
                    </div>
                  </div>
                </div>
              )}

              {hasMetrics && !!program.impactFactor && (
                <div className="flex flex-col justify-between p-6 bg-[var(--bg-main)]/50 rounded-3xl border border-[var(--border-color)] group hover:border-amber-500/40 transition-all duration-300">
                  <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500 w-fit mb-6">
                    <Activity size={22} />
                  </div>
                  <div>
                    <div className="label-mono opacity-50 mb-1">
                      Impact Factor
                    </div>
                    <div className="text-lg font-black text-[var(--text-dark)] uppercase">
                      {program.impactFactor}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-col justify-between p-6 bg-[var(--bg-main)]/50 rounded-3xl border border-[var(--border-color)] group hover:border-[var(--purple-main)]/40 transition-all duration-300">
                <div className="p-3 bg-[var(--purple-main)]/10 rounded-xl text-[var(--purple-main)] w-fit mb-6">
                  <Target size={22} />
                </div>
                <div>
                  <div className="label-mono opacity-50 mb-1">
                    Доступність ресурсу
                  </div>
                  <div className="text-lg font-black text-[var(--text-dark)] uppercase tracking-tight">
                    Open Access
                  </div>
                </div>
              </div>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-[var(--border-color)] to-transparent mb-16" />

            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-8">
                <BookOpen size={20} className="text-[var(--purple-main)]" />
                <h3 className="label-mono font-black text-[var(--purple-main)] tracking-[0.3em]">
                  Деталі та регламент
                </h3>
              </div>

              <div
                className="rich-content mb-16"
                dangerouslySetInnerHTML={{ __html: program.description }}
              />

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: Award, label: "Сертифікація" },
                  { icon: CheckCircle, label: "Верифікація" },
                  { icon: Info, label: "Підтримка 24/7" },
                  { icon: Globe, label: "Global Scope" },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col items-center p-6 bg-[var(--bg-main)]/30 rounded-3xl border border-[var(--border-color)] hover:border-[var(--purple-main)]/30 transition-all duration-300"
                  >
                    <item.icon
                      size={20}
                      className="text-[var(--purple-main)] mb-3"
                    />
                    <span className="label-mono !text-[9px] font-black text-center text-[var(--text-dark)]">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-10 md:p-16 bg-[var(--purple-main)]/5 border-t border-[var(--border-color)] flex flex-col items-center">
            <button
              className="w-full md:w-auto bg-[var(--purple-main)] text-white px-16 py-6 rounded-2xl font-black text-xl shadow-2xl shadow-[var(--purple-main)]/30 hover:bg-[var(--purple-main)]/90 transition-all active:scale-95 flex items-center justify-center gap-4 uppercase tracking-tighter italic"
              onClick={handleApply}
            >
              <Send size={24} />
              {getButtonText()}
            </button>
            <p className="mt-6 label-mono opacity-50 italic text-[var(--text-gray)]">
              * Системна обробка запиту триває до 72 годин
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProgramDetails;
