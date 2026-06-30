import React from "react";
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
} from "recharts";
import { Users, FileText, CheckCircle, ShieldCheck } from "lucide-react";

const COLORS = ["#7c3aed", "#eab308", "#ef4444"];

export default function OrgDashboardTab({
  stats,
  chartData = [],
  pieData = [],
}) {
  const cards = [
    {
      label: "Співробітники",
      value: stats.users,
      icon: Users,
      color: "text-purple-600 bg-purple-500/5 border-purple-500/10",
    },
    {
      label: "Подані роботи",
      value: stats.projects,
      icon: FileText,
      color: "text-blue-600 bg-blue-500/5 border-blue-500/10",
    },
    {
      label: "Схвалені праці",
      value: stats.approvedProjects,
      icon: CheckCircle,
      color: "text-emerald-600 bg-emerald-500/5 border-emerald-500/10",
    },
    {
      label: "Наші програми",
      value: stats.programs,
      icon: ShieldCheck,
      color: "text-amber-600 bg-amber-500/5 border-amber-500/10",
    },
  ];

  return (
    <div className="space-y-8 text-left">
      {/* МЕТРИКИ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c, i) => (
          <div
            key={i}
            className={`p-6 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl flex items-center justify-between shadow-xs`}
          >
            <div>
              <div className="text-2xl font-black text-[var(--text-dark)]">
                {c.value}
              </div>
              <div className="text-xs font-bold text-[var(--text-gray)] uppercase tracking-wider mt-1">
                {c.label}
              </div>
            </div>
            <div className={`p-3.5 rounded-2xl border ${c.color}`}>
              <c.icon size={20} />
            </div>
          </div>
        ))}
      </div>

      {/* ГРАФІКИ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Стовпчикова діаграма за напрямками */}
        <div className="lg:col-span-2 bg-[var(--bg-card)] border border-[var(--border-color)] p-6 rounded-3xl min-h-[340px] flex flex-col">
          <h3 className="text-xs font-black uppercase tracking-wider text-[var(--text-gray)] mb-6">
            📊 Розподіл робіт за науковими галузями
          </h3>
          <div className="flex-1 w-full min-h-[240px]">
            {chartData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-[var(--text-gray)] font-medium">
                Немає даних для побудови графіка
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
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
                  <Tooltip cursor={{ fill: "var(--bg-main)", opacity: 0.5 }} />
                  <Bar
                    dataKey="count"
                    fill="#7c3aed"
                    radius={[6, 6, 0, 0]}
                    name="Кількість робіт"
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Кругова діаграма статусів робіт */}
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-6 rounded-3xl min-h-[340px] flex flex-col">
          <h3 className="text-xs font-black uppercase tracking-wider text-[var(--text-gray)] mb-4">
            📈 Статуси внутрішніх публікацій
          </h3>
          <div className="flex-1 min-h-[200px] flex items-center justify-center relative">
            {pieData.every((v) => v.value === 0) ? (
              <div className="text-xs text-[var(--text-gray)] font-medium">
                Немає поданих робіт
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
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
    </div>
  );
}
