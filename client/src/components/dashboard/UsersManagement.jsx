/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import {
  Mail,
  Ban,
  Building2,
  ShieldAlert,
  Loader2,
  UserCheck,
} from "lucide-react";
import UniversalFilters from "../UniversalFilters";
import { Table } from "../ui/Table";
import { Pagination } from "../ui/Pagination";
import { Button } from "../ui/Button";
import axiosInstance from "../../api/axios";
import toast from "react-hot-toast";
import AssignReviewerModal from "./AssignReviewerModal";

export const UsersManagement = ({
  currentUser,
  userRole,
  orgId,
  enableRoleManagement = false,
}) => {
  const [loading, setLoading] = useState(true);
  const [loadingAction, setLoadingAction] = useState(null);

  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("Всі ролі");
  const [filterStatus, setFilterStatus] = useState("Всі статуси");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserForModal, setSelectedUserForModal] = useState(null);

  const isSuperAdmin = userRole === "superadmin";
  const isOrgAdmin = userRole === "admin" && !!orgId;

  const fetchUsersData = async (pageNumber = 1) => {
    try {
      setLoading(true);

      let url = isOrgAdmin
        ? `/organizations/${orgId}/users?page=${pageNumber}&limit=8`
        : `/users/all?page=${pageNumber}&limit=8`;

      if (searchTerm.trim()) {
        url += `&search=${encodeURIComponent(searchTerm.trim())}`;
      }
      if (filterRole !== "Всі ролі") {
        url += `&role=${encodeURIComponent(filterRole)}`;
      }

      if (filterStatus === "Заблоковані") {
        url += `&isBanned=true`;
      } else if (filterStatus === "Активні") {
        url += `&isBanned=false`;
      }

      const response = await axiosInstance.get(url);
      const fetchedItems =
        response.data?.users || response.data?.items || response.data || [];

      setUsers(Array.isArray(fetchedItems) ? fetchedItems : []);
      setCurrentPage(response.data?.currentPage || pageNumber);
      setTotalPages(response.data?.totalPages || 1);
    } catch (err) {
      console.error("💥 Помилка фетчу користувачів:", err);
      toast.error("Не вдалося завантажити список команди");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchUsersData(1);
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm, filterRole, filterStatus]);

  const handleUpdateRole = async (userId, newRole) => {
    try {
      setLoadingAction(`role_${userId}`);

      const url = isOrgAdmin
        ? `/organizations/${orgId}/users/${userId}/role`
        : `/users/role/${userId}`;

      await axiosInstance.patch(url, { role: newRole });
      toast.success("Роль користувача успішно змінено");
      fetchUsersData(currentPage);
    } catch (err) {
      toast.error(err.response?.data?.error || "Помилка зміни ролі");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleSaveReviewerRequirements = async (userId, payload) => {
    try {
      setLoadingAction(`role_${userId}`);

      const url = isOrgAdmin
        ? `/organizations/${orgId}/users/${userId}/role`
        : `/users/role/${userId}`;

      await axiosInstance.patch(url, payload);
      toast.success("Рецензента успішно акредитовано! 🟣");
      fetchUsersData(currentPage);
    } catch (err) {
      toast.error("Не вдалося зберегти налаштування рецензента");
    } finally {
      setLoadingAction(null);
    }
  };

  const onRoleSelectChange = (u, targetRole) => {
    if (targetRole === "reviewer") {
      setSelectedUserForModal(u);
      setIsModalOpen(true);
    } else {
      handleUpdateRole(u._id, targetRole);
    }
  };

  const handleToggleBan = async (userId, status) => {
    try {
      setLoadingAction(`ban_${userId}`);
      await axiosInstance.patch(`/users/ban/${userId}`, { isBanned: !status });
      toast.success(
        status ? "Користувача розбанено" : "Користувача заблоковано",
      );
      fetchUsersData(currentPage);
    } catch (err) {
      toast.error("Помилка блокування");
    }
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setFilterRole("Всі ролі");
    setFilterStatus("Всі статуси");
  };

  const headers = isSuperAdmin
    ? [
        "Користувач системи",
        "Установа / Організація",
        "Призначити роль",
        "Статус доступу",
      ]
    : enableRoleManagement
      ? ["Член команди", "Внутрішня роль організації", "Статус доступу"]
      : ["Користувач системи", "Статус доступу"];

  const renderRow = (u) => {
    const currentRole = isOrgAdmin ? u.orgRole || "member" : u.role;

    return (
      <tr
        key={u._id}
        className={`border-b border-[var(--border-color)] text-xs font-semibold hover:bg-purple-600/[0.01] transition-colors ${
          u.isBanned ? "opacity-60 bg-red-500/[0.01]" : ""
        }`}
      >
        <td className="px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl overflow-hidden shrink-0 border border-purple-600/10 flex items-center justify-center bg-purple-600/10 text-purple-600">
              {u.image ? (
                <img
                  src={u.image}
                  alt={u.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="font-black text-xs uppercase">
                  {u.name ? u.name[0].toUpperCase() : "U"}
                </span>
              )}
            </div>
            <div className="min-w-0">
              <p className="font-black text-[var(--text-dark)] uppercase tracking-wide truncate">
                {u.name}
              </p>
              <div className="flex items-center gap-1 text-[10px] text-[var(--text-gray)] mt-0.5 font-medium truncate">
                <Mail size={10} /> {u.email}
              </div>
            </div>
          </div>
        </td>

        {isSuperAdmin && (
          <td className="px-6 py-4">
            {u.organizationId ? (
              <div className="flex items-center gap-1.5 text-[var(--text-dark)] font-bold">
                <Building2 size={12} className="text-purple-600 shrink-0" />
                <span className="truncate max-w-[160px]">
                  {u.organizationId.name}
                </span>
              </div>
            ) : (
              <span className="text-[10px] font-mono font-bold text-[var(--text-gray)] uppercase tracking-wider bg-[var(--bg-main)] px-2 py-1 rounded-md border border-[var(--border-color)]">
                Вільний науковець
              </span>
            )}
          </td>
        )}

        {(isSuperAdmin || (isOrgAdmin && enableRoleManagement)) && (
          <td className="px-6 py-4">
            <div className="relative w-fit">
              <select
                value={currentRole}
                disabled={
                  u._id === currentUser?._id ||
                  loadingAction === `role_${u._id}` ||
                  u.isBanned
                }
                onChange={(e) => onRoleSelectChange(u, e.target.value)}
                className="bg-[var(--bg-main)] border border-[var(--border-color)] rounded-lg px-2.5 py-1.5 text-[11px] font-black uppercase tracking-wider text-[var(--text-dark)] appearance-none pr-6 cursor-pointer focus:border-purple-500 outline-hidden disabled:opacity-50 disabled:cursor-not-allowed font-sans"
              >
                {isOrgAdmin ? (
                  <>
                    <option value="member">Співробітник (Member)</option>
                    <option value="reviewer">Рецензент (Reviewer)</option>
                    <option value="content-manager">Контент-менеджер</option>
                    <option value="admin">Адмін організації</option>
                  </>
                ) : (
                  <>
                    <option value="user">User</option>
                    <option value="reviewer">Reviewer</option>
                    <option value="content-manager">Content Manager</option>
                    <option value="admin">Admin</option>
                    <option value="superadmin">SuperAdmin</option>
                  </>
                )}
              </select>
              <UserCheck
                size={11}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-purple-600 pointer-events-none"
              />
            </div>
          </td>
        )}

        <td className="px-6 py-4 text-right">
          {isSuperAdmin ? (
            <Button
              variant={u.isBanned ? "danger" : "outline"}
              size="sm"
              disabled={
                u._id === currentUser?._id || loadingAction === `ban_${u._id}`
              }
              onClick={() => handleToggleBan(u._id, u.isBanned)}
              className="ml-auto text-[10px] uppercase font-black tracking-wider rounded-lg cursor-pointer"
            >
              {loadingAction === `ban_${u._id}` ? (
                <Loader2 size={10} className="animate-spin" />
              ) : u.isBanned ? (
                "Заблокований"
              ) : (
                "Бан"
              )}
            </Button>
          ) : (
            <span
              className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide border ${
                u.isBanned
                  ? "bg-red-500/10 border-red-500/10 text-red-500"
                  : "bg-emerald-500/10 border-emerald-500/10 text-emerald-600"
              }`}
            >
              {u.isBanned ? "Блок системи" : "Активний"}
            </span>
          )}
        </td>
      </tr>
    );
  };

  const rolesOptions = isSuperAdmin
    ? ["Всі ролі", "user", "reviewer", "content-manager", "admin", "superadmin"]
    : ["Всі ролі", "member", "reviewer", "content-manager", "admin"];

  return (
    <div className="space-y-4 text-left animate-[fadeIn_0.3s_ease-out]">
      <div className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] p-4 rounded-3xl">
        <UniversalFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          searchPlaceholder={
            isOrgAdmin
              ? "Пошук колеги за ім'ям чи email..."
              : "Пошук користувача за ім'ям чи email..."
          }
          onReset={handleResetFilters}
          dropdowns={[
            {
              value: filterRole,
              onChange: setFilterRole,
              options: rolesOptions,
            },
            {
              value: filterStatus,
              onChange: setFilterStatus,
              options: ["Всі статуси", "Активні", "Заблоковані"],
            },
          ]}
        />
      </div>

      {loading ? (
        <div className="py-24 flex flex-col justify-center items-center gap-2 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl">
          <Loader2 size={24} className="animate-spin text-purple-600" />
          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-gray)]">
            Синхронізація списку команди...
          </p>
        </div>
      ) : users.length === 0 ? (
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl p-12 text-center text-xs font-bold uppercase tracking-wider text-[var(--text-gray)]">
          🔍 Жодного співробітника не знайдено
        </div>
      ) : (
        <div className="w-full">
          <Table
            headers={headers}
            data={users}
            renderRow={renderRow}
            isLoading={loading}
          />
        </div>
      )}

      {totalPages > 1 && !loading && (
        <div className="pt-2 border-t border-[var(--border-color)]">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={fetchUsersData}
          />
        </div>
      )}

      <AssignReviewerModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedUserForModal(null);
        }}
        user={selectedUserForModal}
        onSave={handleSaveReviewerRequirements}
      />
    </div>
  );
};
