export default function TextArea({
  label,
  error,
  className = "",
  id,
  rows = 4,
  ...props
}) {
  return (
    <div className={`flex flex-col gap-1.5 w-full mt-1 ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="text-[10px] font-bold tracking-widest text-text-muted uppercase"
        >
          {label}
        </label>
      )}
      <textarea
        id={id}
        rows={rows}
        className={`
          w-full px-3.5 py-2.5 text-sm rounded-lg border outline-none transition-all duration-200 resize-y
          bg-bg-secondary border-border-color text-text-primary 
          placeholder:text-text-muted leading-relaxed
          focus:border-brand focus:ring-2 focus:ring-brand/20
          ${
            error
              ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/10"
              : ""
          }
        `}
        {...props}
      />
      {error && (
        <span className="text-[10px] text-red-500 font-medium animate-in slide-in-from-top-1">
          {error}
        </span>
      )}
    </div>
  );
}
