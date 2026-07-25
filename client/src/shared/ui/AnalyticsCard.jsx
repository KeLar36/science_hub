import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function AnalyticsCard({
  title,
  value,
  trend,
  trendType = "up",
  description,
  className = "",
}) {
  return (
    <div
      className={`rounded-lg border border-border-color bg-bg-secondary p-5 hover:border-brand/30 transition-colors ${className}`}
    >
      <div className="flex justify-between items-start mb-3">
        <span className="text-[10px] font-mono text-text-muted uppercase tracking-widest">
          {title}
        </span>
        {trend && (
          <span
            className={`inline-flex items-center gap-0.5 text-[11px] font-bold font-mono ${
              trendType === "up" ? "text-emerald-500" : "text-red-500"
            }`}
          >
            {trend}
            {trendType === "up" ? (
              <ArrowUpRight className="w-3.5 h-3.5" />
            ) : (
              <ArrowDownRight className="w-3.5 h-3.5" />
            )}
          </span>
        )}
      </div>

      <div className="text-3xl font-display font-semibold text-text-primary tracking-tighter mb-2">
        {value}
      </div>

      {description && (
        <p className="text-[11px] text-text-muted leading-snug">
          {description}
        </p>
      )}
    </div>
  );
}
