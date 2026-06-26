/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axios";
import toast, { Toaster } from "react-hot-toast";
import { BarChart3, ShieldCheck, Users, FileText, Loader2 } from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import DashboardTab from "../components/admin/DashboardTab";
import UsersTab from "../components/admin/UsersTab";
import ProgramsTab from "../components/admin/ProgramsTab";
import ProjectsTab from "../components/admin/ProjectsTab";
import { useAuth } from "../context/AuthContext";

export default function AdminPage() {
  const navigate = useNavigate();
  const { user: authUser, loading: authLoading } = useAuth();

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
  });

  const [newProgram, setNewProgram] = useState({
    title: "",
    shortDescription: "",
    description: "",
    deadline: null,
    domain: "Всі галузі",
    type: "Науковий журнал",
    amount: "",
    issn: "",
    impactFactor: 0,
    organizer: "",
    externalLink: "",
    location: "Онлайн",
  });

  const fetchAdminData = useCallback(
    async (signal) => {
      try {
        setLoading(true);
        const [meRes, statsRes, usersRes, projectsRes, programsRes] =
          await Promise.all([
            axiosInstance.get("/users/me", { signal }),
            axiosInstance.get("/users/count", { signal }),
            axiosInstance.get("/users/all", { signal }),
            axiosInstance.get("/projects/all", { signal }),
            axiosInstance.get("/programs", { signal }),
          ]);

        const userData = meRes.data.user || meRes.data;

        if (userData?.role !== "admin" && userData?.role !== "superadmin") {
          toast.error("Доступ заборонено");
          navigate("/profile");
          return;
        }

        setCurrentUser(userData);

        const userCount = statsRes.data?.count ?? statsRes.data?.users ?? 0;
        setStats({
          users: userCount,
          projects: projectsRes.data?.length || 0,
          approvedProjects:
            projectsRes.data?.filter((p) => p.status === "Прийнято").length ||
            0,
        });

        setUsers(usersRes.data || []);
        setProjects(projectsRes.data || []);
        setPrograms(programsRes.data || []);
      } catch (err) {
        if (err.name !== "CanceledError") {
          console.error("Помилка адмін-панелі:", err);
          toast.error("Не вдалося завантажити дані контенту");
        }
      } finally {
        setLoading(false);
      }
    },
    [navigate],
  );

  useEffect(() => {
    const controller = new AbortController();

    if (!authLoading) {
      fetchAdminData(controller.signal);
    }

    return () => controller.abort();
  }, [authLoading, fetchAdminData]);

  const dashboardData = useMemo(() => {
    const projArray = Array.isArray(projects) ? projects : [];

    const approved = projArray.filter((p) => p.status === "Прийнято").length;
    const pending = projArray.filter((p) => p.status === "На розгляді").length;
    const rejected = projArray.filter((p) => p.status === "Відхилено").length;
    const pieData = [
      { name: "Схвалено", value: approved },
      { name: "На розгляді", value: pending },
      { name: "Відхилено", value: rejected },
    ];

    const domains = projArray.reduce((acc, p) => {
      const domain = p.domain || "Без напрямку";
      acc[domain] = (acc[domain] || 0) + 1;
      return acc;
    }, {});

    const chartData = Object.entries(domains).map(([name, count]) => ({
      name,
      count,
    }));

    const authorCounts = projArray.reduce((acc, p) => {
      const name = p.authorId?.name || "Невідомий";
      acc[name] = (acc[name] || 0) + 1;
      return acc;
    }, {});

    const topAuthors = Object.entries(authorCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return { chartData, pieData, topAuthors };
  }, [projects]);

  const safeStats = useMemo(
    () => ({
      users: Number(stats.users),
      projects: Number(projects.length),
      approvedProjects: Number(
        projects.filter((p) => p.status === "Прийнято").length,
      ),
      programs: Number(programs.length),
    }),
    [stats, projects, programs],
  );

  const handleUpdateRole = async (userId, newRole) => {
    try {
      await axiosInstance.patch(`/users/role/${userId}`, { role: newRole });
      setUsers(
        users.map((u) => (u._id === userId ? { ...u, role: newRole } : u)),
      );
      toast.success("Роль змінено");
    } catch {
      toast.error("Помилка зміни ролі");
    }
  };

  const handleToggleBan = async (userId, status) => {
    try {
      await axiosInstance.patch(`/users/ban/${userId}`, { isBanned: !status });
      setUsers(
        users.map((u) => (u._id === userId ? { ...u, isBanned: !status } : u)),
      );
      toast.success(status ? "Розбанено" : "Забанено");
    } catch {
      toast.error("Помилка блокування");
    }
  };

  const handleUpdateProjectStatus = async (projectId, newStatus) => {
    try {
      setLoadingAction(projectId);
      await axiosInstance.patch(`/projects/status/${projectId}`, {
        status: newStatus,
      });
      setProjects(
        projects.map((p) =>
          p._id === projectId ? { ...p, status: newStatus } : p,
        ),
      );
      toast.success(`Статус: ${newStatus}`);
    } catch {
      toast.error("Помилка статусу");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleCreateProgram = async (e) => {
    e.preventDefault();
    try {
      setLoadingAction("create-program");
      const res = await axiosInstance.post("/programs", newProgram);
      setPrograms([res.data, ...programs]);
      setNewProgram({
        title: "",
        shortDescription: "",
        description: "",
        deadline: null,
        domain: "Всі галузі",
        type: "Науковий журнал",
        amount: "",
        issn: "",
        impactFactor: 0,
        organizer: "",
        externalLink: "",
        location: "Онлайн",
      });
      toast.success("Програму створено!");
    } catch {
      toast.error("Помилка створення");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleAssignReviewer = async (projectId, reviewerId) => {
    try {
      setLoadingAction(projectId);
      await axiosInstance.patch(`/projects/assign/${projectId}`, {
        reviewerId,
      });
      setProjects(
        projects.map((p) =>
          p._id === projectId ? { ...p, reviewerId: { _id: reviewerId } } : p,
        ),
      );
      toast.success("Рецензента призначено");
    } catch {
      toast.error("Помилка призначення");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleToggleStatus = async (programId) => {
    setLoadingAction(programId);
    try {
      const res = await axiosInstance.patch(
        `/programs/${programId}/toggle-status`,
      );
      toast.success(res.data.message);

      setPrograms((prev) =>
        prev.map((p) => (p._id === programId ? res.data.program : p)),
      );
    } catch (err) {
      toast.error(err.response?.data?.error || "Помилка при зміні статусу");
    } finally {
      setLoadingAction(null);
    }
  };

  const tabs = [
    { id: "overview", label: "Аналітика", icon: BarChart3 },
    { id: "users", label: "Користувачі", icon: Users },
    { id: "projects", label: "Наукові роботи", icon: FileText },
    { id: "programs", label: "Програми", icon: ShieldCheck },
  ];

  if (loading || authLoading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-main)]">
        <Loader2 size={32} className="animate-spin text-purple-600" />
      </div>
    );

  return (
    <div className="min-h-screen bg-[var(--bg-main)] flex flex-col text-[var(--text-dark)]">
      <Toaster />
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between gap-6 mb-12 mt-18">
          <h1 className="text-3xl font-black">
            SciencePlatform <span className="text-purple-600">Admin</span>
          </h1>
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-1.5 rounded-2xl flex gap-1 overflow-x-auto max-w-full scrollbar-none snap-x whitespace-nowrap">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all snap-caster shrink-0 ${
                  activeTab === tab.id
                    ? "bg-purple-600 text-white"
                    : "text-[var(--text-gray)] hover:text-[var(--text-dark)]"
                }`}
              >
                <tab.icon size={14} /> {tab.label}
              </button>
            ))}
          </div>
        </div>

        {activeTab === "overview" && (
          <DashboardTab
            stats={safeStats}
            chartData={dashboardData.chartData}
            pieData={dashboardData.pieData}
            topAuthors={dashboardData.topAuthors}
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
        {activeTab === "projects" && (
          <ProjectsTab
            projects={projects}
            onUpdateStatus={handleUpdateProjectStatus}
            loadingAction={loadingAction}
            onAssignReviewer={handleAssignReviewer}
            users={users || []}
          />
        )}
        {activeTab === "programs" && (
          <ProgramsTab
            programs={programs}
            setPrograms={setPrograms}
            newProgram={newProgram}
            setNewProgram={setNewProgram}
            onCreateProgram={handleCreateProgram}
            onToggleStatus={handleToggleStatus}
            loadingAction={loadingAction}
          />
        )}
      </main>
      <Footer />
    </div>
  );
}
