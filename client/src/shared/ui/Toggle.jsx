export default function Toggle({ checked, onChange, label, description }) {
  return (
    <div className="flex items-center justify-between gap-6 py-2">
      {(label || description) && (
        <div className="flex flex-col">
          {label && (
            <span className="text-xs font-semibold text-text-primary tracking-tight">
              {label}
            </span>
          )}
          {description && (
            <span className="text-[10px] text-text-muted mt-0.5 leading-tight">
              {description}
            </span>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={() => onChange?.(!checked)}
        className={`
          relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border border-transparent 
          transition-colors duration-300 focus:outline-none
          ${checked ? "bg-brand" : "bg-bg-tertiary"}
        `}
      >
        <span
          className={`
            pointer-events-none inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm ring-0 
            transition-transform duration-300 ease-out mt-0.5 ml-0.5
            ${checked ? "translate-x-4" : "translate-x-0"}
          `}
        />
      </button>
    </div>
  );
}
