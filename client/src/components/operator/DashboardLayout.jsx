import React, { useState, useEffect } from "react";
import { Outlet, Navigate, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../api/axios";
import { Button } from "../ui/Button";
import {
  LayoutDashboard,
  Building2,
  FileText,
  PenTool,
  FileCheck,
  ArrowLeft,
  Menu,
  X,
  ShieldAlert,
  Home,
} from "lucide-react";

import SuperAdminPage from "../../pages/admin/SuperAdminPage";
import OrgAdminPage from "../../pages/admin/OrgAdminPage";
import ReviewerPage from "../../pages/ReviewerPage";
import ContentPanel from "../../pages/ContentPanel";
import DashboardWelcome from "./DashboardWelcome";

export default function DashboardLayout() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeRoleView, setActiveRoleView] = useState(null);

  const [organization, setOrganization] = useState(null);

  useEffect(() => {
    const orgId = user?.organizationId?._id || user?.organizationId;
    if (orgId && orgId !== "null") {
      axiosInstance
        .get(`/organizations/${orgId}`)
        .then((res) => {
          setOrganization(res.data);
        })
        .catch((err) => {
          console.error(
            "💥 Помилка завантаження даних установи в дешборді:",
            err,
          );
        });
    }
  }, [user]);

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const currentRole = activeRoleView || user?.role;

  const menuConfigs = {
    superadmin: [
      { label: "Головна", path: "/dashboard", icon: Home },
      {
        label: "Керування установами",
        path: "/dashboard/superadmin",
        icon: Building2,
      },
    ],
    admin: [
      { label: "Головна", path: "/dashboard", icon: Home },
      {
        label: "Програми та конкурси",
        path: "/dashboard/org-admin",
        icon: Building2,
      },
    ],
    reviewer: [
      { label: "Головна", path: "/dashboard", icon: Home },
      { label: "Черга рецензій", path: "/dashboard/reviewer", icon: FileCheck },
    ],
    "content-manager": [
      { label: "Головна", path: "/dashboard", icon: Home },
      {
        label: "Усі публікації",
        path: "/dashboard/content-panel",
        icon: FileText,
      },
      {
        label: "Створити матеріал",
        path: "/dashboard/content-management",
        icon: PenTool,
      },
    ],
  };

  const menuItems = menuConfigs[currentRole] || [];

  const handleNavigate = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const renderActiveWorkspace = () => {
    if (location.pathname !== "/dashboard") {
      return <Outlet />;
    }

    switch (currentRole) {
      case "superadmin":
        return <SuperAdminPage />;
      case "admin":
        return <OrgAdminPage />;
      case "reviewer":
        return <ReviewerPage />;
      case "content-manager":
        return <ContentPanel />;
      default:
        return <DashboardWelcome />;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] flex flex-col">
      <div className="flex-grow flex relative">
        <aside className="w-68 border-r border-[var(--border-color)] bg-[var(--bg-card)] hidden md:flex flex-col shrink-0 z-10 pt-20">
          <div className="p-5 border-b border-[var(--border-color)]/60">
            <span className="text-[10px] font-mono font-black uppercase tracking-widest text-purple-600">
              // Серце установи
            </span>
            <h3 className="text-xs font-black text-[var(--text-dark)] uppercase tracking-wider mt-1">
              {currentRole === "superadmin" && "Глобальна Адмінка"}
              {currentRole === "admin" && "Панель установи"}
              {currentRole === "reviewer" && "Кабінет рецензента"}
              {currentRole === "content-manager" && "Панель публікацій"}
            </h3>

            {currentRole === "superadmin" ? (
              <p className="text-[9px] font-bold text-purple-600 dark:text-purple-400 uppercase truncate mt-0.5">
                ⚡ Глобальний контроль
              </p>
            ) : organization ? (
              <p
                className="text-[9px] font-bold text-[var(--text-gray)] uppercase truncate mt-0.5"
                title={organization.name}
              >
                🏢 {organization.name}
              </p>
            ) : user?.organizationId ? (
              <p className="text-[9px] font-bold text-[var(--text-gray)]/50 uppercase truncate mt-0.5 animate-pulse">
                ⏳ Завантаження установи...
              </p>
            ) : null}
          </div>

          {user?.role === "superadmin" && (
            <div className="p-4 border-b border-[var(--border-color)]/40 bg-purple-600/[0.02] space-y-1">
              <span className="text-[8px] font-black uppercase tracking-wider text-[var(--text-gray)] block mb-1.5 flex items-center gap-1">
                <ShieldAlert size={10} className="text-purple-600" /> Емуляція
                ролей:
              </span>
              <div className="grid grid-cols-2 gap-1">
                {["superadmin", "admin", "reviewer", "content-manager"].map(
                  (role) => (
                    <button
                      key={role}
                      onClick={() => {
                        setActiveRoleView(role);
                        navigate("/dashboard");
                      }}
                      className={`px-1.5 py-1 text-[8px] font-black uppercase rounded-md border transition-all cursor-pointer ${
                        currentRole === role
                          ? "bg-purple-600 text-white border-purple-500"
                          : "bg-[var(--bg-main)] text-[var(--text-gray)] border-[var(--border-color)] hover:border-purple-500/30"
                      }`}
                    >
                      {role.replace("-", " ")}
                    </button>
                  ),
                )}
              </div>
            </div>
          )}

          <nav className="flex-grow p-4 space-y-1 overflow-y-auto">
            {menuItems.map((item, idx) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <button
                  key={idx}
                  onClick={() => handleNavigate(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                    isActive
                      ? "bg-purple-600/5 text-purple-600 border-purple-500/15"
                      : "text-[var(--text-gray)] hover:bg-[var(--bg-main)] hover:text-[var(--text-dark)] border-transparent"
                  }`}
                >
                  <Icon
                    size={14}
                    className={
                      isActive ? "text-purple-600" : "text-[var(--text-gray)]"
                    }
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="p-4 border-t border-[var(--border-color)]/60">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/profile")}
              className="w-full text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-2 rounded-xl py-3 cursor-pointer"
            >
              <ArrowLeft size={12} className="text-purple-600" />
              <span>Профіль</span>
            </Button>
          </div>
        </aside>

        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 border-b border-[var(--border-color)] bg-[var(--bg-card)] flex items-center justify-between px-6 md:hidden z-10 mt-20 shrink-0">
            <span className="text-[10px] font-mono font-black uppercase tracking-widest text-[var(--text-dark)]">
              Кабінет Керування
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 cursor-pointer"
            >
              {isMobileMenuOpen ? <X size={15} /> : <Menu size={15} />}
            </Button>
          </header>

          {isMobileMenuOpen && (
            <div className="md:hidden bg-[var(--bg-card)] border-b border-[var(--border-color)] p-4 space-y-1 z-10 animate-in slide-in-from-top duration-200">
              {menuItems.map((item, idx) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <button
                    key={idx}
                    onClick={() => handleNavigate(item.path)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                      isActive
                        ? "bg-purple-600/5 text-purple-600 border-purple-500/15"
                        : "text-[var(--text-gray)] hover:bg-[var(--bg-main)] hover:text-[var(--text-dark)] border-transparent"
                    }`}
                  >
                    <Icon size={14} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
              <div className="pt-3 border-t border-[var(--border-color)]/60 mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/profile")}
                  className="w-full text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-2 py-3 cursor-pointer"
                >
                  <ArrowLeft size={12} className="text-purple-600" />
                  <span>Профіль</span>
                </Button>
              </div>
            </div>
          )}

          <main className="flex-grow p-6 sm:p-8 md:p-10 pt-24 md:pt-28 overflow-y-auto">
            {renderActiveWorkspace()}
          </main>
        </div>
      </div>
    </div>
  );
}
