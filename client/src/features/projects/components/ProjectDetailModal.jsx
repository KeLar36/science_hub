import React from "react";
import { Download } from "lucide-react";
import Modal from "@/shared/ui/Modal";
import Badge from "@/shared/ui/Badge";
import Button from "@/shared/ui/Button";

export default function ProjectDetailModal({
  project,
  onClose,
  getDownloadUrl,
}) {
  if (!project) return null;

  const latestVersion = project.versions?.[project.versions.length - 1];

  return (
    <Modal isOpen={!!project} onClose={onClose} title="Деталі наукової праці">
      <div className="space-y-6 text-left">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge status="success">
              {project.programId?.type || "Публікація"}
            </Badge>
            <span className="text-xs font-mono text-text-muted">
              {project.domain}
            </span>
          </div>
          <h2 className="text-xl font-bold text-text-primary font-sans leading-snug">
            {project.title}
          </h2>
        </div>
        <div className="space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-text-muted">
            // Анотація конкурсу / праці
          </span>

          <div className="bg-bg-tertiary p-4 rounded-xl border border-border-color max-h-[300px] overflow-y-auto">
            <div
              className="prose max-w-full overflow-hidden break-words text-sm text-text-secondary leading-relaxed font-sans [&_img]:max-w-full [&_table]:block [&_table]:overflow-x-auto"
              dangerouslySetInnerHTML={{ __html: project.description }}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 font-mono text-xs bg-bg-secondary p-3 rounded-xl border border-border-color">
          <div>
            <span className="block text-[10px] text-text-muted uppercase">
              Автор праці:
            </span>
            <span className="text-text-primary font-bold">
              {project.authorId?.name || "Не вказано"}
            </span>
          </div>
          <div>
            <span className="block text-[10px] text-text-muted uppercase">
              Конкурс:
            </span>
            <span className="text-text-primary font-bold">
              {project.programId?.title || "Автономна робота"}
            </span>
          </div>
        </div>
        <div className="flex justify-end items-center gap-3 pt-4 border-t border-border-color">
          <Button variant="outline" size="sm" onClick={onClose}>
            Закрити
          </Button>

          {latestVersion?.fileUrl && (
            <a
              href={
                getDownloadUrl
                  ? getDownloadUrl(latestVersion.fileUrl)
                  : latestVersion.fileUrl
              }
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="primary" size="sm" icon={Download}>
                Завантажити матеріал (PDF)
              </Button>
            </a>
          )}
        </div>
      </div>
    </Modal>
  );
}
