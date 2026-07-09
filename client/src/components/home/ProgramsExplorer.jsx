/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useMemo } from "react";
import { BookOpen, Loader2 } from "lucide-react";
import axiosInstance from "../../api/axios"; // підкоригуй шлях, якщо потрібно
import UniversalFilters from "../UniversalFilters";
import UniversalCard from "../ui/UniversalCard";
import { Pagination } from "../ui/Pagination";
import { SCIENTIFIC_DOMAINS, PROGRAM_TYPES } from "../../constants/domains";

const ProgramsExplorer = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("Всі галузі");
  const [selectedType, setSelectedType] = useState("Всі типи");

  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPage(1);
    }, 400);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    setPage(1);
  }, [selectedDomain, selectedType]);

  const fetchPrograms = async (currentPage) => {
    try {
      setLoading(true);

      let url = `/programs?page=${currentPage}&limit=9`;

      if (debouncedSearch.trim()) {
        url += `&search=${encodeURIComponent(debouncedSearch.trim())}`;
      }
      if (selectedType !== "Всі типи") {
        url += `&type=${encodeURIComponent(selectedType)}`;
      }
      if (selectedDomain !== "Всі галузі") {
        url += `&domain=${encodeURIComponent(selectedDomain)}`;
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
    fetchPrograms(page);
  }, [page, debouncedSearch, selectedDomain, selectedType]);

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
    <section className="max-w-7xl mx-auto px-4 md:px-6 py-16 flex flex-col gap-8">
      <div>
        <h2 className="text-xl font-black uppercase tracking-tight text-[var(--text-dark)] text-left">
          ⚡ Актуальні можливості
        </h2>
      </div>

      <UniversalFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        searchPlaceholder="Пошук можливостей за назвою або організацією..."
        dropdowns={filterDropdowns}
        onReset={handleResetFilters}
      />

      {loading ? (
        <div className="flex justify-center items-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        </div>
      ) : programsWithUrgency.length === 0 ? (
        <div className="py-24 text-center border border-dashed border-[var(--border-color)] bg-[var(--bg-card)]/10 rounded-2xl">
          <BookOpen size={36} className="mx-auto text-purple-600/30 mb-4" />
          <h4 className="text-lg font-bold text-[var(--text-dark)] uppercase mb-1">
            Упс, порожньо
          </h4>
          <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-gray)] opacity-80">
            За вашими параметрами нічого не знайдено.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-[fadeIn_0.5s_ease-out_forwards]">
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

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      )}
    </section>
  );
};

export default ProgramsExplorer;
