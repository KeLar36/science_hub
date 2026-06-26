import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen } from "lucide-react";
import UniversalFilters from "../UniversalFilters";
import HomeProgramCard from "./HomeProgramCard";

const ProgramsExplorer = ({
  searchTerm,
  setSearchTerm,
  filterDropdowns,
  handleResetFilters,
  loading,
  filteredPrograms,
}) => {
  const navigate = useNavigate();

  const programsWithUrgency = useMemo(() => {
    const now = new Date();
    return filteredPrograms.map((prog) => {
      if (!prog.deadline) return { ...prog, isUrgent: false };

      const deadlineDate = new Date(prog.deadline);
      const diffTime = deadlineDate - now;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      const isUrgent = diffDays >= 0 && diffDays <= 7;

      return { ...prog, isUrgent };
    });
  }, [filteredPrograms]);

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 py-16">
      <div className="mb-8">
        <h2 className="text-xl font-black uppercase tracking-tight text-[var(--text-dark)]">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="bg-[var(--bg-card)] border border-[var(--border-color)] p-6 rounded-3xl h-[440px] animate-pulse flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-20 h-4 bg-[var(--border-color)] rounded-md opacity-60" />
                <div className="w-full h-6 bg-[var(--border-color)] rounded-md opacity-60" />
                <div className="w-3/4 h-4 bg-[var(--border-color)] rounded-md opacity-40" />
              </div>
              <div className="w-full h-10 bg-[var(--border-color)] rounded-xl opacity-40" />
            </div>
          ))}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-[fadeIn_0.5s_ease-out_forwards]">
          {programsWithUrgency.map((p, index) => (
            <HomeProgramCard
              key={p._id}
              p={p}
              index={index}
              isUrgent={p.isUrgent}
              onClick={() => navigate(`/program/${p._id}`)}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default ProgramsExplorer;
