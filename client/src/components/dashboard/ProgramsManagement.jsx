/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import UniversalFilters from "../UniversalFilters";
import { UniversalCard } from "../ui/UniversalCard";
import { Pagination } from "../ui/Pagination";
import ProgramForm from "../ProgramForm";
import { EditProgramModal } from "./EditProgramModal";
import { Loader2, ShieldCheck, Plus } from "lucide-react";
import axiosInstance from "../../api/axios";
import toast from "react-hot-toast";

export const ProgramsManagement = ({
  userRole,
  organizationName = "Платформа",
  orgId,
}) => {
  const [loading, setLoading] = useState(true);
  const [loadingAction, setLoadingAction] = useState(null);

  const [programs, setPrograms] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("Всі типи");
  const [filterDomain, setFilterDomain] = useState("Всі галузі");
  const [subTab, setSubTab] = useState("active");

  const [newProgram, setNewProgram] = useState({
    title: "",
    description: "",
    type: "Науковий журнал",
    domain: "Штучний інтелект & IT",
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProgramForEdit, setSelectedProgramForEdit] = useState(null);

  const fetchProgramsData = async (pageNumber = 1) => {
    try {
      setLoading(true);

      let url = "";

      if (orgId) {
        url = `/organizations/${orgId}/programs?page=${pageNumber}&limit=8&status=${subTab === "closed" ? "closed" : "active"}`;
      } else {
        url =
          subTab === "closed"
            ? `/programs/archive?page=${pageNumber}&limit=8`
            : `/programs?page=${pageNumber}&limit=8&status=active`;
      }

      if (searchTerm.trim()) {
        url += `&search=${encodeURIComponent(searchTerm.trim())}`;
      }
      if (filterType !== "Всі типи") {
        url += `&type=${encodeURIComponent(filterType)}`;
      }
      if (filterDomain !== "Всі галузі") {
        url += `&domain=${encodeURIComponent(filterDomain)}`;
      }

      const response = await axiosInstance.get(url);

      const items =
        response.data?.programs ||
        response.data?.archived ||
        response.data?.items ||
        response.data ||
        [];

      setPrograms(Array.isArray(items) ? items : []);
      setCurrentPage(response.data?.currentPage || pageNumber);
      setTotalPages(response.data?.totalPages || 1);
    } catch (err) {
      console.error("💥 Помилка фетчу програм:", err);
      toast.error("Не вдалося завантажити програми");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchProgramsData(1);
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, filterType, filterDomain, subTab]);

  const handleCreateProgram = async (e) => {
    e.preventDefault();
    if (!newProgram.title.trim())
      return toast.error("Введіть назву конкурсу/журналу");

    try {
      setLoadingAction("createProgram");
      await axiosInstance.post("/programs", newProgram);
      toast.success("Програму успішно створено на платформі");
      setNewProgram({
        title: "",
        description: "",
        type: "Науковий журнал",
        domain: "Штучний інтелект & IT",
      });
      fetchProgramsData(1);
    } catch (err) {
      toast.error("Помилка створення програми");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      setLoadingAction(id);
      const newStatus = currentStatus === "active" ? "closed" : "active";
      await axiosInstance.patch(`/programs/${id}/toggle-status`, {
        status: newStatus,
      });
      toast.success(
        newStatus === "closed"
          ? "Програму перенесено в архів"
          : "Програму успішно активовано",
      );
      fetchProgramsData(currentPage);
    } catch (err) {
      toast.error("Помилка зміни статусу програми");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleDeleteProgram = async (id) => {
    if (
      !window.confirm(
        "Ви впевнені, що хочете безповоротно видалити цю програму?",
      )
    )
      return;
    try {
      setLoadingAction(id);
      await axiosInstance.delete(`/programs/${id}`);
      toast.success("Програму повністю видалено з платформи");
      fetchProgramsData(1);
    } catch (err) {
      toast.error("Помилка видалення програми");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleOpenEditModal = (program) => {
    setSelectedProgramForEdit(program);
    setIsEditModalOpen(true);
  };

  const handleEditSuccess = () => {
    setIsEditModalOpen(false);
    setSelectedProgramForEdit(null);
    fetchProgramsData(currentPage);
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setFilterType("Всі типи");
    setFilterDomain("Всі галузі");
  };

  return (
    <div className="space-y-6 text-left animate-[fadeIn_0.3s_ease-out]">
      {(userRole === "superadmin" || userRole === "admin") && (
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-6 rounded-3xl">
          <div className="flex items-center gap-2 mb-4 text-purple-600">
            <Plus size={18} className="stroke-[3]" />
            <h3 className="text-xs font-black uppercase tracking-wider text-[var(--text-dark)] m-0">
              Створити новий глобальний конкурс або журнал
            </h3>
          </div>
          <ProgramForm
            newProgram={newProgram}
            setNewProgram={setNewProgram}
            onSubmit={handleCreateProgram}
            loading={loadingAction === "createProgram"}
            organizationName={organizationName}
          />
        </div>
      )}

      <div className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] p-4 rounded-3xl space-y-4">
        <div className="flex gap-1.5 border-b border-[var(--border-color)] pb-2">
          <button
            onClick={() => setSubTab("active")}
            className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
              subTab === "active"
                ? "bg-purple-600 text-white"
                : "text-[var(--text-gray)] hover:text-[var(--text-dark)]"
            }`}
          >
            🔥 Активні програми
          </button>
          <button
            onClick={() => setSubTab("closed")}
            className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer ${
              subTab === "closed"
                ? "bg-[var(--bg-main)] border border-[var(--border-color)] text-red-500 font-bold"
                : "text-[var(--text-gray)] hover:text-[var(--text-dark)]"
            }`}
          >
            📁 Архів / Закриті
          </button>
        </div>

        <UniversalFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          searchPlaceholder="Пошук конкурсу чи журналу за назвою або описом..."
          onReset={handleResetFilters}
          dropdowns={[
            {
              value: filterType,
              onChange: setFilterType,
              options: [
                "Всі типи",
                "Науковий журнал",
                "Грантова програма",
                "Конкурс проєктів",
                "Конференція",
              ],
            },
            {
              value: filterDomain,
              onChange: setFilterDomain,
              options: [
                "Всі галузі",
                "Штучний інтелект & IT",
                "Технічні науки & Інженерія",
                "Медицина & Фармація",
                "Економіка & Менеджмент",
                "Гуманітарні науки",
              ],
            },
          ]}
        />
      </div>

      <div>
        {loading ? (
          <div className="py-24 flex flex-col justify-center items-center gap-2 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl">
            <Loader2 size={24} className="animate-spin text-purple-600" />
            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-gray)]">
              Оновлення списку програм платформи...
            </p>
          </div>
        ) : programs.length === 0 ? (
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl p-12 text-center text-xs font-bold uppercase tracking-wider text-[var(--text-gray)]">
            🔍 Жодної програми за вказаними критеріями не знайдено
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {programs.map((p, index) => (
              <UniversalCard
                key={p._id}
                item={p}
                variant="homeProgram"
                index={index}
                onEdit={handleOpenEditModal}
                onDelete={handleDeleteProgram}
                onToggleStatus={handleToggleStatus}
              />
            ))}
          </div>
        )}
      </div>

      {totalPages > 1 && !loading && (
        <div className="pt-2 border-t border-[var(--border-color)]">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={fetchProgramsData}
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
        loading={loadingAction === "editProgram"}
      />
    </div>
  );
};
