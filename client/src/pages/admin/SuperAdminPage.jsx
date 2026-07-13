/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axios";
import toast, { Toaster } from "react-hot-toast";
import {
  BarChart3,
  ShieldCheck,
  Users,
  FileText,
  Building2,
  Zap,
  Newspaper,
} from "lucide-react";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { DashboardOverview } from "../../components/dashboard/DashboardOverview";
import { UsersManagement } from "../../components/dashboard/UsersManagement";
import { OrganizationsManagement } from "../../components/dashboard/OrganizationsManagement";
import { ProjectsManagement } from "../../components/dashboard/ProjectsManagement";
import { ProgramsManagement } from "../../components/dashboard/ProgramsManagement";
import SuperAdminPrograms from "../../components/dashboard/SuperAdminPrograms";
import AdminPostsTab from "../../components/dashboard/AdminPostsTab";
import { useAuth } from "../../context/AuthContext";

export default function SuperAdminPage() {
  const navigate = useNavigate();
  const { user: authUser, loading: authLoading } = useAuth();

  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  const initAdmin = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/users/me");
      setCurrentUser(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Помилка авторизації адміна");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      if (!authUser || authUser.role !== "superadmin") {
        toast.error("Доступ заборонено!");
        navigate("/");
        return;
      }
      initAdmin();
    }
  }, [authUser, authLoading]);

  const tabs = [
    { id: "overview", label: "Аналітика", icon: BarChart3 },
    { id: "users", label: "Користувачі", icon: Users },
    { id: "organizations", label: "Установи", icon: Building2 },
    { id: "projects", label: "Наукові роботи", icon: FileText },
    { id: "blog", label: "Медіа-Блог", icon: Newspaper },
    { id: "programs", label: "Програми платформи", icon: ShieldCheck },
    { id: "free-tier-control", label: "Оптимізація Free Tier", icon: Zap },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-dark)] flex flex-col font-sans selection:bg-purple-600/10 select-none">
      <Toaster position="top-center" reverseOrder={false} />
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-20 space-y-6">
        {/* Верхній банер */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[var(--bg-card)] border border-[var(--border-color)] p-6 rounded-3xl text-left">
          <div>
            <h1 className="text-xl font-black uppercase tracking-wider text-purple-600 dark:text-purple-400 m-0">
              Глобальна панель SuperAdmin
            </h1>
            <p className="text-xs text-[var(--text-gray)] font-semibold mt-0.5 m-0">
              Повний моніторинг користувачів, установ, наукових праць, блогу та
              конкурсів
            </p>
          </div>
          {currentUser && (
            <div className="flex items-center gap-3 bg-[var(--bg-main)] border border-[var(--border-color)] px-4 py-2.5 rounded-2xl w-fit">
              <div className="w-8 h-8 rounded-xl overflow-hidden shrink-0 border border-purple-600/10 flex items-center justify-center bg-purple-600/10 text-purple-600">
                {currentUser.image ? (
                  <img
                    src={currentUser.image}
                    alt={currentUser.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="font-black text-xs uppercase">
                    {currentUser.name ? currentUser.name[0].toUpperCase() : "A"}
                  </span>
                )}
              </div>
              <div className="text-left">
                <p className="text-xs font-black uppercase tracking-wide leading-none m-0">
                  {currentUser.name}
                </p>
                <span className="text-[9px] font-mono font-bold text-amber-500 uppercase tracking-widest mt-1 block">
                  Root System
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="w-full overflow-x-auto pb-2 border-b border-[var(--border-color)] scrollbar-none snap-x">
          <div className="flex gap-2 min-w-max">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer snap-numerator shrink-0 ${
                    isActive
                      ? "bg-purple-600 text-white shadow-lg shadow-purple-600/10 scale-102"
                      : "text-[var(--text-gray)] hover:text-[var(--text-dark)] hover:bg-[var(--bg-card)] border border-transparent hover:border-[var(--border-color)]"
                  }`}
                >
                  <Icon size={14} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-4">
          {activeTab === "overview" && <DashboardOverview />}

          {activeTab === "users" && (
            <UsersManagement currentUser={currentUser} userRole="superadmin" />
          )}

          {activeTab === "organizations" && (
            <OrganizationsManagement
              onViewCabinet={(id) => navigate(`/org-admin?orgId=${id}`)}
            />
          )}

          {activeTab === "projects" && (
            <ProjectsManagement userRole="superadmin" />
          )}

          {activeTab === "blog" && <AdminPostsTab isOrganizationMode={false} />}

          {activeTab === "programs" && (
            <ProgramsManagement
              userRole="superadmin"
              organizationName="Платформа"
            />
          )}

          {activeTab === "free-tier-control" && <SuperAdminPrograms />}
        </div>
      </main>
      <Footer />
    </div>
  );
}
