/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import axiosInstance from "../../api/axios";
import { BookOpen, Award, Globe, Loader2 } from "lucide-react";

const StatsSection = () => {
  const [stats, setStats] = useState({
    programsCount: 0,
    orgsCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        const [programsRes, orgsRes] = await Promise.all([
          axiosInstance.get("/programs?page=1&limit=1"),
          axiosInstance.get("/organizations/public/list"),
        ]);

        // Дістаємо total або count, залежно від структури респонсу твого беку
        const totalPrograms =
          programsRes.data?.totalItems ||
          programsRes.data?.programs?.length ||
          0;
        const totalOrgs = Array.isArray(orgsRes.data) ? orgsRes.data.length : 0;

        setStats({
          programsCount: totalPrograms,
          orgsCount: totalOrgs,
        });
      } catch (err) {
        console.error("💥 Не вдалося завантажити статистику платформи:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <section className="border-y border-[var(--border-color)] bg-[var(--bg-card)]/50 backdrop-blur-xs py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center relative">
        <div className="space-y-1">
          <div className="flex justify-center text-purple-600 dark:text-purple-400 mb-2">
            <Award size={24} />
          </div>
          <div className="text-3xl font-black tracking-tight text-[var(--text-dark)] font-mono min-h-[36px] flex items-center justify-center">
            {loading ? (
              <Loader2 size={18} className="animate-spin text-purple-600/50" />
            ) : (
              `${stats.programsCount}+`
            )}
          </div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-gray)]">
            Активних можливостей
          </div>
        </div>

        <div className="space-y-1 border-y sm:border-y-0 sm:border-x border-[var(--border-color)] py-6 sm:py-0">
          <div className="flex justify-center text-purple-600 dark:text-purple-400 mb-2">
            <BookOpen size={24} />
          </div>
          <div className="text-3xl font-black tracking-tight text-[var(--text-dark)] font-mono min-h-[36px] flex items-center justify-center">
            {loading ? (
              <Loader2 size={18} className="animate-spin text-purple-600/50" />
            ) : (
              `${stats.orgsCount || "5+"}`
            )}
          </div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-gray)]">
            Зареєстрованих ЗВО / НДІ
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex justify-center text-purple-600 dark:text-purple-400 mb-2">
            <Globe size={24} />
          </div>
          <div className="text-3xl font-black tracking-tight text-[var(--text-dark)] font-mono min-h-[36px] flex items-center justify-center">
            100%
          </div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-gray)]">
            Відкритий Доступ (Open Access)
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
