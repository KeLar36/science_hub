/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import toast, { Toaster } from "react-hot-toast";
import {
  BarChart3,
  ShieldCheck,
  Users,
  FileText,
  AlertTriangle,
  Loader2,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import DashboardTab from "../components/admin/DashboardTab";
import UsersTab from "../components/admin/UsersTab";
import ProgramsTab from "../components/admin/ProgramsTab";
import ProjectsTab from "../components/admin/ProjectsTab";

const AdminPage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [loadingAction, setLoadingAction] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  const [users, setUsers] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState({
    users: 0,
    projects: 0,
    approvedProjects: 0,
    pendingProjects: 0,
  });

  const [newProgram, setNewProgram] = useState({
    title: "",
    description: "",
    category: "Гранти",
    deadline: new Date(),
  });

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const controller = new AbortController();

    const fetchAdminData = async () => {
      try {
        setLoading(true);

        const [meRes, statsRes, usersRes, projectsRes, programsRes] =
          await Promise.all([
            axios.get("/me", { signal: controller.signal }),
            axios.get("/users/stats", { signal: controller.signal }),
            axios.get("/users", { signal: controller.signal }),
            axios.get("/projects", { signal: controller.signal }),
            axios.get("/programs", { signal: controller.signal }),
          ]);

        const role = meRes.data.user?.role;
        if (role !== "admin" && role !== "superadmin") {
          toast.error("Доступ заборонено");
          navigate("/profile");
          return;
        }

        setCurrentUser(meRes.data.user);
        setStats(statsRes.data);
        setUsers(usersRes.data);
        setProjects(projectsRes.data);
        setPrograms(programsRes.data);
      } catch (err) {
        if (axios.isCancel(err)) {
          console.log(
            "Попередній дублюючий запит StrictMode успішно скасовано.",
          );
        } else {
          console.error("Помилка завантаження адмін-панелі:", err);
          toast.error("Не вдалося завантажити дані контенту");
          if (err.response?.status === 401) {
            localStorage.removeItem("token");
            navigate("/login");
          }
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchAdminData();

    return () => {
      controller.abort();
    };
  }, [token, navigate]);

  const handleUpdateRole = async (userId, newRole) => {
    try {
      setLoadingAction(userId);
      await axios.put(`/users/${userId}/role`, { role: newRole });
      setUsers(
        users.map((u) => (u._id === userId ? { ...u, role: newRole } : u)),
      );
      toast.success("Роль користувача успішно змінено");
    } catch (err) {
      toast.error(err.response?.data?.message || "Помилка зміни ролі");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleToggleBan = async (userId, currentBanStatus) => {
    try {
      setLoadingAction(userId);
      await axios.put(`/users/${userId}/ban`, {
        isBanned: !currentBanStatus,
      });
      setUsers(
        users.map((u) =>
          u._id === userId ? { ...u, isBanned: !currentBanStatus } : u,
        ),
      );
      toast.success(
        currentBanStatus ? "Користувача розбанено" : "Користувача забанено",
      );
    } catch (err) {
      toast.error("Помилка керування блокуванням");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleUpdateProjectStatus = async (projectId, newStatus) => {
    try {
      setLoadingAction(projectId);
      await axios.put(`/projects/${projectId}/status`, {
        status: newStatus,
      });

      setProjects(
        projects.map((p) =>
          p._id === projectId ? { ...p, status: newStatus } : p,
        ),
      );

      setStats((prev) => {
        const oldProject = projects.find((p) => p._id === projectId);
        let approvedDiff = 0;
        let pendingDiff = 0;

        if (oldProject?.status === "Очікує") pendingDiff--;
        if (oldProject?.status === "Затверджено") approvedDiff--;

        if (newStatus === "Очікує") pendingDiff++;
        if (newStatus === "Затверджено") approvedDiff++;

        return {
          ...prev,
          approvedProjects: prev.approvedProjects + approvedDiff,
          pendingProjects: prev.pendingProjects + pendingDiff,
        };
      });

      toast.success(`Статус проекту змінено на: ${newStatus}`);
    } catch (err) {
      toast.error("Помилка зміни статусу проекту");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleCreateProgram = async (e) => {
    e.preventDefault();
    try {
      setLoadingAction("create-program");
      const res = await axios.post("/programs", newProgram);

      setPrograms([res.data, ...programs]);

      setNewProgram({
        title: "",
        description: "",
        category: "Гранти",
        deadline: new Date(),
      });
      toast.success("Програму успішно опубліковано!");
    } catch (err) {
      toast.error("Помилка при створенні програми");
    } finally {
      setLoadingAction(null);
    }
  };

  const chartData = useMemo(() => {
    const months = [
      "Січ",
      "Лют",
      "Бер",
      "Квіт",
      "Трав",
      "Черв",
      "Лип",
      "Серп",
      "Верес",
      "Жовт",
      "Лист",
      "Груд",
    ];
    const counts = Array(12).fill(0);

    projects.forEach((p) => {
      if (p.createdAt) {
        const m = new Date(p.createdAt).getMonth();
        if (m >= 0 && m < 12) counts[m]++;
      }
    });

    return months.map((name, index) => ({
      name,
      "Подано робіт": counts[index],
    }));
  }, [projects]);

  const pieData = useMemo(() => {
    const domainsMap = {};
    projects.forEach((p) => {
      const domain = p.scientificDomain || "Інші дослідження";
      domainsMap[domain] = (domainsMap[domain] || 0) + 1;
    });

    return Object.keys(domainsMap).map((key) => ({
      name: key,
      value: domainsMap[key],
    }));
  }, [projects]);

  const topAuthorsData = useMemo(() => {
    const authorsMap = {};
    projects.forEach((p) => {
      if (p.authors && p.status === "Затверджено") {
        authorsMap[p.authors] = (authorsMap[p.authors] || 0) + 1;
      }
    });

    return Object.keys(authorsMap)
      .map((name) => ({ name, count: authorsMap[name] }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [projects]);

  const tabs = [
    { id: "overview", label: "Аналітика", icon: BarChart3 },
    { id: "users", label: "Користувачі", icon: Users },
    { id: "projects", label: "Наукові роботи", icon: FileText },
    { id: "programs", label: "Програми & Гранти", icon: ShieldCheck },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-main)] flex flex-col items-center justify-center gap-4">
        <Loader2 size={32} className="animate-spin text-purple-600" />
        <p className="text-xs font-bold uppercase tracking-widest text-[var(--text-gray)] animate-pulse">
          Завантаження Bento системи аналітики... Фіолетовий колір
          завантажується...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-dark)] flex flex-col font-sans selection:bg-purple-500/10 selection:text-purple-600">
      <Toaster position="top-center" reverseOrder={false} />
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mt-18 mb-12">
          <div>
            <div className="flex items-center gap-2.5 text-xs font-black text-purple-600 uppercase tracking-widest mb-2 bg-purple-600/5 px-3 py-1.5 rounded-lg w-fit border border-purple-500/10">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-ping" />
              Панель керування системи
            </div>
            <h1 className="text-3xl font-black tracking-tight text-[var(--text-dark)] md:text-4xl">
              SciencePlatform <span className="text-purple-600">Admin</span>
            </h1>
          </div>

          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-1.5 rounded-2xl flex flex-wrap gap-1 shadow-xs w-fit">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                    isActive
                      ? "bg-purple-600 text-white shadow-md shadow-purple-600/10 scale-[1.02]"
                      : "text-[var(--text-gray)] hover:text-[var(--text-dark)] hover:bg-[var(--bg-main)]"
                  }`}
                >
                  <Icon size={14} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {activeTab === "overview" && (
          <DashboardTab
            stats={stats}
            chartData={chartData}
            pieData={pieData}
            topAuthors={topAuthorsData}
          />
        )}

        {activeTab === "users" && (
          <UsersTab
            users={users}
            currentUser={currentUser}
            onUpdateRole={handleUpdateRole}
            onToggleBan={handleToggleBan}
            loadingAction={loadingAction}
          />
        )}

        {activeTab === "programs" && (
          <ProgramsTab
            programs={programs}
            newProgram={newProgram}
            setNewProgram={setNewProgram}
            onCreateProgram={handleCreateProgram}
            loadingAction={loadingAction}
          />
        )}

        {activeTab === "projects" && (
          <ProjectsTab
            projects={projects}
            onUpdateStatus={handleUpdateProjectStatus}
            loadingAction={loadingAction}
          />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default AdminPage;
