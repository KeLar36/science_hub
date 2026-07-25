import { useState } from "react";

export default function Tooltip({ text, children }) {
  const [visible, setVisible] = useState(false);

  return (
    <div
      className="relative inline-flex items-center"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div
          className="
            absolute z-[999] bottom-full left-1/2 -translate-x-1/2 mb-2
            px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase
            bg-text-primary text-bg-primary rounded-sm shadow-lg whitespace-nowrap
            animate-in fade-in zoom-in-95 duration-200 pointer-events-none
          "
        >
          {text}
        </div>
      )}
    </div>
  );
}
