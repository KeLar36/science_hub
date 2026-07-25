import React from "react";
import { Calendar, Award, BookOpen, Layers } from "lucide-react";
import Card from "@/shared/ui/Card";
import Badge from "@/shared/ui/Badge";
import Link from "@/shared/ui/Link";

export default function ProgramCard({ program }) {
  const getTypeIcon = (type) => {
    switch (type) {
      case "Науковий журнал":
        return <BookOpen className="w-3.5 h-3.5 text-emerald-500" />;
      case "Грант":
        return <Award className="w-3.5 h-3.5 text-amber-500" />;
      default:
        return <Layers className="w-3.5 h-3.5 text-brand" />;
    }
  };

  const getBadgeStatus = (type) => {
    if (type === "Грант") return "warning";
    if (type === "Науковий журнал") return "success";
    return "default";
  };

  const programPath = `/programs/${program._id}`;

  return (
    <Link href={programPath} variant="muted" className="block w-full !gap-0">
      <Card
        hoverable
        className="flex flex-col justify-between h-full w-full !p-5 overflow-hidden group"
      >
        <div className="space-y-4">
          <div className="flex justify-between items-start gap-3">
            <span className="text-[10px] font-mono text-text-muted uppercase tracking-widest truncate max-w-[140px]">
              {program.organizationId?.name || "Science Platform"}
            </span>
            <Badge status={getBadgeStatus(program.type)}>
              <span className="flex items-center gap-1.5">
                {getTypeIcon(program.type)}
                {program.type}
              </span>
            </Badge>
          </div>

          <div>
            <h3 className="font-sans font-bold text-sm text-text-primary line-clamp-2 group-hover:text-brand transition-colors">
              {program.title}
            </h3>
            <p className="text-text-secondary font-mono text-[11px] mt-2 line-clamp-3 leading-relaxed">
              {program.shortDescription ||
                "Детальні умови та вимоги дивіться всередині картки конкурсу."}
            </p>
          </div>

          <div className="bg-bg-tertiary/60 border border-border-color/60 rounded-lg p-3 space-y-1.5 text-[11px] font-mono">
            <div className="text-text-muted">
              Галузь:{" "}
              <span className="text-text-primary font-bold">
                {program.domain}
              </span>
            </div>

            {program.type === "Грант" && program.amount && (
              <div className="text-text-muted">
                Бюджет:{" "}
                <span className="text-amber-500 font-bold">
                  {program.amount}
                </span>
              </div>
            )}
            {program.type === "Науковий журнал" && (
              <div className="text-text-muted">
                Impact Factor:{" "}
                <span className="text-emerald-500 font-bold">
                  {program.impactFactor || "0"}
                </span>
              </div>
            )}
            {program.organizer && (
              <div className="text-text-muted">
                Організатор:{" "}
                <span className="text-text-secondary">{program.organizer}</span>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-border-color mt-5 pt-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-text-muted font-mono text-[10px]">
            <Calendar className="w-3.5 h-3.5 text-red-500/80" />
            <span>
              До: {new Date(program.deadline).toLocaleDateString("uk-UA")}
            </span>
          </div>

          <div className="inline-flex items-center justify-center font-medium rounded border transition-all duration-200 px-3 py-1 text-xs gap-1.5 border-border-color text-text-secondary group-hover:border-brand/50 group-hover:text-brand bg-transparent uppercase font-mono text-[10px] tracking-wider">
            Переглянути
          </div>
        </div>
      </Card>
    </Link>
  );
}
