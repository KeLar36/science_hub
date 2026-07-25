export default function Tabs({
  tabs = [],
  activeTab,
  onChange,
  className = "",
}) {
  return (
    <div
      className={`border-b border-border-color flex gap-6 justify-start items-center overflow-x-auto overflow-y-hidden no-scrollbar scroll-smooth py-0.5 ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange?.(tab.id)}
            className={`
              pb-2.5 text-xs font-mono font-semibold uppercase tracking-wider border-b-2 transition-all duration-150 whitespace-nowrap cursor-pointer shrink-0
              ${
                isActive
                  ? "border-brand text-brand"
                  : "border-transparent text-text-muted hover:text-text-primary"
              }
            `}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
