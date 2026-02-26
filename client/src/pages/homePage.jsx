import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  ArrowRight, Calendar, Search,
  BookOpen, TrendingUp, Tag, Sparkles
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../index.css';

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
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("Всі галузі");

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const res = await axios.get('http://51.21.180.152/api/programs');

        if (Array.isArray(res.data)) {
          setPrograms(res.data);
        }
      } catch (err) {
        console.error("Помилка завантаження програм", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPrograms();
  }, []);

  const filteredPrograms = programs.filter(p => {
    const title = p.title || "";
    const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDomain = selectedDomain === "Всі галузі" || p.domain === selectedDomain;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadlineDate = p.deadline ? new Date(p.deadline) : null;

    const isNotExpired = deadlineDate ? deadlineDate >= today : true;

    return matchesSearch && matchesDomain && isNotExpired;
  });

  return (
    <div className="home-wrapper">
      <Navbar />

      <header className="hero-section">
        <div className="hero-container">
          <div className="badge-hero">
            <Sparkles size={14} /> Платформа 2026
          </div>
          <h1 className="hero-main-title">
            Відкривайте нові горизонти <span className="text-purple-accent">науки</span>
          </h1>
          <p className="hero-sub-text">
            Єдина екосистема для моніторингу наукових публікацій. Подавайте роботи та отримуйте рецензії в один клік.
          </p>

          <div className="search-glass-container">
            <Search size={20} className="text-[#6d28d9]" />
            <input
              type="text"
              placeholder="Пошук програм за назвою..."
              className="search-input-field"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </header>

      <div className="stats-bar">
        <div className="stat-pill">
          <TrendingUp size={18} className="text-[#6d28d9]" />
          {/* Показуємо кількість саме активних програм */}
          <span className="font-bold">{filteredPrograms.length} актуальних програм</span>
        </div>
        <div className="stat-pill">
          <BookOpen size={18} className="text-[#6d28d9]" />
          <span className="font-bold">450+ дослідників</span>
        </div>
      </div>

      <main className="main-content">
        <div className="content-header">
          <h2 className="section-title">Актуальні пропозиції</h2>

          <div className="filter-wrapper">
            <Tag size={18} className="filter-icon text-[#6d28d9]" />
            <select
              className="domain-filter-select"
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
            >
              {DOMAINS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="loader-container">
            <div className="custom-loader border-[#6d28d9]"></div>
            <p className="mt-4 font-bold text-gray-500">Завантаження програм...</p>
          </div>
        ) : (
          <div className="programs-grid">
            {filteredPrograms.map((prog) => {
              // Логіка підсвітки термінових програм
              const today = new Date();
              const deadline = new Date(prog.deadline);
              const diffTime = deadline - today;
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              const isUrgent = diffDays >= 0 && diffDays <= 3;

              return (
                <div key={prog._id} className="program-card group">
                  <div className="card-top">
                    <div className="badge-group">
                      <span className="cat-badge">{prog.category || 'Наука'}</span>
                      <span className="dom-badge">
                        <Tag size={10} /> {prog.domain || 'Загальна'}
                      </span>
                    </div>
                    <div className={`status-indicator ${isUrgent ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                      {isUrgent ? 'Завершується' : 'Активна'}
                    </div>
                  </div>

                  <h3 className="card-program-title group-hover:text-[#6d28d9] transition-colors">
                    {prog.title}
                  </h3>
                  <p className="card-program-desc">
                    {stripHtmlAndTruncate(prog.description, 160)}
                  </p>

                  <div className="card-divider" />

                  <div className="card-bottom">
                    <div className="deadline-info">
                      <Calendar size={14} className={isUrgent ? "text-rose-500 animate-pulse" : "text-gray-400"} />
                      <span className={`font-bold ${isUrgent ? "text-rose-600" : "text-gray-600"}`}>
                        до {prog.deadline ? new Date(prog.deadline).toLocaleDateString() : '---'}
                      </span>
                    </div>
                    <button
                      className="details-btn"
                      onClick={() => navigate(`/program/${prog._id}`)}
                    >
                      Деталі <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && filteredPrograms.length === 0 && (
          <div className="empty-results flex flex-col items-center py-20 opacity-40">
            <Search size={64} className="mb-4" />
            <p className="text-xl font-black uppercase tracking-widest text-center px-4">
              Наразі немає активних програм за цим запитом
            </p>
            <button
              onClick={() => { setSearchTerm(""); setSelectedDomain("Всі галузі"); }}
              className="mt-4 text-[#6d28d9] underline font-bold hover:opacity-70 transition-all"
            >
              Показати всі активні пропозиції
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;