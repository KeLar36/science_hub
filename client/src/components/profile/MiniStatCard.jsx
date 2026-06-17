import React from "react";

export default function MiniStatCard({
  label,
  val,
  icon: Icon,
  color,
  bg,
  onClick,
}) {
  return (
    <div
      onClick={onClick}
      className={`bg-[var(--bg-card)] border border-[var(--border-color)] p-4 rounded-2xl flex items-center gap-4 hover:border-purple-500/20 transition-all ${onClick ? "cursor-pointer select-none" : ""}`}
    >
      <div
        className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center shrink-0`}
      >
        <Icon size={18} className={color} />
      </div>
      <div className="min-w-0">
        <div className="text-sm font-bold tracking-tight text-[var(--text-dark)] truncate">
          {val}
        </div>
        <div className="text-[10px] font-medium text-[var(--text-gray)] uppercase tracking-wider mt-0.5">
          {label}
        </div>
      </div>
    </div>
  );
}
