import { Bell } from "lucide-react";

export default function NotificationCard({ title, message, time, isUnread }) {
  return (
    <div
      className={`
        p-4 border rounded-lg flex gap-3 transition-all duration-200
        ${
          isUnread
            ? "border-brand/30 bg-brand/5 shadow-sm"
            : "border-border-color bg-bg-secondary"
        }
      `}
    >
      <div
        className={`p-1.5 rounded-md h-fit transition-colors ${
          isUnread ? "bg-brand text-white" : "bg-bg-tertiary text-text-muted"
        }`}
      >
        <Bell className="w-3.5 h-3.5" />
      </div>

      <div className="space-y-0.5 flex-1">
        <div className="flex justify-between items-center gap-4">
          <span
            className={`text-xs font-semibold ${isUnread ? "text-text-primary" : "text-text-secondary"}`}
          >
            {title}
          </span>
          <span className="text-[10px] font-mono text-text-muted shrink-0">
            {time}
          </span>
        </div>
        <p className="text-xs text-text-secondary leading-relaxed">{message}</p>
      </div>
    </div>
  );
}
