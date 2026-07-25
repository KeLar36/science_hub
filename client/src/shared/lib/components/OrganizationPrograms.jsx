import React, { useState } from "react";
import {
  BookOpen,
  Plus,
  Clock,
  Archive,
  ArchiveRestore,
  Edit2,
  Trash2,
} from "lucide-react";
import Card from "@/shared/ui/Card";
import Skeleton from "@/shared/ui/Skeleton";
import Badge from "@/shared/ui/Badge";
import Button from "@/shared/ui/Button";
import Alert from "@/shared/ui/Alert";
import { Table, TableRow, TableCell } from "@/shared/ui/Table";

export default function OrganizationPrograms({
  programs = [],
  loading = false,
  isOrgAdmin = false,
  onCreateClick,
  onEditClick,
  onToggleArchiveClick,
  onDeleteClick,
}) {
  const [feedback, setFeedback] = useState({ type: null, message: "" });

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

  if (loading) return <Skeleton variant="rectangle" height="200px" />;

  if (programs.length === 0) {
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
        <Card className="p-8 text-center space-y-2 bg-bg-secondary/40">
          <BookOpen className="mx-auto text-text-muted" size={32} />
          <p className="text-xs font-mono text-text-muted">
            Наразі немає опублікованих наукових програм.
          </p>
          {isOrgAdmin && (
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
      </div>
    );
  }

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

      {isOrgAdmin && (
        <div className="flex justify-end">
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={onCreateClick}
          >
            Створити програму
          </Button>
        </div>
      )}

      <Table headers={headers}>
        {programs.map((prog) => (
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
              <span className="text-xs font-mono flex items-center gap-1">
                <Clock size={12} />
                {new Date(prog.deadline).toLocaleDateString()}
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
    </div>
  );
}
