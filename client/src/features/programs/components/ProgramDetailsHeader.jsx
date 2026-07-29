import { Calendar, ExternalLink, Star, CheckCircle2 } from "lucide-react";
import Badge from "@/shared/ui/Badge";

export default function ProgramDetailsHeader({ program }) {
  const getBadgeStatus = (type) => {
    if (type === "Грант") return "warning";
    if (type === "Науковий журнал") return "success";
    return "default";
  };

  const isOrgVerified =
    program.organizationId?.isVerified || program.isVerified;

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-wrap justify-between items-center gap-4 border-b border-border-color pb-4">
        <div className="flex items-center gap-3">
          {program.organizationId?.logo && (
            <img
              src={program.organizationId.logo}
              alt="Organization Logo"
              className="w-8 h-8 rounded-sm object-cover border border-border-color"
            />
          )}
          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="font-mono text-[10px] font-black uppercase tracking-widest text-text-muted leading-none">
                {program.organizationId?.name || "Science Platform"}
              </h4>
              {isOrgVerified && (
                <CheckCircle2
                  size={13}
                  className="text-brand shrink-0 fill-brand/10"
                  title="Верифікована установа"
                />
              )}
            </div>

            {program.organizationId?.website && (
              <a
                href={program.organizationId.website}
                target="_blank"
                rel="noreferrer"
                className="text-[9px] font-mono text-brand hover:underline flex items-center gap-1 mt-1"
              >
                Офіційний сайт установи <ExternalLink size={10} />
              </a>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {program.isFeatured && (
            <Badge
              status="warning"
              className="!bg-amber-500/90 !text-white border-none flex items-center gap-1 font-bold shadow-sm"
            >
              <Star className="w-3 h-3 fill-white" />
              <span>Рекомендовано</span>
            </Badge>
          )}

          <Badge status={getBadgeStatus(program.type)}>
            <span className="font-bold">{program.type}</span>
          </Badge>
        </div>
      </div>

      <h1 className="text-xl md:text-2xl font-black tracking-tight font-sans uppercase text-text-primary">
        {program.title}
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-bg-tertiary/60 border border-border-color p-4 rounded-xl font-mono text-xs">
        <div>
          <span className="block text-[10px] text-text-muted uppercase font-bold mb-1">
            Галузь знань:
          </span>
          <span className="text-text-primary font-bold">{program.domain}</span>
        </div>
        <div>
          <span className="block text-[10px] text-text-muted uppercase font-bold mb-1">
            Прийом заявок до:
          </span>
          <span className="text-red-500 font-bold flex items-center gap-1.5">
            <Calendar size={13} />{" "}
            {new Date(program.deadline).toLocaleDateString("uk-UA")}
          </span>
        </div>
        <div>
          <span className="block text-[10px] text-text-muted uppercase font-bold mb-1">
            Статус конкурсу:
          </span>
          <span
            className={
              program.active
                ? "text-emerald-500 font-bold"
                : "text-text-muted font-bold"
            }
          >
            {program.active ? "● Активний" : "○ В архіві"}
          </span>
        </div>
      </div>
    </div>
  );
}
