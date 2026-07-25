import { AlertCircle, CheckCircle, Info, XCircle, X } from "lucide-react";

export default function Alert({
  children,
  title,
  variant = "info",
  className = "",
  onClose,
}) {
  const icons = {
    info: <Info className="w-4 h-4 text-brand" />,
    success: <CheckCircle className="w-4 h-4 text-emerald-500" />,
    warning: <AlertCircle className="w-4 h-4 text-amber-500" />,
    danger: <XCircle className="w-4 h-4 text-red-500" />,
  };

  const variants = {
    info: "border-brand/30 bg-brand/5 text-text-primary",
    success: "border-emerald-500/30 bg-emerald-500/5 text-text-primary",
    warning: "border-amber-500/30 bg-amber-500/5 text-text-primary",
    danger: "border-red-500/30 bg-red-500/5 text-text-primary",
  };

  return (
    <div
      className={`flex items-start justify-between gap-3 p-4 border rounded shadow-sm ${variants[variant]} ${className}`}
    >
      <div className="flex gap-3">
        <div className="shrink-0 mt-0.5">{icons[variant]}</div>
        <div className="space-y-0.5">
          {title && (
            <h5 className="font-mono font-bold uppercase tracking-wider text-[10px] opacity-90">
              {title}
            </h5>
          )}
          <div className="text-xs text-text-secondary leading-relaxed">
            {children}
          </div>
        </div>
      </div>

      {/* Кнопка закриття */}
      {onClose && (
        <button
          onClick={onClose}
          type="button"
          className="text-text-muted hover:text-text-primary p-0.5 rounded cursor-pointer shrink-0 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
