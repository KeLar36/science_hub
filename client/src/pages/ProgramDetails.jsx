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
  }, [id]);

  const handleApply = () => {
    if (!isAuthenticated) {
      toast.error("Будь ласка, увійдіть в систему, щоб подати заявку");
      return;
    }
    navigate("/profile", {
      state: {
        programId: program._id,
        programTitle: program.title,
        programType: program.type,
        programDomain: program.domain,
      },
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-dark)] flex flex-col justify-between">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-sm font-mono tracking-widest animate-pulse uppercase opacity-60">
            Завантаження деталей...
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!program) {
    return (
      <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-dark)] flex flex-col justify-between">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center gap-4">
          <p className="text-sm font-mono uppercase tracking-wider opacity-60">
            Програму не знайдено або її було видалено.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 transition-colors"
          >
            <ArrowLeft size={14} /> Назад
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const getTypeIcon = (type) => {
    switch (type) {
      case "Науковий журнал":
        return <BookOpen size={18} />;
      case "Грант":
        return <DollarSign size={18} />;
      case "Конференція":
        return <Activity size={18} />;
      default:
        return <Layers size={18} />;
    }
  };

  const getButtonText = () => {
    switch (program.type) {
      case "Науковий журнал":
        return "Подати статтю";
      case "Грант":
        return "Подати заявку на грант";
      case "Конференція":
        return "Зареєструватися";
      default:
        return "Подати заявку";
    }
  };

  const metaItems = [
    {
      label: "Галузь науки",
      value: program.domain,
      icon: <Target size={18} />,
    },
    program.issn && {
      label: "ISSN",
      value: program.issn,
      icon: <Hash size={18} />,
    },
    program.impactFactor !== undefined &&
      program.type === "Науковий журнал" && {
        label: "Impact Factor",
        value: program.impactFactor || "0",
        icon: <Award size={18} />,
      },
    program.amount && {
      label: "Бюджет / Розмір",
      value: program.amount,
      icon: <DollarSign size={18} />,
    },
    program.location && {
      label: "Локація",
      value: program.location,
      icon: <MapPin size={18} />,
    },
    program.organizer && {
      label: "Організатор",
      value: program.organizer,
      icon: <Globe size={18} />,
    },
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-dark)] flex flex-col justify-between antialiased">
      <Toaster position="top-center" reverseOrder={false} />
      <Navbar />

      <main className="flex-grow pt-32 pb-24 px-4 md:px-6 relative overflow-hidden">
        <div className="absolute top-0 right-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/[0.03] blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-[300px] h-[300px] bg-purple-500/[0.02] blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[var(--text-gray)] hover:text-[var(--text-dark)] transition-colors mb-8"
          >
            <ArrowLeft
              size={14}
              className="transform group-hover:-translate-x-0.5 transition-transform"
            />
            Назад до списку
          </button>

          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[32px] shadow-xs overflow-hidden backdrop-blur-xs">
            <div className="p-6 sm:p-10 md:p-12 border-b border-[var(--border-color)] space-y-6 bg-gradient-to-br from-transparent to-purple-600/[0.01]">
              <div className="flex flex-wrap items-center gap-3">
                <span className="flex items-center gap-1.5 px-3 py-1 bg-purple-600/5 dark:bg-purple-500/10 border border-purple-500/15 rounded-xl text-[10px] font-black uppercase text-purple-600 dark:text-purple-400 tracking-wider">
                  {getTypeIcon(program.type)}
                  {program.type}
                </span>

                <span className="flex items-center gap-1.5 px-3 py-1 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl text-[10px] font-bold text-[var(--text-gray)] uppercase tracking-wider">
                  <Calendar
                    size={13}
                    className="text-purple-600 dark:text-purple-400"
                  />
                  Дедлайн:{" "}
                  <strong className="text-[var(--text-dark)]">
                    {program.deadline
                      ? new Date(program.deadline).toLocaleDateString("uk-UA")
                      : "TBA"}
                  </strong>
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[var(--text-dark)] uppercase tracking-tight leading-none italic">
                {program.title}
              </h1>

              {/* Короткий опис */}
              {program.shortDescription && (
                <p className="text-xs sm:text-sm text-[var(--text-gray)] leading-relaxed font-medium border-l-2 border-purple-500/30 pl-4 py-1">
                  {program.shortDescription}
                </p>
              )}
            </div>

            {metaItems.length > 0 && (
              <div className="bg-[var(--bg-main)]/40 border-b border-[var(--border-color)] p-6 sm:px-10">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {metaItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl flex items-center gap-3 group hover:border-purple-500/20 transition-all"
                    >
                      <div className="p-2 bg-[var(--bg-main)] border border-[var(--border-color)] text-purple-600 dark:text-purple-400 rounded-lg group-hover:scale-105 transition-transform shrink-0">
                        {item.icon}
                      </div>
                      <div className="min-w-0 flex-grow">
                        <div className="text-[9px] font-mono font-bold text-[var(--text-gray)] uppercase tracking-wider block opacity-70">
                          {item.label}
                        </div>
                        <div className="text-xs font-black text-[var(--text-dark)] uppercase tracking-wide truncate mt-0.5">
                          {item.value}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="p-6 sm:p-10 md:p-12 space-y-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-purple-600 dark:text-purple-400 font-mono">
                // Детальний опис та вимоги
              </h3>
              <div
                className="prose dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed text-[var(--text-dark)] opacity-95
      w-full overflow-hidden break-words whitespace-pre-wrap
      [&_p]:mb-4 [&_p]:break-words
      [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4
      [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-4
      [&_li]:mb-1 [&_li]:break-words
      [&_strong]:font-bold [&_strong]:text-purple-600 dark:[&_strong]:text-purple-400
      [&_h1]:text-lg [&_h1]:font-black [&_h1]:uppercase [&_h1]:mt-6 [&_h1]:mb-3
      [&_h2]:text-base [&_h2]:font-black [&_h2]:uppercase [&_h2]:mt-5 [&_h2]:mb-2
      [&_h3]:text-sm [&_h3]:font-bold [&_h3]:uppercase [&_h3]:mt-4 [&_h3]:mb-2"
                dangerouslySetInnerHTML={{
                  __html: program.description
                    ? program.description
                        .replace(/&nbsp;/g, " ")
                        .replace(/\u00a0/g, " ")
                    : "",
                }}
              />

              {program.externalLink && (
                <div className="pt-4">
                  <a
                    href={program.externalLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-bold text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 underline underline-offset-4 tracking-wide uppercase transition-colors"
                  >
                    Офіційне джерело платформи
                    <ExternalLink size={14} />
                  </a>
                </div>
              )}
            </div>

            <div className="p-6 sm:p-10 md:p-12 bg-gradient-to-b from-transparent to-purple-600/[0.03] dark:to-purple-600/[0.01] border-t border-[var(--border-color)] flex flex-col items-center gap-6">
              <button
                className="w-full md:w-auto bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 sm:px-16 sm:py-5 rounded-xl sm:rounded-2xl font-black text-base sm:text-lg shadow-xl shadow-purple-600/20 hover:shadow-purple-600/30 transition-all active:scale-[0.98] flex items-center justify-center gap-3 sm:gap-4 uppercase tracking-tight italic"
                onClick={handleApply}
              >
                <Send size={20} className="sm:size-[22px]" />
                {getButtonText()}
              </button>

              <div className="max-w-md w-full bg-purple-600/[0.04] dark:bg-purple-600/[0.02] border border-purple-500/15 rounded-2xl p-4 flex gap-3 items-start animate-in fade-in duration-300">
                <Info
                  size={16}
                  className="text-purple-600 dark:text-purple-400 shrink-0 mt-0.5"
                />
                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400 leading-tight">
                    Заявки приймаються автоматично
                  </p>
                  <p className="text-[11px] font-medium text-[var(--text-dark)] opacity-90 leading-normal">
                    Обробка менеджером платформи триває до 72 годин.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProgramDetails;
