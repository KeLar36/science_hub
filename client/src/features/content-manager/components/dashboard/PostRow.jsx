import React from "react";
import { TableRow, TableCell } from "@/shared/ui/Table";
import Avatar from "@/shared/ui/Avatar";
import Badge from "@/shared/ui/Badge";
import Button from "@/shared/ui/Button";

export function PostRow({ post, onEdit, onDelete, onPublish }) {
  const getBadgeStatus = (status) => {
    if (status === "published") return "success";
    if (status === "draft") return "warning";
    return "default";
  };

  return (
    <TableRow>
      <TableCell className="font-medium text-text-primary max-w-xs truncate">
        {post.title}
      </TableCell>

      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar
            src={post.authorId?.image}
            name={post.authorId?.name}
            size="sm"
          />
          <span className="text-text-secondary text-xs">
            {post.authorId?.name || "Невідомий"}
          </span>
        </div>
      </TableCell>

      <TableCell className="font-mono text-xs text-text-muted">
        {new Date(post.createdAt).toLocaleDateString("uk-UA")}
      </TableCell>

      <TableCell>
        <Badge status={getBadgeStatus(post.status)}>{post.status}</Badge>
      </TableCell>

      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => onEdit(post._id)}>
            Редагувати
          </Button>

          {post.status === "draft" && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onPublish(post._id)}
            >
              Опублікувати
            </Button>
          )}

          <Button variant="danger" size="sm" onClick={() => onDelete(post._id)}>
            Видалити
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
