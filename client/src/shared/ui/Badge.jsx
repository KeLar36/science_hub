export default function Badge({
  children,
  status = "default", // success, warning, danger, default
  className = "",
}) {
  const statusStyles = {
    default: "border-border-color text-text-secondary bg-bg-tertiary",
    success: "border-emerald-500/30 text-emerald-500 bg-emerald-500/5",
    warning: "border-amber-500/30 text-amber-500 bg-amber-500/5",
    danger: "border-red-500/30 text-red-500 bg-red-500/5",
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-sm border text-[10px] font-mono font-medium uppercase tracking-wider ${statusStyles[status]} ${className}`}
    >
      {children}
    </span>
  );
}
