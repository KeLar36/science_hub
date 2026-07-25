import React from "react";
import { FolderGit2, Clock, ExternalLink, ShieldCheck } from "lucide-react";
import Card from "@/shared/ui/Card";
import Skeleton from "@/shared/ui/Skeleton";
import Badge from "@/shared/ui/Badge";
import Button from "@/shared/ui/Button";
import Avatar from "@/shared/ui/Avatar";
import { Table, TableRow, TableCell } from "@/shared/ui/Table";

export default function OrganizationSubmittedProjects({
  projects = [],
  loading = false,
  onReviewClick,
  onViewDetails,
}) {
  if (loading) return <Skeleton variant="rectangle" height="200px" />;

  if (projects.length === 0) {
    return (
      <Card className="p-8 text-center space-y-2 bg-bg-secondary/40">
        <FolderGit2 className="mx-auto text-text-muted" size={32} />
        <p className="text-xs font-mono text-text-muted">
          На наукові програми вашої організації поки не подано жодного проєкту.
        </p>
      </Card>
    );
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "Прийнято":
      case "approved":
        return <Badge status="success">Прийнято</Badge>;
      case "Відхилено":
      case "rejected":
        return <Badge status="danger">Відхилено</Badge>;
      case "На доопрацюванні":
      case "needs_revision":
        return <Badge status="warning">На доопрацюванні</Badge>;
      case "На розгляді":
      case "under_review":
        return <Badge status="warning">На розгляді</Badge>;
      default:
        return <Badge status="default">{status || "Нова заявка"}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <Table
        headers={[
          "Назва проєкту",
          "Автор",
          "Програма",
          "Дата подачі",
          "Статус",
          "Дії",
        ]}
      >
        {projects.map((item) => {
          const author = item.authorId || item.author;
          const program = item.programId || item.program;

          const isFinalStatus =
            item.status === "Прийнято" ||
            item.status === "approved" ||
            item.status === "Відхилено" ||
            item.status === "rejected";

          return (
            <TableRow key={item._id}>
              <TableCell>
                <div className="font-bold text-xs text-text-primary">
                  {item.title}
                </div>
                <div className="text-[10px] font-mono text-text-muted">
                  Галузь: {item.domain || "Загальна"}
                </div>
              </TableCell>

              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar
                    src={author?.image}
                    name={author?.name || "Дослідник"}
                    size="sm"
                  />
                  <div>
                    <div className="font-bold text-xs text-text-primary">
                      {author?.name || "Невідомий автор"}
                    </div>
                    <div className="text-[10px] font-mono text-text-muted">
                      {author?.email}
                    </div>
                  </div>
                </div>
              </TableCell>

              <TableCell>
                <span className="text-xs font-mono text-text-secondary">
                  {program?.title || "Загальна програма"}
                </span>
              </TableCell>

              <TableCell>
                <span className="text-xs font-mono flex items-center gap-1">
                  <Clock size={12} />
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
              </TableCell>

              <TableCell>{getStatusBadge(item.status)}</TableCell>

              <TableCell>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    icon={ExternalLink}
                    onClick={() => onViewDetails?.(item)}
                  >
                    Переглянути
                  </Button>

                  {onReviewClick && !isFinalStatus && (
                    <Button
                      variant="primary"
                      size="sm"
                      icon={ShieldCheck}
                      onClick={() => onReviewClick(item)}
                    >
                      Рецензувати
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </Table>
    </div>
  );
}
