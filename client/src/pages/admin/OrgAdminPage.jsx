/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axiosInstance from "../../api/axios";
import toast, { Toaster } from "react-hot-toast";
import {
  ShieldCheck,
  Users,
  FileText,
  Loader2,
  UserPlus,
  UserCheck,
  BookOpen,
} from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { UsersManagement } from "../../components/dashboard/UsersManagement";
import { ProjectsManagement } from "../../components/dashboard/ProjectsManagement";
import { ProgramsManagement } from "../../components/dashboard/ProgramsManagement";
import { OrganizationRequestsTab } from "../../components/dashboard/OrganizationRequestsTab";
import AdminPostsTab from "../../components/dashboard/AdminPostsTab"; // 👈 Імпортуємо наш універсальний таб блогу
import { useAuth } from "../../context/AuthContext";

export default function OrgAdminPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user: authUser, loading: authLoading } = useAuth();

  const orgIdFromUrl = searchParams.get("orgId");
  const targetOrgId =
    orgIdFromUrl || authUser?.organizationId?._id || authUser?.organizationId;

  const [activeTab, setActiveTab] = useState("users");
  const [loading, setLoading] = useState(true);
  const [organization, setOrganization] = useState(null);

  const fetchOrganization = useCallback(async () => {
    if (!targetOrgId) return;
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/organizations/${targetOrgId}`);
      setOrganization(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Помилка завантаження даних організації");
    } finally {
      setLoading(false);
    }
  }, [targetOrgId]);

  useEffect(() => {
    if (!authLoading) {
      if (
        !authUser ||
        (authUser.role !== "admin" && authUser.role !== "superadmin")
      ) {
        toast.error("Доступ заборонено!");
        navigate("/");
        return;
      }
      fetchOrganization();
    }
  }, [authUser, authLoading, fetchOrganization]);

  const tabs = [
    { id: "users", label: "Співробітники", icon: Users },
    { id: "requests", label: "Заявки на вступ", icon: UserPlus },
    { id: "projects", label: "Наукові роботи", icon: FileText },
    { id: "blog", label: "Новини та Публікації", icon: BookOpen },
    { id: "programs", label: "Конкурси та Програми", icon: ShieldCheck },
  ];

  if (authLoading || (loading && !organization)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-main)]">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-dark)] flex flex-col font-sans selection:bg-purple-600/10">
      <Toaster position="top-center" reverseOrder={false} />
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-20 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[var(--bg-card)] border border-[var(--border-color)] p-6 rounded-3xl text-left">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-600/10 border border-purple-500/10 flex items-center justify-center text-purple-600 shrink-0 overflow-hidden">
              {organization?.logo ? (
                <img
                  src={organization.logo}
                  alt={organization.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <BookOpen size={20} />
              )}
            </div>
            <div>
              <h1 className="text-lg font-black uppercase tracking-wider text-[var(--text-dark)] m-0">
                {organization?.name || "Кабінет Організації"}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] bg-purple-600/10 text-purple-600 dark:text-purple-400 px-2 py-0.5 rounded-md font-mono font-bold uppercase tracking-wider">
                  {organization?.edrpou || "ЄДРПОУ"}
                </span>
                <span className="text-[10px] text-[var(--text-gray)] font-semibold">
                  Панель керування контентом та структурою
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-[var(--bg-main)] border border-[var(--border-color)] px-4 py-2.5 rounded-2xl w-fit">
            <UserCheck size={16} className="text-emerald-500" />
            <div className="text-left">
              <p className="text-xs font-black uppercase tracking-wide leading-none m-0">
                {authUser?.name}
              </p>
              <span className="text-[9px] font-mono font-bold text-[var(--text-gray)] uppercase tracking-widest mt-1 block">
                {authUser?.role === "superadmin"
                  ? "Global Moderator"
                  : "Org Admin"}
              </span>
            </div>
          </div>
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
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all shrink-0 cursor-pointer snap-numerator ${
                    isActive
                      ? "bg-purple-600 text-white shadow-lg shadow-purple-600/10"
                      : "text-[var(--text-gray)] hover:text-[var(--text-dark)] hover:bg-[var(--bg-main)]/50"
                  }`}
                >
                  <Icon size={14} /> {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-4">
          {activeTab === "users" && (
            <UsersManagement
              currentUser={authUser}
              userRole="admin"
              orgId={targetOrgId}
              enableRoleManagement={true}
            />
          )}

          {activeTab === "requests" && (
            <OrganizationRequestsTab organizationId={targetOrgId} />
          )}

          {activeTab === "projects" && (
            <ProjectsManagement userRole="admin" orgId={targetOrgId} />
          )}

          {activeTab === "blog" && (
            <AdminPostsTab currentUser={authUser} isOrganizationMode={true} />
          )}

          {activeTab === "programs" && (
            <ProgramsManagement
              userRole="admin"
              orgId={targetOrgId}
              organizationName={organization?.name}
            />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
