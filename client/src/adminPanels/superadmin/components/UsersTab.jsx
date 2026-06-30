import React, { useState, useMemo } from "react";
import UniversalFilters from "../../../components/UniversalFilters";
import Pagination from "../../../components/Pagination";
import { Mail, Ban, Building2, ShieldAlert } from "lucide-react";

export default function UsersTab({
  users = [],
  currentUser,
  onUpdateRole,
  onToggleBan,
  loadingAction,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("Всі ролі");
  const [filterStatus, setFilterStatus] = useState("Всі статуси");
  const [filterOrg, setFilterOrg] = useState("Всі установи");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Динамічно збираємо список усіх наявних установ для фільтра
  const uniqueOrganizations = useMemo(() => {
    const orgs = new Set();
    users.forEach((u) => {
      const orgName =
        u.organizationId?.name ||
        (typeof u.organizationId === "string" ? u.organizationId : null);
      if (orgName) orgs.add(orgName);
    });
    return ["Всі установи", ...Array.from(orgs)];
  }, [users]);

  // Глибока фільтрація: Пошук + Роль + Статус + Установа
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      if (!u) return false;

      const titleText = u.name ? String(u.name).toLowerCase() : "";
      const emailText = u.email ? String(u.email).toLowerCase() : "";
      const searchTarget = searchTerm.trim().toLowerCase();

      const matchesSearch =
        titleText.includes(searchTarget) || emailText.includes(searchTarget);
      const matchesRole = filterRole === "Всі ролі" || u.role === filterRole;
      const matchesStatus =
        filterStatus === "Всі статуси" ||
        (filterStatus === "Заблоковані" && u.isBanned === true) ||
        (filterStatus === "Активні" && !u.isBanned);

      const currentOrgName =
        u.organizationId?.name ||
        (typeof u.organizationId === "string" ? u.organizationId : "");
      const matchesOrg =
        filterOrg === "Всі установи" || currentOrgName === filterOrg;

      return matchesSearch && matchesRole && matchesStatus && matchesOrg;
    });
  }, [users, searchTerm, filterRole, filterStatus, filterOrg]);

  // Пагінація
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = useMemo(() => {
    const offset = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(offset, offset + itemsPerPage);
  }, [filteredUsers, currentPage]);

  // Скидання пагінації на 1 сторінку при зміні фільтрів
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterRole, filterStatus, filterOrg]);

  // Функція для повного скидання всіх фільтрів (передається в onReset)
  const handleResetFilters = () => {
    setSearchTerm("");
    setFilterRole("Всі ролі");
    setFilterStatus("Всі статуси");
    setFilterOrg("Всі установи");
  };

  // 🟢 ОНОВЛЕНО КОНФІГУРАЦІЮ: тепер пропси збігаються з UniversalFilters на 100%
  const advancedDropdowns = [
    {
      value: filterRole,
      onChange: setFilterRole,
      options: [
        "Всі ролі",
        "user",
        "reviewer",
        "content-manager",
        "admin",
        "superadmin",
      ],
    },
    {
      value: filterStatus,
      onChange: setFilterStatus,
      options: ["Всі статуси", "Активні", "Заблоковані"],
    },
    {
      value: filterOrg,
      onChange: setFilterOrg,
      options: uniqueOrganizations,
    },
  ];

  return (
    <div className="space-y-4 text-left animate-in fade-in duration-150">
      {/* 🟢 КОРЕКТНО СИНХРОНІЗОВАНІ ФІЛЬТРИ */}
      <UniversalFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm} // Передаємо правильне ім'я пропсу
        searchPlaceholder="Пошук користувача за ім'ям чи email..."
        dropdowns={advancedDropdowns} // Передаємо саме як dropdowns, а не filters
        onReset={handleResetFilters}
      />

      {/* ТАБЛИЦЯ КЕРУВАННЯ КОРИСТУВАЧАМИ МЕРЕЖІ */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--border-color)] bg-[var(--bg-main)]/50 text-[10px] font-black uppercase tracking-wider text-[var(--text-gray)]">
                <th className="px-6 py-4">Користувач системи</th>
                <th className="px-6 py-4">Установа / Організація</th>
                <th className="px-6 py-4">Призначити роль</th>
                <th className="px-6 py-4 text-right">Статус доступу</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)] text-xs font-semibold text-[var(--text-dark)]">
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="px-6 py-12 text-center text-[var(--text-gray)] font-medium"
                  >
                    🔍 Користувачів за вказаними критеріями пошуку не виявлено.
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((u) => (
                  <tr
                    key={u._id}
                    className="hover:bg-[var(--bg-main)]/30 transition-all"
                  >
                    {/* ПРОФІЛЬ ТА EMAIL */}
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-purple-600/10 text-purple-600 font-bold flex items-center justify-center uppercase shrink-0">
                        {u.name?.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-sm flex items-center gap-1.5">
                          {u.name}
                          {u._id === currentUser?._id && (
                            <span className="text-[9px] font-black tracking-wider uppercase text-purple-600 bg-purple-500/5 px-1.5 py-0.5 rounded-md border border-purple-500/10">
                              Це ви
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-[var(--text-gray)] font-medium flex items-center gap-1 mt-0.5">
                          <Mail size={12} /> {u.email}
                        </div>
                      </div>
                    </td>

                    {/* СТАТУС ОРГАНІЗАЦІЇ */}
                    <td className="px-6 py-4">
                      {u.organizationId?.name ? (
                        <div className="flex items-center gap-1.5 text-[var(--text-dark)] max-w-[220px] truncate">
                          <Building2
                            size={14}
                            className="text-purple-500 shrink-0"
                          />
                          <span className="font-bold truncate">
                            {u.organizationId.name}
                          </span>
                        </div>
                      ) : u.role === "admin" ? (
                        <div className="flex items-center gap-1 text-red-500 bg-red-500/5 px-2 py-1 rounded-lg border border-red-500/10 w-fit font-black text-[10px] uppercase tracking-wide">
                          <ShieldAlert size={12} /> Потребує прив'язки
                        </div>
                      ) : (
                        <span className="text-[11px] text-[var(--text-gray)] font-medium italic">
                          Незалежний дослідник
                        </span>
                      )}
                    </td>

                    {/* СЕЛЕКТОР РОЛЕЙ */}
                    <td className="px-6 py-4">
                      <select
                        value={u.role}
                        disabled={
                          u._id === currentUser?._id || loadingAction === u._id
                        }
                        onChange={(e) => onUpdateRole(u._id, e.target.value)}
                        className="bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl px-3 py-1.5 outline-none focus:border-purple-600 font-bold cursor-pointer text-xs"
                      >
                        <option value="user">User / Автор</option>
                        <option value="reviewer">Reviewer / Рецензент</option>
                        <option value="content-manager">Content Manager</option>
                        <option value="admin">Admin Організації</option>
                        <option value="superadmin">
                          👑 SuperAdmin системи
                        </option>
                      </select>
                    </td>

                    {/* БАН КНОПКА */}
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => onToggleBan(u._id, u.isBanned)}
                        disabled={u._id === currentUser?._id}
                        className={`px-3 py-1.5 border rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1 ml-auto transition-all ${
                          u.isBanned
                            ? "bg-red-500/10 border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white"
                            : "bg-[var(--bg-main)] border-[var(--border-color)] text-[var(--text-gray)] hover:text-red-500 hover:border-red-500/20"
                        }`}
                      >
                        <Ban size={12} /> {u.isBanned ? "Заблокований" : "Бан"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
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
