import { Check, Clock } from "lucide-react";

export default function Timeline({ steps = [] }) {
  return (
    <div className="space-y-8 relative before:absolute before:left-[10px] before:top-2 before:bottom-2 before:w-px before:bg-border-color">
      {steps.map((step, index) => {
        const isCompleted = step.status === "completed";
        const isCurrent = step.status === "current";

        return (
          <div key={index} className="relative flex gap-5 items-start">
            <div
              className={`
                absolute left-0 w-5 h-5 rounded-full border-2 flex items-center justify-center z-10 transition-all duration-300
                ${
                  isCompleted
                    ? "bg-brand border-brand text-white"
                    : isCurrent
                      ? "bg-bg-primary border-brand text-brand animate-pulse"
                      : "bg-bg-secondary border-border-color text-text-muted"
                }
              `}
            >
              {isCompleted ? (
                <Check className="w-2.5 h-2.5" strokeWidth={3} />
              ) : isCurrent ? (
                <div className="w-2 h-2 rounded-full bg-brand" />
              ) : (
                <div className="w-1.5 h-1.5 rounded-full bg-text-muted" />
              )}
            </div>

            <div className="pl-8 space-y-1">
              <div className="flex items-center gap-3">
                <h4
                  className={`text-xs font-bold tracking-wide ${isCurrent ? "text-brand" : "text-text-primary"}`}
                >
                  {step.title}
                </h4>
                {step.date && (
                  <span className="text-[10px] font-mono text-text-muted">
                    {step.date}
                  </span>
                )}
              </div>
              {step.description && (
                <p className="text-xs text-text-secondary leading-relaxed max-w-md">
                  {step.description}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
