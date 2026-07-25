import { useEffect } from "react";
import { X } from "lucide-react";

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  className = "",
}) {
  useEffect(() => {
    const handleEsc = (e) => e.key === "Escape" && onClose();
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleEsc);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 pt-16 sm:pt-20 overflow-y-auto">
      <div
        className="fixed inset-0 bg-bg-primary/80 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      <div
        className={`
          relative w-full max-w-lg max-h-[85vh] sm:max-h-[80vh]
          flex flex-col my-auto
          rounded-lg border border-border-color bg-bg-secondary shadow-2xl z-10 
          animate-in fade-in zoom-in-95 duration-200 ${className}
        `}
      >
        <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 border-b border-border-color shrink-0 bg-bg-secondary rounded-t-lg">
          <h3 className="font-semibold text-sm text-text-primary tracking-tight">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-primary transition-colors p-1 rounded-sm hover:bg-bg-tertiary cursor-pointer"
            aria-label="Закрити"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 sm:p-5 overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
}
