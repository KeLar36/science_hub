import React from "react";
import { useAuth } from "../../context/AuthContext";
import {
  MapPin,
  Settings,
  UserCheck,
  ShieldAlert,
  FileText,
  FileCheck,
  Building2,
  Linkedin,
  Github,
  Twitter,
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
      <div className="bento-card p-8 flex items-center justify-center bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl h-48 animate-pulse">
        <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-6 rounded-3xl flex flex-col gap-5 relative overflow-hidden transition-all text-left hover:border-purple-500/10">
      <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/[0.03] blur-3xl rounded-full pointer-events-none" />
      <div className="flex items-center gap-4">
        <div className="relative shrink-0">
          {userData.image ? (
            <img
              src={userData.image}
              alt={userData.name || "User Avatar"}
              className="w-16 h-16 rounded-2xl object-cover border border-purple-600/20 shadow-inner"
            />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-purple-600/10 text-purple-600 flex items-center justify-center font-black text-xl border border-purple-600/20 uppercase">
              {userData.name ? userData.name[0].toUpperCase() : "U"}
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="text-base font-black text-[var(--text-dark)] leading-tight truncate">
            {userData.name}
          </h2>
          <p className="text-xs text-[var(--text-gray)] font-medium truncate mt-0.5">
            {userData.email}
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-1.5">
            {userData.city && (
              <div className="flex items-center gap-1 text-[10px] text-purple-600 font-bold uppercase tracking-wide">
                <MapPin size={10} /> {userData.city}
              </div>
            )}

            {userData.socials && (
              <div className="flex items-center gap-2">
                {userData.city && (
                  <span className="w-1 h-1 rounded-full bg-[var(--border-color)]" />
                )}

                {userData.socials.linkedIn && (
                  <a
                    href={userData.socials.linkedIn}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1 text-[var(--text-gray)] hover:text-purple-600 hover:bg-purple-600/5 rounded-lg transition-all"
                    title="LinkedIn профіль"
                  >
                    <Linkedin size={12} />
                  </a>
                )}

                {userData.socials.github && (
                  <a
                    href={userData.socials.github}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1 text-[var(--text-gray)] hover:text-purple-600 hover:bg-purple-600/5 rounded-lg transition-all"
                    title="GitHub профіль"
                  >
                    <Github size={12} />
                  </a>
                )}

                {userData.socials.twitter && (
                  <a
                    href={userData.socials.twitter}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1 text-[var(--text-gray)] hover:text-purple-600 hover:bg-purple-600/5 rounded-lg transition-all"
                    title="Twitter (X) профіль"
                  >
                    <Twitter size={12} />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="px-3 py-1.5 bg-purple-500/5 text-purple-600 border border-purple-500/10 text-[9px] font-black uppercase tracking-widest rounded-xl w-fit">
        Роль: {userData?.role || "Користувач"}
      </div>
      {userData.bio && (
        <p className="text-xs text-[var(--text-gray)] font-medium leading-relaxed border-t border-[var(--border-color)] pt-3 line-clamp-3">
          {userData.bio}
        </p>
      )}
      <div className="space-y-2 border-t border-[var(--border-color)] pt-4 mt-2">
        <button
          onClick={onOpenEdit}
          className="w-full px-3 py-2.5 bg-[var(--bg-main)] hover:bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-dark)] rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Settings size={13} className="text-purple-600" /> Редагувати профіль
        </button>

        {userData?.role === "admin" &&
          userData?.organizationId &&
          userData?.organizationId !== "null" && (
            <button
              onClick={() => navigate("/org-admin")}
              className="w-full px-3 py-2.5 bg-purple-600 text-white rounded-xl text-xs font-black uppercase tracking-wider italic transition-all hover:bg-purple-700 flex items-center justify-center gap-2 shadow-sm shadow-purple-600/10 cursor-pointer"
            >
              <UserCheck size={13} /> Кабінет Установи
            </button>
          )}

        {userData?.role === "superadmin" && (
          <button
            onClick={() => navigate("/superadmin")}
            className="w-full px-3 py-2.5 bg-amber-500 text-white rounded-xl text-xs font-black uppercase tracking-wider italic transition-all hover:bg-amber-600 flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShieldAlert size={13} /> SuperAdmin Панель
          </button>
        )}

        {(userData?.role === "superadmin" || user?.role === "reviewer") && (
          <button
            onClick={() => navigate("/reviewer")}
            className="w-full px-3 py-2.5 bg-purple-600 text-white rounded-xl text-xs font-black uppercase tracking-wider italic transition-all hover:bg-purple-700 flex items-center justify-center gap-2 shadow-sm shadow-purple-600/10 cursor-pointer"
          >
            <FileCheck size={13} /> Панель рецензента
          </button>
        )}

        {(userData?.role === "superadmin" ||
          user?.role === "content-manager") && (
          <button
            onClick={() => navigate("/content-panel")}
            className="w-full px-3 py-2.5 bg-purple-600 text-white rounded-xl text-xs font-black uppercase tracking-wider italic transition-all hover:bg-purple-700 flex items-center justify-center gap-2 shadow-sm shadow-purple-600/10 cursor-pointer"
          >
            <FileText size={13} /> Менеджер контенту
          </button>
        )}

        {userData?.role === "user" && hasNoOrganization && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full pt-1">
            <button
              onClick={onOpenJoinOrg}
              className="px-3 py-2.5 bg-purple-600 hover:bg-purple-700 text-white border border-transparent rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm shadow-purple-600/5 cursor-pointer"
            >
              <Building2 size={13} /> Приєднатися до установи
            </button>
            <button
              onClick={onOpenCreateOrg}
              className="px-3 py-2.5 bg-purple-600/5 hover:bg-purple-600 hover:text-white border border-purple-500/10 text-purple-600 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              🏢 Створити установу
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
