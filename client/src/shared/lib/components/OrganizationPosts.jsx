import React from "react";
import { Plus, Edit, Trash2, Eye, Calendar, Tag } from "lucide-react";
import Card from "@/shared/ui/Card";
import Button from "@/shared/ui/Button";
import Badge from "@/shared/ui/Badge";
import Skeleton from "@/shared/ui/Skeleton";

export default function OrganizationPosts({
  posts = [],
  loading = false,
  canManage = false,
  onCreateClick,
  onEditClick,
  onDeleteClick,
}) {
  if (loading) {
    return (
      <Card className="p-6 space-y-4">
        <Skeleton variant="line" className="h-6 w-1/4" />
        <Skeleton variant="rectangle" height="80px" />
        <Skeleton variant="rectangle" height="80px" />
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-bg-secondary/80 border-border-color text-left space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-color/60 pb-4">
        <div>
          <h3 className="text-base font-bold uppercase text-text-primary">
            Публікації та Новини
          </h3>
          <p className="text-xs text-text-muted mt-1">
            Керуйте статями, новинами та анонсами вашої організації.
          </p>
        </div>

        {canManage && (
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={onCreateClick}
          >
            Створити допис
          </Button>
        )}
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-border-color rounded-xl bg-bg-primary/40 space-y-3">
          <p className="text-sm text-text-muted">
            У вашої організації ще немає опублікованих статей чи дописів.
          </p>
          {canManage && (
            <Button
              variant="outline"
              size="sm"
              icon={Plus}
              onClick={onCreateClick}
            >
              Написати перший допис
            </Button>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border-color text-text-muted uppercase text-[10px] font-bold tracking-wider">
                <th className="py-3 px-4">Публікація</th>
                <th className="py-3 px-4">Категорія</th>
                <th className="py-3 px-4">Дата</th>
                <th className="py-3 px-4">Статус</th>
                {canManage && <th className="py-3 px-4 text-right">Дії</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-border-color/40">
              {posts.map((post) => {
                const isDraft = post.status === "draft";
                const createdDate = post.createdAt
                  ? new Date(post.createdAt).toLocaleDateString("uk-UA")
                  : "—";

                return (
                  <tr
                    key={post._id}
                    className="hover:bg-bg-primary/50 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-medium text-text-primary max-w-xs truncate">
                      <div className="font-bold text-sm truncate">
                        {post.title}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-text-secondary">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-bg-primary border border-border-color/60 text-[11px] font-mono">
                        <Tag size={10} className="text-brand" />
                        {post.category || "Загальне"}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-text-muted font-mono whitespace-nowrap">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {createdDate}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      {isDraft ? (
                        <Badge status="default">Чернетка</Badge>
                      ) : (
                        <Badge status="success">Опубліковано</Badge>
                      )}
                    </td>

                    {canManage && (
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {!isDraft && (
                            <a
                              href={`/posts/${post._id}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 text-text-muted hover:text-brand hover:bg-bg-primary rounded-lg transition-colors"
                              title="Переглянути на сайті"
                            >
                              <Eye size={15} />
                            </a>
                          )}

                          <button
                            type="button"
                            onClick={() => onEditClick?.(post)}
                            className="p-1.5 text-text-muted hover:text-brand hover:bg-bg-primary rounded-lg transition-colors"
                            title="Редагувати"
                          >
                            <Edit size={15} />
                          </button>

                          <button
                            type="button"
                            onClick={() => onDeleteClick?.(post._id)}
                            className="p-1.5 text-text-muted hover:text-red-500 hover:bg-bg-primary rounded-lg transition-colors"
                            title="Видалити"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
