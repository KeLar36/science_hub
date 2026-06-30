import React, { useState, useMemo } from "react";
import UniversalFilters from "../../../components/UniversalFilters";
import Pagination from "../../../components/Pagination";
import { FileDown, User, ShieldCheck, CheckCircle2, Clock } from "lucide-react";

export default function OrgProjectsTab({
  projects = [],
  onUpdateStatus,
  onAssignReviewer,
  users = [],
  loadingAction,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("Всі статуси");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Вифільтровуємо колег, які мають статус рецензента
  const reviewersList = useMemo(
    () => users.filter((u) => u.role === "reviewer"),
    [users],
  );

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchesSearch =
        p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.authorId?.name?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        filterStatus === "Всі статуси" || p.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [projects, searchTerm, filterStatus]);

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const paginatedProjects = useMemo(() => {
    const offset = (currentPage - 1) * itemsPerPage;
    return filteredProjects.slice(offset, offset + itemsPerPage);
  }, [filteredProjects, currentPage]);

  const getStatusStyle = (status) => {
    switch (status) {
      case "Прийнято":
        return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
      case "На розгляді":
        return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      case "Відхилено":
        return "bg-red-500/10 text-red-600 border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-500/20";
    }
  };

  return (
    <div className="space-y-4 text-left">
      <UniversalFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Пошук дослідження за назвою або автором..."
        filters={[
          {
            id: "status",
            label: "Статус",
            value: filterStatus,
            onChange: setFilterStatus,
            options: ["Всі статуси", "На розгляді", "Прийнято", "Відхилено"],
          },
        ]}
      />

      <div className="grid grid-cols-1 gap-4">
        {paginatedProjects.length === 0 ? (
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl p-12 text-center text-sm text-[var(--text-gray)] font-medium">
            🔍 Наукових праць за обраними критеріями не виявлено.
          </div>
        ) : (
          paginatedProjects.map((p) => (
            <div
              key={p._id}
              className="bg-[var(--bg-card)] border border-[var(--border-color)] p-6 rounded-3xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden"
            >
              <div className="space-y-3 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 border text-[9px] font-black uppercase tracking-wider rounded-md ${getStatusStyle(p.status)}`}
                  >
                    {p.status}
                  </span>
                  <span className="text-[10px] font-bold text-[var(--text-gray)] bg-[var(--bg-main)] px-2 py-0.5 rounded-md border border-[var(--border-color)] uppercase">
                    {p.domain || "Загальна галузь"}
                  </span>
                </div>

                <h4 className="text-base font-black text-[var(--text-dark)] leading-tight">
                  {p.title}
                </h4>
                <p className="text-xs text-[var(--text-gray)] font-semibold flex items-center gap-1">
                  <User size={13} className="text-purple-500" /> Автор:{" "}
                  <span className="text-[var(--text-dark)]">
                    {p.authorId?.name || "Невідомий автор"}
                  </span>
                </p>

                {p.programId && (
                  <div className="text-[11px] font-bold text-purple-600 bg-purple-500/5 border border-purple-500/10 px-3 py-1.5 rounded-xl w-fit">
                    🎯 {p.programId.title}
                  </div>
                )}
              </div>

              {/* КЕРУВАННЯ ТА МОДЕРАЦІЯ НАУКОВОЇ РОБОТИ */}
              <div className="flex flex-wrap md:flex-col items-end gap-3 shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-[var(--border-color)]">
                {/* Вибір Рецензента */}
                <div className="space-y-1 w-full md:w-48">
                  <label className="text-[9px] font-black uppercase tracking-wider text-[var(--text-gray)] pl-1">
                    Призначити оцінювача
                  </label>
                  <select
                    value={p.reviewerId?._id || p.reviewerId || ""}
                    disabled={loadingAction === p._id}
                    onChange={(e) => onAssignReviewer(p._id, e.target.value)}
                    className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] text-xs font-bold px-3 py-2 rounded-xl outline-none focus:border-purple-600 cursor-pointer"
                  >
                    <option value="">-- Оберіть рецензента --</option>
                    {reviewersList.map((rev) => (
                      <option key={rev._id} value={rev._id}>
                        {rev.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Швидка зміна статусу */}
                <div className="flex gap-2 w-full md:w-auto">
                  <button
                    onClick={() => onUpdateStatus(p._id, "Прийнято")}
                    disabled={
                      loadingAction === p._id || p.status === "Прийнято"
                    }
                    className="flex-1 md:flex-none px-3 py-2 bg-emerald-500/10 hover:bg-emerald-500 hover:text-white border border-emerald-500/20 text-emerald-600 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all"
                  >
                    Апрув
                  </button>
                  <button
                    onClick={() => onUpdateStatus(p._id, "Відхилено")}
                    disabled={
                      loadingAction === p._id || p.status === "Відхилено"
                    }
                    className="flex-1 md:flex-none px-3 py-2 bg-red-500/10 hover:bg-red-500 hover:text-white border border-red-500/20 text-red-600 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all"
                  >
                    Відхилити
                  </button>
                  <a
                    href={p.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-dark)] hover:text-purple-600 rounded-xl transition-all"
                    title="Завантажити документ"
                  >
                    <FileDown size={14} />
                  </a>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="pt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}
