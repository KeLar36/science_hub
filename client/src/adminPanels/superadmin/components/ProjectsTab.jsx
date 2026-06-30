import React, { useState, useMemo } from "react";
import UniversalFilters from "../../../components/UniversalFilters";
import Pagination from "../../../components/Pagination";
import { CheckCircle, XCircle, FileDown, Building2, User } from "lucide-react";

const ProjectsTab = ({
  projects = [],
  users = [],
  onUpdateStatus,
  onAssignReviewer,
  loadingAction,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("Всі статуси");
  const [filterDomain, setFilterDomain] = useState("Всі галузі");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Вифільтровуємо глобальних рецензентів системи
  const reviewers = useMemo(() => {
    return Array.isArray(users)
      ? users.filter((u) => u.role === "reviewer")
      : [];
  }, [users]);

  // Динамічно збираємо список усіх наявних у базі наукових галузей для фільтра
  const uniqueDomains = useMemo(() => {
    const domains = new Set();
    projects.forEach((p) => {
      if (p.domain) domains.add(p.domain);
    });
    return ["Всі галузі", ...Array.from(domains)];
  }, [projects]);

  // ГЛИБОКА ФІЛЬТРАЦІЯ: Пошук по назві/автору + Статус + Галузь
  const filteredProjects = useMemo(() => {
    if (!Array.isArray(projects)) return [];

    return projects.filter((p) => {
      const titleText = p.title ? String(p.title).toLowerCase() : "";
      const authorText = p.authorId?.name
        ? String(p.authorId.name).toLowerCase()
        : p.authors
          ? String(p.authors).toLowerCase()
          : "";
      const searchTarget = searchTerm.trim().toLowerCase();

      const matchesSearch =
        titleText.includes(searchTarget) || authorText.includes(searchTarget);
      const matchesStatus =
        filterStatus === "Всі статуси" || p.status === filterStatus;
      const matchesDomain =
        filterDomain === "Всі галузі" || p.domain === filterDomain;

      return matchesSearch && matchesStatus && matchesDomain;
    });
  }, [projects, searchTerm, filterStatus, filterDomain]);

  // Пагінація
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage) || 1;
  const currentProjects = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProjects.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProjects, currentPage]);

  // 🟢 ОБРОБНИКИ ЗМІНИ ФІЛЬТРІВ (Заміна ефекту — скидаємо сторінку одразу під час кліку)
  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleStatusChange = (value) => {
    setFilterStatus(value);
    setCurrentPage(1);
  };

  const handleDomainChange = (value) => {
    setFilterDomain(value);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setFilterStatus("Всі статуси");
    setFilterDomain("Всі галузі");
    setCurrentPage(1);
  };

  // Конфігурація селекторів: прокидаємо функції, які паралельно скидають пагінацію
  const advancedDropdowns = [
    {
      value: filterStatus,
      onChange: handleStatusChange,
      options: ["Всі статуси", "На розгляді", "Прийнято", "Відхилено"],
    },
    {
      value: filterDomain,
      onChange: handleDomainChange,
      options: uniqueDomains,
    },
  ];

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case "Прийнято":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "Відхилено":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
    }
  };

  return (
    <div className="space-y-4 text-left animate-in fade-in duration-150">
      {/* УНІВЕРСАЛЬНІ ФІЛЬТРИ З ОПТИМІЗОВАНИМИ ОБРОБНИКАМИ СТАНУ */}
      <UniversalFilters
        searchTerm={searchTerm}
        setSearchTerm={handleSearchChange} // Тепер передаємо функцію з інтегрованим скиданням сторінки
        searchPlaceholder="Пошук дослідження за назвою або ім'ям автора..."
        dropdowns={advancedDropdowns}
        onReset={handleResetFilters}
      />

      {/* ТАБЛИЦЯ ВСІХ РОБІТ МЕРЕЖІ */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-[var(--border-color)] bg-[var(--bg-main)]/50 text-[10px] font-black uppercase tracking-wider text-[var(--text-gray)]">
                <th className="p-4 pl-6">Наукова праця / Творець</th>
                <th className="p-4">Установа походження</th>
                <th className="p-4">Програма / Напрямок</th>
                <th className="p-4">Призначити рецензента</th>
                <th className="p-4">Статус модерації</th>
                <th className="p-4 pr-6 text-right">Модерація</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)] font-semibold text-[var(--text-dark)]">
              {currentProjects.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="p-12 text-center text-sm text-[var(--text-gray)] font-medium"
                  >
                    🔍 Жодної наукової роботи за вказаними критеріями фільтрації
                    не знайдено.
                  </td>
                </tr>
              ) : (
                currentProjects.map((item) => (
                  <tr
                    key={item._id}
                    className="hover:bg-[var(--bg-main)]/30 transition-colors"
                  >
                    {/* НАЗВА ТА АВТОР */}
                    <td className="p-4 pl-6 max-w-xs">
                      <div
                        className="font-bold text-sm text-[var(--text-dark)] truncate"
                        title={item.title}
                      >
                        {item.title}
                      </div>
                      <div className="text-[11px] text-[var(--text-gray)] font-medium flex items-center gap-1 mt-0.5">
                        <User size={12} className="text-purple-500" />
                        Автор:{" "}
                        <span className="text-[var(--text-dark)]">
                          {item.authorId?.name || item.authors || "Невідомий"}
                        </span>
                      </div>
                    </td>

                    {/* УСТАНОВА */}
                    <td className="p-4">
                      {item.authorId?.organizationId?.name ? (
                        <div
                          className="flex items-center gap-1.5 max-w-[160px] truncate"
                          title={item.authorId.organizationId.name}
                        >
                          <Building2
                            size={13}
                            className="text-purple-500 shrink-0"
                          />
                          <span className="truncate">
                            {item.authorId.organizationId.name}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[11px] text-[var(--text-gray)] font-medium italic">
                          Незалежний дослідник
                        </span>
                      )}
                    </td>

                    {/* ПРОГРАМА ТА ГАЛУЗЬ */}
                    <td className="p-4">
                      <div className="font-bold truncate max-w-[140px]">
                        {item.programId?.title || "Глобальна сторінка"}
                      </div>
                      <div className="text-[10px] text-purple-600 font-bold bg-purple-500/5 border border-purple-500/10 px-1.5 py-0.5 rounded-md mt-0.5 w-fit uppercase tracking-wide">
                        {item.domain || "Всі галузі"}
                      </div>
                    </td>

                    {/* СЕЛЕКТОР РЕЦЕНЗЕНТІВ */}
                    <td className="p-4">
                      <select
                        className="bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-3 py-1.5 font-bold cursor-pointer text-xs w-full max-w-[160px] outline-none focus:border-purple-600 transition-all"
                        value={item.reviewerId?._id || item.reviewerId || ""}
                        onChange={(e) =>
                          onAssignReviewer(item._id, e.target.value)
                        }
                        disabled={loadingAction === item._id}
                      >
                        <option value="">-- Оберіть оцінювача --</option>
                        {reviewers.map((r) => (
                          <option key={r._id} value={r._id}>
                            {r.name}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* КОЛЬОРОВИЙ СТАТУС */}
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-0.5 border rounded-md text-[9px] font-black uppercase tracking-wider ${getStatusBadgeStyle(item.status)}`}
                      >
                        {item.status || "На розгляді"}
                      </span>
                    </td>

                    {/* ДІЇ */}
                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onUpdateStatus(item._id, "Прийнято")}
                          disabled={
                            loadingAction === item._id ||
                            item.status === "Прийнято"
                          }
                          className="p-2 hover:bg-emerald-500/10 disabled:opacity-40 text-emerald-500 rounded-xl transition-all"
                          title="Затвердити роботу"
                        >
                          <CheckCircle size={15} />
                        </button>
                        <button
                          onClick={() => onUpdateStatus(item._id, "Відхилено")}
                          disabled={
                            loadingAction === item._id ||
                            item.status === "Відхилено"
                          }
                          className="p-2 hover:bg-red-500/10 disabled:opacity-40 text-red-500 rounded-xl transition-all"
                          title="Відхилити роботу"
                        >
                          <XCircle size={15} />
                        </button>
                        {item.fileUrl && (
                          <a
                            href={item.fileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 hover:bg-purple-500/10 text-[var(--text-dark)] hover:text-purple-600 rounded-xl transition-all"
                            title="Відкрити / Завантажити документ"
                          >
                            <FileDown size={15} />
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ПАГІНАЦІЯ */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-[var(--border-color)] bg-[var(--bg-main)]/20">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsTab;
