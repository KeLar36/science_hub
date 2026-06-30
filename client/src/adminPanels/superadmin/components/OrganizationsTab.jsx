import React, { useState, useMemo } from "react";
import UniversalFilters from "../../../components/UniversalFilters";
import Pagination from "../../../components/Pagination";
import {
  Building2,
  Link2,
  CheckCircle,
  XCircle,
  Clock,
  ExternalLink,
  Mail,
} from "lucide-react";

export default function OrganizationsTab({
  organizations = [],
  onUpdateStatus,
  loadingAction,
  onViewCabinet, // Функція переходу в кабінет організації з SuperAdminPage ( navigate(`/org-admin?orgId=${id}`) )
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("Всі статуси");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Глобальна фільтрація організацій за назвою, ЄДРПОУ або поштою творця
  const filteredOrganizations = useMemo(() => {
    return organizations.filter((org) => {
      if (!org) return false;

      const nameText = org.name ? String(org.name).toLowerCase() : "";
      const edrpouText = org.edrpou ? String(org.edrpou).toLowerCase() : "";
      const creatorEmail = org.creatorId?.email
        ? String(org.creatorId.email).toLowerCase()
        : "";
      const searchTarget = searchTerm.trim().toLowerCase();

      const matchesSearch =
        nameText.includes(searchTarget) ||
        edrpouText.includes(searchTarget) ||
        creatorEmail.includes(searchTarget);

      const matchesStatus =
        filterStatus === "Всі статуси" ||
        (filterStatus === "Верифіковані" && org.status === "approved") ||
        (filterStatus === "Очікують підтвердження" &&
          org.status === "pending") ||
        (filterStatus === "Відхилені" && org.status === "rejected");

      return matchesSearch && matchesStatus;
    });
  }, [organizations, searchTerm, filterStatus]);

  // Обчислення пагінації
  const totalPages = Math.ceil(filteredOrganizations.length / itemsPerPage);
  const paginatedOrgs = useMemo(() => {
    const offset = (currentPage - 1) * itemsPerPage;
    return filteredOrganizations.slice(offset, offset + itemsPerPage);
  }, [filteredOrganizations, currentPage]);

  // Скидаємо сторінку при зміні фільтрів
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus]);

  const handleResetFilters = () => {
    setSearchTerm("");
    setFilterStatus("Всі статуси");
  };

  // Конфігурація селекторів для твого компонента UniversalFilters
  const orgDropdowns = [
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
  ];

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
    <div className="space-y-4 text-left animate-in fade-in duration-150">
      {/* СИНХРОНІЗОВАНІ ФІЛЬТРИ ТА ПОШУК */}
      <UniversalFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        searchPlaceholder="Пошук установи за назвою, кодом ЄДРПОУ чи email творця..."
        dropdowns={orgDropdowns}
        onReset={handleResetFilters}
      />

      {/* РЕНДЕР КАРТОК ОРГАНІЗАЦІЙ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {paginatedOrgs.length === 0 ? (
          <div className="col-span-full bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl p-12 text-center text-sm text-[var(--text-gray)] font-medium">
            🔍 Жодної організації за вказаними критеріями фільтрації не
            знайдено.
          </div>
        ) : (
          paginatedOrgs.map((org) => (
            <div
              key={org._id}
              className="bg-[var(--bg-card)] border border-[var(--border-color)] p-6 rounded-3xl shadow-xs flex flex-col justify-between gap-4 transition-all hover:border-purple-500/20 relative"
            >
              {/* ВЕРХНЯ ЧАСТИНА КАРТКИ */}
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-purple-600/10 text-purple-600 font-black flex items-center justify-center shrink-0">
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
                    <div>
                      <h4 className="font-black text-base text-[var(--text-dark)] leading-tight max-w-[240px] md:max-w-[280px] break-words">
                        {org.name}
                      </h4>
                      <div className="text-[10px] font-mono font-bold text-[var(--text-gray)] mt-0.5">
                        Код ЄДРПОУ: {org.edrpou}
                      </div>
                    </div>
                  </div>
                  {getStatusBadge(org.status)}
                </div>

                <p className="text-xs text-[var(--text-gray)] font-medium leading-relaxed line-clamp-2">
                  {org.description || "Опис діяльності установи не надано."}
                </p>

                <div className="pt-2 border-t border-[var(--border-color)] space-y-1.5 text-[11px] font-semibold text-[var(--text-gray)]">
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
                    <button
                      onClick={() => onUpdateStatus(org._id, "approved")}
                      disabled={loadingAction === org._id}
                      className="flex-1 py-2 bg-emerald-500/10 hover:bg-emerald-500 hover:text-white border border-emerald-500/20 text-emerald-600 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all"
                    >
                      Підтвердити
                    </button>
                    <button
                      onClick={() => onUpdateStatus(org._id, "rejected")}
                      disabled={loadingAction === org._id}
                      className="flex-1 py-2 bg-red-500/10 hover:bg-red-500 hover:text-white border border-red-500/20 text-red-600 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all"
                    >
                      Відхилити
                    </button>
                  </>
                )}

                {org.status === "approved" && (
                  <>
                    {/* Кнопка швидкого входу суперадміна у внутрішній кабінет цієї установи */}
                    <button
                      onClick={() => onViewCabinet(org._id)}
                      className="flex-1 py-2 bg-purple-600 hover:bg-purple-700 text-white text-[10px] font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1 shadow-sm"
                    >
                      <ExternalLink size={12} /> Керувати кабінетом
                    </button>
                    <button
                      onClick={() => onUpdateStatus(org._id, "rejected")}
                      disabled={loadingAction === org._id}
                      className="px-3 py-2 bg-[var(--bg-main)] border border-[var(--border-color)] hover:border-red-500/30 hover:text-red-500 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all text-[var(--text-gray)]"
                      title="Анулювати верифікацію"
                    >
                      Блок
                    </button>
                  </>
                )}

                {org.status === "rejected" && (
                  <button
                    onClick={() => onUpdateStatus(org._id, "approved")}
                    disabled={loadingAction === org._id}
                    className="w-full py-2 bg-[var(--bg-main)] hover:bg-emerald-500 hover:text-white border border-[var(--border-color)] text-[var(--text-dark)] text-[10px] font-black uppercase tracking-wider rounded-xl transition-all"
                  >
                    Повернути в систему / Верифікувати
                  </button>
                )}
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
