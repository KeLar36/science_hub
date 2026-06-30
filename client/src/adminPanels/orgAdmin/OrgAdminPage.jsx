/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../../api/axios";
import toast, { Toaster } from "react-hot-toast";
import {
  BarChart3,
  Users,
  FileText,
  UserPlus,
  ShieldCheck,
  Loader2,
} from "lucide-react";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import OrgDashboardTab from "./components/OrgDashboardTab";
import OrgUsersTab from "./components/OrgUsersTab";
import OrgProjectsTab from "./components/OrgProjectsTab";
import OrgJoinRequestsTab from "./components/OrgJoinRequestsTab";
import OrgProgramsTab from "./components/OrgProgramsTab";

import { useAuth } from "../../context/AuthContext";

export default function OrgAdminPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user: authUser, loading: authLoading } = useAuth();

  const queryParams = new URLSearchParams(location.search);
  const targetOrgId = queryParams.get("orgId"); // Передається, якщо зайшов суперадмін

  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [loadingAction, setLoadingAction] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [organization, setOrganization] = useState(null);

  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [joinRequests, setJoinRequests] = useState([]);
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

  const fetchOrgData = useCallback(
    async (signal) => {
      try {
        setLoading(true);

        // 1. Отримуємо дані про поточного сесійного користувача
        const meRes = await axiosInstance.get("/users/me", { signal });
        const userData = meRes.data.user || meRes.data;

        if (userData?.role !== "admin" && userData?.role !== "superadmin") {
          toast.error("Доступ заборонено: потрібні права адміністратора");
          navigate("/profile");
          return;
        }

        setCurrentUser(userData);

        // 2. 🟢 ПРИМУСОВА ІЗОЛЯЦІЯ ОРГАНІЗАЦІЇ
        // Якщо зайшов суперадмін — беремо orgId з урла, якщо звичайний адмін — його рідний ID установи
        const activeOrgId = targetOrgId || userData.organizationId;

        if (!activeOrgId) {
          toast.error("Не вдалося визначити ID організації для цього акаунту");
          setLoading(false);
          return;
        }

        // Завжди формуємо явний orgId для завантаження контенту
        const explicitParams = { orgId: activeOrgId };

        // 3. Завантажуємо дані, де програми, лічильники та списки 100% відфільтровані по activeOrgId
        const [statsRes, usersRes, projectsRes, requestsRes, programsRes] =
          await Promise.all([
            axiosInstance.get("/users/count", {
              signal,
              params: explicitParams,
            }),
            axiosInstance.get("/users/all", { signal, params: explicitParams }),
            axiosInstance.get("/projects/all", {
              signal,
              params: explicitParams,
            }),
            axiosInstance.get("/organizations/my-org/requests", {
              signal,
              params: explicitParams,
            }),
            axiosInstance.get("/programs", { signal, params: explicitParams }), // 🎯 Тепер сюди летить чіткий orgId!
          ]);

        setUsers(usersRes.data || []);
        setProjects(projectsRes.data || []);
        setJoinRequests(requestsRes.data || []);
        setPrograms(programsRes.data || []); // 🎯 Зберігаємо тільки програми цієї установи

        // Отримуємо брендовані деталі установи
        const orgDetails = await axiosInstance.get(
          `/organizations/${activeOrgId}`,
          { signal },
        );
        setOrganization(orgDetails.data);

        // Автоматично заповнюємо організатора для форми
        setNewProgram((prev) => ({
          ...prev,
          organizer: orgDetails.data?.name || "",
        }));

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
          console.error("Помилка адмінки організації:", err);
          toast.error("Не вдалося завантажити дані організації");
        }
      } finally {
        setLoading(false);
      }
    },
    [navigate, targetOrgId],
  );

  useEffect(() => {
    const controller = new AbortController();
    if (!authLoading) {
      fetchOrgData(controller.signal);
    }
    return () => controller.abort();
  }, [authLoading, fetchOrgData]);

  // Створення нової програми в контексті поточної установи
  const handleCreateOrgProgram = async (e) => {
    e.preventDefault();
    try {
      setLoadingAction("createProgram");

      const activeOrgId = targetOrgId || currentUser?.organizationId;
      const bodyData = targetOrgId
        ? { ...newProgram, orgId: targetOrgId }
        : newProgram;

      const res = await axiosInstance.post("/programs", bodyData);
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
        organizer: organization?.name || "",
        externalLink: "",
        location: "Онлайн",
      });
      toast.success("Нову програму організації успішно опубліковано!");
    } catch (err) {
      toast.error(err.response?.data?.error || "Помилка створення програми");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleToggleOrgProgramStatus = async (programId) => {
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
      toast.error("Помилка зміни статусу програми");
    } finally {
      setLoadingAction(null);
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
      toast.success(`Статус роботи оновлено`);
    } catch {
      toast.error("Помилка зміни статусу");
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
      toast.error("Помилка призначення рецензента");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleAcceptRequest = async (userId) => {
    try {
      setLoadingAction(userId);
      const body = targetOrgId ? { orgId: targetOrgId } : {};
      await axiosInstance.post(
        `/organizations/requests/accept/${userId}`,
        body,
      );
      setJoinRequests((prev) =>
        prev.filter((req) => req.userId?._id !== userId),
      );
      toast.success("Користувача успішно прийнято!");

      const controller = new AbortController();
      fetchOrgData(controller.signal);
    } catch {
      toast.error("Помилка прийняття запиту");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleRejectRequest = async (userId) => {
    try {
      setLoadingAction(userId);
      const body = targetOrgId ? { orgId: targetOrgId } : {};
      await axiosInstance.post(
        `/organizations/requests/reject/${userId}`,
        body,
      );
      setJoinRequests((prev) =>
        prev.filter((req) => req.userId?._id !== userId),
      );
      toast.success("Заявку відхилено");
    } catch {
      toast.error("Помилка відхилення запиту");
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

  const tabs = [
    { id: "overview", label: "Аналітика", icon: BarChart3 },
    { id: "users", label: "Співробітники", icon: Users },
    { id: "programs", label: "Наші конкурси", icon: ShieldCheck },
    { id: "projects", label: "Наукові роботи", icon: FileText },
    { id: "requests", label: "Заявки на вступ", icon: UserPlus },
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
        {/* 🟢 КНОПКА РОЗУМНОГО ПОВЕРНЕННЯ НАЗАД (UX ДЕТАЛЬ) */}
        <div className="mb-4 mt-18 text-left">
          {targetOrgId ? (
            <button
              onClick={() => navigate("/superadmin")}
              className="group flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[var(--text-gray)] hover:text-purple-600 transition-colors"
            >
              <span className="transform group-hover:-translate-x-0.5 transition-transform">
                ←
              </span>
              Назад у SuperAdmin
            </button>
          ) : (
            <button
              onClick={() => navigate("/profile")}
              className="group flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[var(--text-gray)] hover:text-purple-600 transition-colors"
            >
              <span className="transform group-hover:-translate-x-0.5 transition-transform">
                ←
              </span>
              Повернутись у профіль
            </button>
          )}
        </div>

        <div className="flex flex-col md:flex-row justify-between gap-6 mb-12">
          <h1 className="text-3xl font-black text-left">
            Кабінет{" "}
            <span className="text-purple-600">
              {organization ? organization.name : "Організації"}
            </span>
          </h1>
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-1.5 rounded-2xl flex gap-1 overflow-x-auto max-w-full scrollbar-none whitespace-nowrap">
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
          <OrgDashboardTab
            stats={safeStats}
            chartData={dashboardData.chartData}
            pieData={dashboardData.pieData}
          />
        )}
        {activeTab === "users" && (
          <OrgUsersTab
            users={users}
            currentUser={currentUser}
            onUpdateRole={(id, r) => {}}
            onToggleBan={(id, s) => {}}
            loadingAction={loadingAction}
          />
        )}
        {activeTab === "programs" && (
          <OrgProgramsTab
            programs={programs}
            setPrograms={setPrograms}
            newProgram={newProgram}
            setNewProgram={setNewProgram}
            onCreateProgram={handleCreateOrgProgram}
            onToggleStatus={handleToggleOrgProgramStatus}
            loadingAction={loadingAction}
            organizationName={organization?.name || ""}
          />
        )}
        {activeTab === "projects" && (
          <OrgProjectsTab
            projects={projects}
            onUpdateStatus={handleUpdateProjectStatus}
            loadingAction={loadingAction}
            onAssignReviewer={handleAssignReviewer}
            users={users}
          />
        )}
        {activeTab === "requests" && (
          <OrgJoinRequestsTab
            requests={joinRequests}
            onAccept={handleAcceptRequest}
            onReject={handleRejectRequest}
            loadingAction={loadingAction}
          />
        )}
      </main>
      <Footer />
    </div>
  );
}
