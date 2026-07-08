import React from "react";
import { FileText, Bookmark, PlusCircle } from "lucide-react";

export default function ProfileTabs({ activeView, onViewChange }) {
  const tabs = [
    { id: "list", label: "Мої роботи", icon: FileText },
    { id: "bookmarks", label: "Закладки", icon: Bookmark },
    { id: "form", label: "Нова публікація", icon: PlusCircle },
  ];

  return (
    <div className="flex justify-start mb-6">
      <nav className="flex bg-[var(--bg-card)] border border-[var(--border-color)] p-1 rounded-2xl gap-1">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = activeView === t.id;
          return (
            <button
              key={t.id}
              onClick={() => onViewChange(t.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-tight transition-all flex items-center gap-2 ${
                isActive
                  ? "bg-purple-600 text-white shadow-xs"
                  : "text-[var(--text-gray)] hover:text-[var(--text-dark)]"
              }`}
            >
              <Icon size={13} />
              {t.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
