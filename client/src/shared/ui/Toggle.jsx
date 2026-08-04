export default function Toggle({
  checked,
  onChange,
  label,
  description,
  iconOff: IconOff,
  iconOn: IconOn,
  size = "sm",
  className = "",
}) {
  const sizes = {
    sm: {
      button: "h-5 w-9",
      circle: "h-3.5 w-3.5",
      translate: "translate-x-4",
      icon: "w-2.5 h-2.5",
    },
    md: {
      button: "h-6 w-11",
      circle: "h-5 w-5",
      translate: "translate-x-5",
      icon: "w-3.5 h-3.5",
    },
    lg: {
      button: "h-7 w-13",
      circle: "h-6 w-6",
      translate: "translate-x-6",
      icon: "w-4 h-4",
    },
  };

  const currentSize = sizes[size] || sizes.sm;

  return (
    <div
      className={`flex items-center justify-between gap-6 py-2 ${className}`}
    >
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
          relative inline-flex ${currentSize.button} shrink-0 cursor-pointer rounded-full border border-transparent 
          transition-colors duration-300 focus:outline-none p-0.5
          ${checked ? "bg-brand" : "bg-bg-tertiary"}
        `}
      >
        <span
          className={`
            pointer-events-none inline-flex items-center justify-center ${currentSize.circle} transform rounded-full bg-white shadow-md ring-0 
            transition-transform duration-300 ease-out text-text-primary
            ${checked ? currentSize.translate : "translate-x-0"}
          `}
        >
          {checked
            ? IconOn && (
                <IconOn className={`${currentSize.icon} text-amber-500`} />
              )
            : IconOff && (
                <IconOff className={`${currentSize.icon} text-text-muted`} />
              )}
        </span>
      </button>
    </div>
  );
}
