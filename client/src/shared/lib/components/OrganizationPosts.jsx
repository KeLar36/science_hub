import React, { useState, useMemo } from "react";
import {
  Plus,
  Edit3,
  Trash2,
  Eye,
  Calendar,
  Tag,
  Search,
  FileText,
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

export default function OrganizationPosts({
  posts = [],
  loading = false,
  canManage = false,
  onCreateClick,
  onEditClick,
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
    setTimeout(() => setFeedback({ type: null, message: "" }), 5000);
  };

  const handleDelete = async (postId, postTitle) => {
    if (!confirm(`Ви дійсно бажаєте видалити допис "${postTitle}"?`)) return;

    try {
      const res = await onDeleteClick?.(postId);
      if (res?.success) {
        showFeedback("success", `Допис "${postTitle}" успішно видалено.`);
      } else {
        showFeedback("danger", res?.error || "Не вдалося видалити допис.");
      }
    } catch {
      showFeedback("danger", "Помилка при видаленні допису.");
    }
  };

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch =
        !search.trim() ||
        post.title?.toLowerCase().includes(search.toLowerCase()) ||
        post.category?.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "published" && post.status !== "draft") ||
        (statusFilter === "draft" && post.status === "draft");

      return matchesSearch && matchesStatus;
    });
  }, [posts, search, statusFilter]);

  if (loading) return <Skeleton variant="rectangle" height="200px" />;

  const headers = [
    "Публікація",
    "Категорія",
    "Дата",
    "Статус",
    ...(canManage ? ["Дії"] : []),
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
            placeholder="Шукати за заголовком чи категорією..."
            icon={Search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { label: "Всі статуси", value: "all" },
              { label: "Опубліковані", value: "published" },
              { label: "Чернетки", value: "draft" },
            ]}
          />
        </div>

        {canManage && (
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={onCreateClick}
            className="shrink-0 w-full md:w-auto"
          >
            Створити допис
          </Button>
        )}
      </div>

      {filteredPosts.length === 0 ? (
        <Card className="p-8 text-center space-y-2 bg-bg-secondary/40 border-dashed">
          <FileText className="mx-auto text-text-muted" size={32} />
          <p className="text-xs font-mono text-text-muted">
            {posts.length === 0
              ? "У вашої організації ще немає опублікованих статей чи дописів."
              : "За вказаними фільтрами дописів не знайдено."}
          </p>
          {canManage && posts.length === 0 && (
            <Button
              variant="outline"
              size="sm"
              icon={Plus}
              onClick={onCreateClick}
              className="mt-2"
            >
              Написати перший допис
            </Button>
          )}
        </Card>
      ) : (
        <>
          <Table headers={headers}>
            {filteredPosts.map((post) => {
              const isDraft = post.status === "draft";
              const createdDate = post.createdAt
                ? new Date(post.createdAt).toLocaleDateString("uk-UA")
                : "—";

              return (
                <TableRow key={post._id}>
                  <TableCell>
                    <div className="font-bold text-xs text-text-primary leading-snug">
                      {post.title}
                    </div>
                  </TableCell>

                  <TableCell>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-bg-tertiary border border-border-color text-[10px] font-mono">
                      <Tag size={10} className="text-brand" />
                      {post.category || "Загальне"}
                    </span>
                  </TableCell>

                  <TableCell>
                    <span className="text-xs font-mono text-text-muted flex items-center gap-1">
                      <Calendar size={12} />
                      {createdDate}
                    </span>
                  </TableCell>

                  <TableCell>
                    {isDraft ? (
                      <Badge status="default">Чернетка</Badge>
                    ) : (
                      <Badge status="success">Опубліковано</Badge>
                    )}
                  </TableCell>

                  {canManage && (
                    <TableCell>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {!isDraft && (
                          <a href={`/blog/${post._id}`} rel="noreferrer">
                            <Button
                              variant="outline"
                              size="sm"
                              icon={Eye}
                              className="!p-1.5"
                              title="Переглянути на сайті"
                            />
                          </a>
                        )}

                        <Button
                          variant="outline"
                          size="sm"
                          icon={Edit3}
                          onClick={() => onEditClick?.(post)}
                          className="!p-1.5"
                          title="Редагувати"
                        />

                        <Button
                          variant="outline"
                          size="sm"
                          icon={Trash2}
                          onClick={() => handleDelete(post._id, post.title)}
                          className="!p-1.5 border-red-500/30 text-red-500 hover:bg-red-500/10"
                          title="Видалити"
                        />
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
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
