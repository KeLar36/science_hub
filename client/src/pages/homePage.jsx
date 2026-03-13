import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import {
  ArrowRight, Calendar, Search,
  BookOpen, TrendingUp, Tag, Sparkles, FilterX
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const DOMAINS = [
  "Всі галузі", "Штучний інтелект & IT", "Медицина та фармація",
  "Економіка та фінанси", "Право та юриспруденція", "Природничі науки",
  "Гуманітарні науки", "Технічні науки & Інженерія"
];

const stripHtmlAndTruncate = (html, limit) => {
  if (!html) return "";
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const text = doc.body.textContent || "";
  return text.length > limit ? text.substring(0, limit) + "..." : text;
};

const HomePage = () => {
  const navigate = useNavigate();
  const [programs, setPrograms] = useState([]);
  const [usersCount, setUsersCount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("Всі галузі");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

        const [programsRes, usersRes] = await Promise.all([
          axios.get(`${apiUrl}/api/programs`),
          axios.get(`${apiUrl}/api/users/count`).catch(() => ({ data: { count: 0 } }))
        ]);

        if (Array.isArray(programsRes.data)) {
          setPrograms(programsRes.data);
        }

        setUsersCount(usersRes.data.count);
      } catch (err) {
        console.error("Помилка синхронізації даних", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredPrograms = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return programs.filter(p => {
      const matchesSearch = (p.title || "").toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDomain = selectedDomain === "Всі галузі" || p.domain === selectedDomain;
      const deadlineDate = p.deadline ? new Date(p.deadline) : null;
      const isNotExpired = deadlineDate ? deadlineDate >= today : true;

      return matchesSearch && matchesDomain && isNotExpired;
    });
  }, [programs, searchTerm, selectedDomain]);

  return (
    <div className="min-h-screen bg-[var(--bg-main)] transition-colors duration-500">
      <Navbar />

      <header className="relative pt-32 pb-20 px-6 overflow-hidden bg-[var(--bg-card)] border-b border-[var(--border-color)]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(109,40,217,0.05)_0%,transparent_70%)]" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 text-purple-600 text-xs font-black uppercase tracking-widest mb-8 border border-purple-100"
            data-aos="fade-down"
          >
            <Sparkles size={14} /> Платформа 2026
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-[var(--text-dark)] leading-[1.1] mb-8" data-aos="fade-up" data-aos-delay="200">
            Відкривайте нові горизонти <span className="text-[#6d28d9] inline-block hover:scale-105 transition-transform cursor-default">науки</span>
          </h1>

          <p className="text-[var(--text-gray)] text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed" data-aos="fade-up" data-aos-delay="400">
            Єдина екосистема для моніторингу наукових публікацій. Подавайте роботи та отримуйте рецензії в один клік.
          </p>

          <div className="max-w-2xl mx-auto relative group" data-aos="zoom-in" data-aos-delay="600">
            <Search size={22} className="absolute left-5 top-1/2 -translate-y-1/2 text-[var(--text-gray)] group-focus-within:text-[#6d28d9] transition-colors" />
            <input
              type="text"
              placeholder="Пошук програм за назвою..."
              className="w-full pl-14 pr-6 py-5 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-[24px] text-[var(--text-dark)] font-bold shadow-xl shadow-purple-500/5 focus:ring-4 focus:ring-purple-500/10 transition-all outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 -mt-8 relative z-20">
        <div className="flex flex-wrap justify-center gap-4" data-aos="fade-up">
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] px-6 py-3 rounded-2xl shadow-lg flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-[#6d28d9]">
              <TrendingUp size={18} />
            </div>
            <span className="font-black text-sm text-[var(--text-dark)]">{filteredPrograms.length} Актуальних програм</span>
          </div>
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] px-6 py-3 rounded-2xl shadow-lg flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600">
              <BookOpen size={18} />
            </div>
            <span className="font-black text-sm text-[var(--text-dark)]">
              {usersCount !== null ? `${usersCount} Дослідників` : 'Завантаження...'}
            </span>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12" data-aos="fade-right">
          <div>
            <h2 className="text-3xl font-black text-[var(--text-dark)] mb-2">Актуальні пропозиції</h2>
            <p className="text-[var(--text-gray)] text-sm font-medium italic">Знайдіть свій наступний грант або конференцію</p>
          </div>

          <div className="relative min-w-[240px]">
            <Tag size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6d28d9]" />
            <select
              className="w-full pl-10 pr-4 py-3 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl font-bold text-sm text-[var(--text-dark)] outline-none focus:border-[#6d28d9] transition-all cursor-pointer appearance-none"
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
            >
              {DOMAINS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="w-16 h-16 border-4 border-purple-500/10 border-t-[#6d28d9] rounded-full animate-spin mb-6"></div>
            <p className="font-black text-[var(--text-gray)] tracking-tighter">СИНХРОНІЗАЦІЯ БАЗИ ДАНИХ...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPrograms.map((prog, index) => {
              const diffDays = Math.ceil((new Date(prog.deadline) - new Date()) / (1000 * 60 * 60 * 24));
              const isUrgent = diffDays >= 0 && diffDays <= 3;

              return (
                <div
                  key={prog._id}
                  className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[32px] p-6 flex flex-col hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 group relative overflow-hidden"
                  data-aos="fade-up"
                  data-aos-delay={(index % 4) * 100}
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex flex-col gap-2">
                      <span className="px-3 py-1 bg-purple-500/10 text-[#6d28d9] text-[10px] font-black rounded-lg uppercase">
                        {prog.category || 'Наука'}
                      </span>
                    </div>
                    <div className={`px-2 py-1 rounded-md text-[9px] font-black uppercase border ${isUrgent ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                      }`}>
                      {isUrgent ? 'Завершується' : 'Активна'}
                    </div>
                  </div>

                  <h3 className="text-xl font-black text-[var(--text-dark)] mb-4 line-clamp-2 leading-snug group-hover:text-[#6d28d9] transition-colors">
                    {prog.title}
                  </h3>

                  <p className="text-[var(--text-gray)] text-xs leading-relaxed mb-8 flex-grow opacity-80">
                    {stripHtmlAndTruncate(prog.description, 120)}
                  </p>

                  <div className="flex items-center justify-between pt-6 border-t border-[var(--border-color)]">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className={isUrgent ? "text-rose-500 animate-pulse" : "text-[var(--text-gray)]"} />
                      <span className={`text-[11px] font-black ${isUrgent ? "text-rose-600" : "text-[var(--text-dark)]"}`}>
                        до {prog.deadline ? new Date(prog.deadline).toLocaleDateString() : '---'}
                      </span>
                    </div>

                    <button
                      className="w-10 h-10 rounded-full bg-[var(--bg-main)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-dark)] hover:bg-[#6d28d9] hover:text-white transition-all transform group-hover:rotate-[-45deg]"
                      onClick={() => navigate(`/program/${prog._id}`)}
                    >
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && filteredPrograms.length === 0 && (
          <div className="text-center py-32 bg-[var(--bg-card)] rounded-[40px] border border-[var(--border-color)] border-dashed" data-aos="zoom-in">
            <div className="w-20 h-20 bg-[var(--bg-main)] rounded-full flex items-center justify-center mx-auto mb-6 text-[var(--text-gray)]">
              <FilterX size={40} />
            </div>
            <p className="text-xl font-black text-[var(--text-dark)] uppercase mb-4 tracking-tighter">Нічого не знайдено</p>
            <button
              onClick={() => { setSearchTerm(""); setSelectedDomain("Всі галузі"); }}
              className="px-8 py-3 bg-[#6d28d9] text-white rounded-xl font-black text-sm hover:scale-105 transition-transform"
            >
              Скинути фільтри
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;