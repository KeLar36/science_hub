import React from "react";

export const Input = ({ label, error, className = "", ...props }) => {
  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label className="text-sm font-medium text-[var(--text-main)]">
          {label}
        </label>
      )}
      <input
        className={`px-3 py-2 text-sm bg-[var(--bg-card)] text-[var(--text-dark)] border border-[var(--border-color)] rounded-lg shadow-xs outline-none focus:ring-2 focus:ring-[#6d28d9]/20 focus:border-[#6d28d9] transition-all ${
          error
            ? "border-red-500 focus:ring-red-500/20 focus:border-red-500"
            : "focus:border-[var(--text-dark)]"
        }`}
        {...props}
      />
      {error && (
        <span className="text-xs text-red-500 font-medium">{error}</span>
      )}
    </div>
  );
};
