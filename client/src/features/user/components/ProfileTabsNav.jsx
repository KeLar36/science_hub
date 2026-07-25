import React from "react";
import { FileText, Bookmark, Settings } from "lucide-react";

export default function ProfileTabsNav({ activeTab, setActiveTab }) {
  const tabs = [
    { id: "projects", label: "Мої наукові праці", icon: FileText },
    { id: "saved", label: "Збережені матеріали", icon: Bookmark },
    { id: "settings", label: "Налаштування акаунту", icon: Settings },
  ];

  return (
    <div className="flex items-center gap-2 border-b border-border-color pb-2 overflow-x-auto">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all whitespace-nowrap cursor-pointer uppercase tracking-wider
              ${
                isActive
                  ? "bg-brand text-white shadow-sm"
                  : "text-text-muted hover:text-text-primary hover:bg-bg-tertiary"
              }
            `}
          >
            <Icon size={14} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
