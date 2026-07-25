import { Trash2 } from "lucide-react";
import { useAuth } from "@/shared/lib/hooks/useAuth";
import Avatar from "@/shared/ui/Avatar";
import Badge from "@/shared/ui/Badge";
import Button from "@/shared/ui/Button";

export default function CommentCard({ comment, post, onDelete, isDeleting }) {
  const { user: currentUser } = useAuth();

  const commentAuthorId = comment.userId?._id || comment.userId;
  const currentUserId = currentUser?.id;
  const currentUserRole = currentUser?.role;

  const isOwner =
    currentUserId && commentAuthorId?.toString() === currentUserId?.toString();
  const isSuper = currentUserRole === "superadmin";
  const isAdminOfThisOrg =
    currentUserRole === "admin" &&
    post?.organizationId?._id?.toString() ===
      currentUser?.organizationId?.toString();

  const canDelete = isOwner || isSuper || isAdminOfThisOrg;

  const formattedDate = comment.createdAt
    ? new Date(comment.createdAt).toLocaleDateString("uk-UA", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <div className="flex items-start gap-3.5 p-4 rounded-lg bg-bg-secondary border border-border-color/60 text-left animate-in fade-in duration-200">
      <Avatar
        src={comment.userId?.image}
        name={comment.userId?.name || "Користувач"}
        size="sm"
      />

      <div className="flex-1 space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-text-primary">
              {comment.userId?.name || "Науковець"}
            </span>

            {comment.userId?.role && (
              <Badge
                status={
                  comment.userId.role === "superadmin" ? "danger" : "default"
                }
              >
                {comment.userId.role}
              </Badge>
            )}
          </div>

          <Badge
            status="default"
            className="!bg-bg-primary/40 font-mono text-[9px]"
          >
            {formattedDate}
          </Badge>
        </div>

        <p className="text-xs text-text-secondary leading-relaxed break-words whitespace-pre-line">
          {comment.text}
        </p>
      </div>

      {canDelete && (
        <Button
          variant="danger"
          size="sm"
          isLoading={isDeleting}
          icon={Trash2}
          onClick={() => onDelete(comment._id)}
          className="!p-1.5 !h-auto shrink-0"
          title="Видалити коментар модератором"
        />
      )}
    </div>
  );
}
