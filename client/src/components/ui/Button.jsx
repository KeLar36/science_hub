import React from "react";
import { Loader2 } from "lucide-react";

const VARIANTS = {
  primary:
    "bg-[#6d28d9] hover:bg-[#5b21b6] text-white shadow-xs focus-visible:ring-[#6d28d9]",
  secondary:
    "bg-[var(--border-color)] hover:bg-[var(--text-gray)] hover:text-[var(--bg-main)] text-[var(--text-main)] focus-visible:ring-[var(--text-gray)]",
  danger:
    "bg-red-600 hover:bg-red-700 text-white shadow-xs focus-visible:ring-red-500",
  success:
    "bg-green-600 hover:bg-green-700 text-white shadow-xs focus-visible:ring-green-500",
  outline:
    "border border-[var(--border-color)] bg-[var(--bg-card)] text-[var(--text-main)] hover:border-[var(--text-dark)] focus-visible:ring-[#6d28d9]",
};

const SIZES = {
  sm: "px-3 py-1.5 text-xs rounded-md gap-1.5",
  md: "px-4 py-2 text-sm rounded-lg gap-2",
  lg: "px-5 py-2.5 text-base rounded-xl gap-2.5",
};

export const Button = ({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  icon: Icon,
  className = "",
  disabled,
  ...props
}) => {
  return (
    <button
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center font-medium transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="animate-spin w-4 h-4" />
      ) : Icon ? (
        <Icon className="w-4 h-4 shrink-0" />
      ) : null}
      {children}
    </button>
  );
};
