import { FileText, User, Tag, Calendar, Download } from "lucide-react";
import Card from "@/shared/ui/Card";
import Badge from "@/shared/ui/Badge";
import Button from "@/shared/ui/Button";

export default function ProjectCard({
  project,
  onSelectProject,
  getDownloadUrl,
}) {
  const latestVersion = project.versions?.[project.versions.length - 1];

  const stripHtml = (htmlContent) => {
    if (!htmlContent) return "";

    let cleanText = htmlContent.replace(/<\/?[^>]+(>|$)/g, "");

    cleanText = cleanText
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/\s+/g, " ")
      .trim();

    return cleanText;
  };

  return (
    <Card
      hoverable
      className="flex flex-col justify-between h-full border-border-color/80"
    >
      <div className="space-y-4">
        <div className="flex justify-between items-start gap-3">
          <div className="flex items-center gap-1.5 text-text-muted text-[11px] font-mono truncate">
            <User size={12} className="text-brand shrink-0" />
            <span className="truncate font-bold text-text-primary">
              {project.authorId?.name || "Автор публікації"}
            </span>
          </div>

          {project.programId?.type && (
            <Badge status="success">{project.programId.type}</Badge>
          )}
        </div>

        <div>
          <h3
            onClick={() => onSelectProject?.(project)}
            className="font-sans font-bold text-base text-text-primary line-clamp-2 hover:text-brand transition-colors cursor-pointer"
          >
            {project.title}
          </h3>

          <p className="text-text-secondary font-mono text-[11px] mt-2 line-clamp-3 leading-relaxed">
            {stripHtml(project.description)}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] bg-bg-tertiary/60 p-2.5 rounded-lg border border-border-color/60">
          <span className="text-text-muted flex items-center gap-1">
            <Tag size={10} /> Галузь:
          </span>
          <span className="text-text-primary font-bold">{project.domain}</span>
        </div>
      </div>

      <div className="border-t border-border-color mt-5 pt-3 flex items-center justify-between gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onSelectProject?.(project)}
          className="font-mono text-[10px] uppercase tracking-wider"
        >
          Детальніше
        </Button>

        {latestVersion?.fileUrl ? (
          <a
            href={
              getDownloadUrl
                ? getDownloadUrl(latestVersion.fileUrl)
                : latestVersion.fileUrl
            }
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              variant="outline"
              size="sm"
              icon={Download}
              className="font-mono text-[10px] uppercase"
            >
              PDF
            </Button>
          </a>
        ) : (
          <span className="text-[10px] font-mono text-text-muted">
            Файл недоступний
          </span>
        )}
      </div>
    </Card>
  );
}
