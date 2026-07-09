/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import {
  Building2,
  Link2,
  CheckCircle,
  XCircle,
  Clock,
  ExternalLink,
  Mail,
  Loader2,
  Layers,
  Scale,
  MapPin,
} from "lucide-react";
import UniversalFilters from "../UniversalFilters";
import { Pagination } from "../ui/Pagination";
import { Button } from "../ui/Button";
import axiosInstance from "../../api/axios";
import toast from "react-hot-toast";

export const OrganizationsManagement = ({ onViewCabinet }) => {
  const [loading, setLoading] = useState(true);
  const [loadingAction, setLoadingAction] = useState(null);

  const [organizations, setOrganizations] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("Всі статуси");

  const getBackendStatus = (statusLabel) => {
    switch (statusLabel) {
      case "Очікують підтвердження":
        return "pending";
      case "Верифіковані":
        return "approved";
      case "Відхилені":
        return "rejected";
      default:
        return "";
    }
  };

  const fetchOrganizations = async (pageNumber = 1) => {
    try {
      setLoading(true);

      const validatedPage =
        Number.isNaN(Number(pageNumber)) || typeof pageNumber === "object"
          ? 1
          : Number(pageNumber);

      let url = `/organizations/all?page=${validatedPage}&limit=8`;

      if (searchTerm.trim()) {
        url += `&search=${encodeURIComponent(searchTerm.trim())}`;
      }

      const backendStatus = getBackendStatus(filterStatus);
      if (backendStatus) {
        url += `&status=${encodeURIComponent(backendStatus)}`;
      }

      const response = await axiosInstance.get(url);

      const items = response.data?.organizations || response.data?.items || [];
      setOrganizations(items);

      setCurrentPage(Number(response.data?.currentPage) || pageNumber);
      setTotalPages(Number(response.data?.totalPages) || 1);
    } catch (err) {
      console.error("💥 Помилка фетчу організацій:", err);
      toast.error("Не вдалося завантажити список установ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchOrganizations(1);
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, filterStatus]);

  const handleUpdateStatus = async (id, status) => {
    try {
      setLoadingAction(id);
      await axiosInstance.patch(`/organizations/${id}/status`, { status });

      if (status === "rejected") {
        toast.success(
          "Заявку відхилено (історію збережено, код ЄДРПОУ звільнено)",
        );
      } else {
        toast.success("Статус установи успішно оновлено");
      }

      fetchOrganizations(currentPage);
    } catch (err) {
      console.error("💥 Помилка зміни статусу:", err);
      toast.error(err.response?.data?.error || "Помилка оновлення статусу");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setFilterStatus("Всі статуси");
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return (
          <div className="flex items-center gap-1 text-emerald-500 bg-emerald-500/5 px-2 py-1 rounded-lg border border-emerald-500/10 font-black text-[9px] uppercase tracking-wide w-fit">
            <CheckCircle size={11} /> Верифікована
          </div>
        );
      case "rejected":
        return (
          <div className="flex items-center gap-1 text-red-500 bg-red-500/5 px-2 py-1 rounded-lg border border-red-500/10 font-black text-[9px] uppercase tracking-wide w-fit">
            <XCircle size={11} /> Відхилена
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-1 text-amber-500 bg-amber-500/5 px-2 py-1 rounded-lg border border-amber-500/10 font-black text-[9px] uppercase tracking-wide w-fit">
            <Clock size={11} /> Очікує апруву
          </div>
        );
    }
  };

  return (
    <div className="space-y-4 text-left animate-[fadeIn_0.3s_ease-out]">
      <div className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] p-4 rounded-3xl">
        <UniversalFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          searchPlaceholder="Пошук установи за назвою, кодом ЄДРПОУ чи email творця..."
          onReset={handleResetFilters}
          dropdowns={[
            {
              value: filterStatus,
              onChange: setFilterStatus,
              options: [
                "Всі статуси",
                "Очікують підтвердження",
                "Верифіковані",
                "Відхилені",
              ],
            },
          ]}
        />
      </div>

      {loading ? (
        <div className="py-24 flex flex-col justify-center items-center gap-2 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl">
          <Loader2 size={24} className="animate-spin text-purple-600" />
          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-gray)]">
            Синхронізація списку установ...
          </p>
        </div>
      ) : organizations.length === 0 ? (
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl p-12 text-center text-xs font-bold uppercase tracking-wider text-[var(--text-gray)]">
          🔍 Жодної організації за вказаними критеріями не знайдено
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {organizations.map((org) => (
            <div
              key={org._id}
              className="bg-[var(--bg-card)] border border-[var(--border-color)] p-6 rounded-3xl shadow-xs flex flex-col justify-between gap-4 transition-all hover:border-purple-500/20 relative"
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-purple-600/10 text-purple-600 font-black flex items-center justify-center shrink-0 border border-purple-600/10">
                      {org.logo ? (
                        <img
                          src={org.logo}
                          alt={org.name}
                          className="w-full h-full object-cover rounded-2xl"
                        />
                      ) : (
                        <Building2 size={20} />
                      )}
                    </div>
                    <div className="min-w-0 text-left">
                      <h4 className="font-black text-base text-[var(--text-dark)] leading-tight truncate max-w-[180px] sm:max-w-[240px] uppercase tracking-wide">
                        {org.name}
                      </h4>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] font-bold text-[var(--text-gray)] mt-0.5">
                        <span className="font-mono bg-[var(--bg-main)] px-1.5 py-0.5 rounded border border-[var(--border-color)]">
                          ЄДРПОУ: {org.edrpou?.split("-rejected")[0]}
                        </span>
                        {org.city && (
                          <span className="flex items-center gap-0.5 text-purple-600">
                            <MapPin size={10} /> {org.city}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {getStatusBadge(org.status)}
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  <div className="flex items-center gap-1 bg-purple-600/5 border border-purple-600/10 text-purple-600 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide">
                    <Layers size={10} /> {org.type || "Університет"}
                  </div>
                  <div className="flex items-center gap-1 bg-blue-600/5 border border-blue-600/10 text-blue-600 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide">
                    <Scale size={10} /> {org.legalForm || "ДУ/КЗ"}
                  </div>
                </div>

                <p className="text-xs text-[var(--text-gray)] font-medium leading-relaxed line-clamp-2 text-left pt-1">
                  {org.description || "Опис діяльності установи не надано."}
                </p>

                <div className="pt-2 border-t border-[var(--border-color)] space-y-1.5 text-[11px] font-semibold text-[var(--text-gray)] text-left">
                  <div className="flex items-center gap-1">
                    👑 Заявник:{" "}
                    <span className="text-[var(--text-dark)] font-bold">
                      {org.creatorId?.name || "Система"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Mail size={12} className="text-purple-500" /> Email:{" "}
                    <span className="text-[var(--text-dark)] font-mono">
                      {org.creatorId?.email || "—"}
                    </span>
                  </div>
                  {org.website && (
                    <a
                      href={org.website}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-purple-600 hover:underline w-fit"
                    >
                      <Link2 size={12} /> Офіційний сайт установи
                    </a>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-[var(--border-color)]">
                {org.status === "pending" && (
                  <>
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => handleUpdateStatus(org._id, "approved")}
                      disabled={loadingAction === org._id}
                      className="flex-1 uppercase text-[10px] tracking-wider rounded-xl font-black"
                    >
                      Підтвердити
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleUpdateStatus(org._id, "rejected")}
                      disabled={loadingAction === org._id}
                      className="flex-1 uppercase text-[10px] tracking-wider rounded-xl font-black"
                    >
                      Відхилити
                    </Button>
                  </>
                )}

                {org.status === "approved" && (
                  <>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => onViewCabinet(org._id)}
                      className="flex-1 text-[10px] tracking-wider uppercase rounded-xl font-black flex items-center justify-center gap-1"
                    >
                      <ExternalLink size={12} /> Керувати кабінетом
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUpdateStatus(org._id, "rejected")}
                      disabled={loadingAction === org._id}
                      className="px-3 border-[var(--border-color)] text-[var(--text-gray)] hover:text-red-500 hover:border-red-500/20 text-[10px] uppercase font-black rounded-xl"
                    >
                      Блок
                    </Button>
                  </>
                )}

                {org.status === "rejected" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUpdateStatus(org._id, "approved")}
                    disabled={loadingAction === org._id}
                    className="w-full text-[10px] tracking-wider uppercase rounded-xl font-black"
                  >
                    Повернути в систему
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && !loading && (
        <div className="pt-4 border-t border-[var(--border-color)]">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={fetchOrganizations}
          />
        </div>
      )}
    </div>
  );
};
