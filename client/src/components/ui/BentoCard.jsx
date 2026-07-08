import React from "react";

export const BentoCard = ({
  title,
  subtitle,
  children,
  footer,
  className = "",
  ...props
}) => {
  return (
    <div
      className={`bento-card animate-reveal flex flex-col rounded-2xl overflow-hidden p-5 gap-4 ${className}`}
      {...props}
    >
      {title && (
        <div className="flex flex-col gap-0.5">
          <h3 className="section-title text-lg tracking-tight">{title}</h3>
          {subtitle && <p className="label-mono">{subtitle}</p>}
        </div>
      )}
      <div className="text-sm text-[var(--text-main)] flex-1">{children}</div>
      {footer && (
        <div className="pt-3 border-t border-[var(--border-color)] flex items-center justify-between">
          {footer}
        </div>
      )}
    </div>
  );
};
