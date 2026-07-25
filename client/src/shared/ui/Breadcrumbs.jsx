import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

export default function Breadcrumbs({ items = [], className = "" }) {
  return (
    <nav
      className={`flex items-center space-x-1.5 text-[10px] font-mono uppercase tracking-widest ${className}`}
    >
      <Link
        to="/"
        className="text-text-muted hover:text-brand transition-colors flex items-center p-1 rounded-sm hover:bg-bg-tertiary"
        aria-label="Головна"
      >
        <Home className="w-3 h-3" />
      </Link>

      {items.map((item, index) => (
        <React.Fragment key={`${item.label}-${index}`}>
          <ChevronRight className="w-3 h-3 text-text-muted/30" />
          {item.active ? (
            <span className="font-bold text-text-primary px-1">
              {item.label}
            </span>
          ) : (
            <Link
              to={item.href || "#"}
              className="text-text-muted hover:text-brand transition-colors px-1 rounded-sm hover:bg-bg-tertiary"
            >
              {item.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
