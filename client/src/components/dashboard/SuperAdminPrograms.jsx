/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Calendar,
  Trash2,
  RefreshCw,
  Search,
  AlertTriangle,
  Clock,
  ShieldAlert,
  CheckCircle,
  Loader2,
} from "lucide-react";
import axiosInstance from "../../api/axios";
import toast from "react-hot-toast";
import { Pagination } from "../ui/Pagination";

export default function SuperAdminPrograms() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchPrograms = async (pageNumber = 1) => {
    setLoading(true);
    try {
      let url = `/programs?page=${pageNumber}&limit=8`;

      if (searchTerm.trim()) {
        url += `&search=${encodeURIComponent(searchTerm.trim())}`;
      }

      const response = await axiosInstance.get(url);
      const data =
        response.data?.programs || response.data?.items || response.data || [];

      setPrograms(Array.isArray(data) ? data : []);
      setCurrentPage(response.data?.currentPage || pageNumber);
      setTotalPages(response.data?.totalPages || 1);
    } catch (err) {
      console.error("💥 Помилка завантаження програм:", err);
      toast.error("Не вдалося синхронізувати список програм");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchPrograms(1);
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const handleTriggerDeadline = async (programId) => {
    if (
      !window.confirm(
        "Ви впевнені, що хочете примусово завершити прийом заявок? Чернетки та відхилені роботи будуть видалені, а проєкти 'На розгляді' залишаться.",
      )
    )
      return;

    setActionLoading(`deadline_${programId}`);
    try {
      await axiosInstance.post(`/programs/${programId}/deadline`);
      toast.success("Прийом заявок зупинено. Простір очищено від чернеток! ⏰");
      fetchPrograms(currentPage);
    } catch (err) {
      toast.error(err.response?.data?.error || "Помилка зупинки програми");
    } finally {
      setActionLoading(null);
    }
  };

  const handleFinalCleanup = async (programId) => {
    const check = window.confirm(
      "🚨 УВАГА! Ця дія БЕЗЖАЛЬНО ВИДАЛИТЬ усі проєкти цієї програми з бази даних та Cloudinary, які НЕ мають статусу 'Прийнято'. Сховище Free Tier буде повністю оптимізовано. Продовжити?",
    );
    if (!check) return;

    setActionLoading(`cleanup_${programId}`);
    try {
      await axiosInstance.post(`/programs/${programId}/final-cleanup`);
      toast.success(
        "Сховище Cloudinary та БД успішно оптимізовано під нуль! ♻️💜",
      );
      fetchPrograms(currentPage);
    } catch (err) {
      toast.error(err.response?.data?.error || "Помилка оптимізації сховища");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6 text-left animate-[fadeIn_0.3s_ease-out]">
      <div className="bg-amber-500/5 border border-amber-500/10 p-4 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center gap-3.5">
        <div className="p-2.5 bg-amber-500/10 text-amber-500 rounded-2xl shrink-0">
          <ShieldAlert size={20} />
        </div>
        <div>
          <h4 className="text-xs font-black text-[var(--text-dark)] uppercase tracking-wide">
            Панель глобального контролю Free Tier (Тільки для SuperAdmin)
          </h4>
          <p className="text-[11px] text-[var(--text-gray)] font-medium mt-0.5 leading-relaxed">
            Керуйте життєвим циклом наукових програм. М'яка чистка зупиняє
            прийом та видаляє чернетки. Фінальна чистка повністю звільняє ліміти
            Cloudinary, залишаючи в базі лише затверджені роботи.
          </p>
        </div>
      </div>

      <div className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] p-4 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-gray)]"
            size={14}
          />
          <input
            type="text"
            placeholder="Пошук програми за назвою чи типом (Грант, Конференція...)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-main)] text-xs border border-[var(--border-color)] text-[var(--text-dark)] rounded-xl focus:border-purple-500 focus:outline-none transition-all placeholder:text-[var(--text-gray)]/70 font-semibold"
          />
        </div>
        <button
          onClick={() => fetchPrograms(currentPage)}
          className="px-4 py-2.5 bg-[var(--bg-main)] hover:bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-dark)] rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <RefreshCw size={13} className="text-purple-600" /> Оновити дані
        </button>
      </div>

      {loading ? (
        <div className="py-24 flex flex-col justify-center items-center gap-2 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl">
          <Loader2 size={24} className="animate-spin text-purple-600" />
          <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-gray)]">
            Завантажуємо наукові реєстри...
          </p>
        </div>
      ) : programs.length === 0 ? (
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl p-12 text-center text-xs font-bold uppercase tracking-wider text-[var(--text-gray)]">
          🔍 Жодної програми не знайдено
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {programs.map((program) => {
            const isDeadlinePassed = new Date(program.deadline) <= new Date();

            return (
              <div
                key={program._id}
                className={`p-5 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-5 transition-colors duration-300 hover:border-purple-500/30 dark:hover:border-purple-400/30 ${
                  !program.active ? "opacity-75 bg-[var(--bg-main)]/20" : ""
                }`}
              >
                <div className="space-y-2 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[9px] font-black uppercase tracking-widest bg-purple-500/10 text-purple-600 px-2.5 py-0.5 rounded-md border border-purple-500/10">
                      {program.type || "Програма"}
                    </span>
                    <span
                      className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-md border ${
                        program.active
                          ? "bg-emerald-500/10 border-emerald-500/10 text-emerald-600"
                          : "bg-red-500/10 border-red-500/10 text-red-600"
                      }`}
                    >
                      {program.active ? "Прийом відкритий" : "Прийом закритий"}
                    </span>
                  </div>

                  <h3 className="text-sm font-black text-[var(--text-dark)] uppercase tracking-wide truncate">
                    {program.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-[var(--text-gray)] font-medium">
                    <span className="flex items-center gap-1">
                      <Calendar size={11} className="text-purple-500" />
                      Дедлайн:{" "}
                      {new Date(program.deadline).toLocaleDateString("uk-UA")}
                    </span>
                    {program.organizationId && (
                      <span className="font-bold text-purple-600">
                        🏢 {program.organizationId.name}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 md:shrink-0">
                  <button
                    onClick={() => handleTriggerDeadline(program._id)}
                    disabled={
                      !program.active ||
                      actionLoading === `deadline_${program._id}`
                    }
                    className="px-3.5 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-40 disabled:hover:bg-amber-500 text-white text-[10px] font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:cursor-not-allowed shadow-sm shadow-amber-500/10"
                    title="Зупинити прийом заявок та видалити чернетки"
                  >
                    {actionLoading === `deadline_${program._id}` ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : (
                      <Clock size={12} />
                    )}
                    Зупинити прийом
                  </button>

                  <button
                    onClick={() => handleFinalCleanup(program._id)}
                    disabled={actionLoading === `cleanup_${program._id}`}
                    className="px-3.5 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-[10px] font-black uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm shadow-purple-600/10"
                    title="Видалити всі неприйняті файли з хмари та бд"
                  >
                    {actionLoading === `cleanup_${program._id}` ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : (
                      <Trash2 size={12} />
                    )}
                    Очистити Сховище
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {totalPages > 1 && !loading && (
        <div className="pt-2 border-t border-[var(--border-color)]">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={fetchPrograms}
          />
        </div>
      )}
    </div>
  );
}
