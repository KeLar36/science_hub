/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axiosInstance from "../../api/axios";
import toast, { Toaster } from "react-hot-toast";
import { ShieldCheck, Users, FileText, Loader2 } from "lucide-react";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { UsersManagement } from "../../components/dashboard/UsersManagement";
import { ProjectsManagement } from "../../components/dashboard/ProjectsManagement";
import { ProgramsManagement } from "../../components/dashboard/ProgramsManagement";
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

  // Ініціалізація кабінету установи та завантаження її профілю
  const initOrgAdmin = useCallback(
    async (signal) => {
      try {
        setLoading(true);
        if (!targetOrgId) {
          toast.error("Помилка: Установу не знайдено");
          navigate("/profile");
          return;
        }

        const orgRes = await axiosInstance.get(
          `/organizations/${targetOrgId}`,
          {
            signal,
          },
        );
        setOrganization(orgRes.data);
      } catch (err) {
        if (err.name !== "CanceledError") {
          toast.error("Не вдалося завантажити дані кабінету установи");
        }
      } finally {
        setLoading(false);
      }
    },
    [targetOrgId, navigate],
  );

  useEffect(() => {
    const controller = new AbortController();
    if (!authLoading) {
      const isSuperAdmin = authUser?.role === "superadmin";
      const isOrgAdmin =
        authUser?.role === "admin" &&
        String(authUser?.organizationId?._id || authUser?.organizationId) ===
          String(targetOrgId);

      if (!authUser || (!isSuperAdmin && !isOrgAdmin)) {
        toast.error("Доступ заборонено!");
        navigate("/");
        return;
      }

      initOrgAdmin(controller.signal);
    }
    return () => controller.abort();
  }, [authLoading, initOrgAdmin, authUser, targetOrgId]);

  const tabs = [
    { id: "users", label: "Співробітники", icon: Users },
    { id: "projects", label: "Модерація робіт", icon: FileText },
    { id: "programs", label: "Конкурси установи", icon: ShieldCheck },
  ];

  if (loading || authLoading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-main)]">
        <Loader2 size={32} className="animate-spin text-purple-600" />
      </div>
    );

  return (
    <div className="min-h-screen bg-[var(--bg-main)] flex flex-col text-[var(--text-dark)] select-none">
      <Toaster position="top-center" reverseOrder={false} />
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-12">
        {/* Кнопка навігації Назад */}
        <div className="mb-4 mt-15 text-left">
          <button
            onClick={() => navigate("/profile")}
            className="group flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[var(--text-gray)] hover:text-purple-600 transition-colors cursor-pointer"
          >
            <span className="transform group-hover:-translate-x-0.5 transition-transform font-bold">
              ←
            </span>
            Назад у кабінет
          </button>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 mt-4 text-left">
          <div>
            <span className="text-[10px] font-mono font-black uppercase tracking-widest text-purple-600">
              Кабінет Установи
            </span>
            <h1 className="text-2xl font-black uppercase tracking-tight mt-1">
              {organization?.name}
            </h1>
          </div>

          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-1.5 rounded-2xl flex gap-1 overflow-x-auto max-w-full scrollbar-none h-fit">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? "bg-purple-600 text-white shadow-lg shadow-purple-600/10"
                      : "text-[var(--text-gray)] hover:text-[var(--text-dark)]"
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
            />
          )}

          {activeTab === "projects" && (
            <ProjectsManagement userRole="admin" orgId={targetOrgId} />
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
