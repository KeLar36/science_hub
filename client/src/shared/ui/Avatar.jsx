export default function Avatar({
  src,
  name = "",
  size = "md",
  className = "",
}) {
  const sizes = {
    sm: "w-7 h-7 text-[10px]",
    md: "w-9 h-9 text-xs",
    lg: "w-12 h-12 text-sm",
  };

  const getInitials = (fullName) => {
    if (!fullName) return "?";
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 1).toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  return (
    <div
      className={`
        relative shrink-0 flex items-center justify-center rounded-full border border-border-color overflow-hidden select-none
        bg-bg-tertiary text-text-secondary font-mono font-bold uppercase
        transition-colors duration-200 ${sizes[size]} ${className}
      `}
    >
      {src ? (
        <img src={src} alt={name} className="w-full h-full object-cover" />
      ) : (
        <span>{getInitials(name)}</span>
      )}
    </div>
  );
}
