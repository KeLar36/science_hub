import React from "react";
import { useAuth } from "../../context/AuthContext";
import {
  MapPin,
  Settings,
  UserCheck,
  ShieldAlert,
  Building2,
  Linkedin,
  Github,
  Twitter,
  LayoutDashboard,
} from "lucide-react";

export default function ProfileHeader({
  userData,
  navigate,
  onOpenEdit,
  onOpenCreateOrg,
  onOpenJoinOrg,
}) {
  const { user } = useAuth();

  const hasNoOrganization =
    !userData?.organizationId || userData?.organizationId === "null";

  if (!userData) {
    return (
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-8 flex items-center justify-center rounded-3xl h-48 animate-pulse">
        <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const getAdminRoute = () => {
    const userRole = userData?.role || user?.role;

    if (userRole === "superadmin") return "/dashboard/superadmin";
    if (userRole === "admin") return "/dashboard/org-admin";
    if (userRole === "reviewer") return "/dashboard/reviewer";
    if (userRole === "content-manager") return "/dashboard/content-panel";
    return "/profile";
  };

  const hasAccessToAdminDashboard = [
    "admin",
    "superadmin",
    "reviewer",
    "content-manager",
  ].includes(userData?.role || user?.role);

  const firstLetter = userData?.name
    ? userData.name.charAt(0).toUpperCase()
    : "?";

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-6 rounded-3xl flex flex-col gap-5 relative overflow-hidden transition-all text-left hover:border-purple-500/10">
      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex items-start gap-4">
        <div className="relative group shrink-0">
          {userData?.image ? (
            <img
              src={userData.image}
              alt={userData.name}
              className="w-16 h-16 rounded-2xl object-cover border border-[var(--border-color)]"
            />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600/10 to-indigo-600/5 border border-purple-500/20 flex items-center justify-center shadow-xs">
              <span className="text-xl font-black text-purple-600 dark:text-purple-400 font-mono">
                {firstLetter}
              </span>
            </div>
          )}

          {userData?.isBanned && (
            <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white p-1 rounded-lg text-[8px] font-black uppercase tracking-wider flex items-center gap-0.5 shadow-md">
              <ShieldAlert size={10} /> Бан
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl font-black tracking-tight text-[var(--text-dark)] truncate uppercase">
              {userData?.name}
            </h2>
            {userData?.role && userData.role !== "user" && (
              <span className="px-2 py-0.5 bg-purple-500/10 text-purple-600 border border-purple-500/10 rounded-md text-[8px] font-black uppercase tracking-widest font-mono">
                {userData.role}
              </span>
            )}
          </div>

          {userData?.city && (
            <div className="flex items-center gap-1 text-xs text-[var(--text-gray)] font-medium mb-1">
              <MapPin size={12} className="text-purple-500" />
              <span>{userData.city}</span>
            </div>
          )}

          {userData?.organizationId && userData.organizationId !== "null" && (
            <div className="flex items-center gap-1 text-xs font-bold text-purple-600 dark:text-purple-400">
              <UserCheck size={12} />
              <span className="truncate">
                {userData.organizationId?.name || "Наукова установа"}
              </span>
            </div>
          )}
        </div>
      </div>

      {userData?.bio && (
        <p className="text-xs text-[var(--text-gray)] leading-relaxed font-medium">
          {userData.bio}
        </p>
      )}

      {userData?.socials && (
        <div className="flex items-center gap-2 pt-1">
          {userData.socials.github && (
            <a
              href={userData.socials.github}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-gray)] hover:text-purple-600 hover:border-purple-500/20 transition-all"
            >
              <Github size={14} />
            </a>
          )}
          {userData.socials.linkedIn && (
            <a
              href={userData.socials.linkedIn}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-gray)] hover:text-purple-600 hover:border-purple-500/20 transition-all"
            >
              <Linkedin size={14} />
            </a>
          )}
          {userData.socials.twitter && (
            <a
              href={userData.socials.twitter}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-gray)] hover:text-purple-600 hover:border-purple-500/20 transition-all"
            >
              <Twitter size={14} />
            </a>
          )}
        </div>
      )}

      <div className="flex flex-col gap-2 w-full border-t border-[var(--border-color)]/60 pt-4 mt-auto z-10">
        {hasNoOrganization && userData?.role !== "superadmin" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full pb-1">
            <button
              onClick={onOpenJoinOrg}
              className="px-3 py-2.5 bg-purple-600 hover:bg-purple-700 text-white border border-transparent rounded-xl text-xs font-black uppercase tracking-wider italic transition-all flex items-center justify-center gap-2 shadow-sm shadow-purple-600/10 cursor-pointer"
            >
              <Building2 size={13} /> Приєднатися до установи
            </button>
            <button
              onClick={onOpenCreateOrg}
              className="px-3 py-2.5 bg-purple-600/5 hover:bg-purple-600 hover:text-white border border-purple-500/10 rounded-xl text-xs font-bold text-purple-600 dark:text-purple-400 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Building2 size={13} /> Створити установу
            </button>
          </div>
        )}
        {hasAccessToAdminDashboard && (
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full px-3 py-2.5 bg-purple-600 text-white rounded-xl text-xs font-black uppercase tracking-wider italic transition-all hover:bg-purple-700 flex items-center justify-center gap-2 shadow-sm shadow-purple-600/10 cursor-pointer"
          >
            <LayoutDashboard size={13} />
            Панель управління
          </button>
        )}
        <button
          onClick={onOpenEdit}
          className="w-full px-3 py-2.5 bg-[var(--bg-main)] text-[var(--text-dark)] border border-[var(--border-color)] rounded-xl text-xs font-bold transition-all hover:bg-[var(--bg-card)] hover:border-purple-500/30 flex items-center justify-center gap-2 cursor-pointer"
        >
          <Settings size={13} className="text-purple-600" /> Налаштування
          профілю
        </button>
      </div>
    </div>
  );
}
