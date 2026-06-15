import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Users,
  FileText,
  CheckCircle,
  AlertTriangle,
  PieChart as PieIcon,
  BarChart3,
  Award,
  TrendingUp,
} from "lucide-react";
import { COLORS } from "../../constants/adminConstants";

const DashboardTab = ({ stats, chartData, pieData, topAuthors = [] }) => {
  const successRate = stats.projects
    ? Math.round((stats.approvedProjects / stats.projects) * 100)
    : 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          label="Всього користувачів"
          val={stats.users}
          icon={Users}
          color="text-blue-500"
          bg="bg-blue-500/5"
        />
        <StatCard
          label="Подано робіт"
          val={stats.projects}
          icon={FileText}
          color="text-purple-500"
          bg="bg-purple-500/5"
        />
        <StatCard
          label="Схвалено праць"
          val={stats.approvedProjects}
          icon={CheckCircle}
          color="text-emerald-500"
          bg="bg-emerald-500/5"
        />
        <StatCard
          label="Активні програми"
          val={stats.programs}
          icon={AlertTriangle}
          color="text-amber-500"
          bg="bg-amber-500/5"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-6 rounded-3xl shadow-xs flex items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[var(--text-gray)] uppercase tracking-wider">
              <TrendingUp size={14} className="text-emerald-500" />
              Коефіцієнт схвалення
            </div>
            <p className="text-xs text-[var(--text-gray)] font-medium max-w-[180px]">
              Відсоток наукових робіт, які успішно пройшли модерацію платформи.
            </p>
          </div>
          <div className="relative flex items-center justify-center shrink-0 w-24 h-24">
            <svg
              className="w-full h-full transform -rotate-90"
              viewBox="0 0 36 36"
            >
              <path
                className="text-[var(--bg-main)]"
                strokeWidth="3"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-emerald-500 transition-all duration-500 stroke-linecap-round"
                strokeDasharray={`${successRate}, 100`}
                strokeWidth="3"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute text-xl font-black tracking-tighter text-[var(--text-dark)]">
              {successRate}%
            </div>
          </div>
        </div>

        <div className="md:col-span-2 bg-[var(--bg-card)] border border-[var(--border-color)] p-6 rounded-3xl shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <Award size={16} className="text-purple-500" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-gray)]">
              Найактивніші дослідники
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {topAuthors.length === 0 ? (
              <div className="col-span-full text-center py-2 text-xs text-[var(--text-gray)] font-medium">
                Немає даних про авторів
              </div>
            ) : (
              topAuthors.map((author, idx) => (
                <div
                  key={author.name}
                  className="bg-[var(--bg-main)] border border-[var(--border-color)]/60 p-3.5 rounded-2xl flex flex-col justify-between gap-2 min-w-0"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-black text-purple-500/50">
                      #{idx + 1}
                    </span>
                    <div
                      className="text-xs font-bold text-[var(--text-dark)] truncate w-full"
                      title={author.name}
                    >
                      {author.name}
                    </div>
                  </div>
                  <div className="text-[10px] font-bold text-[var(--text-gray)] uppercase tracking-wider">
                    Праць:{" "}
                    <strong className="text-purple-600 font-black">
                      {author.count}
                    </strong>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[var(--bg-card)] border border-[var(--border-color)] p-6 rounded-3xl shadow-xs">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 size={18} className="text-purple-500" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-gray)]">
              Публікації за напрямками
            </h3>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--border-color)"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  stroke="var(--text-gray)"
                  fontSize={11}
                  tickLine={false}
                />
                <YAxis
                  stroke="var(--text-gray)"
                  fontSize={11}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--bg-card)",
                    borderColor: "var(--border-color)",
                    borderRadius: "12px",
                    color: "var(--text-dark)",
                  }}
                  itemStyle={{ color: "var(--purple-600)" }}
                />
                <Bar
                  dataKey="count"
                  fill="#8b5cf6"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-6 rounded-3xl shadow-xs flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <PieIcon size={18} className="text-purple-500" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--text-gray)]">
              Статуси робіт
            </h3>
          </div>
          <div className="h-64 flex-grow relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--bg-card)",
                    borderColor: "var(--border-color)",
                    borderRadius: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-4 border-t border-[var(--border-color)]">
            {pieData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2 text-xs">
                <div
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-[var(--text-gray)] truncate">
                  {entry.name}:{" "}
                  <strong className="text-[var(--text-dark)]">
                    {entry.value}
                  </strong>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, val, icon: Icon, color, bg }) => (
  <div className="bg-[var(--bg-card)] border border-[var(--border-color)] p-6 rounded-3xl flex items-center gap-5 shadow-xs">
    <div
      className={`w-12 h-12 rounded-2xl ${bg} flex items-center justify-center shrink-0`}
    >
      <Icon size={22} className={color} />
    </div>
    <div className="min-w-0">
      <div className="text-2xl font-black tracking-tight text-[var(--text-dark)]">
        {val}
      </div>
      <div className="text-[10px] font-bold text-[var(--text-gray)] uppercase tracking-wider mt-0.5">
        {label}
      </div>
    </div>
  </div>
);

export default DashboardTab;
