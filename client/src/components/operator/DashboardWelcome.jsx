import React from "react";
import { useAuth } from "../../context/AuthContext";
import { Shield, Award, BookOpen, PenTool } from "lucide-react";

export default function DashboardWelcome() {
  const { user } = useAuth();

  const getRoleBadge = (role) => {
    switch (role) {
      case "superadmin":
        return {
          text: "Глобальний Суперадміністратор",
          color:
            "from-red-500/10 to-purple-600/10 text-purple-600 border-purple-500/20",
        };
      case "admin":
        return {
          text: "Адміністратор установи",
          color:
            "from-blue-500/10 to-purple-600/10 text-blue-600 border-blue-500/20",
        };
      case "reviewer":
        return {
          text: "Науковий Рецензент",
          color:
            "from-emerald-500/10 to-purple-600/10 text-emerald-600 border-emerald-500/20",
        };
      case "content-manager":
        return {
          text: "Редактор контенту",
          color:
            "from-amber-500/10 to-purple-600/10 text-amber-600 border-amber-500/20",
        };
      default:
        return {
          text: "Користувач системи",
          color:
            "from-gray-500/10 to-gray-600/10 text-gray-600 border-gray-500/20",
        };
    }
  };

  const badge = getRoleBadge(user?.role);

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-left">
      <div className="relative overflow-hidden bg-[var(--bg-card)] border border-[var(--border-color)] p-8 sm:p-10 rounded-3xl shadow-sm hover:border-purple-500/15 transition-all">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-purple-600/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-indigo-600/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-2xl">👋</span>
            <span
              className={`px-3 py-1 bg-gradient-to-r ${badge.color} border rounded-full text-[10px] font-black uppercase tracking-widest font-mono`}
            >
              {badge.text}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-[var(--text-dark)] uppercase tracking-tight leading-tight">
            Вітаємо в панелі керування <br />
            <span className="text-purple-600 dark:text-purple-400">
              Science Platform
            </span>
          </h1>

          <p className="text-sm text-[var(--text-gray)] max-w-2xl leading-relaxed font-medium">
            Це серце вашої операційної діяльності. Тут ви можете керувати
            процесами установи, координувати наукові програми, проводити
            експертне рецензування та популяризувати науку через публікації.
            Скористайтеся бічним меню для швидкого переходу до робочих розділів.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-[var(--bg-card)]/50 border border-[var(--border-color)]/60 p-5 rounded-2xl flex gap-4 items-start">
          <div className="p-2.5 bg-purple-600/10 text-purple-600 rounded-xl">
            <Shield size={18} />
          </div>
          <div>
            <h4 className="text-xs font-black uppercase text-[var(--text-dark)] tracking-wider mb-1">
              Безпека та Верифікація
            </h4>
            <p className="text-[11px] text-[var(--text-gray)] leading-relaxed font-medium">
              Ваша сесія захищена шифруванням. Усі дії логуються для
              забезпечення прозорості Open Science.
            </p>
          </div>
        </div>

        <div className="bg-[var(--bg-card)]/50 border border-[var(--border-color)]/60 p-5 rounded-2xl flex gap-4 items-start">
          <div className="p-2.5 bg-purple-600/10 text-purple-600 rounded-xl">
            <BookOpen size={18} />
          </div>
          <div>
            <h4 className="text-xs font-black uppercase text-[var(--text-dark)] tracking-wider mb-1">
              Double-Blind Рецензії
            </h4>
            <p className="text-[11px] text-[var(--text-gray)] leading-relaxed font-medium">
              Усі наукові праці рецензуються анонімно для дотримання високих
              стандартів академічної доброчесності.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
