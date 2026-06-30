/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useMemo, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { SCIENTIFIC_DOMAINS, PROGRAM_TYPES } from "../../../constants/domains";
import UniversalFilters from "../../../components/UniversalFilters";
import ProgramCard from "./ProgramCard";
import ProgramForm from "./ProgramForm";
import EditProgramModal from "./EditProgramModal";
import Pagination from "../../../components/Pagination";
import axiosInstance from "../../../api/axios";
import toast from "react-hot-toast";

const ProgramsTab = ({
  programs = [], // Це загальний пул програм, який приходить з сервера
  setPrograms,
  onCreateProgram,
  newProgram,
  setNewProgram,
  loadingAction,
  onToggleStatus,
  organizationName,
}) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const targetOrgId = queryParams.get("orgId");

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("Всі типи");
  const [filterDomain, setFilterDomain] = useState("Всі галузі");
  const [sortBy, setSortBy] = useState("За замовчуванням");

  const [subTab, setSubTab] = useState("active");
  const [archivedPrograms, setArchivedPrograms] = useState([]);
  const [loadingArchive, setLoadingArchive] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProgramForEdit, setSelectedProgramForEdit] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Завантаження архіву з сервера при переході на вкладку архіву
  useEffect(() => {
    if (subTab === "archived") {
      const fetchArchive = async () => {
        try {
          setLoadingArchive(true);
          const url = targetOrgId
            ? `/programs/archived?orgId=${targetOrgId}`
            : "/programs/archive";
          const res = await axiosInstance.get(url);
          setArchivedPrograms(res.data || []);
        } catch {
          toast.error("Не вдалося завантажити архівні програми");
        } finally {
          setLoadingArchive(false);
        }
      };
      fetchArchive();
    }
  }, [subTab, targetOrgId]);

  const activePool = useMemo(() => {
    return programs.filter((p) => p.active === true || p.isActive === true);
  }, [programs]);

  const currentPool = subTab === "active" ? activePool : archivedPrograms;

  const filteredPrograms = useMemo(() => {
    let result = [...currentPool];

    // Пошук
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.organizer?.toLowerCase().includes(q) ||
          p.domain?.toLowerCase().includes(q),
      );
    }

    if (filterType !== "Всі типи") {
      result = result.filter((p) => p.type === filterType);
    }

    // Фільтр по галузі
    if (filterDomain !== "Всі галузі") {
      result = result.filter((p) => p.domain === filterDomain);
    }

    // Сортування
    if (sortBy === "Дедлайн: спочатку найближчі") {
      result.sort(
        (a, b) => new Date(a.deadline || 0) - new Date(b.deadline || 0),
      );
    } else if (sortBy === "Дедлайн: спочатку пізніші") {
      result.sort(
        (a, b) => new Date(b.deadline || 0) - new Date(a.deadline || 0),
      );
    } else if (sortBy === "Категорія (А-Я)") {
      result.sort((a, b) => (a.domain || "").localeCompare(b.domain || ""));
    } else if (sortBy === "Тип програми (А-Я)") {
      result.sort((a, b) => (a.type || "").localeCompare(b.type || ""));
    }

    return result;
  }, [currentPool, searchTerm, filterType, filterDomain, sortBy]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterType, filterDomain, sortBy, subTab]);

  const paginatedPrograms = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredPrograms.slice(start, start + itemsPerPage);
  }, [filteredPrograms, currentPage]);

  const totalPages = Math.ceil(filteredPrograms.length / itemsPerPage);

  const handleResetFilters = () => {
    setSearchTerm("");
    setFilterType("Всі типи");
    setFilterDomain("Всі галузі");
    setSortBy("За замовчуванням");
  };

  const handleDelete = async (id) => {
    const isConfirm = window.confirm(
      subTab === "active"
        ? "Ви впевнені, що хочете перенести цю програму в архів?"
        : "Ви впевнені, що хочете видалити цю програму назавжди?",
    );
    if (!isConfirm) return;

    try {
      if (subTab === "active") {
        await axiosInstance.patch(`/programs/archive/${id}`);
        setPrograms((prev) => prev.filter((p) => p._id !== id));
        toast.success("Програму архівовано");
      } else {
        await axiosInstance.delete(`/programs/${id}`);
        setArchivedPrograms((prev) => prev.filter((p) => p._id !== id));
        toast.success("Програму видалено назавжди");
      }
    } catch {
      toast.error("Помилка виконання операції");
    }
  };

  const handleToggleActiveStatus = async (id, currentStatus) => {
    try {
      await onToggleStatus(id, currentStatus);

      if (subTab === "active") {
        setPrograms((prev) =>
          prev.map((p) =>
            p._id === id ? { ...p, active: !currentStatus } : p,
          ),
        );
      }

      if (subTab === "archived") {
        setArchivedPrograms((prev) =>
          prev.map((p) =>
            p._id === id ? { ...p, active: !currentStatus } : p,
          ),
        );
      }
    } catch {
      toast.error("Не вдалося змінити статус активності");
    }
  };

  const handleOpenEditModal = (program) => {
    setSelectedProgramForEdit(program);
    setIsEditModalOpen(true);
  };

  const handleEditSuccess = (updatedProgram) => {
    if (subTab === "active") {
      setPrograms((prev) =>
        prev.map((p) => (p._id === updatedProgram._id ? updatedProgram : p)),
      );
    } else {
      setArchivedPrograms((prev) =>
        prev.map((p) => (p._id === updatedProgram._id ? updatedProgram : p)),
      );
    }
    setIsEditModalOpen(false);
    setSelectedProgramForEdit(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start text-left">
      {/* Форма створення */}
      <div className="lg:col-span-1">
        <h3 className="text-base font-black text-[var(--text-dark)] uppercase tracking-wider mb-4 italic">
          🛠️ Створити нову програму
        </h3>
        <ProgramForm
          newProgram={newProgram}
          setNewProgram={setNewProgram}
          loadingAction={loadingAction}
          onSubmit={onCreateProgram}
          organizationName={organizationName}
        />
      </div>

      {/* Список та фільтри */}
      <div className="lg:col-span-2 space-y-4">
        <div className="flex border-b border-[var(--border-color)] gap-4">
          {/* 🟢 КІЛЬКІСТЬ ДЛЯ АКТИВНИХ */}
          <button
            onClick={() => setSubTab("active")}
            className={`pb-2.5 text-xs font-black uppercase tracking-wider transition-all border-b-2 ${
              subTab === "active"
                ? "border-purple-600 text-purple-600"
                : "border-transparent text-[var(--text-gray)] hover:text-purple-600"
            }`}
          >
            Активні програми ({activePool.length})
          </button>

          {/* 🟢 КІЛЬКІСТЬ ДЛЯ АРХІВУ В ДУЖКАХ */}
          <button
            onClick={() => setSubTab("archived")}
            className={`pb-2.5 text-xs font-black uppercase tracking-wider transition-all border-b-2 ${
              subTab === "archived"
                ? "border-purple-600 text-purple-600"
                : "border-transparent text-[var(--text-gray)] hover:text-purple-600"
            }`}
          >
            Архів програм ({archivedPrograms.length})
          </button>
        </div>

        <UniversalFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          searchPlaceholder="Пошук програми за назвою або організатором..."
          onReset={handleResetFilters}
          dropdowns={[
            {
              value: filterType,
              onChange: setFilterType,
              options: ["Всі типи", ...PROGRAM_TYPES],
            },
            {
              value: filterDomain,
              onChange: setFilterDomain,
              options: ["Всі галузі", ...SCIENTIFIC_DOMAINS],
            },
            {
              value: sortBy,
              onChange: setSortBy,
              options: [
                "За замовчуванням",
                "Дедлайн: спочатку найближчі",
                "Дедлайн: спочатку пізніші",
                "Категорія (А-Я)",
                "Тип програми (А-Я)",
              ],
            },
          ]}
        />

        <div className="w-full">
          {subTab === "archived" && loadingArchive ? (
            <div className="flex justify-center py-12 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl">
              <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredPrograms.length === 0 ? (
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl p-12 text-center text-sm text-[var(--text-gray)] font-medium">
              🔍 Програм у цій вкладці за вказаними фільтрами не знайдено.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {paginatedPrograms.map((p) => (
                <ProgramCard
                  key={p._id}
                  p={p}
                  onEdit={handleOpenEditModal}
                  onDelete={handleDelete}
                  onToggleStatus={handleToggleActiveStatus}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {totalPages > 1 && (
        <div className="mt-6 pt-4 border-t border-[var(--border-color)] col-span-full">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      <EditProgramModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedProgramForEdit(null);
        }}
        programData={selectedProgramForEdit}
        onSave={handleEditSuccess}
        loadingAction={loadingAction}
      />
    </div>
  );
};

export default ProgramsTab;
