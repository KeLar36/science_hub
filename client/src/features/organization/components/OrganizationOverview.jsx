import React from "react";
import Card from "@/shared/ui/Card";
import Badge from "@/shared/ui/Badge";
import {
  Globe,
  Mail,
  MapPin,
  Building2,
  BookOpen,
  ShieldCheck,
} from "lucide-react";

export default function OrganizationOverview({ orgData }) {
  if (!orgData) return null;

  return (
    <div className="space-y-5 text-left animate-reveal">
      <Card className="p-5 md:p-6 bg-bg-secondary/60 border-border-color space-y-3 shadow-xs overflow-hidden">
        <div className="flex items-center gap-2 border-b border-border-color/40 pb-3">
          <Building2 size={16} className="text-brand shrink-0" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-text-muted">
            Про наукову установу
          </h3>
        </div>

        <p className="text-xs md:text-sm text-text-primary leading-relaxed whitespace-pre-line [overflow-wrap:anywhere]">
          {orgData.description || "Опис організації поки що відсутній."}
        </p>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
        <Card className="p-5 md:p-6 bg-bg-secondary/60 border-border-color space-y-4 flex flex-col justify-between shadow-xs">
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b border-border-color/40 pb-3">
              <BookOpen size={16} className="text-brand shrink-0" />
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-text-muted">
                Наукові галузі та напрями
              </h3>
            </div>

            {orgData.scientificDomains &&
            orgData.scientificDomains.length > 0 ? (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {orgData.scientificDomains.map((domain, idx) => (
                  <Badge key={idx} status="default">
                    {domain}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-xs text-text-muted">Галузі наук не вказані.</p>
            )}
          </div>
        </Card>

        <Card className="p-5 md:p-6 bg-bg-secondary/60 border-border-color space-y-4 flex flex-col justify-between shadow-xs">
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b border-border-color/40 pb-3">
              <ShieldCheck size={16} className="text-brand shrink-0" />
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-text-muted">
                Реквізити та контакти
              </h3>
            </div>

            <div className="space-y-3 text-xs text-text-secondary font-mono">
              <div className="flex items-center justify-between gap-2 border-b border-border-color/30 pb-2">
                <span className="text-text-muted">Форма власності:</span>
                <span className="font-bold text-text-primary">
                  {orgData.legalForm || "ДУ/КЗ"}
                </span>
              </div>

              {orgData.city && (
                <div className="flex items-center justify-between gap-2 border-b border-border-color/30 pb-2">
                  <span className="text-text-muted flex items-center gap-1.5">
                    <MapPin size={13} className="text-text-muted" /> Локація:
                  </span>
                  <span className="font-semibold text-text-primary">
                    {orgData.city}
                  </span>
                </div>
              )}

              {orgData.email && (
                <div className="flex items-center justify-between gap-2 border-b border-border-color/30 pb-2">
                  <span className="text-text-muted flex items-center gap-1.5">
                    <Mail size={13} className="text-text-muted" /> Email:
                  </span>
                  <a
                    href={`mailto:${orgData.email}`}
                    className="text-text-primary hover:text-brand transition-colors truncate max-w-[200px]"
                  >
                    {orgData.email}
                  </a>
                </div>
              )}

              <div className="flex items-center justify-between gap-2 border-b border-border-color/30 pb-2">
                <span className="text-text-muted flex items-center gap-1.5">
                  <Globe size={13} className="text-text-muted" /> Офіційний
                  сайт:
                </span>
                {orgData.website ? (
                  <a
                    href={
                      orgData.website.startsWith("http")
                        ? orgData.website
                        : `https://${orgData.website}`
                    }
                    target="_blank"
                    rel="noreferrer"
                    className="text-brand hover:underline font-medium truncate max-w-[180px]"
                  >
                    {orgData.website.replace(/^https?:\/\//, "")}
                  </a>
                ) : (
                  <span className="text-text-muted">—</span>
                )}
              </div>

              <div className="flex items-center justify-between gap-2 pt-1">
                <span className="text-text-muted">Публічний вступ:</span>
                <Badge status={orgData.allowPublicJoin ? "success" : "warning"}>
                  {orgData.allowPublicJoin ? "Відкритий" : "За запитом"}
                </Badge>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
