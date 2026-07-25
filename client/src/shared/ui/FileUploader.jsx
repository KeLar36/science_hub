import { useState } from "react";
import { UploadCloud } from "lucide-react";

export default function FileUploader({
  label,
  description,
  error,
  className = "",
  onChange,
  ...props
}) {
  const [isDragActive, setIsDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const fakeEvent = {
        target: {
          files: e.dataTransfer.files,
        },
      };
      onChange?.(fakeEvent);
    }
  };

  return (
    <div className={`flex flex-col gap-2 w-full ${className}`}>
      {label && (
        <span className="text-[10px] font-mono font-bold text-text-muted uppercase tracking-widest">
          {label}
        </span>
      )}

      <label
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg bg-bg-secondary p-5
          flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-200
          ${isDragActive ? "border-brand bg-brand/10" : "border-border-color hover:border-brand/50 hover:bg-brand/5"}
          ${error ? "border-red-500/50 bg-red-500/5" : ""}
        `}
      >
        <input type="file" className="hidden" onChange={onChange} {...props} />

        <div
          className={`p-2 rounded-full ${error ? "bg-red-500/10" : "bg-bg-tertiary"}`}
        >
          <UploadCloud
            className={`w-5 h-5 ${error ? "text-red-500" : "text-brand"}`}
          />
        </div>

        <div className="text-center select-none">
          <span className="block text-xs font-semibold text-text-primary">
            Натисніть або перетягніть
          </span>
          {description && (
            <span className="block text-[10px] font-mono text-text-muted mt-0.5">
              {description}
            </span>
          )}
        </div>
      </label>

      {error && (
        <span className="text-[11px] text-red-500 font-medium animate-in slide-in-from-top-1">
          {error}
        </span>
      )}
    </div>
  );
}
