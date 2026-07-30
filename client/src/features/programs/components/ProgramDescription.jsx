import React from "react";
import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import Button from "@/shared/ui/Button";

export default function ProgramDescription({ program }) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted font-mono">
          // Повний опис програми та вимоги
        </h3>

        <div
          className="prose text-sm font-medium leading-relaxed font-sans text-text-secondary p-1  max-w-full break-words overfflow-hidden"
          dangerouslySetInnerHTML={{ __html: program.description }}
        />
      </div>

      {program.externalLink && (
        <div className="pt-2">
          <a href={program.externalLink} target="_blank" rel="noreferrer">
            <Button variant="outline" size="sm" icon={ExternalLink}>
              Читати першоджерело конкурсу
            </Button>
          </a>
        </div>
      )}

      {program.active && (
        <div className="border-t border-border-color pt-6 flex justify-end">
          <Link
            to={`/projects/submit?program=${program._id}${
              program.domain
                ? `&domain=${encodeURIComponent(program.domain)}`
                : ""
            }`}
          >
            <Button variant="primary" size="lg">
              Подати проєкт на конкурс
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
