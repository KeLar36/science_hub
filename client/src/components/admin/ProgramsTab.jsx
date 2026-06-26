/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useMemo, useEffect } from "react";
import { SCIENTIFIC_DOMAINS, PROGRAM_TYPES } from "../../constants/domains";
import UniversalFilters from "../UniversalFilters";
import ProgramCard from "./ProgramCard";
import ProgramForm from "./ProgramForm";
import EditProgramModal from "./EditProgramModal";
import Pagination from "../Pagination";
import { useProgramForm } from "../../hooks/useProgramForm";
import axiosInstance from "../../api/axios";
import toast from "react-hot-toast";

const initialFormState = {
  title: "",
  shortDescription: "",
  description: "",
  deadline: null,
  domain: "Всі галузі",
  type: "Науковий журнал",
  amount: "",
  issn: "",
  impactFactor: 0,
  organizer: "",
  externalLink: "",
  location: "Онлайн",
};

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
  const ITEMS_PER_PAGE = 4;

  const { handleTypeChange, handleSubmit, handleSaveModal, handleDelete } =
    useProgramForm(
      newProgram,
      setNewProgram,
      setPrograms,
      onCreateProgram,
      initialFormState,
    );

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (subTab === "archive") {
          setLoadingArchive(true);
          const res = await axiosInstance.get("/programs/archive");
          setArchivedPrograms(res.data);
        } else if (subTab === "active" && setPrograms) {
          const res = await axiosInstance.get("/programs");
          setPrograms(res.data);
        }
      } catch (err) {
        toast.error(
          `Не вдалося оновити список можливостей (${subTab === "archive" ? "архів" : "активні"})`,
        );
      } finally {
        if (subTab === "archive") setLoadingArchive(false);
      }
    };

    fetchData();
  }, [subTab]);

  useEffect(() => {
    setCurrentPage(1);
  }, [subTab, searchTerm, filterType, filterDomain]);

  const currentSource = subTab === "active" ? programs : archivedPrograms;

  const filteredPrograms = useMemo(() => {
    return currentSource.filter((p) => {
      const matchesSearch =
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.organizer &&
          p.organizer.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesType = filterType === "Всі типи" || p.type === filterType;
      const matchesDomain =
        filterDomain === "Всі галузі" || p.domain === filterDomain;
      return matchesSearch && matchesType && matchesDomain;
    });
  }, [currentSource, searchTerm, filterType, filterDomain]);

  const totalPages = Math.ceil(filteredPrograms.length / ITEMS_PER_PAGE);
  const paginatedPrograms = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredPrograms.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredPrograms, currentPage]);

  const handleResetFilters = () => {
    setSearchTerm("");
    setFilterType("Всі типи");
    setFilterDomain("Всі галузі");
  };

  const filterDropdowns = [
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

  const handleToggleActiveStatus = async (id) => {
    await onToggleStatus(id);
    if (subTab === "archive") {
      setArchivedPrograms((prev) => prev.filter((p) => p._id !== id));
    }
  };

  const handleOpenEditModal = (program) => {
    setSelectedProgramForEdit(program);
    setIsEditModalOpen(true);
  };

  const handleSaveFromModal = async (updatedData) => {
    await handleSaveModal(updatedData, (savedProgram) => {
      if (subTab === "archive") {
        setArchivedPrograms((prev) =>
          prev.map((p) => (p._id === savedProgram._id ? savedProgram : p)),
        );
      }
      setIsEditModalOpen(false);
      setSelectedProgramForEdit(null);
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-200">
      <ProgramForm
        newProgram={newProgram}
        setNewProgram={setNewProgram}
        loadingAction={loadingAction}
        onSubmit={handleSubmit}
        onTypeChange={handleTypeChange}
      />

      <div className="lg:col-span-2 flex flex-col justify-between min-h-[500px]">
        <div>
          <div className="flex gap-2 mb-4 bg-[var(--bg-main)] p-1 rounded-xl border border-[var(--border-color)] self-start">
            <button
              onClick={() => setSubTab("active")}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all ${
                subTab === "active"
                  ? "bg-purple-600 text-white shadow-xs"
                  : "text-[var(--text-gray)] hover:text-[var(--text-dark)]"
              }`}
            >
              Активні ({programs.length})
            </button>
            <button
              onClick={() => setSubTab("archive")}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all ${
                subTab === "archive"
                  ? "bg-purple-600 text-white shadow-xs"
                  : "text-[var(--text-gray)] hover:text-[var(--text-dark)]"
              }`}
            >
              Арнів ({archivedPrograms.length})
            </button>
          </div>

          <UniversalFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            searchPlaceholder="Швидкий пошук за назвою або організатором..."
            dropdowns={filterDropdowns}
            onReset={handleResetFilters}
          />

          {subTab === "archive" && loadingArchive ? (
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl p-12 text-center text-sm text-[var(--text-gray)] font-medium">
              ⏳ Завантаження архівних програм...
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
                  onEdit={handleOpenEditModal} // 🟣 Передаємо відкриття модалки
                  onDelete={handleDelete}
                  onToggleStatus={handleToggleActiveStatus}
                />
              ))}
            </div>
          )}
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
      </div>

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
