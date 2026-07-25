export default function Select({
  label,
  options = [],
  className = "",
  id,
  ...props
}) {
  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="text-[10px] font-bold tracking-widest text-text-muted uppercase"
        >
          {label}
        </label>
      )}
      <select
        id={id}
        className={`
          w-full px-3.5 py-2 text-sm rounded-lg border outline-none appearance-none cursor-pointer transition-all duration-200
          bg-bg-secondary border-border-color text-text-primary 
          focus:border-brand focus:ring-2 focus:ring-brand/20
          bg-[url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")] 
          bg-[length:14px_14px] bg-[right:12px_center] bg-no-repeat
        `}
        {...props}
      >
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
