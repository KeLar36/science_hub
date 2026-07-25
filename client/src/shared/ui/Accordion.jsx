import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function Accordion({ title, children, className = "" }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`border border-border-color rounded-lg bg-bg-secondary overflow-hidden transition-all duration-200 ${className}`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center px-5 py-4 text-sm font-medium text-text-primary hover:bg-bg-tertiary/50 transition-colors"
      >
        <span>{title}</span>
        <ChevronDown
          className={`w-4 h-4 text-text-muted transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="px-5 pb-4 pt-1 text-sm text-text-secondary border-t border-border-color bg-bg-tertiary/30 leading-relaxed animate-reveal">
          {children}
        </div>
      )}
    </div>
  );
}
