import { useState, useEffect, useRef } from "react";
import { MoreHorizontal } from "lucide-react";

export default function Dropdown({
  trigger: Trigger,
  items = [],
  className = "",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target))
        setIsOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {Trigger ? (
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="cursor-pointer inline-flex"
        >
          <Trigger />
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1.5 border border-border-color bg-bg-secondary hover:bg-bg-tertiary rounded transition-colors flex items-center justify-center text-text-muted hover:text-text-primary"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      )}

      {isOpen && (
        <div
          className={`absolute right-0 mt-2 w-48 rounded-lg border bg-bg-secondary border-border-color shadow-lg z-50 py-1 animate-in fade-in zoom-in-95 duration-200 ${className}`}
        >
          {items.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                item.onClick?.();
                setIsOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-xs font-medium flex items-center gap-2 transition-colors border-none ${
                item.variant === "danger"
                  ? "text-red-500 hover:bg-red-500/10"
                  : "text-text-secondary hover:bg-bg-tertiary hover:text-text-primary"
              }`}
            >
              {item.icon && <item.icon className="w-3.5 h-3.5" />}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
