/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";
import {
  ArrowUpRight,
  Calendar,
  Search,
  Zap,
  TrendingUp,
  Globe2,
  Users,
  Mail,
  Terminal,
  BookOpen,
  Layers,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AOS from "aos";
import "aos/dist/aos.css";

import { SCIENTIFIC_DOMAINS, PROGRAM_TYPES } from "../constants/domains";

// Оптимізована функція очищення HTML (швидша за DOMParser для рендерингу списків)
const stripHtmlFast = (html) => {
  if (!html) return "";
  return html.replace(/<\/?[^>]+(>|$)/g, "");
};

const HomePage = () => {
  const navigate = useNavigate();
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("Всі галузі");
  const [selectedType, setSelectedType] = useState("Всі типи");

  const domainsList = useMemo(() => ["Всі галузі", ...SCIENTIFIC_DOMAINS], []);
  const typesList = useMemo(() => ["Всі типи", ...PROGRAM_TYPES], []);

  useEffect(() => {
    AOS.init({ duration: 800, once: true, disable: "mobile" }); // вимикаємо AOS на мобілках для швидкості

    const fetchData = async () => {
      try {
        const res = await axiosInstance.get("/programs");
        if (Array.isArray(res.data)) {
          // Очищаємо HTML один раз при запиті, а не під час кожного рендеру картки!
          const cleanedPrograms = res.data.map((p) => ({
            ...p,
            cleanedDescription: stripHtmlFast(p.description),
          }));
          setPrograms(cleanedPrograms);
        }
      } catch (err) {
        console.error("Помилка завантаження даних:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredPrograms = useMemo(() => {
    const today = new Date().setHours(0, 0, 0, 0);
    const normalizedSearch = searchTerm.toLowerCase().trim();

    return programs.filter((p) => {
      const matchesSearch =
        !normalizedSearch ||
        (p.title || "").toLowerCase().includes(normalizedSearch);
      const matchesDomain =
        selectedDomain === "Всі галузі" || p.domain === selectedDomain;
      const matchesType =
        selectedType === "Всі типи" || p.type === selectedType;
      const deadlineDate = p.deadline ? new Date(p.deadline) : null;

      return (
        matchesSearch &&
        matchesDomain &&
        matchesType &&
        (deadlineDate ? deadlineDate >= today : true)
      );
    });
  }, [programs, searchTerm, selectedDomain, selectedType]);

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-300 overflow-x-hidden selection:bg-purple-600 selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <header className="relative pt-40 pb-24 px-6 border-b border-[var(--border-color)] overflow-hidden">
        {/* Заміна важкого radial-gradient на легкий CSS паттерн через Tailwind */}
        <div className="absolute inset-0 opacity-25 pointer-events-none z-0 bg-[radial-gradient(var(--border-color)_1px,transparent_1px)] [background-size:32px_32px]" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div
            className="flex flex-col items-center text-center mb-12"
            data-aos="fade-down"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/20 bg-purple-500/5 text-purple-600 mb-6">
              <Terminal size={12} />
              <span className="font-mono text-[10px] font-bold uppercase tracking-widest">
                Science Platform v2.0
              </span>
            </div>

            <h1 className="text-5xl lg:text-8xl font-black tracking-tight text-[var(--text-dark)] leading-none uppercase italic">
              Досліджуй <br />
              <span className="text-purple-600">Публікуй</span> <br />
              Впливай
            </h1>

            <p className="mt-6 max-w-xl mx-auto text-[var(--text-gray)] font-medium leading-relaxed italic text-base md:text-lg">
              Глобальна екосистема для верифікації та розповсюдження цифрового
              наукового контенту.
            </p>
          </div>

          {/* Статистика */}
          <div
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
            data-aos="fade-up"
          >
            {[
              {
                icon: <TrendingUp size={16} />,
                label: "Наукових програм",
                val: filteredPrograms.length,
              },
              { icon: <Globe2 size={16} />, label: "Країн", val: "24" },
              { icon: <Users size={16} />, label: "Науковців", val: "3k+" },
              {
                icon: <Zap size={16} />,
                label: "Галузей",
                val: SCIENTIFIC_DOMAINS.length,
              },
            ].map((s, i) => (
              <div
                key={i}
                className="p-6 border border-[var(--border-color)] bg-[var(--bg-card)]/20 backdrop-blur-sm transition-all hover:border-purple-600/40"
              >
                <div className="text-purple-600 mb-2">{s.icon}</div>
                <div className="text-2xl font-black text-[var(--text-dark)] italic uppercase tracking-tighter">
                  {s.val}
                </div>
                <div className="font-mono text-[9px] uppercase tracking-wider opacity-60 mt-1">
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* Пошуковий інпут */}
          <div className="max-w-2xl mx-auto" data-aos="zoom-in">
            <div className="relative p-1.5 bg-[var(--bg-card)]/40 backdrop-blur-md border border-[var(--border-color)] rounded-xl focus-within:border-purple-600/80 transition-all">
              <Search
                size={20}
                className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--text-gray)]"
              />
              <input
                type="text"
                placeholder="Пошук за ключовими словами (AI, Quantum)..."
                className="w-full pl-12 pr-4 py-3.5 bg-transparent text-lg outline-none placeholder:text-gray-500/70 font-bold text-[var(--text-dark)]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Головний контент */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        {/* Блок фільтрів без тегів <style> */}
        <div className="mb-16 space-y-10" data-aos="fade-up">
          {/* Галузі */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="w-1 h-3.5 bg-purple-600" />
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-purple-600">
                Напрямок дослідження:
              </span>
            </div>
            <div className="flex items-center gap-x-6 overflow-x-auto pb-3 border-b border-[var(--border-color)] scrollbar-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {domainsList.map((d) => (
                <button
                  key={d}
                  onClick={() => setSelectedDomain(d)}
                  className={`text-[11px] font-black uppercase tracking-widest whitespace-nowrap pb-2 transition-all relative ${
                    selectedDomain === d
                      ? "text-purple-600 after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-purple-600"
                      : "text-[var(--text-gray)] hover:text-[var(--text-dark)]"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Типи */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Layers size={12} className="text-purple-600" />
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-purple-600">
                Тип контенту:
              </span>
            </div>
            <div className="flex items-center gap-x-6 overflow-x-auto pb-3 border-b border-[var(--border-color)] scrollbar-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {typesList.map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedType(t)}
                  className={`text-[11px] font-black uppercase tracking-widest whitespace-nowrap pb-2 transition-all relative ${
                    selectedType === t
                      ? "text-purple-600 after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-purple-600"
                      : "text-[var(--text-gray)] hover:text-[var(--text-dark)]"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Списочна частина */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="w-10 h-10 border-2 border-purple-600/20 border-t-purple-600 rounded-full animate-spin mb-4" />
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest opacity-70">
              Синхронізуємо базу даних...
            </span>
          </div>
        ) : filteredPrograms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrograms.map((prog, index) => {
              const diffDays = Math.ceil(
                (new Date(prog.deadline) - new Date()) / (1000 * 60 * 60 * 24),
              );
              const isUrgent = diffDays >= 0 && diffDays <= 7;

              return (
                <article
                  key={prog._id}
                  onClick={() => navigate(`/program/${prog._id}`)}
                  className="group relative p-8 bg-[var(--bg-card)] border border-[var(--border-color)] cursor-pointer flex flex-col h-[460px] transition-all duration-300 hover:border-purple-600/40 will-change-transform hover:-translate-y-1"
                >
                  <div className="absolute top-2 right-6 text-4xl font-black text-[var(--text-gray)] opacity-[0.03] group-hover:opacity-[0.1] transition-opacity italic">
                    {index + 1 < 10 ? `0${index + 1}` : index + 1}
                  </div>

                  <div className="flex justify-between items-start mb-6 mt-2">
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-wrap gap-1.5 items-center">
                        <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-purple-600 bg-purple-600/5 px-2 py-0.5 rounded">
                          {prog.type || "Програма"}
                        </span>
                        {prog.type === "Науковий журнал" &&
                          prog.impactFactor > 0 && (
                            <span className="text-[9px] font-black bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 px-1.5 py-0.5 rounded">
                              IF: {prog.impactFactor}
                            </span>
                          )}
                        {prog.type === "Грант" && prog.amount && (
                          <span className="text-[9px] font-black bg-amber-500/10 text-amber-600 border border-amber-500/20 px-1.5 py-0.5 rounded">
                            💰 {prog.amount}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-bold text-[var(--text-gray)] uppercase tracking-wider">
                        {prog.domain}
                      </span>
                    </div>
                    <div className="p-2 border border-[var(--border-color)] group-hover:border-purple-600 transition-colors">
                      <ArrowUpRight
                        size={14}
                        className="text-[var(--text-gray)] group-hover:text-purple-600 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-3 mb-auto">
                    <h3 className="text-xl font-bold text-[var(--text-dark)] leading-tight uppercase italic group-hover:text-purple-600 transition-colors line-clamp-2">
                      {prog.title}
                    </h3>
                    <p className="text-xs text-[var(--text-gray)] line-clamp-4 leading-relaxed italic font-medium">
                      {prog.cleanedDescription}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-[var(--border-color)] flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-[var(--bg-main)] border border-[var(--border-color)] flex items-center justify-center">
                        <Calendar size={11} className="text-purple-600" />
                      </div>
                      <div>
                        <div className="font-mono text-[8px] opacity-50 uppercase">
                          Дедлайн
                        </div>
                        <div className="text-[11px] font-black text-[var(--text-dark)] uppercase">
                          {prog.deadline
                            ? new Date(prog.deadline).toLocaleDateString(
                                "uk-UA",
                              )
                            : "TBA"}
                        </div>
                      </div>
                    </div>

                    {isUrgent && (
                      <div className="flex items-center gap-1 px-2.5 py-0.5 bg-purple-600/10 rounded-full">
                        <span className="w-1 h-1 rounded-full bg-purple-600 animate-ping" />
                        <span className="text-[8px] font-black uppercase text-purple-600">
                          Спливає
                        </span>
                      </div>
                    )}
                    <Zap
                      size={14}
                      className="text-[var(--border-color)] group-hover:text-amber-500 transition-colors"
                    />
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div
            className="py-24 text-center border border-dashed border-[var(--border-color)] bg-[var(--bg-card)]/20 rounded-2xl"
            data-aos="zoom-in"
          >
            <BookOpen size={40} className="mx-auto text-purple-600/40 mb-4" />
            <h4 className="text-xl font-black text-[var(--text-dark)] uppercase italic mb-1">
              Упс, порожньо
            </h4>
            <p className="font-mono text-[9px] uppercase tracking-wider opacity-60">
              За вашими параметрами нічого не знайдено.
            </p>
          </div>
        )}

        {/* Секція підписки */}
        <section
          className="mt-32 p-8 md:p-16 border border-[var(--border-color)] relative overflow-hidden rounded-[2rem] bg-[var(--bg-card)]/10"
          data-aos="fade-up"
        >
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(var(--border-color)_1px,transparent_1px)] [background-size:32px_32px]" />
          <div className="absolute top-0 right-0 w-1/3 h-full bg-purple-600/[0.02] -skew-x-12 translate-x-1/4 pointer-events-none" />

          <div className="relative z-10 grid lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4 text-center lg:text-left">
              <div className="w-12 h-12 bg-purple-600 flex items-center justify-center text-white mx-auto lg:mx-0 shadow-md shadow-purple-500/15">
                <Mail size={22} />
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-[var(--text-dark)] tracking-tight uppercase italic leading-none">
                Науковий <br />{" "}
                <span className="text-purple-600">Дайджест</span>
              </h2>
              <p className="font-mono text-[9px] uppercase tracking-wider text-[var(--text-gray)]">
                Будьте в курсі нових Open Science можливостей.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="ЕЛЕКТРОННА_ПОШТА"
                className="flex-grow bg-transparent border-b border-[var(--border-color)] px-2 py-4 text-xs font-black outline-none focus:border-purple-600 transition-all text-[var(--text-dark)] placeholder:text-[var(--text-gray)]/40"
              />
              <button className="bg-purple-600 text-white px-8 py-4 text-[10px] font-black uppercase tracking-[0.25em] hover:bg-purple-700 transition-all active:scale-95 shrink-0">
                ПІДПИСАТИСЯ
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
