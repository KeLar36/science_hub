/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useMemo } from "react";
import {
  BookOpen,
  Loader2,
  Sparkles,
  SlidersHorizontal,
  Layers,
} from "lucide-react";
import axiosInstance from "../api/axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import UniversalFilters from "../components/UniversalFilters";
import UniversalCard from "../components/ui/UniversalCard";
import { Pagination } from "../components/ui/Pagination";
import { SCIENTIFIC_DOMAINS, PROGRAM_TYPES } from "../constants/domains";

const ProgramsPage = () => {
  const [items, setItems] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("Всі галузі");
  const [selectedType, setSelectedType] = useState("Всі типи");

  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const fetchOrgs = async () => {
      try {
        const res = await axiosInstance.get("/organizations/public/list");
        setOrganizations(res.data || []);
      } catch (err) {
        console.error("💥 Не вдалося завантажити організації:", err);
      }
    };
    fetchOrgs();
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, selectedDomain, selectedType]);

  // 4. Головна функція запиту програм
  const fetchPrograms = async (
    currentPage,
    currentSearch,
    currentType,
    currentDomain,
  ) => {
    try {
      setLoading(true);
      let url = `/programs?page=${currentPage}&limit=9`;

      if (currentSearch.trim()) {
        url += `&search=${encodeURIComponent(currentSearch.trim())}`;
      }
      if (currentType !== "Всі типи") {
        url += `&type=${encodeURIComponent(currentType)}`;
      }
      if (currentDomain !== "Всі галузі") {
        url += `&domain=${encodeURIComponent(currentDomain)}`;
      }

      const res = await axiosInstance.get(url);
      setItems(res.data.programs || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error("💥 Помилка завантаження програм:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms(page, debouncedSearch, selectedType, selectedDomain);
  }, [page, debouncedSearch, selectedType, selectedDomain]);

  // Розрахунок терміновості (дедлайнів)
  const programsWithUrgency = useMemo(() => {
    const now = new Date();
    return items.map((prog) => {
      if (!prog.deadline) return { ...prog, isUrgent: false };

      const deadlineDate = new Date(prog.deadline);
      const diffTime = deadlineDate - now;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const isUrgent = diffDays >= 0 && diffDays <= 7;

      return { ...prog, isUrgent };
    });
  }, [items]);

  const filterDropdowns = [
    {
      value: selectedType,
      onChange: setSelectedType,
      options: ["Всі типи", ...PROGRAM_TYPES],
    },
    {
      value: selectedDomain,
      onChange: setSelectedDomain,
      options: ["Всі галузі", ...SCIENTIFIC_DOMAINS],
    },
  ];

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedType("Всі типи");
    setSelectedDomain("Всі галузі");
    setPage(1);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-main)] font-['Plus_Jakarta_Sans',_sans-serif] text-[var(--text-dark)] transition-colors duration-300 text-left selection:bg-purple-600 selection:text-white">
      <Navbar />

      <main className="flex-grow pt-40 pb-24 px-4 md:px-6 relative">
        <div className="absolute inset-0 opacity-25 pointer-events-none z-0 bg-[radial-gradient(var(--border-color)_1px,transparent_1px)] [background-size:32px_32px]" />
        <div className="absolute top-40 left-1/4 w-96 h-96 bg-purple-600/[0.02] blur-[130px] rounded-full z-0 pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 flex flex-col gap-8">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 border-b border-[var(--border-color)]/60 pb-8 w-full">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-600/10 border border-purple-500/20 text-purple-600 rounded-xl text-[10px] font-black uppercase tracking-widest font-mono">
                <Layers size={11} /> Навігатор можливостей
              </div>
              <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight leading-none">
                Наукові{" "}
                <span className="text-purple-600 dark:text-purple-400">
                  програми
                </span>
              </h1>
              <p className="text-xs md:text-sm font-medium text-[var(--text-gray)] leading-relaxed opacity-95">
                Досліджуйте актуальні міжнародні гранти, верифіковані фахові
                видання, наукові конференції та програми стажування, інтегровані
                в єдиний реєстр.
              </p>
            </div>

            <div className="flex gap-4 font-mono text-[10px] uppercase text-[var(--text-gray)] font-bold tracking-wider shrink-0 bg-[var(--bg-card)]/50 border border-[var(--border-color)] p-4 rounded-2xl backdrop-blur-xs">
              <div className="text-left">
                <span className="block text-[var(--text-dark)] font-black text-sm leading-none mb-1">
                  {items.length}
                </span>
                <span>На екрані</span>
              </div>
              <div className="w-px bg-[var(--border-color)] h-8" />
              <div className="text-left">
                <span className="block text-purple-600 font-black text-sm leading-none mb-1">
                  {organizations.length}
                </span>
                <span>Установ</span>
              </div>
            </div>
          </div>

          <UniversalFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            searchPlaceholder="Пошук можливостей за назвою, тегами або закладом..."
            dropdowns={filterDropdowns}
            onReset={handleResetFilters}
          />

          {loading ? (
            <div className="flex justify-center items-center py-32">
              <Loader2 className="w-9 h-9 animate-spin text-purple-600" />
            </div>
          ) : programsWithUrgency.length === 0 ? (
            <div className="py-28 text-center border border-dashed border-[var(--border-color)] bg-[var(--bg-card)]/10 rounded-3xl max-w-7xl w-full">
              <BookOpen size={40} className="mx-auto text-purple-600/20 mb-4" />
              <h4 className="text-base font-black text-[var(--text-dark)] uppercase tracking-tight mb-1">
                Параметри пошуку пусті
              </h4>
              <p className="font-mono text-[9px] uppercase tracking-wider text-[var(--text-gray)] opacity-80">
                За вказаними фільтрами жодної наукової програми не знайдено.
                Спробуйте скинути налаштування.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-10 w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-[fadeIn_0.4s_ease-out_forwards]">
                {programsWithUrgency.map((p, index) => (
                  <UniversalCard
                    key={p._id}
                    item={p}
                    variant="homeProgram"
                    index={index}
                    isUrgent={p.isUrgent}
                  />
                ))}
              </div>

              {/* Блок пагінації */}
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProgramsPage;
