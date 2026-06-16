import React from "react";

export default function ProfileTabs({ activeView, onViewChange }) {
  const tabs = [
    { id: "list", label: "Мої роботи" },
    { id: "bookmarks", label: "Закладки" },
    { id: "form", label: "Нова публікація" },
  ];

  return (
    <div className="flex justify-center mb-10">
      <nav className="flex bg-[var(--bg-card)] p-1.5 rounded-2xl border border-[var(--border-color)] shadow-sm backdrop-blur-md">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => onViewChange(t.id)}
            className={`px-6 md:px-8 py-3 rounded-xl text-xs font-bold transition-all duration-200 ${
              activeView === t.id
                ? "bg-purple-600 text-white shadow-md shadow-purple-600/15"
                : "text-[var(--text-gray)] hover:text-purple-600"
            }`}
          >
            {t.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
