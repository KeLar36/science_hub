/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import { Users, FileText, Building2, ShieldCheck, Loader2 } from "lucide-react";
import { BentoCard } from "../ui/BentoCard";
import axiosInstance from "../../api/axios";
import toast from "react-hot-toast";

const STATUS_COLORS = ["#7c3aed", "#eab308", "#ef4444"];

export const DashboardOverview = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    users: 0,
    projects: 0,
    approvedProjects: 0,
    programs: 0,
    organizations: 0,
  });
  const [analyticsData, setAnalyticsData] = useState({
    pieData: [],
    chartData: [],
  });

  useEffect(() => {
    const controller = new AbortController();

    const fetchAnalytics = async () => {
      try {
        setLoading(true);

        // 1. Робимо запити до бекенду
        const [statsRes, projectsRes, orgsRes, programsRes] = await Promise.all(
          [
            axiosInstance.get("/users/count", { signal: controller.signal }),
            axiosInstance.get("/projects?limit=999", {
              signal: controller.signal,
            }),
            axiosInstance.get("/organizations/all?limit=999", {
              signal: controller.signal,
            }),
            axiosInstance.get("/programs?limit=999", {
              signal: controller.signal,
            }),
          ],
        );

        // 2. ВСЕЇДНИЙ ПАРСИНГ МАСИВІВ (Захист від будь-яких назв ключів на бекенді)
        console.log("📊 ДАНІ З БЕКЕНДУ ДЛЯ АНАЛІТИКИ:", {
          usersRaw: statsRes.data,
          projectsRaw: projectsRes.data,
          orgsRaw: orgsRes.data,
          programsRaw: programsRes.data,
        });

        // Визначаємо кількість користувачів (перевіряємо всі можливі варіанти від сервера)
        let userCount = 0;
        if (typeof statsRes.data === "number") {
          userCount = statsRes.data;
        } else if (statsRes.data) {
          userCount =
            statsRes.data.count ??
            statsRes.data.users ??
            statsRes.data.total ??
            statsRes.data.data ??
            0;
        }

        // Шукаємо масив для проектів
        const allProjects = Array.isArray(projectsRes.data)
          ? projectsRes.data
          : projectsRes.data?.projects || projectsRes.data?.items || [];

        // Шукаємо масив для організацій
        const allOrgs = Array.isArray(orgsRes.data)
          ? orgsRes.data
          : orgsRes.data?.organizations || orgsRes.data?.items || [];

        // Шукаємо масив для конкурсів/програм
        const allPrograms = Array.isArray(programsRes.data)
          ? programsRes.data
          : programsRes.data?.programs || programsRes.data?.items || [];

        // 3. РОЗРАХУНОК СТАТИСТИКИ ДЛЯ BENTO CARDS
        const approvedProjCount = allProjects.filter(
          (p) => p.status === "Прийнято" || p.status === "approved",
        ).length;

        const calculatedStats = {
          users: Number(userCount) || 0,
          projects: Number(allProjects.length) || 0,
          approvedProjects: Number(approvedProjCount) || 0,
          organizations: Number(allOrgs.length) || 0,
          programs: Number(allPrograms.length) || 0,
        };

        console.log("🔢 РОЗРАХОВАНА СТАТИСТИКА ДЛЯ КАРТОК:", calculatedStats);
        setStats(calculatedStats);

        // 4. ФОРМУВАННЯ ДАНИХ ДЛЯ КРУГОВОГО ГРАФІКА (Статуси робіт)
        const approved = approvedProjCount;
        const pending = allProjects.filter(
          (p) => p.status === "На розгляді" || p.status === "pending",
        ).length;
        const rejected = allProjects.filter(
          (p) => p.status === "Відхилено" || p.status === "rejected",
        ).length;

        // 5. ФОРМУВАННЯ ДАНИХ ДЛЯ СТОВПЧИКОВОГО ГРАФІКА (Наукові галузі)
        const domains = allProjects.reduce((acc, p) => {
          const domain = p.domain || "Без напрямку";
          acc[domain] = (acc[domain] || 0) + 1;
          return acc;
        }, {});

        setAnalyticsData({
          pieData: [
            { name: "Схвалено", value: approved },
            { name: "На розгляді", value: pending },
            { name: "Відхилено", value: rejected },
          ],
          chartData: Object.entries(domains).map(([name, count]) => ({
            name: name.length > 15 ? `${name.substring(0, 15)}...` : name,
            count,
          })),
        });
      } catch (err) {
        if (err.name !== "CanceledError") {
          console.error("💥 Помилка завантаження аналітики:", err);
          toast.error("Не вдалося завантажити деякі аналітичні дані");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();

    return () => controller.abort();
  }, []);

  if (loading) {
    return (
      <div className="py-32 flex flex-col justify-center items-center gap-3 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl">
        <Loader2 size={32} className="animate-spin text-purple-600" />
        <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-gray)]">
          Збір та аналіз даних платформи...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-6 rounded-3xl flex items-center justify-between shadow-xs">
          <div className="space-y-1 text-left">
            <p className="text-[11px] font-bold text-[var(--text-gray)] uppercase tracking-wider">
              Всі користувачі
            </p>
            <h3 className="text-2xl font-black text-[var(--text-dark)] leading-none">
              {stats.users}
            </h3>
            <p className="text-[10px] font-medium text-[var(--text-gray)]">
              Зареєстровано науковців
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-600/10 text-purple-600 flex items-center justify-center shrink-0 border border-purple-600/10">
            <Users size={20} />
          </div>
        </div>

        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-6 rounded-3xl flex items-center justify-between shadow-xs">
          <div className="space-y-1 text-left">
            <p className="text-[11px] font-bold text-[var(--text-gray)] uppercase tracking-wider">
              Установи
            </p>
            <h3 className="text-2xl font-black text-[var(--text-dark)] leading-none">
              {stats.organizations}
            </h3>
            <p className="text-[10px] font-medium text-[var(--text-gray)]">
              Акредитовані організації
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-600/10 text-blue-600 flex items-center justify-center shrink-0 border border-blue-600/10">
            <Building2 size={20} />
          </div>
        </div>

        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-6 rounded-3xl flex items-center justify-between shadow-xs">
          <div className="space-y-1 text-left">
            <p className="text-[11px] font-bold text-[var(--text-gray)] uppercase tracking-wider">
              Наукові роботи
            </p>
            <h3 className="text-2xl font-black text-[var(--text-dark)] leading-none">
              {stats.projects}
            </h3>
            <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">
              З них прийнято: {stats.approvedProjects}
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-600/10 text-amber-600 flex items-center justify-center shrink-0 border border-amber-600/10">
            <FileText size={20} />
          </div>
        </div>

        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-6 rounded-3xl flex items-center justify-between shadow-xs">
          <div className="space-y-1 text-left">
            <p className="text-[11px] font-bold text-[var(--text-gray)] uppercase tracking-wider">
              Програми та журнали
            </p>
            <h3 className="text-2xl font-black text-[var(--text-dark)] leading-none">
              {stats.programs}
            </h3>
            <p className="text-[10px] font-medium text-[var(--text-gray)]">
              Активні конкурси платформи
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-600/10 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-600/10">
            <ShieldCheck size={20} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-[var(--bg-card)] border border-[var(--border-color)] p-6 rounded-3xl flex flex-col min-h-[380px]">
          <h3 className="text-left text-xs font-black uppercase tracking-wider text-[var(--text-gray)] mb-6">
            📊 Розподіл наукового контенту в розрізі галузей
          </h3>
          <div className="flex-1 w-full min-h-[260px]">
            {analyticsData.chartData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-[var(--text-gray)] font-medium">
                Науковий контент за напрямками ще не розподілений
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsData.chartData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--border-color)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="name"
                    stroke="var(--text-gray)"
                    fontSize={10}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="var(--text-gray)"
                    fontSize={10}
                    tickLine={false}
                  />
                  <Tooltip cursor={{ fill: "var(--bg-main)", opacity: 0.4 }} />
                  <Bar
                    dataKey="count"
                    fill="#7c3aed"
                    radius={[6, 6, 0, 0]}
                    name="Кількість праць"
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Правий графік: Круговий статусів робіт */}
        <div className="lg:col-span-4 bg-[var(--bg-card)] border border-[var(--border-color)] p-6 rounded-3xl flex flex-col min-h-[380px]">
          <h3 className="text-left text-xs font-black uppercase tracking-wider text-[var(--text-gray)] mb-6">
            🎯 Статуси модерації наукових робіт
          </h3>
          <div className="flex-1 w-full min-h-[220px] flex items-center justify-center relative">
            {stats.projects === 0 ? (
              <div className="text-xs text-[var(--text-gray)] font-medium">
                Немає завантажених робіт
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analyticsData.pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {analyticsData.pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={STATUS_COLORS[index % STATUS_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconSize={10}
                    iconType="circle"
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
