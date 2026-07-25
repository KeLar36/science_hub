import React from "react";

export default function Input({
  label,
  error,
  icon: Icon,
  className = "",
  id,
  disabled,
  ...props
}) {
  return (
    <div className={`flex flex-col gap-1.5 w-full mt-1 ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className={`text-[10px] font-bold tracking-widest uppercase transition-colors ${
            disabled ? "text-text-muted/60" : "text-text-muted"
          }`}
        >
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        {Icon && (
          <div
            className={`absolute left-3 pointer-events-none transition-colors ${
              disabled ? "text-text-muted/50" : "text-text-muted"
            }`}
          >
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          id={id}
          disabled={disabled}
          className={`
            w-full px-3.5 py-2 text-sm rounded-lg border outline-none transition-all duration-200
            bg-bg-secondary border-border-color text-text-primary 
            placeholder:text-text-muted 
            focus:border-brand focus:ring-2 focus:ring-brand/20 
            
            disabled:bg-bg-tertiary/70 
            disabled:text-text-muted 
            disabled:border-border-color/50 
            disabled:cursor-not-allowed 
            disabled:select-none
            disabled:focus:border-border-color/50 
            disabled:focus:ring-0

            ${Icon ? "pl-10" : ""}
            ${
              error
                ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/10"
                : ""
            }
          `}
          {...props}
        />
      </div>

      {error && (
        <span className="text-[10px] text-red-500 font-medium animate-in slide-in-from-top-1">
          {error}
        </span>
      )}
    </div>
  );
}
