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
  MapPin,
  ExternalLink,
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

  const getButtonText = () => {
    if (program.type === "Грант") return "Подати проєкт на грант";
    if (program.type === "Курс") return "Зареєструватися на курс";
    if (program.type === "Конференція") return "Зареєструватись на конференцію";
    if (program.type === "Науковий журнал") return "Подати наукову статтю";
    return "Надіслати матеріал";
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-main)] font-['Plus_Jakarta_Sans',_sans-serif] transition-colors duration-300 selection:bg-[var(--purple-main)] selection:text-white">
      <Toaster position="top-right" />
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12 md:py-20 w-full flex-grow mt-20 md:mt-24">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-3 mb-6 md:mb-10 text-[var(--text-gray)] hover:text-purple-600 dark:hover:text-purple-400 transition-all text-xs font-black uppercase tracking-widest group"
        >
          <ArrowLeft
            size={16}
            className="group-hover:-translate-x-1.5 transition-transform"
          />
          Назад до списку
        </button>

        <div className="bg-[var(--bg-card)] rounded-3xl md:rounded-[40px] border border-[var(--border-color)] shadow-xl overflow-hidden animate-[reveal_0.6s_cubic-bezier(0.23,1,0.32,1)_forwards]">
          <div className="p-5 sm:p-8 md:p-16">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-6 md:mb-10">
              <span className="bg-purple-600/5 text-purple-600 dark:text-purple-400 px-3 py-1 sm:px-4 sm:py-1.5 rounded-xl text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-widest border border-purple-600/10">
                {program.domain}
              </span>
              <span className="bg-amber-500/5 text-amber-600 dark:text-amber-400 px-3 py-1 sm:px-4 sm:py-1.5 rounded-xl text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-widest border border-amber-500/10 flex items-center gap-1.5">
                <Layers size={11} />
                {program.type}
              </span>
              <span className="flex items-center gap-1.5 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 px-3 py-1 sm:px-4 sm:py-1.5 rounded-xl text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-widest border border-emerald-500/10">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                Активно
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-6xl font-black text-[var(--text-dark)] mb-8 md:mb-12 leading-[1.15] tracking-tight md:tracking-tighter uppercase italic break-words">
              {program.title}
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mb-10 md:mb-16">
              {program.type === "Грант" && !!program.amount && (
                <div className="sm:col-span-2 flex flex-col justify-between p-6 sm:p-8 bg-gradient-to-br from-purple-600/[0.03] to-transparent rounded-2xl sm:rounded-3xl border border-purple-600/20 group transition-all duration-300 hover:border-purple-600/40 shadow-sm">
                  <div className="p-3 bg-purple-600 rounded-xl text-white w-fit mb-4 sm:mb-6 shadow-md shadow-purple-600/20">
                    <DollarSign size={24} />
                  </div>
                  <div>
                    <div className="text-[9px] sm:text-[10px] font-mono text-purple-600 dark:text-purple-400 font-bold uppercase tracking-widest mb-1">
                      Обсяг фінансування гранту
                    </div>
                    <div className="text-xl sm:text-2xl md:text-3xl font-black text-[var(--text-dark)] uppercase italic tracking-tight">
                      {program.amount}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-col justify-between p-5 sm:p-6 bg-[var(--bg-main)]/40 rounded-2xl sm:rounded-3xl border border-[var(--border-color)] group hover:border-purple-500/30 transition-all duration-300">
                <div className="p-2.5 bg-purple-600/10 text-purple-600 dark:text-purple-400 rounded-xl w-fit mb-4 sm:mb-6">
                  <Calendar size={20} />
                </div>
                <div>
                  <div className="text-[9px] sm:text-[10px] font-mono opacity-50 uppercase tracking-widest mb-1">
                    Кінцевий термін
                  </div>
                  <div className="text-base sm:text-lg font-black text-[var(--text-dark)] uppercase">
                    {program.deadline
                      ? new Date(program.deadline).toLocaleDateString("uk-UA")
                      : "Не обмежено"}
                  </div>
                </div>
              </div>

              {program.type === "Науковий журнал" && !!program.issn && (
                <div className="flex flex-col justify-between p-5 sm:p-6 bg-[var(--bg-main)]/40 rounded-2xl sm:rounded-3xl border border-[var(--border-color)] group hover:border-blue-500/30 transition-all duration-300">
                  <div className="p-2.5 bg-blue-500/10 text-blue-500 rounded-xl w-fit mb-4 sm:mb-6">
                    <Hash size={20} />
                  </div>
                  <div>
                    <div className="text-[9px] sm:text-[10px] font-mono opacity-50 uppercase tracking-widest mb-1">
                      ISSN Індекс
                    </div>
                    <div className="text-base sm:text-lg font-black text-[var(--text-dark)] uppercase">
                      {program.issn}
                    </div>
                  </div>
                </div>
              )}

              {program.type === "Науковий журнал" &&
                program.impactFactor !== undefined && (
                  <div className="flex flex-col justify-between p-5 sm:p-6 bg-[var(--bg-main)]/40 rounded-2xl sm:rounded-3xl border border-[var(--border-color)] group hover:border-amber-500/30 transition-all duration-300">
                    <div className="p-2.5 bg-amber-500/10 text-amber-500 rounded-xl w-fit mb-4 sm:mb-6">
                      <Activity size={20} />
                    </div>
                    <div>
                      <div className="text-[9px] sm:text-[10px] font-mono opacity-50 uppercase tracking-widest mb-1">
                        Impact Factor
                      </div>
                      <div className="text-base sm:text-lg font-black text-[var(--text-dark)] uppercase">
                        {program.impactFactor || "0.0"}
                      </div>
                    </div>
                  </div>
                )}

              {program.type === "Конференція" && !!program.location && (
                <div className="flex flex-col justify-between p-5 sm:p-6 bg-[var(--bg-main)]/40 rounded-2xl sm:rounded-3xl border border-[var(--border-color)] group hover:border-blue-500/30 transition-all duration-300">
                  <div className="p-2.5 bg-blue-500/10 text-blue-500 rounded-xl w-fit mb-4 sm:mb-6">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <div className="text-[9px] sm:text-[10px] font-mono opacity-50 uppercase tracking-widest mb-1">
                      Локація проведення
                    </div>
                    <div className="text-base sm:text-lg font-black text-[var(--text-dark)] uppercase">
                      {program.location}
                    </div>
                  </div>
                </div>
              )}

              {["Грант", "Конференція"].includes(program.type) &&
                !!program.organizer && (
                  <div className="flex flex-col justify-between p-5 sm:p-6 bg-[var(--bg-main)]/40 rounded-2xl sm:rounded-3xl border border-[var(--border-color)] group hover:border-purple-500/30 transition-all duration-300">
                    <div className="p-2.5 bg-purple-600/10 text-purple-600 dark:text-purple-400 rounded-xl w-fit mb-4 sm:mb-6">
                      <Award size={20} />
                    </div>
                    <div>
                      <div className="text-[9px] sm:text-[10px] font-mono opacity-50 uppercase tracking-widest mb-1">
                        Організація / Платформа
                      </div>
                      <div className="text-base sm:text-lg font-black text-[var(--text-dark)] uppercase line-clamp-1">
                        {program.organizer}
                      </div>
                    </div>
                  </div>
                )}

              <div className="flex flex-col justify-between p-5 sm:p-6 bg-[var(--bg-main)]/40 rounded-2xl sm:rounded-3xl border border border-[var(--border-color)] group hover:border-purple-500/30 transition-all duration-300">
                <div className="p-2.5 bg-purple-600/10 text-purple-600 dark:text-purple-400 rounded-xl w-fit mb-4 sm:mb-6">
                  <Target size={20} />
                </div>
                <div>
                  <div className="text-[9px] sm:text-[10px] font-mono opacity-50 uppercase tracking-widest mb-1">
                    Доступність ресурсу
                  </div>
                  <div className="text-base sm:text-lg font-black text-[var(--text-dark)] uppercase tracking-tight">
                    Open Science
                  </div>
                </div>
              </div>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-[var(--border-color)] to-transparent mb-10 md:mb-16" />

            <div className="max-w-3xl mx-auto md:mx-0">
              <div className="flex items-center gap-3 mb-6 md:mb-8">
                <BookOpen
                  size={18}
                  className="text-purple-600 dark:text-purple-400"
                />
                <h3 className="text-[10px] font-mono font-black text-purple-600 dark:text-purple-400 tracking-[0.25em] uppercase">
                  Деталі та регламент
                </h3>
              </div>

              <div
                className="prose dark:prose-invert max-w-none text-sm sm:text-base text-[var(--text-main)] leading-relaxed sm:leading-loose mb-12 md:mb-16
                  prose-headings:text-[var(--text-dark)] prose-headings:font-extrabold prose-headings:uppercase prose-headings:italic prose-headings:tracking-tight
                  prose-strong:text-[var(--text-dark)]
                  prose-ul:list-none prose-ul:pl-5
                  prose-li:relative prose-li:mb-2
                  before:prose-li:content-['→'] before:prose-li:absolute before:prose-li:-left-5 before:prose-li:text-purple-600 before:prose-li:font-bold"
                dangerouslySetInnerHTML={{
                  __html: program.description
                    ? program.description
                        .replace(/&nbsp;/g, " ")
                        .replace(/\u00a0/g, " ")
                    : "",
                }}
              />

              {program.externalLink && (
                <div className="mb-12 p-5 bg-purple-600/[0.02] border border-purple-500/15 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in duration-300">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-xl">
                      <Globe size={18} />
                    </div>
                    <div>
                      <h5 className="text-xs font-black text-[var(--text-dark)] uppercase tracking-wider">
                        Першоджерело / Офіційний сайт
                      </h5>
                      <p className="text-[11px] text-[var(--text-gray)] mt-0.5">
                        Клацніть для переходу на зовнішню веб-сторінку події чи
                        матеріалу.
                      </p>
                    </div>
                  </div>
                  <a
                    href={program.externalLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto text-center bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all active:scale-98 shadow-md shadow-purple-600/10 flex items-center justify-center gap-2"
                  >
                    Відкрити ресурс
                    <ExternalLink size={12} />
                  </a>
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                {[
                  { icon: Award, label: "Сертифікація" },
                  { icon: CheckCircle, label: "Верифікація" },
                  { icon: Info, label: "Підтримка 24/7" },
                  { icon: Globe, label: "Global Scope" },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col items-center p-4 sm:p-6 bg-[var(--bg-main)]/20 rounded-2xl border border-[var(--border-color)] hover:border-purple-500/20 transition-all duration-300"
                  >
                    <item.icon
                      size={18}
                      className="text-purple-600 dark:text-purple-400 mb-2 sm:mb-3"
                    />
                    <span className="text-[8px] sm:text-[9px] font-mono font-black text-center text-[var(--text-dark)] uppercase tracking-wider">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-10 md:p-16 bg-purple-600/[0.02] dark:bg-purple-600/[0.01] border-t border-[var(--border-color)] flex flex-col items-center">
            <button
              className="w-full md:w-auto bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 sm:px-16 sm:py-5 rounded-xl sm:rounded-2xl font-black text-base sm:text-lg shadow-xl shadow-purple-600/10 transition-all active:scale-[0.98] flex items-center justify-center gap-3 sm:gap-4 uppercase tracking-tight italic"
              onClick={handleApply}
            >
              <Send size={20} className="sm:size-[22px]" />
              {getButtonText()}
            </button>
            <p className="mt-4 sm:mt-6 text-[8px] sm:text-[9px] font-mono opacity-50 italic text-[var(--text-gray)] uppercase tracking-widest text-center">
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
