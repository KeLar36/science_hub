/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { UserCheck, UserX, Loader2, Mail, Calendar, Inbox } from "lucide-react";
import { Table } from "../ui/Table";
import { Pagination } from "../ui/Pagination";
import UniversalFilters from "../UniversalFilters";
import axiosInstance from "../../api/axios";
import toast from "react-hot-toast";

export const OrganizationRequestsTab = ({ orgId }) => {
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const [requests, setRequests] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchRequestsData = async (pageNumber = 1) => {
    try {
      setLoading(true);
      let url = `/organizations/requests/pending?page=${pageNumber}&limit=8`;

      if (orgId) url += `&orgId=${orgId}`;
      if (searchTerm.trim())
        url += `&search=${encodeURIComponent(searchTerm.trim())}`;

      const response = await axiosInstance.get(url);
      setRequests(response.data?.items || []);
      setCurrentPage(response.data?.currentPage || pageNumber);
      setTotalPages(response.data?.totalPages || 1);
    } catch (err) {
      console.error("💥 Помилка фетчу заявок:", err);
      toast.error("Не вдалося завантажити чергу заявок");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchRequestsData(1);
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const handleAction = async (userId, actionType) => {
    try {
      setActionLoading(userId);
      await axiosInstance.post(
        `/organizations/requests/${actionType}/${userId}`,
        { orgId },
      );
      toast.success(
        actionType === "accept"
          ? "Дослідника успішно зараховано"
          : "Заявку відхилено",
      );
      fetchRequestsData(currentPage);
    } catch (err) {
      toast.error("Помилка обробки запиту");
    } finally {
      setActionLoading(null);
    }
  };

  const headers = ["Дослідник / Контакти", "Дата подачі заявки", "Дія"];

  const renderRow = (item) => {
    const requester = item.user;
    if (!requester) return null;

    return (
      <tr
        key={item._id}
        className="border-b border-[var(--border-color)] text-xs font-semibold hover:bg-purple-600/[0.01] transition-colors"
      >
        <td className="px-6 py-4 text-left">
          <div className="font-black text-[var(--text-dark)] uppercase tracking-wide truncate">
            {requester.name}
          </div>
          <div className="text-[10px] text-[var(--text-gray)] font-medium flex items-center gap-1 mt-1">
            <Mail size={11} className="text-purple-500 shrink-0" />
            {requester.email}
          </div>
        </td>
        <td className="px-6 py-4 text-left font-mono text-[11px] text-[var(--text-gray)]">
          {new Date(item.createdAt).toLocaleDateString("uk-UA")}
        </td>
        <td className="px-6 py-4 text-right">
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => handleAction(requester._id, "reject")}
              disabled={actionLoading !== null}
              className="p-2 hover:bg-red-500/10 text-red-500 rounded-xl transition-all cursor-pointer disabled:opacity-30"
              title="Відхилити запит"
            >
              <UserX size={15} />
            </button>
            <button
              onClick={() => handleAction(requester._id, "accept")}
              disabled={actionLoading !== null}
              className="p-2 hover:bg-emerald-500/10 text-emerald-500 rounded-xl transition-all cursor-pointer disabled:opacity-30 flex items-center justify-center"
              title="Прийняти в організацію"
            >
              {actionLoading === requester._id ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <UserCheck size={15} />
              )}
            </button>
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className="space-y-4 text-left animate-[fadeIn_0.3s_ease-out]">
      <div className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] p-4 rounded-3xl">
        <UniversalFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          searchPlaceholder="Пошук заявки за іменем або email..."
          onReset={() => setSearchTerm("")}
          dropdowns={[]}
        />
      </div>

      <div className="w-full">
        {loading ? (
          <div className="py-20 flex justify-center items-center bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[32px]">
            <Loader2 size={24} className="animate-spin text-purple-600" />
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-20 bg-[var(--bg-card)] rounded-[32px] border border-[var(--border-color)] border-dashed p-8">
            <Inbox
              className="mx-auto mb-4 text-[var(--border-color)]"
              size={40}
            />
            <p className="text-xs font-black text-[var(--text-gray)] uppercase tracking-widest">
              Черга заявок порожня
            </p>
          </div>
        ) : (
          <Table
            headers={headers}
            data={requests}
            renderRow={renderRow}
            isLoading={loading}
          />
        )}
      </div>

      {totalPages > 1 && !loading && (
        <div className="pt-2 border-t border-[var(--border-color)]">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={fetchRequestsData}
          />
        </div>
      )}
    </div>
  );
};
