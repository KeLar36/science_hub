/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axios";
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
  FileText,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../index.css";

const ProgramDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProgramDetails = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/programs/${id}`);
        setProgram(res.data);
      } catch (err) {
        toast.error("Не вдалося завантажити деталі програми");
      } finally {
        setLoading(false);
      }
    };
    fetchProgramDetails();
    window.scrollTo(0, 0);
  }, [id, apiUrl]);

  const handleApply = () => {
    if (!user || !token) {
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
        <div className="w-12 h-12 border-2 border-purple-600/20 border-t-purple-600 rounded-full animate-spin"></div>
      </div>
    );

  if (!program)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--bg-main)] p-4 text-center">
        <h2 className="text-2xl font-black text-[var(--text-dark)] mb-4 uppercase italic">
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

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-main)] font-['Plus_Jakarta_Sans',_sans-serif] transition-colors duration-300 selection:bg-purple-600 selection:text-white">
      <Toaster position="top-right" />
      <Navbar />

      <style>{`
        .rich-content { color: var(--text-main); line-height: 1.8; font-size: 1.05rem; }
        .rich-content h2, .rich-content h3 { color: var(--text-dark); font-weight: 800; margin: 2rem 0 1rem; font-size: 1.5rem; text-transform: uppercase; font-style: italic; }
        .rich-content p { margin-bottom: 1.25rem; }
        .rich-content ul { margin: 1.5rem 0; padding-left: 1.5rem; }
        .rich-content li { margin-bottom: 0.75rem; position: relative; list-style: none; }
        .rich-content li::before { content: "→"; position: absolute; left: -1.5rem; color: #7c3aed; font-weight: bold; }
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
          className="flex items-center gap-3 mb-10 text-[var(--text-gray)] hover:text-purple-600 transition-all text-xs font-black uppercase tracking-widest group"
        >
          <ArrowLeft
            size={18}
            className="group-hover:-translate-x-2 transition-transform"
          />
          Назад до списку
        </button>

        <div className="bg-[var(--bg-card)] rounded-[40px] border border-[var(--border-color)] shadow-2xl overflow-hidden animate-reveal">
          <div className="p-8 md:p-16">
            {/* Баджі типу програми */}
            <div className="flex flex-wrap items-center gap-3 mb-10">
              <span className="bg-purple-600/10 text-purple-600 px-4 py-1.5 rounded-xl label-mono font-bold border border-purple-600/20">
                {program.domain}
              </span>
              <span className="bg-amber-500/10 text-amber-600 px-4 py-1.5 rounded-xl label-mono font-bold border border-amber-500/20 flex items-center gap-2">
                <Layers size={12} />
                {program.type === "Грант"
                  ? "Науковий Грант"
                  : program.type === "Журнал"
                    ? "Науковий Журнал"
                    : program.type}
              </span>
              <span className="flex items-center gap-2 bg-emerald-500/10 text-emerald-500 px-4 py-1.5 rounded-xl label-mono font-bold border border-emerald-500/20">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                Активно
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-black text-[var(--text-dark)] mb-12 leading-[1.1] tracking-tighter uppercase italic">
              {program.title}
            </h1>

            {/* Динамічна сітка характеристик */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
              {/* Дата - є завжди */}
              <div className="flex items-center gap-4 p-6 bg-[var(--bg-main)]/50 rounded-2xl border border-[var(--border-color)] group hover:border-purple-600/30 transition-colors">
                <div className="p-3 bg-purple-600/10 rounded-xl text-purple-600">
                  <Calendar size={24} />
                </div>
                <div>
                  <div className="label-mono opacity-50 mb-1">
                    Дедлайн подачі
                  </div>
                  <div className="text-sm font-black text-[var(--text-dark)] uppercase">
                    {program.deadline
                      ? new Date(program.deadline).toLocaleDateString("uk-UA")
                      : "Не обмежено"}
                  </div>
                </div>
              </div>

              {program.type === "Грант" && !!program.amount && (
                <div className="flex items-center gap-4 p-6 bg-[var(--bg-main)]/50 rounded-2xl border border-[var(--border-color)] group hover:border-emerald-600/30 transition-colors">
                  <div className="p-3 bg-emerald-600/10 rounded-xl text-emerald-600">
                    <DollarSign size={24} />
                  </div>
                  <div>
                    <div className="label-mono opacity-50 mb-1">
                      Фінансування
                    </div>
                    <div className="text-sm font-black text-[var(--text-dark)] uppercase">
                      {program.amount}
                    </div>
                  </div>
                </div>
              )}

              {(program.type === "Журнал" || program.type === "Стаття") &&
                !!program.issn && (
                  <div className="flex items-center gap-4 p-6 bg-[var(--bg-main)]/50 rounded-2xl border border-[var(--border-color)] group hover:border-blue-600/30 transition-colors">
                    <div className="p-3 bg-blue-600/10 rounded-xl text-blue-600">
                      <Hash size={24} />
                    </div>
                    <div>
                      <div className="label-mono opacity-50 mb-1">
                        ISSN Індекс
                      </div>
                      <div className="text-sm font-black text-[var(--text-dark)] uppercase">
                        {program.issn}
                      </div>
                    </div>
                  </div>
                )}

              {!!program.impactFactor && (
                <div className="flex items-center gap-4 p-6 bg-[var(--bg-main)]/50 rounded-2xl border border-[var(--border-color)] group hover:border-amber-600/30 transition-colors">
                  <div className="p-3 bg-amber-600/10 rounded-xl text-amber-600">
                    <Activity size={24} />
                  </div>
                  <div>
                    <div className="label-mono opacity-50 mb-1">
                      Impact Factor
                    </div>
                    <div className="text-sm font-black text-[var(--text-dark)] uppercase">
                      {program.impactFactor}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-4 p-6 bg-[var(--bg-main)]/50 rounded-2xl border border-[var(--border-color)] group hover:border-blue-600/30 transition-colors">
                <div className="p-3 bg-blue-600/10 rounded-xl text-blue-600">
                  <Target size={24} />
                </div>
                <div>
                  <div className="label-mono opacity-50 mb-1">Доступність</div>
                  <div className="text-sm font-black text-[var(--text-dark)] uppercase">
                    Open Access
                  </div>
                </div>
              </div>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-[var(--border-color)] to-transparent mb-16" />

            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-8">
                <BookOpen size={20} className="text-purple-600" />
                <h3 className="label-mono font-black text-purple-600 tracking-[0.3em]">
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
                  { icon: Globe2, label: "Global Scope", customIcon: true },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col items-center p-6 bg-[var(--bg-main)]/30 rounded-3xl border border-[var(--border-color)] hover:border-purple-600/20 transition-all"
                  >
                    {item.customIcon ? (
                      <div className="text-purple-600 mb-3">
                        <Globe2 size={20} />
                      </div>
                    ) : (
                      <item.icon size={20} className="text-purple-600 mb-3" />
                    )}
                    <span className="label-mono !text-[9px] font-black text-center">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-10 md:p-16 bg-purple-600/5 border-t border-[var(--border-color)] flex flex-col items-center">
            <button
              className="w-full md:w-auto bg-purple-600 text-white px-16 py-6 rounded-2xl font-black text-xl shadow-2xl shadow-purple-600/30 hover:bg-purple-700 dark:hover:bg-purple-500 transition-all active:scale-95 flex items-center justify-center gap-4 uppercase tracking-tighter italic"
              onClick={handleApply}
            >
              <Send size={24} />
              {program.type === "Грант"
                ? "Подати заявку на грант"
                : "Надіслати матеріал"}
            </button>
            <p className="mt-6 label-mono opacity-50 italic">
              * Системна обробка запиту триває до 72 годин
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

const Globe2 = ({ size, className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

export default ProgramDetails;
