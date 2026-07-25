import { Loader2 } from "lucide-react";

export default function Button({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  icon: Icon,
  className = "",
  ...props
}) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded border transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed tracking-wide font-sans shrink-0";

  const variants = {
    primary:
      "bg-brand border-brand text-white hover:bg-brand/90 hover:border-brand shadow-sm",
    secondary:
      "bg-bg-tertiary border-border-color text-text-primary hover:bg-bg-quaternary",
    outline:
      "border-border-color text-text-secondary hover:border-brand/50 hover:text-brand bg-transparent",
    danger:
      "bg-red-500/10 border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white",
  };

  const sizes = {
    sm: "px-3 py-1 text-xs gap-1.5",
    md: "px-4 py-2 text-sm gap-2",
    lg: "px-6 py-2.5 text-base gap-2.5",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin text-current shrink-0" />
      ) : Icon ? (
        <Icon className="w-4 h-4 text-current shrink-0" />
      ) : null}

      {children && <span className="truncate">{children}</span>}
    </button>
  );
}
