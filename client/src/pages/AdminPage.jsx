/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import toast, { Toaster } from "react-hot-toast";
import {
  PlusCircle,
  CheckCircle,
  BarChart3,
  ShieldCheck,
  Ban,
  XCircle,
  Users,
  Search,
  FileText,
  Clock,
  ChevronLeft,
  ChevronRight,
  PieChart as PieIcon,
  Calendar as CalendarIcon,
  Loader2,
  AlertTriangle,
  Crown,
  ChevronDown,
  Send,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import ReactQuill from "react-quill-new";
import DatePicker, { registerLocale } from "react-datepicker";
import uk from "date-fns/locale/uk";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import "react-datepicker/dist/react-datepicker.css";
import "react-quill-new/dist/quill.snow.css";

registerLocale("uk", uk);

const SCIENTIFIC_DOMAINS = [
  "Штучний інтелект & IT",
  "Медицина та фармація",
  "Економіка та фінанси",
  "Право та юриспруденція",
  "Природничі науки",
  "Гуманітарні науки",
  "Технічні науки & Інженерія",
];

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["clean"],
  ],
};

const CHART_COLORS = [
  "#6d28d9",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#3b82f6",
  "#ec4899",
  "#8b5cf6",
];

const issnRegex = /^\d{4}-\d{3}[\dX]$/;

const toastSuccess = (msg) =>
  toast(msg, {
    icon: "✓",
    style: {
      background: "#6d28d9",
      color: "#fff",
      fontWeight: "700",
      borderRadius: "16px",
      fontSize: "13px",
    },
  });

const toastError = (msg) =>
  toast(msg, {
    icon: "✕",
    style: {
      background: "#fff",
      color: "#6d28d9",
      fontWeight: "700",
      border: "2px solid #6d28d9",
      borderRadius: "16px",
      fontSize: "13px",
    },
  });

const toastInfo = (msg, icon) =>
  toast(msg, {
    icon,
    style: {
      background: "#ede9fe",
      color: "#4c1d95",
      fontWeight: "700",
      borderRadius: "16px",
      fontSize: "13px",
    },
  });

const ConfirmDialog = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[32px] p-8 max-w-sm w-full mx-4 shadow-2xl">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 bg-purple-100">
          <AlertTriangle size={28} className="text-[#6d28d9]" />
        </div>
        <h3 className="text-lg font-black text-[var(--text-dark)] mb-2">
          {title}
        </h3>
        <p className="text-sm text-[var(--text-gray)] font-medium mb-8">
          {message}
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-2xl border border-[var(--border-color)] font-black text-sm text-[var(--text-gray)] hover:bg-[var(--bg-main)] transition-all"
          >
            Скасувати
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 rounded-2xl font-black text-sm text-white bg-[#6d28d9] hover:bg-[#5b21b6] transition-all"
          >
            Підтвердити
          </button>
        </div>
      </div>
    </div>
  );
};

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;
  return (
    <div className="p-6 border-t border-[var(--border-color)] flex flex-wrap items-center justify-between gap-4 bg-[var(--bg-main)]">
      <span className="text-xs font-bold text-[var(--text-gray)] uppercase">
        Сторінка {currentPage} з {totalPages}
      </span>
      <div className="flex gap-2">
        <button
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className="p-2 rounded-xl border border-[var(--border-color)] disabled:opacity-30 hover:bg-purple-50 text-[#6d28d9] transition-all"
        >
          <ChevronLeft size={18} />
        </button>
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => onPageChange(i + 1)}
            className={`w-10 h-10 rounded-xl text-xs font-black ${
              currentPage === i + 1
                ? "bg-[#6d28d9] text-white"
                : "bg-[var(--bg-card)] text-[var(--text-gray)] border border-[var(--border-color)]"
            }`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="p-2 rounded-xl border border-[var(--border-color)] disabled:opacity-30 hover:bg-purple-50 text-[#6d28d9] transition-all"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

const AdminPage = () => {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const user = useMemo(() => {
    const raw = JSON.parse(localStorage.getItem("user") || "null");
    if (!raw) return null;
    return { ...raw, _id: raw._id || raw.id };
  }, []);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const isSuperAdmin = user?.role === "superadmin";
  const isAdmin = user?.role === "admin";

  const [activeTab, setActiveTab] = useState("projects");
  const [projects, setProjects] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [confirm, setConfirm] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
  });

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    deadline: new Date(),
    type: "",
    domain: "Всі галузі",
    issn: "",
    impactFactor: 0,
    amount: "",
    active: true,
  });

  const authConfig = useMemo(
    () => ({ headers: { Authorization: `Bearer ${token}` } }),
    [token],
  );

  useEffect(() => {
    const hasAccess = isSuperAdmin || isAdmin;
    if (!user || !token || !hasAccess) {
      toastError("Доступ заборонено!");
      navigate("/");
    }
  }, [user, token]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [resProj, resUsers] = await Promise.all([
        axios.get(`${apiUrl}/api/projects/all`, authConfig),
        axios.get(`${apiUrl}/api/users/all`, authConfig),
      ]);
      setProjects(Array.isArray(resProj.data) ? resProj.data : []);
      setUsersList(Array.isArray(resUsers.data) ? resUsers.data : []);
    } catch (err) {
      toastError(err?.response?.data?.message || "Помилка завантаження даних");
    } finally {
      setLoading(false);
    }
  }, [apiUrl, authConfig]);

  useEffect(() => {
    if (user && token) loadData();
  }, [loadData]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchTerm]);

  const askConfirm = ({ title, message, onConfirm }) => {
    setConfirm({ isOpen: true, title, message, onConfirm });
  };

  const closeConfirm = () =>
    setConfirm((prev) => ({ ...prev, isOpen: false, onConfirm: null }));

  const handleCreateProgram = async (e) => {
    e.preventDefault();

    // Валідація
    if (!formData.description || formData.description === "<p><br></p>")
      return toastError("Додайте опис програми");
    if (!formData.type) return toastError("Оберіть тип програми");

    try {
      // Очищення даних перед відправкою
      const cleanedData = { ...formData };
      if (cleanedData.type === "Грант") {
        delete cleanedData.issn;
        delete cleanedData.impactFactor;
      } else {
        delete cleanedData.amount;
      }

      await toast.promise(
        axios.post(`${apiUrl}/api/programs/create`, cleanedData, authConfig),
        {
          loading: "Створення...",
          success: "Програму опубліковано!",
          error: (err) => err?.response?.data?.message || "Помилка сервера",
        },
        // ... твої стилі тостів
      );

      setFormData({
        title: "",
        description: "",
        deadline: new Date(),
        type: "", // Тепер сервер не сваритиметься при наступній ініціалізації
        domain: "Всі галузі",
        active: true,
        issn: "",
        impactFactor: 0,
        amount: "",
      });
    } catch (error) {
      console.error("ValidationError Catch:", error);
    }
  };
  const toggleBan = (targetUser) => {
    if (targetUser.role === "superadmin")
      return toastError("Не можна заблокувати супер-адміна");
    if (targetUser.role === "admin" && !isSuperAdmin)
      return toastError("Тільки супер-адмін може блокувати адміністраторів");

    const action = targetUser.isBanned ? "розблокувати" : "заблокувати";
    askConfirm({
      title: `${targetUser.isBanned ? "Розблокувати" : "Заблокувати"} користувача?`,
      message: `Ви дійсно хочете ${action} ${targetUser.name}?`,
      onConfirm: async () => {
        closeConfirm();
        try {
          await axios.patch(
            `${apiUrl}/api/users/ban/${targetUser._id}`,
            { isBanned: !targetUser.isBanned },
            authConfig,
          );
          setUsersList((prev) =>
            prev.map((u) =>
              u._id === targetUser._id
                ? { ...u, isBanned: !targetUser.isBanned }
                : u,
            ),
          );
          toastInfo(
            targetUser.isBanned
              ? "Доступ поновлено"
              : "Користувача заблоковано",
            targetUser.isBanned ? "🔓" : "🚫",
          );
        } catch (err) {
          toastError(err?.response?.data?.message || "Помилка зміни статусу");
        }
      },
    });
  };

  const updateStatus = (id, status) => {
    const label = status === "Прийнято" ? "прийняти" : "відхилити";
    askConfirm({
      title: `${status === "Прийнято" ? "Прийняти" : "Відхилити"} заявку?`,
      message: `Ви дійсно хочете ${label} цю заявку?`,
      onConfirm: async () => {
        closeConfirm();
        try {
          await axios.patch(
            `${apiUrl}/api/projects/status/${id}`,
            { status },
            authConfig,
          );
          setProjects((prev) =>
            prev.map((p) => (p._id === id ? { ...p, status } : p)),
          );
          toastSuccess(`Статус змінено: ${status}`);
        } catch (err) {
          toastError(err?.response?.data?.message || "Помилка зміни статусу");
        }
      },
    });
  };

  const changeRole = (targetUser, newRole) => {
    if (targetUser.role === "superadmin")
      return toastError("Не можна змінити роль супер-адміна");
    if (targetUser.role === "admin" && !isSuperAdmin)
      return toastError(
        "Тільки супер-адмін може змінювати роль адміністратора",
      );
    if (targetUser._id === user._id)
      return toastError("Не можна змінити власну роль");

    const roleLabels = {
      user: "Користувач",
      reviewer: "Рецензент",
      admin: "Адміністратор",
      "content-manager": "Менеджер",
    };

    askConfirm({
      title: "Змінити роль?",
      message: `Встановити роль «${roleLabels[newRole] || newRole}» для ${targetUser.name}?`,
      onConfirm: async () => {
        closeConfirm();
        try {
          await axios.patch(
            `${apiUrl}/api/users/role/${targetUser._id}`,
            { role: newRole },
            authConfig,
          );
          setUsersList((prev) =>
            prev.map((u) =>
              u._id === targetUser._id ? { ...u, role: newRole } : u,
            ),
          );
          toastSuccess(`Нова роль: ${roleLabels[newRole] || newRole}`);
        } catch (err) {
          toastError(err?.response?.data?.message || "Помилка зміни ролі");
        }
      },
    });
  };

  const assignReviewer = async (projectId, reviewerId) => {
    try {
      await axios.patch(
        `${apiUrl}/api/projects/assign/${projectId}`,
        { reviewerId },
        authConfig,
      );
      toastSuccess("Рецензента призначено");
      loadData();
    } catch (err) {
      toastError(
        err?.response?.data?.message || "Помилка призначення рецензента",
      );
    }
  };

  const reviewers = useMemo(
    () => usersList.filter((u) => u.role === "reviewer"),
    [usersList],
  );

  const statusData = useMemo(
    () => [
      {
        name: "Прийнято",
        value: projects.filter((p) => p.status === "Прийнято").length,
      },
      {
        name: "На розгляді",
        value: projects.filter((p) => p.status === "На розгляді").length,
      },
      {
        name: "Відхилено",
        value: projects.filter((p) => p.status === "Відхилено").length,
      },
    ],
    [projects],
  );

  const domainData = useMemo(() => {
    const counts = {};
    projects.forEach((p) => {
      counts[p.domain] = (counts[p.domain] || 0) + 1;
    });
    return Object.keys(counts).map((key) => ({
      name: key,
      count: counts[key],
    }));
  }, [projects]);

  const filteredData = useMemo(() => {
    const search = searchTerm.toLowerCase();
    const targetList = activeTab === "projects" ? projects : usersList;
    return targetList.filter((item) => {
      if (activeTab === "projects") {
        return (
          item.title?.toLowerCase().includes(search) ||
          item.authorId?.name?.toLowerCase().includes(search)
        );
      }
      return (
        item.name?.toLowerCase().includes(search) ||
        item.email?.toLowerCase().includes(search)
      );
    });
  }, [activeTab, projects, usersList, searchTerm]);

  const currentItems = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const getRoleOptions = () => {
    const base = [
      { value: "user", label: "Користувач" },
      { value: "reviewer", label: "Рецензент" },
      { value: "content-manager", label: "Менеджер" },
    ];
    if (isSuperAdmin) base.push({ value: "admin", label: "Адміністратор" });
    return base;
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-300 font-sans selection:bg-[var(--selection-bg)] selection:text-white">
      <style>{`
      .react-datepicker-wrapper { width: 100%; }
      .custom-datepicker { 
        width: 100%; 
        padding: 0.75rem 1rem 0.75rem 3rem; 
        background: var(--bg-card); 
        border: 1px solid var(--border-color); 
        border-radius: 0.5rem; 
        color: var(--text-dark); 
        transition: all 0.2s;
      }
      .custom-datepicker:focus { border-color: var(--purple-main); outline: none; }
      .quill { background: var(--bg-card); border-radius: 0.5rem; overflow: hidden; border: 1px solid var(--border-color); }
      .ql-toolbar { border: none !important; background: rgba(124, 58, 237, 0.05); border-bottom: 1px solid var(--border-color) !important; }
      .ql-container { border: none !important; min-height: 200px; font-family: inherit; }
    `}</style>

      <Toaster
        position="bottom-right"
        toastOptions={{
          className:
            "border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-dark)] rounded-lg",
        }}
      />
      <Navbar />

      <ConfirmDialog
        isOpen={confirm.isOpen}
        title={confirm.title}
        message={confirm.message}
        onConfirm={confirm.onConfirm}
        onCancel={closeConfirm}
      />

      <nav className="sticky top-[70px] z-30 bg-[var(--bg-main)]/80 backdrop-blur-md border-b border-[var(--border-color)]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-center items-center flex-wrap gap-3 py-3 mt-25">
            {[
              { id: "projects", label: "Заявки", icon: BarChart3 },
              { id: "create", label: "Нова програма", icon: PlusCircle },
              { id: "users", label: "Користувачі", icon: Users },
              { id: "analytics", label: "Аналітика", icon: PieIcon },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center border-1 border-[var(--purple-main)] gap-2 px-5 py-2 rounded-md transition-all duration-200 text-sm font-semibold whitespace-nowrap ${
                    isActive
                      ? "bg-[var(--purple-main)] text-[var(--bg-main)] shadow-sm"
                      : "text-[var(--purple-main)] hover:bg-[var(--border-color)] hover:text-[var(--text-dark)]"
                  }`}
                >
                  <tab.icon size={16} strokeWidth={isActive ? 2.5 : 2} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto w-full py-10 px-4 lg:px-8">
        {isSuperAdmin && (
          <div className="mb-8 flex items-center gap-3 px-4 py-2 border-l-4 border-purple-600 bg-purple-500/5 text-purple-600 animate-reveal">
            <Crown size={14} fill="currentColor" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
              режим суперадміна - повний доступ
            </span>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <div className="w-10 h-10 border-2 border-[var(--border-color)] border-t-purple-600 rounded-full animate-spin"></div>
            <span className="mt-4 text-[10px] font-medium uppercase tracking-widest text-[var(--text-gray)]">
              Loading System...
            </span>
          </div>
        ) : (
          <div className="animate-reveal">
            {activeTab === "analytics" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    {
                      label: "Усього заявок",
                      value: projects.length,
                      icon: FileText,
                    },
                    {
                      label: "На розгляді",
                      value: projects.filter((p) => p.status === "На розгляді")
                        .length,
                      icon: Clock,
                    },
                    {
                      label: "Прийнято",
                      value: projects.filter((p) => p.status === "Прийнято")
                        .length,
                      icon: CheckCircle,
                    },
                    {
                      label: "Користувачі",
                      value: usersList.length,
                      icon: Users,
                    },
                  ].map((stat, i) => (
                    <div key={i} className="bento-card p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-[10px] font-bold text-[var(--text-gray)] uppercase tracking-wider mb-1">
                            {stat.label}
                          </p>
                          <p className="text-3xl font-light text-[var(--text-dark)]">
                            {stat.value}
                          </p>
                        </div>
                        <stat.icon size={20} className="text-purple-600" />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="bento-card p-6">
                    <h3 className="text-xs font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
                      <span className="w-1 h-4 bg-purple-600" /> Розподіл
                      статусів
                    </h3>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={statusData}
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                          >
                            {statusData.map((_, i) => (
                              <Cell
                                key={i}
                                fill={CHART_COLORS[i % CHART_COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "var(--bg-card)",
                              borderColor: "var(--border-color)",
                              color: "var(--text-dark)",
                            }}
                          />
                          <Legend
                            iconType="rect"
                            verticalAlign="bottom"
                            height={36}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div className="bento-card p-6">
                    <h3 className="text-xs font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
                      <span className="w-1 h-4 bg-emerald-500" /> Популярні
                      галузі
                    </h3>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={domainData} layout="vertical">
                          <XAxis type="number" hide />
                          <YAxis
                            dataKey="name"
                            type="category"
                            width={100}
                            tick={{ fontSize: 10, fill: "var(--text-gray)" }}
                            axisLine={false}
                            tickLine={false}
                          />
                          <Tooltip
                            cursor={{
                              fill: "var(--border-color)",
                              opacity: 0.4,
                            }}
                          />
                          <Bar
                            dataKey="count"
                            fill="var(--purple-main)"
                            radius={[0, 4, 4, 0]}
                            barSize={15}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "create" && (
              <div
                className="max-w-5xl mx-auto bento-card p-10 md:p-16 border border-[var(--border-color)] bg-[var(--bg-card)] rounded-[40px] shadow-2xl"
                data-aos="zoom-in"
              >
                <div className="mb-12">
                  <h2 className="text-3xl font-black uppercase tracking-tighter text-[var(--text-dark)] mb-2 italic">
                    Створення науково-дослідної програми
                  </h2>
                  <div className="h-1 w-20 bg-purple-600 rounded-full"></div>
                </div>

                <form onSubmit={handleCreateProgram} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Назва */}
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-gray)] ml-2">
                        Назва програми
                      </label>
                      <input
                        className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-dark)] rounded-2xl px-6 py-4 outline-none text-sm focus:border-purple-600 transition-all"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                        placeholder="Введіть назву..."
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-gray)] ml-2">
                        Тип програми
                      </label>
                      <div className="relative">
                        <select
                          className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-dark)] rounded-2xl px-6 py-4 outline-none text-sm appearance-none cursor-pointer focus:border-purple-600 transition-all pr-12"
                          value={formData.type}
                          onChange={(e) => {
                            const newType = e.target.value;
                            setFormData({
                              ...formData,
                              type: newType,
                              issn: newType === "Грант" ? "" : formData.issn,
                              amount:
                                newType === "Науковий журнал" ||
                                newType === "Стаття"
                                  ? ""
                                  : formData.amount,
                            });
                          }}
                          required
                        >
                          <option value="" disabled className="text-gray-400">
                            Оберіть тип...
                          </option>
                          {[
                            "Науковий журнал",
                            "Стаття",
                            "Грант",
                            "Конференція",
                            "Датасет",
                            "Курс",
                          ].map((t) => (
                            <option
                              key={t}
                              value={t}
                              className="bg-[var(--bg-card)]"
                            >
                              {t}
                            </option>
                          ))}
                        </select>
                        <ChevronDown
                          className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-purple-600"
                          size={18}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Опис з ReactQuill */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-gray)] ml-2">
                      Опис програми та вимоги
                    </label>
                    <div className="quill-wrapper rounded-3xl overflow-hidden border border-[var(--border-color)] bg-[var(--bg-main)]">
                      <style>{`
            .ql-toolbar.ql-snow { border: none !important; border-bottom: 1px solid var(--border-color) !important; background: var(--bg-card); }
            .ql-container.ql-snow { border: none !important; min-height: 250px; font-family: inherit; }
            .ql-editor { color: var(--text-dark); font-size: 15px; }
            .ql-editor.ql-blank::before { color: var(--text-gray); font-style: normal; opacity: 0.5; }
          `}</style>
                      <ReactQuill
                        theme="snow"
                        placeholder="Детально опишіть умови участі, критерії та переваги..."
                        value={formData.description || ""}
                        onChange={(val) =>
                          setFormData({ ...formData, description: val })
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Дедлайн */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-gray)] ml-2">
                        Кінцевий термін (Дедлайн)
                      </label>
                      <div className="relative">
                        <CalendarIcon
                          className="absolute left-5 top-1/2 -translate-y-1/2 text-purple-600 z-10"
                          size={18}
                        />
                        <DatePicker
                          selected={formData.deadline}
                          onChange={(d) =>
                            setFormData({ ...formData, deadline: d })
                          }
                          className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-dark)] rounded-2xl pl-14 pr-6 py-4 outline-none text-sm focus:border-purple-600 transition-all cursor-pointer"
                          dateFormat="dd.MM.yyyy"
                          minDate={new Date()}
                        />
                      </div>
                    </div>

                    {/* Галузь */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-gray)] ml-2">
                        Наукова галузь
                      </label>
                      <div className="relative">
                        <select
                          className="w-full bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-dark)] rounded-2xl px-6 py-4 outline-none text-sm appearance-none cursor-pointer focus:border-purple-600 transition-all pr-12"
                          value={formData.domain}
                          onChange={(e) =>
                            setFormData({ ...formData, domain: e.target.value })
                          }
                        >
                          {SCIENTIFIC_DOMAINS.map((d) => (
                            <option
                              key={d}
                              value={d}
                              className="bg-[var(--bg-card)]"
                            >
                              {d}
                            </option>
                          ))}
                        </select>
                        <ChevronDown
                          className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-purple-600"
                          size={18}
                        />
                      </div>
                    </div>

                    {/* Статус */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-gray)] ml-2">
                        Статус публікації
                      </label>
                      <div
                        onClick={() =>
                          setFormData({ ...formData, active: !formData.active })
                        }
                        className={`w-full h-[54px] rounded-2xl border-2 flex items-center justify-center cursor-pointer transition-all uppercase font-black text-[10px] tracking-widest ${
                          formData.active
                            ? "border-emerald-500/50 text-emerald-500 bg-emerald-500/5 shadow-[0_0_15px_-5px_#10b981]"
                            : "border-red-500/50 text-red-500 bg-red-500/5"
                        }`}
                      >
                        {formData.active ? "● Активна" : "○ Чернетка"}
                      </div>
                    </div>
                  </div>

                  {/* Динамічні поля */}
                  {(formData.type === "Науковий журнал" ||
                    formData.type === "Стаття" ||
                    formData.type === "Грант") && (
                    <div className="p-8 rounded-[32px] bg-purple-600/5 border border-purple-600/10 grid grid-cols-1 md:grid-cols-3 gap-8 animate-in fade-in slide-in-from-top-2">
                      {(formData.type === "Науковий журнал" ||
                        formData.type === "Стаття") && (
                        <>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-purple-600 ml-2">
                              ISSN
                            </label>
                            <input
                              className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-dark)] rounded-xl px-5 py-3 outline-none text-sm focus:border-purple-600 transition-all"
                              placeholder="0000-0000"
                              maxLength={9}
                              value={formData.issn}
                              onChange={(e) => {
                                let val = e.target.value
                                  .toUpperCase()
                                  .replace(/[^0-9X-]/g, "");
                                if (val.length === 4 && !val.includes("-"))
                                  val += "-";
                                setFormData({ ...formData, issn: val });
                              }}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-purple-600 ml-2">
                              Impact Factor
                            </label>
                            <input
                              type="number"
                              step="0.01"
                              className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-dark)] rounded-xl px-5 py-3 outline-none text-sm focus:border-purple-600 transition-all"
                              value={formData.impactFactor}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  impactFactor: e.target.value,
                                })
                              }
                            />
                          </div>
                        </>
                      )}

                      {formData.type === "Грант" && (
                        <div className="md:col-span-3 space-y-2">
                          <label className="text-[10px] font-black uppercase text-purple-600 ml-2">
                            Фінансування
                          </label>
                          <input
                            className="w-full bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-dark)] rounded-xl px-5 py-3 outline-none text-sm focus:border-purple-600 transition-all"
                            placeholder="Напр. 50 000 USD, покриття витрат на переліт тощо"
                            value={formData.amount}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                amount: e.target.value,
                              })
                            }
                          />
                        </div>
                      )}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-6 bg-purple-600 text-white font-black uppercase tracking-[0.3em] rounded-[24px] hover:bg-purple-700 active:scale-[0.98] transition-all flex items-center justify-center gap-4 italic shadow-2xl shadow-purple-600/30"
                  >
                    <Send size={20} /> Створити програму
                  </button>
                </form>
              </div>
            )}

            {(activeTab === "users" || activeTab === "projects") && (
              <div className="bento-card overflow-hidden">
                <div className="p-6 border-b border-[var(--border-color)] flex flex-col md:flex-row justify-between items-center gap-4">
                  <h2 className="text-sm font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-600" />
                    {activeTab === "users" ? "Користувачі" : "Реєстр заявок"}
                  </h2>
                  <div className="relative w-full md:w-72">
                    <Search
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-gray)]"
                      size={14}
                    />
                    <input
                      className="w-full pl-10 pr-4 py-2 bg-[var(--bg-main)] rounded-md border border-[var(--border-color)] focus:border-purple-600 outline-none text-sm transition-all"
                      placeholder="Пошук за іменем або email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[var(--border-color)]/30 text-[10px] uppercase font-bold text-[var(--text-gray)] tracking-widest">
                        <th className="px-6 py-4">Статус</th>
                        <th className="px-6 py-4">
                          {activeTab === "users"
                            ? "Профіль / Роль"
                            : "Автор / Тема"}
                        </th>
                        <th className="px-6 py-4">
                          {activeTab === "users"
                            ? "Керування доступом"
                            : "Рецензент"}
                        </th>
                        <th className="px-6 py-4 text-right">Дії</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-color)]">
                      {currentItems.length === 0 ? (
                        <tr>
                          <td
                            colSpan={4}
                            className="px-6 py-20 text-center text-[var(--text-gray)] text-xs uppercase tracking-widest italic"
                          >
                            Даних не знайдено
                          </td>
                        </tr>
                      ) : (
                        currentItems.map((item) => {
                          const isItemSuperAdmin = item.role === "superadmin";

                          return (
                            <tr
                              key={item._id}
                              className="hover:bg-[var(--border-color)]/20 transition-colors"
                            >
                              <td className="px-6 py-4">
                                {activeTab === "users" ? (
                                  <div
                                    className={`w-8 h-8 rounded flex items-center justify-center 
                        ${
                          isItemSuperAdmin
                            ? "bg-purple-600/20 text-purple-600"
                            : item.isBanned
                              ? "bg-red-500/10 text-red-500"
                              : "bg-emerald-500/10 text-emerald-500"
                        }`}
                                  >
                                    {isItemSuperAdmin ? (
                                      <Crown size={14} />
                                    ) : item.isBanned ? (
                                      <Ban size={14} />
                                    ) : (
                                      <ShieldCheck size={14} />
                                    )}
                                  </div>
                                ) : (
                                  <span className="text-[9px] font-bold px-2 py-1 border border-purple-600/20 text-purple-600 uppercase rounded">
                                    {item.status}
                                  </span>
                                )}
                              </td>

                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                  <div className="text-sm font-semibold text-[var(--text-dark)]">
                                    {item.name ||
                                      item.authorId?.name ||
                                      "Анонім"}
                                  </div>
                                  {activeTab === "users" &&
                                    isItemSuperAdmin && (
                                      <span className="bg-purple-600 text-white text-[8px] px-1.5 py-0.5 rounded uppercase font-black tracking-tighter">
                                        Root
                                      </span>
                                    )}
                                </div>
                                <div className="text-[11px] text-[var(--text-gray)] truncate max-w-[250px]">
                                  {item.email || item.title}
                                </div>
                              </td>

                              <td className="px-6 py-4">
                                {activeTab === "users" ? (
                                  <div className="flex items-center gap-2">
                                    <select
                                      className={`bg-transparent border-none text-[11px] font-bold outline-none cursor-pointer 
                            ${isItemSuperAdmin ? "text-purple-600 cursor-default" : "text-[var(--text-dark)]"}`}
                                      value={item.role}
                                      onChange={(e) =>
                                        changeRole(item, e.target.value)
                                      }
                                      disabled={
                                        item._id === user._id ||
                                        isItemSuperAdmin
                                      }
                                    >
                                      {getRoleOptions().map((opt) => (
                                        <option
                                          key={opt.value}
                                          value={opt.value}
                                        >
                                          {opt.label}
                                        </option>
                                      ))}
                                    </select>
                                    {isItemSuperAdmin && (
                                      <span className="text-[9px] text-[var(--text-gray)] font-normal italic">
                                        (неможливо змінити)
                                      </span>
                                    )}
                                  </div>
                                ) : (
                                  <select
                                    className="bg-transparent border-none text-[11px] font-bold text-[var(--text-dark)] outline-none cursor-pointer"
                                    value={item.reviewerId?._id || ""}
                                    onChange={(e) =>
                                      assignReviewer(item._id, e.target.value)
                                    }
                                  >
                                    <option value="">Оберіть рецензента</option>
                                    {reviewers.map((rev) => (
                                      <option key={rev._id} value={rev._id}>
                                        {rev.name}
                                      </option>
                                    ))}
                                  </select>
                                )}
                              </td>

                              <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  {activeTab === "users" ? (
                                    <button
                                      onClick={() => toggleBan(item)}
                                      disabled={
                                        item._id === user._id ||
                                        isItemSuperAdmin
                                      }
                                      className={`px-3 py-1 text-[9px] font-bold uppercase rounded border transition-all 
                            ${
                              isItemSuperAdmin
                                ? "opacity-20 cursor-not-allowed border-gray-400 text-gray-400"
                                : item.isBanned
                                  ? "border-emerald-500 text-emerald-500 hover:bg-emerald-500 hover:text-white"
                                  : "border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                            }`}
                                    >
                                      {item.isBanned
                                        ? "Розблокувати"
                                        : "Заблокувати"}
                                    </button>
                                  ) : (
                                    <>
                                      <button
                                        onClick={() =>
                                          updateStatus(item._id, "Прийнято")
                                        }
                                        className="p-2 hover:bg-emerald-500/10 text-emerald-500 rounded transition-colors"
                                      >
                                        <CheckCircle size={16} />
                                      </button>
                                      <button
                                        onClick={() =>
                                          updateStatus(item._id, "Відхилено")
                                        }
                                        className="p-2 hover:bg-red-500/10 text-red-500 rounded transition-colors"
                                      >
                                        <XCircle size={16} />
                                      </button>
                                    </>
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

                <div className="p-4 border-t border-[var(--border-color)]">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default AdminPage;
