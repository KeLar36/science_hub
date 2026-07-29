import React, { useState, useEffect } from "react";
import {
  Search,
  FileText,
  User,
  BookOpen,
  UserCheck,
  Trash2,
  Tag,
  Download,
} from "lucide-react";
import Card from "@/shared/ui/Card";
import Skeleton from "@/shared/ui/Skeleton";
import Badge from "@/shared/ui/Badge";
import Button from "@/shared/ui/Button";
import Alert from "@/shared/ui/Alert";
import Input from "@/shared/ui/Input";
import Select from "@/shared/ui/Select";
import Pagination from "@/shared/ui/Pagination";
import { Table, TableRow, TableCell } from "@/shared/ui/Table";
import { useAdminData } from "@/features/admin/hooks/useAdminData";

export default function SuperadminProjectsTab() {
  const {
    projects = [],
    loading = false,
    projectsPagination,
    pagination: fallbackPagination,
    fetchProjects,
    deleteProject,
  } = useAdminData();

  const pagination = projectsPagination ||
    fallbackPagination || {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
    };

  const [feedback, setFeedback] = useState({ type: null, message: "" });
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Всі");
  const [reviewStatusFilter, setReviewStatusFilter] = useState("Всі");

  const showFeedback = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => {
      setFeedback({ type: null, message: "" });
    }, 5000);
  };

  useEffect(() => {
    if (typeof fetchProjects === "function") {
      fetchProjects(pagination?.currentPage || 1, {
        search,
        status: statusFilter,
        reviewStatus: reviewStatusFilter,
      });
    }
  }, [
    pagination?.currentPage,
    search,
    statusFilter,
    reviewStatusFilter,
    fetchProjects,
  ]);

  const handleDelete = async (projectId, projectTitle) => {
    if (
      !confirm(
        `Ви дійсно бажаєте остаточно видалити наукову працю "${projectTitle}"?\nУсі версії файлів будуть видалені з хмари!`,
      )
    ) {
      return;
    }

    try {
      const res = await deleteProject(projectId);
      if (res?.success) {
        showFeedback("success", `Працю "${projectTitle}" успішно видалено.`);
        fetchProjects(pagination?.currentPage || 1, {
          search,
          status: statusFilter,
          reviewStatus: reviewStatusFilter,
        });
      } else {
        showFeedback("danger", res?.message || "Помилка видалення праці.");
      }
    } catch (err) {
      showFeedback(
        "danger",
        err.response?.data?.message || "Сталася помилка при видаленні праці.",
      );
    }
  };

  const projectList = Array.isArray(projects) ? projects : [];

  const headers = [
    "Назва праці / Галузь",
    "Автор",
    "Програма",
    "Рецензент",
    "Статус",
    "Файл / Дії",
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case "Прийнято":
        return <Badge status="success">Прийнято</Badge>;
      case "Відхилено":
        return <Badge status="danger">Відхилено</Badge>;
      case "На доопрацюванні":
        return <Badge status="warning">Доопрацювання</Badge>;
      default:
        return <Badge status="default">На розгляді</Badge>;
    }
  };

  if (loading && projectList.length === 0) {
    return <Skeleton variant="rectangle" height="280px" />;
  }

  return (
    <div className="space-y-4 text-left">
      {feedback.type && (
        <Alert
          variant={feedback.type}
          onClose={() => setFeedback({ type: null, message: "" })}
        >
          {feedback.message}
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-bg-secondary p-3 rounded-xl border border-border-color">
        <Input
          placeholder="Шукати за назвою чи описом..."
          icon={Search}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          options={[
            { label: "Усі статуси", value: "Всі" },
            { label: "На розгляді", value: "На розгляді" },
            { label: "Прийнято", value: "Прийнято" },
            { label: "На доопрацюванні", value: "На доопрацюванні" },
            { label: "Відхилено", value: "Відхилено" },
          ]}
        />
        <Select
          value={reviewStatusFilter}
          onChange={(e) => setReviewStatusFilter(e.target.value)}
          options={[
            { label: "Усі рецензії", value: "Всі" },
            { label: "Не призначено", value: "Не призначено" },
            { label: "В процесі", value: "В процесі" },
            { label: "Завершено", value: "Завершено" },
            { label: "На доопрацюванні", value: "На доопрацюванні" },
          ]}
        />
      </div>

      {projectList.length === 0 ? (
        <Card className="p-8 text-center space-y-2 bg-bg-secondary/40 border-dashed">
          <FileText className="mx-auto text-text-muted" size={36} />
          <p className="text-xs font-mono text-text-muted">
            Ніяких наукових праць не знайдено за вказаними фільтрами.
          </p>
        </Card>
      ) : (
        <>
          <Table headers={headers} className="[&_table]:min-w-[1000px]">
            {projectList.map((proj) => {
              const latestVersion =
                proj.versions && proj.versions.length > 0
                  ? proj.versions[proj.versions.length - 1]
                  : null;
              const fileUrl = proj.fileUrl || latestVersion?.fileUrl;

              return (
                <TableRow key={proj._id}>
                  <TableCell className="px-8 py-5 min-w-[280px]">
                    <div className="space-y-1">
                      <span className="font-bold text-sm text-text-primary block line-clamp-2">
                        {proj.title}
                      </span>
                      <div className="flex items-center gap-1.5 text-[11px] font-mono text-text-muted">
                        <Tag size={12} className="text-purple-600" />
                        <span>{proj.domain || "Загальна"}</span>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="px-8 py-5 whitespace-nowrap">
                    <div className="flex flex-col text-xs font-mono">
                      <span className="font-bold text-text-primary flex items-center gap-1">
                        <User size={13} className="text-purple-600" />
                        {proj.authorId?.name || "—"}
                      </span>
                      <span className="text-text-muted text-[11px]">
                        {proj.authorId?.email || "—"}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="px-8 py-5 min-w-[200px]">
                    <div className="flex flex-col text-xs">
                      <span className="font-semibold text-text-primary flex items-center gap-1 line-clamp-1">
                        <BookOpen size={13} className="text-text-muted" />
                        {proj.programId?.title || proj.programTitle || "—"}
                      </span>
                      {proj.programId?.type && (
                        <span className="text-[10px] font-mono text-purple-600 bg-purple-500/10 px-1.5 py-0.5 rounded w-fit mt-0.5">
                          {proj.programId.type}
                        </span>
                      )}
                    </div>
                  </TableCell>

                  <TableCell className="px-8 py-5 whitespace-nowrap">
                    <div className="flex flex-col text-xs font-mono">
                      {proj.reviewerId ? (
                        <>
                          <span className="font-semibold text-text-primary flex items-center gap-1">
                            <UserCheck size={13} className="text-green-500" />
                            {proj.reviewerId.name}
                          </span>
                          <span className="text-text-muted text-[11px]">
                            {proj.reviewerId.email}
                          </span>
                        </>
                      ) : (
                        <span className="text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded text-[11px] font-mono w-fit">
                          Не призначено
                        </span>
                      )}
                    </div>
                  </TableCell>

                  <TableCell className="px-8 py-5 whitespace-nowrap">
                    <div className="space-y-1">
                      {getStatusBadge(proj.status)}
                      <div className="text-[10px] font-mono text-text-muted">
                        Рецензія: {proj.reviewStatus || "—"}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="px-8 py-5 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {fileUrl ? (
                        <a
                          href={fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg border border-border-color bg-bg-tertiary text-purple-600 hover:border-purple-600 hover:bg-purple-500/10 transition-colors"
                          title="Переглянути файл"
                        >
                          <Download size={14} />
                        </a>
                      ) : (
                        <span
                          className="text-text-muted text-xs font-mono"
                          title="Файл відсутній"
                        >
                          —
                        </span>
                      )}

                      <Button
                        variant="outline"
                        size="sm"
                        icon={Trash2}
                        onClick={() => handleDelete(proj._id, proj.title)}
                        className="text-xs text-red-500 border-red-500/30 hover:bg-red-500/10"
                        title="Видалити назавжди"
                      />
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </Table>

          {pagination && (
            <Pagination
              currentPage={pagination.currentPage || 1}
              totalPages={pagination.totalPages || 1}
              onPageChange={(page) =>
                fetchProjects(page, {
                  search,
                  status: statusFilter,
                  reviewStatus: reviewStatusFilter,
                })
              }
            />
          )}
        </>
      )}
    </div>
  );
}
