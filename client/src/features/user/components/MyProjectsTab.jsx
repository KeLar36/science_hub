import React from "react";
import { Link } from "react-router-dom";
import { PlusCircle, FileText, Award } from "lucide-react"; // 👈 Додали Award або Folder
import Card from "@/shared/ui/Card";
import Button from "@/shared/ui/Button";
import Badge from "@/shared/ui/Badge";
import Skeleton from "@/shared/ui/Skeleton";
import Pagination from "@/shared/ui/Pagination";

export default function MyProjectsTab({
  projects = [],
  loading,
  onPageChange,
}) {
  const projectList = Array.isArray(projects)
    ? projects
    : projects?.projects || [];

  const totalPages = projects?.totalPages || 1;
  const currentPage = projects?.currentPage || 1;
  const totalItems = projects?.totalItems ?? projectList.length;

  const getStatusBadge = (status) => {
    switch (status) {
      case "Прийнято":
      case "approved":
        return <Badge status="success">Прийнято</Badge>;
      case "На доопрацюванні":
      case "needs_revision":
        return <Badge status="warning">На доопрацюванні</Badge>;
      case "Відхилено":
      case "rejected":
        return <Badge status="danger">Відхилено</Badge>;
      default:
        return <Badge status="default">На розгляді</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        <Skeleton variant="rectangle" height="70px" />
        <Skeleton variant="rectangle" height="70px" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono text-text-muted">
          Всього подано праць:{" "}
          <strong className="text-text-primary">{totalItems}</strong>
        </span>
        <Link to="/programs">
          <Button variant="primary" size="sm" icon={PlusCircle}>
            Подати нову працю
          </Button>
        </Link>
      </div>

      {projectList.length === 0 ? (
        <Card className="p-8 text-center space-y-3 bg-bg-secondary/40">
          <FileText className="mx-auto text-text-muted" size={32} />
          <p className="text-xs font-mono text-text-muted">
            Ви ще не подавали жодної наукової праці.
          </p>
        </Card>
      ) : (
        <>
          <div className="space-y-3">
            {projectList.map((project) => {
              const programName =
                project.programId?.title ||
                project.program?.title ||
                project.programName ||
                "Загальна програма";

              const programId =
                project.programId?._id ||
                project.programId ||
                project.program?._id;

              return (
                <Card key={project._id} hoverable className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-mono text-brand font-bold uppercase">
                          [{project.domain || "Загальна"}]
                        </span>

                        <div className="flex items-center gap-1 text-[11px] font-medium text-text-secondary bg-bg-tertiary px-2 py-0.5 rounded border border-border-color">
                          <Award size={12} className="text-brand shrink-0" />
                          {programId ? (
                            <Link
                              to={`/programs/${programId}`}
                              className="hover:text-brand hover:underline truncate max-w-[220px]"
                              title={programName}
                            >
                              {programName}
                            </Link>
                          ) : (
                            <span className="truncate max-w-[220px]">
                              {programName}
                            </span>
                          )}
                        </div>

                        <span className="text-[10px] font-mono text-text-muted">
                          • {new Date(project.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      {/* Заголовок праці */}
                      <h3 className="font-bold text-xs text-text-primary font-sans leading-snug">
                        {project.title}
                      </h3>
                    </div>

                    <div className="shrink-0">
                      {getStatusBadge(project.status)}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </>
      )}
    </div>
  );
}
