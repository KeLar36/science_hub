import React, { useMemo } from "react";
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
import {
  Users,
  FileText,
  CheckCircle,
  Building2,
  ShieldCheck,
  Award,
} from "lucide-react";

const STATUS_COLORS = ["#7c3aed", "#eab308", "#ef4444"]; // Схвалено, На розгляді, Відхилено
const ORG_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6"]; // Кольори для топ-установ

export default function DashboardTab({
  stats,
  chartData = [],
  pieData = [],
  organizations = [],
}) {
  // 1. Обчислюємо топ-5 найактивніших організацій за кількістю завантаженого контенту/робіт
  // (Цей крок розширює аналітику і показує суперадміну лідерів серед установ)
  const topOrganizationsData = useMemo(() => {
    if (!Array.isArray(organizations)) return [];
    return organizations
      .map((org) => ({
        name:
          org.name?.length > 20 ? `${org.name.substring(0, 20)}...` : org.name,
        "Кількість робіт": org.joinRequests?.length || 0, // Або інше поле метрики, якщо є в моделі
      }))
      .sort((a, b) => b["Кількість робіт"] - a["Кількість робіт"])
      .slice(0, 5);
  }, [organizations]);

  const globalCards = [
    {
      label: "Всього користувачів",
      value: stats.users,
      icon: Users,
      color: "text-purple-600 bg-purple-500/5 border-purple-500/10",
    },
    {
      label: "Верифіковано установ",
      value: stats.organizations || organizations.length || 0,
      icon: Building2,
      color: "text-blue-600 bg-blue-500/5 border-blue-500/10",
    },
    {
      label: "Наукових робіт подано",
      value: stats.projects,
      icon: FileText,
      color: "text-amber-600 bg-amber-500/5 border-amber-500/10",
    },
    {
      label: "Глобальних програм",
      value: stats.programs || 0,
      icon: ShieldCheck,
      color: "text-emerald-600 bg-emerald-500/5 border-emerald-500/10",
    },
  ];

  return (
    <div className="space-y-8 text-left animate-in fade-in duration-200">
      {/* РОЗДІЛ 1: СУМАРНІ МЕТРИКИ ПЛАТФОРМИ */}
      <div>
        <h3 className="text-[11px] font-black uppercase tracking-widest text-[var(--text-gray)] mb-4 pl-1">
          🌐 Загальний стан екосистеми платформи
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {globalCards.map((card, index) => (
            <div
              key={index}
              className="p-6 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl flex items-center justify-between shadow-xs hover:border-purple-500/20 transition-all"
            >
              <div>
                <div className="text-2xl font-black text-[var(--text-dark)]">
                  {card.value}
                </div>
                <div className="text-xs font-bold text-[var(--text-gray)] uppercase tracking-wider mt-1">
                  {card.label}
                </div>
              </div>
              <div className={`p-3.5 rounded-2xl border ${card.color}`}>
                <card.icon size={20} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* РОЗДІЛ 2: АНАЛІТИКА АКТИВНОСТІ ОРГАНІЗАЦІЙ (НОВИЙ ВЕЛИКИЙ БЛОК) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[var(--bg-card)] border border-[var(--border-color)] p-6 rounded-3xl min-h-[340px] flex flex-col">
          <div className="mb-6">
            <span className="text-[10px] font-black uppercase tracking-wider text-purple-600 bg-purple-500/5 px-2.5 py-1 rounded-md border border-purple-500/10">
              Рейтинг
            </span>
            <h3 className="text-sm font-black text-[var(--text-dark)] mt-2">
              🏢 Топ-5 найактивніших університетів та фондів мережі
            </h3>
          </div>
          <div className="flex-1 w-full min-h-[220px]">
            {topOrganizationsData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-[var(--text-gray)] font-medium">
                Дані про активність установ оновлюються...
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topOrganizationsData} layout="vertical">
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--border-color)"
                    horizontal={false}
                  />
                  <XAxis
                    type="number"
                    stroke="var(--text-gray)"
                    fontSize={10}
                    tickLine={false}
                  />
                  <YAxis
                    dataKey="name"
                    type="category"
                    stroke="var(--text-dark)"
                    fontSize={11}
                    fontWeight="bold"
                    tickLine={false}
                    width={130}
                  />
                  <Tooltip cursor={{ fill: "var(--bg-main)", opacity: 0.3 }} />
                  <Bar
                    dataKey="Кількість робіт"
                    fill="#3b82f6"
                    radius={[0, 6, 6, 0]}
                    barSize={16}
                  >
                    {topOrganizationsData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={ORG_COLORS[index % ORG_COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* СТАТУСИ ПУБЛІКАЦІЙ */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-6 rounded-3xl min-h-[340px] flex flex-col">
          <h3 className="text-xs font-black uppercase tracking-wider text-[var(--text-gray)] mb-4">
            📈 Глобальний моніторинг статусів рецензування
          </h3>
          <div className="flex-1 min-h-[200px] flex items-center justify-center relative">
            {pieData.every((v) => v.value === 0) ? (
              <div className="text-xs text-[var(--text-gray)] font-medium">
                Немає поданих наукових праць для аналізу статусів
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
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
                    iconType="circle"
                    wrapperStyle={{ fontSize: 11, fontWeight: "bold" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* РОЗДІЛ 3: РОЗПОДІЛ НАУКОВОГО КОНТЕНТУ */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-6 rounded-3xl min-h-[360px] flex flex-col">
        <h3 className="text-xs font-black uppercase tracking-wider text-[var(--text-gray)] mb-6">
          📊 Об'єм контенту платформи в розрізі наукових галузей
        </h3>
        <div className="flex-1 w-full min-h-[260px]">
          {chartData.length === 0 ? (
            <div className="h-full flex items-center justify-center text-xs text-[var(--text-gray)] font-medium">
              Науковий контент за напрямками ще не розподілений
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
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
    </div>
  );
}
