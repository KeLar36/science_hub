import React, { useState, useEffect, useMemo } from "react";
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
import { useAdminData } from "@/features/admin/hooks/useAdminData";

export default function SuperadminProgramsTab({ onCreateClick, onEditClick }) {
  const {
    programs = [],
    loading = false,
    programsPagination,
    pagination: fallbackPagination,
    fetchPrograms,
    toggleProgramStatus,
    deleteProgram,
  } = useAdminData();

  // Захист на випадок різного найменування ключів у хуку
  const pagination = programsPagination ||
    fallbackPagination || { currentPage: 1, totalPages: 1 };

  const [feedback, setFeedback] = useState({ type: null, message: "" });
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const showFeedback = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => {
      setFeedback({ type: null, message: "" });
    }, 5000);
  };

  // 🔥 АВТОМАТИЧНЕ ЗАВАНТАЖЕННЯ ДАНИХ
  useEffect(() => {
    if (typeof fetchPrograms === "function") {
      fetchPrograms(pagination?.currentPage || 1, search);
    }
  }, [pagination?.currentPage, search, fetchPrograms]);

  const handleToggleArchive = async (prog) => {
    try {
      const result = await toggleProgramStatus(prog._id);
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
    if (
      !confirm(`Ви дійсно бажаєте остаточно видалити програму "${progTitle}"?`)
    ) {
      return;
    }

    try {
      const result = await deleteProgram(progId);
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
    const list = Array.isArray(programs) ? programs : [];
    return list.filter((prog) => {
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

  if (loading && (!programs || programs.length === 0)) {
    return <Skeleton variant="rectangle" height="250px" />;
  }

  const headers = [
    "Назва програми",
    "Тип",
    "Організація / Галузь",
    "Дедлайн",
    "Статус",
    "Дії (Superadmin)",
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

        {onCreateClick && (
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
            {!programs || programs.length === 0
              ? "Наразі в системі немає створених програм."
              : "За вказаними параметрами програм не знайдено."}
          </p>
          {(!programs || programs.length === 0) && onCreateClick && (
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
          <Table headers={headers} className="[&_table]:min-w-[1000px]">
            {filteredPrograms.map((prog) => (
              <TableRow key={prog._id}>
                <TableCell className="px-8 py-5 min-w-[280px]">
                  <div>
                    <span className="font-bold text-sm text-text-primary block">
                      {prog.title}
                    </span>
                  </div>
                </TableCell>

                <TableCell className="px-8 py-5">
                  <Badge status="default">{prog.type || "Програма"}</Badge>
                </TableCell>

                <TableCell className="px-8 py-5 min-w-[200px]">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-text-primary">
                      {prog.organizationId?.name ||
                        prog.organizer ||
                        "Платформа"}
                    </span>
                    <span className="text-[11px] font-mono text-text-muted">
                      {prog.domain || "Загальна"}
                    </span>
                  </div>
                </TableCell>

                <TableCell className="px-8 py-5 whitespace-nowrap">
                  <span className="text-xs font-mono flex items-center gap-1.5 text-purple-600 font-semibold">
                    <Clock size={13} />
                    {prog.deadline
                      ? new Date(prog.deadline).toLocaleDateString("uk-UA")
                      : "—"}
                  </span>
                </TableCell>

                <TableCell className="px-8 py-5">
                  <Badge status={prog.active ? "success" : "danger"}>
                    {prog.active ? "Активна" : "Архів"}
                  </Badge>
                </TableCell>

                <TableCell className="px-8 py-5 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      icon={prog.active ? Archive : ArchiveRestore}
                      onClick={() => handleToggleArchive(prog)}
                      className="text-xs text-text-muted hover:text-amber-500 hover:border-amber-500/40"
                      title={prog.active ? "В архів" : "Відновити"}
                    >
                      {prog.active ? "Архів" : "Відновити"}
                    </Button>

                    {onEditClick && (
                      <Button
                        variant="outline"
                        size="sm"
                        icon={Edit2}
                        onClick={() => onEditClick(prog)}
                        className="text-xs text-text-muted hover:text-purple-600 hover:border-purple-600/40"
                        title="Редагувати"
                      />
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      icon={Trash2}
                      onClick={() => handleDelete(prog._id, prog.title)}
                      className="text-xs text-red-500 border-red-500/30 hover:bg-red-500/10"
                      title="Видалити"
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </Table>

          {pagination && (
            <Pagination
              currentPage={pagination.currentPage || 1}
              totalPages={pagination.totalPages || 1}
              onPageChange={(page) => fetchPrograms(page, search)}
            />
          )}
        </>
      )}
    </div>
  );
}
