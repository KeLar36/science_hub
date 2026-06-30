/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axios";
import toast, { Toaster } from "react-hot-toast";
import {
  BarChart3,
  ShieldCheck,
  Users,
  FileText,
  Building2,
  Loader2,
} from "lucide-react";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import DashboardTab from "./components/DashboardTab";
import UsersTab from "./components/UsersTab";
import OrganizationsTab from "./components/OrganizationsTab";
import ProjectsTab from "./components/ProjectsTab";
import ProgramsTab from "./components/ProgramsTab";
import { useAuth } from "../../context/AuthContext";

export default function SuperAdminPage() {
  const navigate = useNavigate();
  const { user: authUser, loading: authLoading } = useAuth();

  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [loadingAction, setLoadingAction] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  const [users, setUsers] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [projects, setProjects] = useState([]);
  const [programs, setPrograms] = useState([]);
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
    organizer: "Платформа",
    externalLink: "",
    location: "Онлайн",
  });

  const fetchSuperAdminData = useCallback(
    async (signal) => {
      try {
        setLoading(true);
        // Суперадмін тягне глобальні ендпоінти БЕЗ жодних фільтрів orgId
        const [meRes, statsRes, usersRes, projectsRes, programsRes, orgsRes] =
          await Promise.all([
            axiosInstance.get("/users/me", { signal }),
            axiosInstance.get("/users/count", { signal }),
            axiosInstance.get("/users/all", { signal }),
            axiosInstance.get("/projects/all", { signal }),
            axiosInstance.get("/programs", { signal }),
            axiosInstance.get("/organizations/all", { signal }),
          ]);

        const userData = meRes.data.user || meRes.data;
        if (userData?.role !== "superadmin") {
          toast.error("Доступ заборонено: потрібні права суперадміністратора");
          navigate("/profile");
          return;
        }

        setCurrentUser(userData);
        setUsers(usersRes.data || []);
        setProjects(projectsRes.data || []);
        setPrograms(programsRes.data || []);
        setOrganizations(orgsRes.data || []);

        const userCount = statsRes.data?.count ?? statsRes.data?.users ?? 0;
        setStats({
          users: userCount,
          projects: projectsRes.data?.length || 0,
          approvedProjects:
            projectsRes.data?.filter((p) => p.status === "Прийнято").length ||
            0,
        });
      } catch (err) {
        if (err.name !== "CanceledError") {
          console.error("Помилка суперадмінки:", err);
          toast.error("Не вдалося завантажити глобальні дані платформи");
        }
      } finally {
        setLoading(false);
      }
    },
    [navigate],
  );

  useEffect(() => {
    const controller = new AbortController();
    if (!authLoading) fetchSuperAdminData(controller.signal);
    return () => controller.abort();
  }, [authLoading, fetchSuperAdminData]);

  // Створення ГЛОБАЛЬНОЇ програми (від імені самої платформи)
  const handleCreateGlobalProgram = async (e) => {
    e.preventDefault();
    try {
      setLoadingAction("createProgram");
      const res = await axiosInstance.post("/programs", newProgram); // orgId тут буде null автоматично
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
        organizer: "Платформа",
        externalLink: "",
        location: "Онлайн",
      });
      toast.success("Глобальну програму успішно створено!");
    } catch {
      toast.error("Помилка створення програми");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleToggleGlobalProgramStatus = async (programId) => {
    setLoadingAction(programId);
    try {
      const res = await axiosInstance.patch(
        `/programs/${programId}/toggle-status`,
      );
      toast.success(res.data.message);
      setPrograms((prev) =>
        prev.map((p) => (p._id === programId ? res.data.program : p)),
      );
    } catch {
      toast.error("Помилка зміни статусу");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleUpdateOrganizationStatus = async (orgId, newStatus) => {
    try {
      setLoadingAction(orgId);
      await axiosInstance.patch(`/organizations/${orgId}/status`, {
        status: newStatus,
      });
      setOrganizations((prev) =>
        prev.map((org) =>
          org._id === orgId ? { ...org, status: newStatus } : org,
        ),
      );
      toast.success(`Статус організації змінено`);
    } catch {
      toast.error("Помилка оновлення організації");
    } finally {
      setLoadingAction(null);
    }
  };

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
      toast.success("Статус роботи оновлено");
    } catch {
      toast.error("Помилка статусу");
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

  const dashboardData = useMemo(() => {
    const projArray = Array.isArray(projects) ? projects : [];
    const approved = projArray.filter((p) => p.status === "Прийнято").length;
    const pending = projArray.filter((p) => p.status === "На розгляді").length;
    const rejected = projArray.filter((p) => p.status === "Відхилено").length;
    const domains = projArray.reduce((acc, p) => {
      const domain = p.domain || "Без напрямку";
      acc[domain] = (acc[domain] || 0) + 1;
      return acc;
    }, {});

    return {
      pieData: [
        { name: "Схвалено", value: approved },
        { name: "На розгляді", value: pending },
        { name: "Відхилено", value: rejected },
      ],
      chartData: Object.entries(domains).map(([name, count]) => ({
        name,
        count,
      })),
      topAuthors: [],
    };
  }, [projects]);

  const tabs = [
    { id: "overview", label: "Аналітика", icon: BarChart3 },
    { id: "users", label: "Користувачі", icon: Users },
    { id: "organizations", label: "Організації", icon: Building2 },
    { id: "projects", label: "Наукові роботи", icon: FileText },
    { id: "programs", label: "Програми платформи", icon: ShieldCheck },
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
        <div className="mb-4 mt-15">
          <button
            onClick={() => navigate("/profile")}
            className="group flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[var(--text-gray)] hover:text-purple-600 transition-colors"
          >
            <span className="transform group-hover:-translate-x-0.5 transition-transform">
              ←
            </span>
            Повернутись у профіль
          </button>
        </div>
        <div className="flex flex-col md:flex-row justify-between gap-6 mb-12 mt-4">
          <h1 className="text-3xl font-black">
            SciencePlatform <span className="text-purple-600">SuperAdmin</span>
          </h1>
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-1.5 rounded-2xl flex gap-1 overflow-x-auto max-w-full scrollbar-none">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all shrink-0 ${
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
            stats={{
              ...stats,
              programs: programs.length,
              organizations: organizations.length,
            }}
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
        {activeTab === "organizations" && (
          <OrganizationsTab
            organizations={organizations}
            onUpdateStatus={handleUpdateOrganizationStatus}
            loadingAction={loadingAction}
            onViewCabinet={(id) => navigate(`/org-admin?orgId=${id}`)}
          />
        )}
        {activeTab === "projects" && (
          <ProjectsTab
            projects={projects}
            onUpdateStatus={handleUpdateProjectStatus}
            loadingAction={loadingAction}
            onAssignReviewer={handleAssignReviewer}
            users={users}
          />
        )}
        {activeTab === "programs" && (
          <ProgramsTab
            programs={programs}
            setPrograms={setPrograms}
            newProgram={newProgram}
            setNewProgram={setNewProgram}
            onCreateProgram={handleCreateGlobalProgram}
            onToggleStatus={handleToggleGlobalProgramStatus}
            loadingAction={loadingAction}
            organizationName=""
          />
        )}
      </main>
      <Footer />
    </div>
  );
}
