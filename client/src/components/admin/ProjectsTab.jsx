import React, { useState, useMemo } from "react";
import { Search, CheckCircle, XCircle } from "lucide-react";
import Pagination from "./Pagination";

const ProjectsTab = ({ projects, onUpdateStatus, loadingAction }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const filteredProjects = useMemo(() => {
    return projects.filter(
      (p) =>
        p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.authors?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [projects, searchTerm]);

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage) || 1;
  const currentProjects = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProjects.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProjects, currentPage]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-4 rounded-2xl flex items-center gap-3 shadow-xs max-w-md">
        <Search size={18} className="text-[var(--text-gray)]" />
        <input
          type="text"
          placeholder="Пошук робіт за назвою або автором..."
          className="w-full bg-transparent border-none outline-none text-sm text-[var(--text-dark)]"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--border-color)] bg-[var(--bg-main)] text-[var(--text-gray)] text-xs font-bold uppercase tracking-wider">
                <th className="p-4 pl-6">Наукова праця</th>
                <th className="p-4">Категорія / Програма</th>
                <th className="p-4">Статус</th>
                <th className="p-4 pr-6 text-right">Модерація</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)] font-medium">
              {currentProjects.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="p-8 text-center text-[var(--text-gray)]"
                  >
                    Робіт, що потребують перевірки, не знайдено
                  </td>
                </tr>
              ) : (
                currentProjects.map((item) => (
                  <tr
                    key={item._id}
                    className="hover:bg-[var(--bg-main)]/40 transition-colors"
                  >
                    <td className="p-4 pl-6">
                      <div className="font-bold text-[var(--text-dark)] max-w-md truncate">
                        {item.title}
                      </div>
                      <div className="text-xs text-[var(--text-gray)] mt-0.5">
                        Автор: {item.authors}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-xs text-[var(--text-dark)] font-bold">
                        {item.programId?.title || "Самостійна публікація"}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          item.status === "Прийнято"
                            ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/10"
                            : item.status === "Відхилено"
                              ? "bg-red-500/10 text-red-500 border border-red-500/10"
                              : item.status === "На рецензії"
                                ? "bg-amber-500/10 text-amber-500 border border-amber-500/10"
                                : "bg-blue-500/10 text-blue-500 border border-blue-500/10"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {item.status === "Очікує підтвердження" && (
                          <>
                            <button
                              onClick={() =>
                                onUpdateStatus(item._id, "Прийнято")
                              }
                              disabled={loadingAction === item._id}
                              className="p-2 hover:bg-emerald-500/10 text-emerald-500 rounded-xl transition-colors"
                              title="Затвердити працю"
                            >
                              <CheckCircle size={16} />
                            </button>
                            <button
                              onClick={() =>
                                onUpdateStatus(item._id, "Відхилено")
                              }
                              disabled={loadingAction === item._id}
                              className="p-2 hover:bg-red-500/10 text-red-500 rounded-xl transition-colors"
                              title="Відхилити"
                            >
                              <XCircle size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="p-4 border-t border-[var(--border-color)]">
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
