/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useMemo, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { SCIENTIFIC_DOMAINS, PROGRAM_TYPES } from "../../../constants/domains";
import UniversalFilters from "../../../components/UniversalFilters";
import ProgramCard from "../../superadmin/components/ProgramCard"; // Реюзаємо візуальну картку
import OrgProgramForm from "./OrgProgramForm";
import EditProgramModal from "../../superadmin/components/EditProgramModal";
import Pagination from "../../../components/Pagination";
import axiosInstance from "../../../api/axios";
import toast from "react-hot-toast";

const OrgProgramsTab = ({
  programs = [],
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
  const [filterType, setFilterType] = useState("Всі типу");
  const [filterDomain, setFilterDomain] = useState("Всі галузі");

  const [subTab, setSubTab] = useState("active");
  const [archivedPrograms, setArchivedPrograms] = useState([]);
  const [loadingArchive, setLoadingArchive] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProgramForEdit, setSelectedProgramForEdit] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    if (subTab === "archive") {
      const fetchArchive = async () => {
        try {
          setLoadingArchive(true);
          const params = targetOrgId ? { orgId: targetOrgId } : {};
          const res = await axiosInstance.get("/programs/archive", { params });
          setArchivedPrograms(res.data || []);
        } catch (err) {
          toast.error("Не вдалося завантажити локальний архів програм");
        } finally {
          setLoadingArchive(false);
        }
      };
      fetchArchive();
    }
  }, [subTab, targetOrgId]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterType, filterDomain, subTab]);

  const handleOpenEditModal = (program) => {
    setSelectedProgramForEdit(program);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (updatedProgram) => {
    if (subTab === "active") {
      setPrograms(
        programs.map((p) =>
          p._id === updatedProgram._id ? updatedProgram : p,
        ),
      );
    } else {
      setArchivedPrograms(
        archivedPrograms.map((p) =>
          p._id === updatedProgram._id ? updatedProgram : p,
        ),
      );
    }
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm("Ви впевнені, що хочете видалити конкурс вашої установи?")
    )
      return;
    try {
      await axiosInstance.delete(`/programs/${id}/permanent`);
      toast.success("Програму видалено назавжди");
      if (subTab === "active") {
        setPrograms(programs.filter((p) => p._id !== id));
      } else {
        setArchivedPrograms(archivedPrograms.filter((p) => p._id !== id));
      }
    } catch {
      toast.error("Помилка видалення");
    }
  };

  const handleToggleActiveStatus = async (id) => {
    try {
      await onToggleStatus(id);
      if (subTab === "active") {
        const moved = programs.find((p) => p._id === id);
        if (moved) {
          setPrograms(programs.filter((p) => p._id !== id));
          setArchivedPrograms([
            { ...moved, active: false },
            ...archivedPrograms,
          ]);
        }
      } else {
        const moved = archivedPrograms.find((p) => p._id === id);
        if (moved) {
          setArchivedPrograms(archivedPrograms.filter((p) => p._id !== id));
          setPrograms([{ ...moved, active: true }, ...programs]);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const currentProgramsList = useMemo(() => {
    return subTab === "active"
      ? Array.isArray(programs)
        ? programs
        : []
      : Array.isArray(archivedPrograms)
        ? archivedPrograms
        : [];
  }, [subTab, programs, archivedPrograms]);

  const filteredPrograms = useMemo(() => {
    return currentProgramsList.filter((p) => {
      if (!p) return false;
      const titleText = p.title ? String(p.title).toLowerCase() : "";
      const searchTarget = searchTerm.trim().toLowerCase();
      const matchesSearch = titleText.includes(searchTarget);
      const matchesType =
        filterType === "Всі типи" ||
        filterType === "Всі типу" ||
        p.type === filterType;
      const matchesDomain =
        filterDomain === "Всі галузі" || p.domain === filterDomain;
      return matchesSearch && matchesType && matchesDomain;
    });
  }, [currentProgramsList, searchTerm, filterType, filterDomain]);

  const totalPages = Math.ceil(filteredPrograms.length / itemsPerPage);
  const paginatedPrograms = useMemo(() => {
    const offset = (currentPage - 1) * itemsPerPage;
    return filteredPrograms.slice(offset, offset + itemsPerPage);
  }, [filteredPrograms, currentPage]);

  const filterConfigs = [
    {
      id: "type",
      label: "Тип",
      value: filterType === "Всі типу" ? "Всі типи" : filterType,
      onChange: (val) => setFilterType(val === "Всі типи" ? "Всі типу" : val),
      options: ["Всі типи", ...PROGRAM_TYPES],
    },
    {
      id: "domain",
      label: "Галузь",
      value: filterDomain,
      onChange: setFilterDomain,
      options: ["Всі галузі", ...SCIENTIFIC_DOMAINS],
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
      <div className="lg:col-span-1">
        <OrgProgramForm
          newProgram={newProgram}
          setNewProgram={setNewProgram}
          loadingAction={loadingAction}
          onSubmit={onCreateProgram}
          onTypeChange={(e) =>
            setNewProgram({ ...newProgram, type: e.target.value })
          }
          organizationName={organizationName}
        />
      </div>

      <div className="lg:col-span-2 space-y-4">
        <div className="flex border-b border-[var(--border-color)] gap-4">
          <button
            onClick={() => setSubTab("active")}
            className={`pb-2 text-xs font-black uppercase tracking-wider transition-all relative ${
              subTab === "active"
                ? "text-purple-600 after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-purple-600"
                : "text-[var(--text-gray)] hover:text-[var(--text-dark)]"
            }`}
          >
            🟢 Наші активні програми
          </button>
          <button
            onClick={() => setSubTab("archive")}
            className={`pb-2 text-xs font-black uppercase tracking-wider transition-all relative ${
              subTab === "archive"
                ? "text-purple-600 after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-purple-600"
                : "text-[var(--text-gray)] hover:text-[var(--text-dark)]"
            }`}
          >
            📦 Архів установи
          </button>
        </div>

        <UniversalFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Пошук у локальному списку за назвою..."
          filters={filterConfigs}
        />

        <div className="relative min-h-[200px]">
          {loadingArchive && subTab === "archive" ? (
            <div className="absolute inset-0 flex items-center justify-center bg-[var(--bg-main)]/50 rounded-3xl">
              <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredPrograms.length === 0 ? (
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl p-12 text-center text-sm text-[var(--text-gray)] font-medium">
              🔍 Конкурсів вашої установи за вказаними фільтрами не виявлено.
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
        onSave={handleSaveEdit}
      />
    </div>
  );
};

export default OrgProgramsTab;
