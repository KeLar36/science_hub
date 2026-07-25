import React, { useState, useMemo, useRef, useEffect } from "react";
import { ChevronDown, Check, Search } from "lucide-react";

export default function Combobox({
  label,
  options = [],
  value,
  onChange,
  placeholder = "Оберіть варіант...",
  searchPlaceholder = "Пошук...",
  required = false,
  className = "",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef(null);

  // Закриття дропдауну при кліку поза ним
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const filteredOptions = useMemo(() => {
    if (!search.trim()) return options;
    return options.filter((option) =>
      option.toLowerCase().includes(search.toLowerCase().trim()),
    );
  }, [options, search]);

  return (
    <div
      ref={containerRef}
      className={`space-y-1.5 flex flex-col items-stretch relative ${className}`}
    >
      {label && (
        <label className="text-[10px] uppercase tracking-wider text-text-muted font-mono block">
          {label} {required && <span className="text-brand">*</span>}
        </label>
      )}

      {/* Головний тригер-поле */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-bg-tertiary border border-border-color rounded px-3.5 py-2.5 text-sm transition-all duration-150 hover:border-brand/40 text-left cursor-pointer group"
      >
        <span className={value ? "text-text-primary" : "text-text-muted"}>
          {value || placeholder}
        </span>
        <ChevronDown
          size={16}
          className={`text-text-muted group-hover:text-brand transition-transform duration-150 ${isOpen ? "rotate-180" : ""}`}
        />
      </div>

      {isOpen && (
        <div className="absolute top-[100%] left-0 right-0 mt-1 bg-bg-secondary border border-border-color rounded shadow-popup z-50 overflow-hidden animate-reveal">
          <div className="flex items-center gap-2 px-3 py-2 border-b border-border-color bg-bg-tertiary/50">
            <Search size={14} className="text-text-muted shrink-0" />
            <input
              type="text"
              className="bg-transparent border-none outline-none w-full p-0 text-text-primary placeholder:text-text-muted text-xs font-sans"
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
          </div>

          <ul className="max-h-48 overflow-y-auto py-1 scrollbar-none">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => {
                const isSelected = option === value;
                return (
                  <li
                    key={option}
                    onClick={() => {
                      onChange(option);
                      setIsOpen(false);
                      setSearch("");
                    }}
                    className={`flex items-center justify-between px-3 py-2 text-xs font-sans transition-colors cursor-pointer hover:bg-bg-tertiary ${
                      isSelected
                        ? "text-brand font-medium bg-brand-light/30"
                        : "text-text-secondary"
                    }`}
                  >
                    <span>{option}</span>
                    {isSelected && (
                      <Check size={14} className="text-brand shrink-0" />
                    )}
                  </li>
                );
              })
            ) : (
              <li className="px-3 py-3 text-center text-[11px] font-mono text-text-muted uppercase tracking-wider">
                Нічого не знайдено
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
