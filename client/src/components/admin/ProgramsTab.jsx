/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useMemo, useEffect } from "react";
import { SCIENTIFIC_DOMAINS, PROGRAM_TYPES } from "../../constants/domains";
import UniversalFilters from "../UniversalFilters";
import ProgramCard from "./ProgramCard";
import ProgramForm from "./ProgramForm";
import EditProgramModal from "./EditProgramModal";
import Pagination from "../Pagination";
import axiosInstance from "../../api/axios";
import toast from "react-hot-toast";

const ProgramsTab = ({
  programs = [],
  setPrograms,
  newProgram,
  setNewProgram,
  onCreateProgram,
  loadingAction,
  onToggleStatus,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("Всі типи");
  const [filterDomain, setFilterDomain] = useState("Всі галузі");

  const [subTab, setSubTab] = useState("active");
  const [archivedPrograms, setArchivedPrograms] = useState([]);
  const [loadingArchive, setLoadingArchive] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProgramForEdit, setSelectedProgramForEdit] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    if (subTab === "archived") {
      const fetchArchive = async () => {
        try {
          setLoadingArchive(true);
          const res = await axiosInstance.get("/programs/archive");
          setArchivedPrograms(res.data);
        } catch (err) {
          console.error("Помилка архіву:", err);
          toast.error("Не вдалося завантажити архів");
        } finally {
          setLoadingArchive(false);
        }
      };
      fetchArchive();
    }
  }, [subTab]);

  const filteredPrograms = useMemo(() => {
    return programs.filter((p) => {
      if (!p) return false;

      const matchesTab =
        subTab === "active" ? p.active !== false : p.active === false;

      const programTitle = p.title ? p.title.toLowerCase() : "";
      const searchStr = searchTerm.toLowerCase();
      const matchesSearch =
        programTitle.includes(searchStr) ||
        (p.organizer && p.organizer.toLowerCase().includes(searchStr));

      const matchesType = filterType === "Всі типи" || p.type === filterType;

      const matchesDomain =
        filterDomain === "Всі галузі" || p.domain === filterDomain;

      return matchesTab && matchesSearch && matchesType && matchesDomain;
    });
  }, [programs, subTab, searchTerm, filterType, filterDomain]);

  const totalPages = Math.ceil(filteredPrograms.length / itemsPerPage);
  const paginatedPrograms = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredPrograms.slice(start, start + itemsPerPage);
  }, [filteredPrograms, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterType, filterDomain, subTab]);

  const dropdowns = [
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
  ];

  const handleReset = () => {
    setSearchTerm("");
    setFilterType("Всі типи");
    setFilterDomain("Всі галузі");
  };

  const handleOpenEditModal = (prog) => {
    setSelectedProgramForEdit(prog);
    setIsEditModalOpen(true);
  };

  const handleSaveFromModal = async (updatedData) => {
    try {
      const res = await axiosInstance.put(
        `/programs/${updatedData._id}`,
        updatedData,
      );
      if (res.data) {
        const updatedTarget = res.data.program ? res.data.program : res.data;

        setPrograms((prev) =>
          prev.map((item) =>
            item._id === updatedData._id ? updatedTarget : item,
          ),
        );
        if (subTab === "archived") {
          setArchivedPrograms((prev) =>
            prev.map((item) =>
              item._id === updatedData._id ? updatedTarget : item,
            ),
          );
        }
        toast.success("Зміни успішно збережено!");
        setIsEditModalOpen(false);
        setSelectedProgramForEdit(null);
      }
    } catch (err) {
      console.error(err);
      toast.error("Помилка при оновленні програми");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Ви впевнені, що хочете видалити цю програму?")) return;
    try {
      await axiosInstance.delete(`/programs/${id}`);
      setPrograms((prev) => prev.filter((item) => item._id !== id));
      setArchivedPrograms((prev) => prev.filter((item) => item._id !== id));
      toast.success("Програму видалено");
    } catch (err) {
      console.error(err);
      toast.error("Не вдалося видалити");
    }
  };

  return (
    <div className="w-full">
      <div className="flex gap-2 mb-6 bg-[var(--bg-main)] p-1 rounded-xl border border-[var(--border-color)] w-fit">
        <button
          onClick={() => setSubTab("active")}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
            subTab === "active"
              ? "bg-purple-600 text-white shadow-sm"
              : "text-[var(--text-gray)] hover:text-[var(--text-dark)]"
          }`}
        >
          🟢 Активні ({programs.length})
        </button>
        <button
          onClick={() => setSubTab("archived")}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
            subTab === "archived"
              ? "bg-purple-600 text-white shadow-sm"
              : "text-[var(--text-gray)] hover:text-[var(--text-dark)]"
          }`}
        >
          <span>
            📁 Архівні ({programs.filter((p) => p && p.active === false).length}
            )
          </span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start relative">
        <div className="lg:col-span-1 lg:sticky lg:top-6 z-20 bg-[var(--bg-main)]">
          <ProgramForm
            newProgram={newProgram}
            setNewProgram={setNewProgram}
            loadingAction={loadingAction}
            onSubmit={onCreateProgram}
            onTypeChange={(selectedType) => {
              setNewProgram((prev) => ({
                ...prev,
                type: selectedType,
                issn: "",
                impactFactor: 0,
                amount: "",
                organizer: "",
                externalLink: "",
                location: "Онлайн",
              }));
            }}
          />
        </div>

        <div className="lg:col-span-2 space-y-4 z-10 relative">
          <UniversalFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            searchPlaceholder="Пошук за назвою або організатором..."
            dropdowns={dropdowns}
            onReset={handleReset}
          />

          {subTab === "archived" && loadingArchive ? (
            <div className="text-center py-12 text-xs font-mono uppercase tracking-widest text-[var(--text-gray)] animate-pulse">
              Завантаження архіву...
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
                  // 🟢 ОНОВЛЕНО: Передаємо безпосередньо функцію з AdminPage
                  onToggleStatus={onToggleStatus}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {totalPages > 1 && (
        <div className="mt-6 pt-4 border-t border-[var(--border-color)]">
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
        onSave={handleSaveFromModal}
        loadingAction={loadingAction}
      />
    </div>
  );
};

export default ProgramsTab;
