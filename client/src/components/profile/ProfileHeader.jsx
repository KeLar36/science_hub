import React from "react";
import { useAuth } from "../../context/AuthContext";
import {
  MapPin,
  Settings,
  Github,
  Linkedin,
  Globe,
  UserCheck,
  FileText,
  FileCheck,
} from "lucide-react";

export default function ProfileHeader({
  userData,
  apiUrl,
  navigate,
  onOpenEdit,
}) {
  const { user } = useAuth();

  return (
    <div className="lg:col-span-3 bento-card p-8 md:p-10 flex flex-col md:flex-row items-center md:items-start gap-8 relative overflow-hidden bg-[var(--bg-card)] border border-[var(--border-color)] rounded-[2rem]">
      <div className="absolute top-0 left-0 w-64 h-64 bg-purple-600/5 rounded-full blur-3xl -z-10" />

      <div className="relative shrink-0">
        <div className="w-28 h-28 rounded-3xl bg-gradient-to-br from-purple-600 to-indigo-700 overflow-hidden shadow-xl flex items-center justify-center ring-4 ring-purple-500/10">
          {userData.image ? (
            <img
              src={
                userData.image.startsWith("http")
                  ? userData.image
                  : `${apiUrl}${userData.image}`
              }
              alt="Avatar"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          ) : (
            <div className="text-white text-4xl font-extrabold uppercase">
              {userData.name?.charAt(0)}
            </div>
          )}
        </div>
      </div>

      <div className="text-center md:text-left flex-1 space-y-4">
        <div>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-[var(--text-dark)]">
              {userData.name}
            </h1>
            {userData.role !== "user" && (
              <span className="px-2.5 py-1 bg-purple-600/10 text-purple-600 dark:text-purple-400 rounded-md text-[10px] font-bold tracking-wider uppercase border border-purple-500/10">
                {userData.role}
              </span>
            )}
          </div>

          <div className="flex items-center justify-center md:justify-start gap-1.5 text-[var(--text-gray)] text-xs font-semibold">
            <MapPin size={14} className="text-purple-500" />
            <span>{userData.city || "Ukraїna"}</span>
          </div>
        </div>

        <p className="text-[var(--text-gray)] text-sm leading-relaxed max-w-2xl font-medium">
          {userData.bio ||
            "Дослідник відкритої науки. Інформація про наукові інтереси поки не заповнена."}
        </p>

        <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 pt-2">
          <div className="flex gap-3">
            {userData.socials?.github && (
              <a
                href={userData.socials.github}
                target="_blank"
                rel="noreferrer"
                className="p-2 bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-gray)] hover:text-purple-600 hover:border-purple-500/30 rounded-xl transition-all shadow-sm"
              >
                <Github size={18} />
              </a>
            )}
            {userData.socials?.linkedin && (
              <a
                href={userData.socials.linkedin}
                target="_blank"
                rel="noreferrer"
                className="p-2 bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-gray)] hover:text-purple-600 hover:border-purple-500/30 rounded-xl transition-all shadow-sm"
              >
                <Linkedin size={18} />
              </a>
            )}
            {userData.socials?.website && (
              <a
                href={userData.socials.website}
                target="_blank"
                rel="noreferrer"
                className="p-2 bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-gray)] hover:text-purple-600 hover:border-purple-500/30 rounded-xl transition-all shadow-sm"
              >
                <Globe size={18} />
              </a>
            )}
            <button
              onClick={onOpenEdit}
              className="p-2 bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-dark)] hover:text-purple-600 hover:border-purple-500/30 rounded-xl transition-all shadow-sm"
              title="Налаштування профілю"
            >
              <Settings size={18} />
            </button>
          </div>

          {user &&
            ["admin", "superadmin", "content-manager", "reviewer"].includes(
              user.role,
            ) && (
              <div className="h-5 w-[1px] bg-[var(--border-color)] hidden sm:block" />
            )}

          <div className="flex items-center gap-2">
            {user && ["admin", "superadmin"].includes(user.role) && (
              <button
                onClick={() => navigate("/admin")}
                className="px-3 py-2 bg-purple-600/5 hover:bg-purple-600 hover:text-white border border-purple-500/10 text-purple-600 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
              >
                <UserCheck size={14} /> Адмінка
              </button>
            )}

            {user && ["content-manager", "superadmin"].includes(user.role) && (
              <button
                onClick={() => navigate("/content-panel")}
                className="px-3 py-2 bg-blue-500/5 hover:bg-blue-500 hover:text-white border border-blue-500/10 text-blue-500 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
              >
                <FileText size={14} /> Контент
              </button>
            )}

            {user && ["reviewer", "superadmin"].includes(user.role) && (
              <button
                onClick={() => navigate("/reviewer")}
                className="px-3 py-2 bg-emerald-500/5 hover:bg-emerald-500 hover:text-white border border-emerald-500/10 text-emerald-500 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
              >
                <FileCheck size={14} /> Рецензії
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
