import React, { useState, useMemo } from "react";
import {
  BookOpen,
  Plus,
  Clock,
  Archive,
  ArchiveRestore,
  Edit2,
  Trash2,
  Search,
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

export default function OrganizationPrograms({
  programs = [],
  loading = false,
  isOrgAdmin = false,
  onCreateClick,
  onEditClick,
  onToggleArchiveClick,
  onDeleteClick,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
}) {
  const [feedback, setFeedback] = useState({ type: null, message: "" });
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const showFeedback = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => {
      setFeedback({ type: null, message: "" });
    }, 5000);
  };

  const handleToggleArchive = async (prog) => {
    try {
      const result = await onToggleArchiveClick?.(prog);
      if (result?.success) {
        showFeedback(
          "success",
          result.message || `Статус програми "${prog.title}" успішно змінено.`,
        );
      } else if (result?.error) {
        showFeedback("danger", result.error);
      }
    } catch (err) {
      showFeedback("danger", "Не вдалося змінити статус програми.");
    }
  };

  const handleDelete = async (progId, progTitle) => {
    if (!confirm(`Ви дійсно бажаєте видалити програму "${progTitle}"?`)) {
      return;
    }

    try {
      const result = await onDeleteClick?.(progId);
      if (result?.success) {
        showFeedback(
          "success",
          result.message || `Програму "${progTitle}" успішно видалено.`,
        );
      } else if (result?.error) {
        showFeedback("danger", result.error);
      }
    } catch (err) {
      showFeedback("danger", "Сталася помилка при видаленні програми.");
    }
  };

  const filteredPrograms = useMemo(() => {
    return programs.filter((prog) => {
      const matchesSearch =
        !search.trim() ||
        prog.title?.toLowerCase().includes(search.toLowerCase()) ||
        prog.domain?.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && prog.active) ||
        (statusFilter === "archived" && !prog.active);

      return matchesSearch && matchesStatus;
    });
  }, [programs, search, statusFilter]);

  if (loading) return <Skeleton variant="rectangle" height="200px" />;

  const headers = [
    "Назва програми",
    "Тип",
    "Галузь",
    "Дедлайн",
    "Статус",
    ...(isOrgAdmin ? ["Дії"] : []),
  ];

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

      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-bg-secondary p-3 rounded-xl border border-border-color">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full md:w-auto flex-1">
          <Input
            placeholder="Шукати за назвою чи галуззю..."
            icon={Search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { label: "Всі статуси", value: "all" },
              { label: "Активні", value: "active" },
              { label: "В архіві", value: "archived" },
            ]}
          />
        </div>

        {isOrgAdmin && (
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={onCreateClick}
            className="shrink-0 w-full md:w-auto"
          >
            Створити програму
          </Button>
        )}
      </div>

      {filteredPrograms.length === 0 ? (
        <Card className="p-8 text-center space-y-2 bg-bg-secondary/40 border-dashed">
          <BookOpen className="mx-auto text-text-muted" size={32} />
          <p className="text-xs font-mono text-text-muted">
            {programs.length === 0
              ? "Наразі немає опублікованих наукових програм."
              : "За вказаними параметрами програм не знайдено."}
          </p>
          {isOrgAdmin && programs.length === 0 && (
            <Button
              variant="outline"
              size="sm"
              icon={Plus}
              onClick={onCreateClick}
              className="mt-2"
            >
              Створити першу програму
            </Button>
          )}
        </Card>
      ) : (
        <>
          <Table headers={headers}>
            {filteredPrograms.map((prog) => (
              <TableRow key={prog._id}>
                <TableCell>
                  <div className="font-bold text-xs text-text-primary">
                    {prog.title}
                  </div>
                  {prog.shortDescription && (
                    <div className="text-[10px] text-text-muted line-clamp-1">
                      {prog.shortDescription}
                    </div>
                  )}
                </TableCell>

                <TableCell>
                  <Badge status="default">{prog.type || "Програма"}</Badge>
                </TableCell>

                <TableCell>
                  <span className="text-xs font-mono">{prog.domain}</span>
                </TableCell>

                <TableCell>
                  <span className="text-xs font-mono flex items-center gap-1 text-red-500 font-semibold">
                    <Clock size={12} />
                    {new Date(prog.deadline).toLocaleDateString("uk-UA")}
                  </span>
                </TableCell>

                <TableCell>
                  <Badge status={prog.active ? "success" : "danger"}>
                    {prog.active ? "Активна" : "Архів"}
                  </Badge>
                </TableCell>

                {isOrgAdmin && (
                  <TableCell>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Button
                        variant="outline"
                        size="sm"
                        icon={prog.active ? Archive : ArchiveRestore}
                        onClick={() => handleToggleArchive(prog)}
                        className="text-xs text-text-muted hover:text-amber-500 hover:border-amber-500/40"
                      >
                        {prog.active ? "В архів" : "Відновити"}
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        icon={Edit2}
                        onClick={() => onEditClick?.(prog)}
                        className="text-xs text-text-muted hover:text-brand hover:border-brand/40"
                      >
                        Редагувати
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        icon={Trash2}
                        onClick={() => handleDelete(prog._id, prog.title)}
                        className="text-xs text-red-500 border-red-500/30 hover:bg-red-500/10"
                      >
                        Видалити
                      </Button>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </Table>

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
