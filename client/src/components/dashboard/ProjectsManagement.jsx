/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useMemo } from "react";
import {
  CheckCircle,
  XCircle,
  FileDown,
  Building2,
  User,
  Loader2,
} from "lucide-react";
import UniversalFilters from "../UniversalFilters";
import { Table } from "../ui/Table";
import { Pagination } from "../ui/Pagination";
import axiosInstance from "../../api/axios";
import toast from "react-hot-toast";

export const ProjectsManagement = ({ userRole }) => {
  const [loading, setLoading] = useState(true);
  const [loadingAction, setLoadingAction] = useState(null);

  const [projects, setProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [reviewers, setReviewers] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("Всі статуси");
  const [filterDomain, setFilterDomain] = useState("Всі галузі");

  const isSuperAdmin = userRole === "superadmin";

  const fetchReviewers = async () => {
    try {
      const response = await axiosInstance.get(
        "/users/all?role=reviewer&limit=100",
      );
      const fetchedUsers =
        response.data?.users || response.data?.items || response.data || [];
      setReviewers(Array.isArray(fetchedUsers) ? fetchedUsers : []);
    } catch (err) {
      console.error("💥 Помилка завантаження рецензентів:", err);
    }
  };

  const fetchProjectsData = async (pageNumber = 1) => {
    try {
      setLoading(true);
      let url = `/projects?page=${pageNumber}&limit=8`;

      if (searchTerm.trim()) {
        url += `&search=${encodeURIComponent(searchTerm.trim())}`;
      }
      if (filterStatus !== "Всі статуси") {
        url += `&status=${encodeURIComponent(filterStatus)}`;
      }
      if (filterDomain !== "Всі галузі") {
        url += `&domain=${encodeURIComponent(filterDomain)}`;
      }

      const response = await axiosInstance.get(url);

      const items =
        response.data?.projects || response.data?.items || response.data || [];
      setProjects(Array.isArray(items) ? items : []);
      setCurrentPage(response.data?.currentPage || pageNumber);
      setTotalPages(response.data?.totalPages || 1);
    } catch (err) {
      console.error("💥 Помилка фетчу наукових робіт:", err);
      toast.error("Не вдалося завантажити список наукових робіт");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviewers();
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchProjectsData(1);
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, filterStatus, filterDomain]);

  const handleAssignReviewer = async (projectId, reviewerId) => {
    try {
      setLoadingAction(`assign_${projectId}`);
      await axiosInstance.patch(`/projects/assign/${projectId}`, {
        reviewerId,
      });
      toast.success("Рецензента успішно призначено для роботи");
      fetchProjectsData(currentPage);
    } catch (err) {
      toast.error("Помилка призначення рецензента");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleUpdateStatus = async (projectId, newStatus) => {
    try {
      setLoadingAction(`status_${projectId}`);
      await axiosInstance.patch(`/projects/status/${projectId}`, {
        status: newStatus,
      });
      toast.success(`Статус наукової праці оновлено на "${newStatus}"`);
      fetchProjectsData(currentPage);
    } catch (err) {
      toast.error("Помилка зміни статусу модерації");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setFilterStatus("Всі статуси");
    setFilterDomain("Всі галузі");
  };

  const uniqueDomains = useMemo(() => {
    const domains = new Set();
    projects.forEach((p) => {
      if (p.domain) domains.add(p.domain);
    });
    return ["Всі галузі", ...Array.from(domains)];
  }, [projects]);

  const headers = isSuperAdmin
    ? [
        "Наукова праця / Творець",
        "Установа походження",
        "Програма / Напрямок",
        "Призначити рецензента",
        "Статус модерації",
        "Модерація",
      ]
    : [
        "Наукова праця / Творець",
        "Програма / Напрямок",
        "Призначити рецензента",
        "Статус модерації",
        "Модерація",
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

  const renderRow = (item) => (
    <tr
      key={item._id}
      className="border-b border-[var(--border-color)] text-xs font-semibold hover:bg-purple-600/[0.01] transition-colors"
    >
      <td className="px-6 py-4 max-w-xs text-left">
        <div
          className="font-black text-[var(--text-dark)] uppercase tracking-wide truncate"
          title={item.title}
        >
          {item.title}
        </div>
        <div className="text-[10px] text-[var(--text-gray)] font-medium flex items-center gap-1 mt-1 truncate">
          <User size={11} className="text-purple-500 shrink-0" />
          Автор:{" "}
          <span className="text-[var(--text-dark)] font-bold">
            {item.authorId?.name || item.authors || "Невідомий"}
          </span>
        </div>
      </td>

      {isSuperAdmin && (
        <td className="px-6 py-4 text-left">
          {item.authorId?.organizationId?.name ? (
            <div
              className="flex items-center gap-1.5 max-w-[180px] text-[var(--text-dark)] font-bold"
              title={item.authorId.organizationId.name}
            >
              <Building2 size={12} className="text-purple-500 shrink-0" />
              <span className="truncate">
                {item.authorId.organizationId.name}
              </span>
            </div>
          ) : (
            <span className="text-[10px] font-mono font-bold text-[var(--text-gray)] uppercase tracking-wider bg-[var(--bg-main)] px-2 py-0.5 rounded border border-[var(--border-color)]">
              Вільний науковець
            </span>
          )}
        </td>
      )}

      <td className="px-6 py-4 text-left">
        <div className="font-bold text-[var(--text-dark)] truncate max-w-[140px]">
          {item.programId?.title || "Глобальна сторінка"}
        </div>
        <div className="text-[9px] text-purple-600 font-black bg-purple-500/5 border border-purple-500/10 px-1.5 py-0.5 rounded-md mt-1 w-fit uppercase tracking-wide">
          {item.domain || "Всі галузі"}
        </div>
      </td>

      <td className="px-6 py-4 text-left">
        <select
          className="bg-[var(--bg-main)] border border-[var(--border-color)] rounded-lg px-2.5 py-1.5 font-black uppercase tracking-wider text-[11px] text-[var(--text-dark)] cursor-pointer w-full max-w-[160px] outline-hidden focus:border-purple-500 transition-all disabled:opacity-50"
          value={item.reviewerId?._id || item.reviewerId || ""}
          onChange={(e) => handleAssignReviewer(item._id, e.target.value)}
          disabled={loadingAction === `assign_${item._id}`}
        >
          <option value="">-- ОБЕРІТЬ ОЦІНЮВАЧА --</option>
          {reviewers.map((r) => (
            <option key={r._id} value={r._id}>
              {r.name?.toUpperCase()}
            </option>
          ))}
        </select>
      </td>

      <td className="px-6 py-4 text-left">
        <span
          className={`px-2.5 py-0.5 border rounded-md text-[9px] font-black uppercase tracking-wider ${getStatusBadgeStyle(item.status)}`}
        >
          {item.status || "На розгляді"}
        </span>
      </td>

      <td className="px-6 py-4 pr-6 text-right">
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => handleUpdateStatus(item._id, "Прийнято")}
            disabled={
              loadingAction === `status_${item._id}` ||
              item.status === "Прийнято"
            }
            className="p-2 hover:bg-emerald-500/10 disabled:opacity-40 text-emerald-500 rounded-xl transition-all cursor-pointer"
            title="Затвердити роботу"
          >
            <CheckCircle size={15} />
          </button>
          <button
            onClick={() => handleUpdateStatus(item._id, "Відхилено")}
            disabled={
              loadingAction === `status_${item._id}` ||
              item.status === "Відхилено"
            }
            className="p-2 hover:bg-red-500/10 disabled:opacity-40 text-red-500 rounded-xl transition-all cursor-pointer"
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
  );

  return (
    <div className="space-y-4 text-left animate-[fadeIn_0.3s_ease-out]">
      <div className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] p-4 rounded-3xl">
        <UniversalFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          searchPlaceholder="Пошук дослідження за назвою або ім'ям автора..."
          onReset={handleResetFilters}
          dropdowns={[
            {
              value: filterStatus,
              onChange: setFilterStatus,
              options: ["Всі статуси", "На розгляді", "Прийнято", "Відхилено"],
            },
            {
              value: filterDomain,
              onChange: setFilterDomain,
              options: uniqueDomains,
            },
          ]}
        />
      </div>

      <div className="w-full">
        <Table
          headers={headers}
          data={projects}
          renderRow={renderRow}
          isLoading={loading}
        />
      </div>

      {totalPages > 1 && !loading && (
        <div className="pt-2 border-t border-[var(--border-color)]">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={fetchProjectsData}
          />
        </div>
      )}
    </div>
  );
};
