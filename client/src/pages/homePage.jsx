/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import {
  ArrowUpRight,
  Calendar,
  Search,
  Zap,
  TrendingUp,
  Users,
  Globe2,
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

const parser = new DOMParser();
const stripHtml = (html) => {
  if (!html) return "";
  const doc = parser.parseFromString(html, "text/html");
  return doc.body.textContent || "";
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
    AOS.init({ duration: 1000, once: true });

    const fetchData = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
        const res = await axios.get(`${apiUrl}/api/programs`);
        if (Array.isArray(res.data)) setPrograms(res.data);
      } catch (err) {
        console.error("Помилка завантаження:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredPrograms = useMemo(() => {
    const today = new Date().setHours(0, 0, 0, 0);
    return programs.filter((p) => {
      const matchesSearch = (p.title || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
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

      <style>{`
        .rules-grid-bg {
          background-image: radial-gradient(var(--border-color) 1px, transparent 1px);
          background-size: 40px 40px;
          position: absolute;
          inset: 0; 
          opacity: 0.4; 
          z-index: 0;
        }
        .label-mono {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.2em;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          animation: marquee 30s linear infinite;
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        .filter-tab {
          text-align: left;
          font-size: 11px;
          font-weight: 900;
          white-space: nowrap;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          position: relative;
          padding: 8px 0;
          flex-shrink: 0;
        }
        .filter-tab::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background-color: #9333ea;
          transition: width 0.3s ease;
        }
        .filter-tab-active {
          color: #9333ea !important;
        }
        .filter-tab-active::after {
          width: 100%;
        }
      `}</style>

      <header className="relative pt-44 pb-32 px-6 border-b border-[var(--border-color)] overflow-hidden">
        <div className="rules-grid-bg" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-600/10 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none animate-pulse" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div
            className="flex flex-col items-center text-center mb-16"
            data-aos="fade-down"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/5 text-purple-600 mb-8">
              <Terminal size={14} />
              <span className="label-mono font-bold">
                Science Platform v2.0
              </span>
            </div>

            <h1 className="text-6xl lg:text-9xl font-black tracking-tighter text-[var(--text-dark)] leading-[1.15] uppercase italic">
              Досліджуй <br />
              <span className="text-purple-600">Публікуй</span> <br />
              Впливай
            </h1>

            <p className="mt-8 max-w-2xl mx-auto text-[var(--text-gray)] font-medium leading-relaxed italic text-lg md:text-xl">
              Глобальна екосистема для верифікації та розповсюдження цифрового
              наукового контенту.
            </p>
          </div>

          <div
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-15"
            data-aos="fade-up"
            data-aos-delay="400"
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
                className="p-8 border border-[var(--border-color)] bg-[var(--bg-card)]/30 backdrop-blur-sm hover:border-purple-600/50 transition-all group"
              >
                <div className="text-purple-600 mb-4 group-hover:scale-110 transition-transform">
                  {s.icon}
                </div>
                <div className="text-3xl font-black text-[var(--text-dark)] italic uppercase tracking-tighter">
                  {s.val}
                </div>
                <div className="label-mono opacity-60">{s.label}</div>
              </div>
            ))}
          </div>

          <div
            className="max-w-3xl mx-auto mb-20"
            data-aos="zoom-in"
            data-aos-delay="200"
          >
            <div className="relative group p-2 bg-[var(--bg-card)]/50 backdrop-blur-xl border border-[var(--border-color)] rounded-2xl focus-within:border-purple-600 transition-all shadow-2xl">
              <Search
                size={24}
                className="absolute left-6 top-1/2 -translate-y-1/2 text-[var(--text-gray)] group-focus-within:text-purple-600 transition-colors"
              />
              <input
                type="text"
                placeholder="Пошук за ключовими словами (AI, Quantum, Bio)..."
                className="w-full pl-16 pr-6 py-5 bg-transparent text-xl outline-none placeholder:text-gray-500 font-bold text-[var(--text-dark)]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-20">
        {/* Блок фільтрів */}
        <div className="mb-20 space-y-12" data-aos="fade-up">
          {/* Галузі */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2">
              <div className="w-1 h-4 bg-purple-600" />
              <span className="label-mono font-bold text-purple-600">
                Напрямок дослідження:
              </span>
            </div>
            <div className="flex items-center gap-x-8 overflow-x-auto no-scrollbar pb-4 border-b border-[var(--border-color)]">
              {domainsList.map((d) => (
                <button
                  key={d}
                  onClick={() => setSelectedDomain(d)}
                  className={`filter-tab ${selectedDomain === d ? "filter-tab-active" : "text-[var(--text-gray)] hover:text-[var(--text-dark)]"}`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Типи контенту */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2">
              <Layers size={14} className="text-purple-600" />
              <span className="label-mono font-bold text-purple-600">
                Тип контенту:
              </span>
            </div>
            <div className="flex items-center gap-x-8 overflow-x-auto no-scrollbar pb-4 border-b border-[var(--border-color)]">
              {typesList.map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedType(t)}
                  className={`filter-tab ${selectedType === t ? "filter-tab-active" : "text-[var(--text-gray)] hover:text-[var(--text-dark)]"}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40">
            <div className="w-12 h-12 border-2 border-purple-600/20 border-t-purple-600 rounded-full animate-spin mb-4" />
            <span className="label-mono font-bold">
              Синхронізуємо базу даних...
            </span>
          </div>
        ) : filteredPrograms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPrograms.map((prog, index) => {
              const diffDays = Math.ceil(
                (new Date(prog.deadline) - new Date()) / (1000 * 60 * 60 * 24),
              );
              const isUrgent = diffDays >= 0 && diffDays <= 7;

              return (
                <article
                  key={prog._id}
                  onClick={() => navigate(`/program/${prog._id}`)}
                  data-aos="fade-up"
                  data-aos-delay={index * 50}
                  className="group relative p-10 bg-[var(--bg-card)] border border-[var(--border-color)] cursor-pointer flex flex-col h-[500px] transition-all duration-500 hover:border-purple-600/50 hover:shadow-[0_30px_60px_rgba(124,58,237,0.08)]"
                >
                  <div className="absolute top-1 right-6 text-5xl font-black text-[var(--text-gray)] opacity-[0.03] group-hover:opacity-[0.15] transition-opacity italic">
                    {index + 1 < 10 ? `0${index + 1}` : index + 1}
                  </div>

                  <div className="flex justify-between items-start mb-8 mt-5 relative z-10">
                    <div className="flex flex-col gap-3">
                      <div className="flex flex-wrap gap-2 items-center">
                        <span className="label-mono !text-purple-600 font-bold bg-purple-600/5 px-2 py-1 rounded">
                          {prog.type || "Програма"}
                        </span>
                        {prog.type === "Науковий журнал" &&
                          prog.impactFactor > 0 && (
                            <span className="text-[9px] font-black bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 px-2 py-1 rounded uppercase tracking-tighter">
                              IF: {prog.impactFactor}
                            </span>
                          )}
                        {prog.type === "Грант" && prog.amount && (
                          <span className="text-[9px] font-black bg-amber-500/10 text-amber-600 border border-amber-500/20 px-2 py-1 rounded uppercase tracking-tighter">
                            💰 {prog.amount}
                          </span>
                        )}
                      </div>
                      <span className="text-[12px] font-bold text-[var(--text-gray)] uppercase tracking-widest">
                        {prog.domain}
                      </span>
                    </div>
                    <div className="p-2 border border-[var(--border-color)] group-hover:border-purple-600 transition-colors">
                      <ArrowUpRight
                        size={16}
                        className="text-[var(--text-gray)] group-hover:text-purple-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-4 mb-auto relative z-10">
                    <h3 className="text-2xl font-bold text-[var(--text-dark)] leading-tight uppercase italic group-hover:text-purple-600 transition-colors">
                      {prog.title}
                    </h3>
                    <p className="text-sm text-[var(--text-gray)] line-clamp-4 leading-relaxed font-medium italic">
                      {stripHtml(prog.description)}
                    </p>
                  </div>

                  <div className="pt-8 border-t border-[var(--border-color)] flex items-center justify-between mt-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[var(--bg-main)] border border-[var(--border-color)] flex items-center justify-center">
                        <Calendar size={12} className="text-purple-600" />
                      </div>
                      <div>
                        <div className="label-mono !text-[8px] opacity-60">
                          Дедлайн
                        </div>
                        <div className="text-xs font-black text-[var(--text-dark)] uppercase">
                          {prog.deadline
                            ? new Date(prog.deadline).toLocaleDateString(
                                "uk-UA",
                              )
                            : "TBA"}
                        </div>
                      </div>
                    </div>{" "}
                    {isUrgent && (
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-purple-600/15 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-600 animate-ping" />
                        <span className="text-[9px] font-black uppercase text-purple-600">
                          Термін спливає
                        </span>
                      </div>
                    )}
                    <Zap
                      size={16}
                      className="text-[var(--border-color)] group-hover:text-amber-500 transition-all"
                    />
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div
            className="py-40 text-center border border-dashed border-[var(--border-color)] bg-[var(--bg-card)]/50 backdrop-blur-sm rounded-3xl"
            data-aos="zoom-in"
          >
            <BookOpen size={48} className="mx-auto text-purple-600/50 mb-6" />
            <h4 className="text-2xl font-black text-[var(--text-dark)] uppercase italic tracking-tighter mb-2">
              Упс, порожньо
            </h4>
            <p className="label-mono opacity-80">
              За вашими параметрами нічого не знайдено.
            </p>
          </div>
        )}

        <section
          className="mt-40 p-12 md:p-24 border border-[var(--border-color)] relative overflow-hidden group rounded-[2.5rem] bg-[var(--bg-card)]/30 backdrop-blur-sm"
          data-aos="fade-up"
        >
          <div className="rules-grid-bg opacity-20" />
          <div className="absolute top-0 right-0 w-1/2 h-full bg-purple-600/5 -skew-x-12 translate-x-1/4 pointer-events-none transition-transform group-hover:scale-110" />

          <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 text-center lg:text-left">
              <div className="w-14 h-14 bg-purple-600 flex items-center justify-center text-white mx-auto lg:mx-0 shadow-lg shadow-purple-500/20">
                <Mail size={28} />
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-[var(--text-dark)] tracking-tighter uppercase italic leading-none">
                Науковий <br />{" "}
                <span className="text-purple-600">Дайджест</span>
              </h2>
              <p className="label-mono text-[var(--text-gray)] opacity-80">
                Будьте в курсі нових Open Science можливостей.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 relative">
              <input
                type="email"
                placeholder="ЕЛЕКТРОННА_ПОШТА"
                className="flex-grow bg-transparent border-b-2 border-[var(--border-color)] px-4 py-5 text-sm font-black outline-none focus:border-purple-600 transition-all text-[var(--text-dark)] placeholder:text-[var(--text-gray)]/50"
              />
              <button
                className="bg-purple-600 text-white px-10 py-5 text-[11px] font-black uppercase tracking-[0.3em] 
                   hover:bg-purple-700 dark:hover:bg-purple-500 
                   hover:shadow-[0_10px_20px_rgba(147,51,234,0.3)]
                   transition-all duration-300 shadow-xl active:scale-95 shrink-0"
              >
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
