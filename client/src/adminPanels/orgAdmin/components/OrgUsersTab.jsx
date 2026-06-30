import React, { useState, useMemo } from "react";
import UniversalFilters from "../../../components/UniversalFilters";
import Pagination from "../../../components/Pagination";
import { Mail, Shield, ShieldAlert, Ban } from "lucide-react";

export default function OrgUsersTab({
  users = [],
  currentUser,
  onUpdateRole,
  onToggleBan,
  loadingAction,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("Всі ролі");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = filterRole === "Всі ролі" || u.role === filterRole;
      return matchesSearch && matchesRole;
    });
  }, [users, searchTerm, filterRole]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = useMemo(() => {
    const offset = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(offset, offset + itemsPerPage);
  }, [filteredUsers, currentPage]);

  return (
    <div className="space-y-4 text-left">
      <UniversalFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Пошук співробітника за ім'ям або email..."
        filters={[
          {
            id: "role",
            label: "Посада",
            value: filterRole,
            onChange: setFilterRole,
            options: [
              "Всі ролі",
              "user",
              "admin",
              "reviewer",
              "content-manager",
            ],
          },
        ]}
      />

      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[var(--border-color)] bg-[var(--bg-main)]/50 text-[10px] font-black uppercase tracking-wider text-[var(--text-gray)]">
                <th className="px-6 py-4">Співробітник</th>
                <th className="px-6 py-4">Поточна роль</th>
                <th className="px-6 py-4 text-right">Модерація</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)] text-xs font-semibold text-[var(--text-dark)]">
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan="3"
                    className="px-6 py-12 text-center text-[var(--text-gray)] font-medium"
                  >
                    Науковців за вказаними фільтрами не знайдено.
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((u) => (
                  <tr
                    key={u._id}
                    className="hover:bg-[var(--bg-main)]/30 transition-all"
                  >
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-purple-600/10 text-purple-600 font-bold flex items-center justify-center uppercase">
                        {u.name?.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-sm">
                          {u.name}{" "}
                          {u._id === currentUser?._id && (
                            <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded-md border border-purple-100">
                              Ви
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-[var(--text-gray)] font-medium flex items-center gap-1 mt-0.5">
                          <Mail size={12} /> {u.email}
                        </div>
                      </div>
                    </td>
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
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => onToggleBan(u._id, u.isBanned)}
                        disabled={
                          u._id === currentUser?._id || u.role === "superadmin"
                        }
                        className={`px-3 py-1.5 border rounded-xl text-[11px] font-black uppercase tracking-wider flex items-center gap-1 ml-auto transition-all ${
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
