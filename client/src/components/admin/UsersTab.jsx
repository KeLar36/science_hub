import React, { useState, useMemo } from "react";
import { Search, ShieldCheck, Ban, Crown, Loader2 } from "lucide-react";
import Pagination from "../Pagination";

const UsersTab = ({
  users,
  currentUser,
  onUpdateRole,
  onToggleBan,
  loadingAction,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const filteredUsers = useMemo(() => {
    return users.filter(
      (u) =>
        u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [users, searchTerm]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;
  const currentUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredUsers, currentPage]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-4 rounded-2xl flex items-center gap-3 shadow-xs max-w-md">
        <Search size={18} className="text-[var(--text-gray)]" />
        <input
          type="text"
          placeholder="Пошук за ім'ям або email..."
          className="w-full bg-transparent border-none outline-none text-sm text-[var(--text-dark)]"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--border-color)] bg-[var(--bg-main)] text-[var(--text-gray)] text-xs font-bold uppercase tracking-wider">
                <th className="p-4 pl-6">Користувач</th>
                <th className="p-4">Роль</th>
                <th className="p-4">Статус</th>
                <th className="p-4 pr-6 text-right">Дії</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)] font-medium">
              {currentUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="p-8 text-center text-[var(--text-gray)]"
                  >
                    Користувачів не знайдено
                  </td>
                </tr>
              ) : (
                currentUsers.map((u) => {
                  const isSelf = u._id === currentUser?._id;
                  const isSuperAdmin = u.role === "superadmin";

                  return (
                    <tr
                      key={u._id}
                      className="hover:bg-[var(--bg-main)]/40 transition-colors"
                    >
                      <td className="p-4 pl-6">
                        <div className="font-bold text-[var(--text-dark)]">
                          {u.name}
                        </div>
                        <div className="text-xs text-[var(--text-gray)] mt-0.5">
                          {u.email}
                        </div>
                      </td>
                      <td className="p-4">
                        {isSuperAdmin ? (
                          <span className="px-2.5 py-1 bg-amber-500/10 text-amber-500 rounded-md text-[10px] font-bold tracking-wider uppercase border border-amber-500/10 flex items-center gap-1 w-fit">
                            <Crown size={12} /> Superadmin
                          </span>
                        ) : isSelf ? (
                          <select
                            disabled
                            className="bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-dark)] rounded-lg px-2 py-1 text-xs font-bold opacity-60"
                            value={u.role}
                          >
                            <option value={u.role}>{u.role}</option>
                          </select>
                        ) : (
                          <select
                            className="bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-dark)] rounded-lg px-2 py-1 text-xs font-bold focus:border-purple-500 outline-none cursor-pointer"
                            value={u.role}
                            onChange={(e) =>
                              onUpdateRole(u._id, e.target.value)
                            }
                            disabled={loadingAction === u._id}
                          >
                            <option value="user">User</option>
                            <option value="reviewer">Reviewer</option>
                            <option value="content-manager">
                              Content Manager
                            </option>
                            <option value="admin">Admin</option>
                          </select>
                        )}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            u.isBanned
                              ? "bg-red-500/10 text-red-500 border border-red-500/10"
                              : "bg-emerald-500/10 text-emerald-500 border border-emerald-500/10"
                          }`}
                        >
                          {u.isBanned ? "Забанений" : "Активний"}
                        </span>
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {loadingAction === u._id ? (
                            <Loader2
                              size={16}
                              className="animate-spin text-purple-600 m-2"
                            />
                          ) : isSelf || isSuperAdmin ? null : (
                            <button
                              onClick={() => onToggleBan(u._id, u.isBanned)}
                              className={`p-2 rounded-xl transition-all ${
                                u.isBanned
                                  ? "hover:bg-emerald-500/10 text-emerald-500"
                                  : "hover:bg-red-500/10 text-red-500"
                              }`}
                              title={u.isBanned ? "Розбанити" : "Забанити"}
                            >
                              {u.isBanned ? (
                                <ShieldCheck size={16} />
                              ) : (
                                <Ban size={16} />
                              )}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="p-4 border-t border-[var(--border-color)]">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersTab;
