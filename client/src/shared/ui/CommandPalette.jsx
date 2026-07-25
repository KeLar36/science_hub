import { useEffect, useRef } from "react";
import { Search, Terminal, FileText, Settings, X } from "lucide-react";

export default function CommandPalette({
  isOpen,
  onClose,
  onCommand,
  query,
  setQuery,
}) {
  const inputRef = useRef(null);

  const commands = [
    {
      id: "new-project",
      label: "Подати новий проект",
      category: "Дії",
      icon: FileText,
    },
    {
      id: "go-settings",
      label: "Налаштування профілю",
      category: "Навігація",
      icon: Settings,
    },
    {
      id: "view-logs",
      label: "Переглянути системний лог",
      category: "Адміністрування",
      icon: Terminal,
    },
  ];

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredCommands = commands.filter((cmd) =>
    cmd.label.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] p-4">
      <div
        className="absolute inset-0 bg-bg-primary/80 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg rounded-lg border border-border-color bg-bg-secondary shadow-2xl overflow-hidden font-sans animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border-color">
          <Search className="w-4 h-4 text-text-muted" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Швидкий пошук або команда..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent outline-none text-sm text-text-primary placeholder:text-text-muted"
          />
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-primary transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-2 max-h-[300px] overflow-y-auto">
          {filteredCommands.length > 0 ? (
            <div className="space-y-0.5">
              {filteredCommands.map((cmd) => {
                const Icon = cmd.icon;
                return (
                  <button
                    key={cmd.id}
                    onClick={() => {
                      onCommand?.(cmd.id);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded hover:bg-bg-tertiary transition-colors group text-left"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-3.5 h-3.5 text-text-muted group-hover:text-brand transition-colors" />
                      <span className="text-sm text-text-primary group-hover:text-brand transition-colors">
                        {cmd.label}
                      </span>
                    </div>
                    <span className="text-[9px] font-mono text-text-muted bg-bg-primary px-1.5 py-0.5 rounded border border-border-color">
                      {cmd.category}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-text-muted">
              Нічого не знайдено
            </div>
          )}
        </div>

        <div className="px-4 py-2 bg-bg-tertiary/50 border-t border-border-color flex justify-between text-[10px] font-mono text-text-muted">
          <span>Стрілки для вибору</span>
          <span>Esc для виходу</span>
        </div>
      </div>
    </div>
  );
}
