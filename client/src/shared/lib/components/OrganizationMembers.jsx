import React, { useState } from "react";
import { Shield, UserMinus } from "lucide-react";
import Skeleton from "@/shared/ui/Skeleton";
import Badge from "@/shared/ui/Badge";
import Button from "@/shared/ui/Button";
import Avatar from "@/shared/ui/Avatar";
import Alert from "@/shared/ui/Alert";
import { Table, TableRow, TableCell } from "@/shared/ui/Table";

export default function OrganizationMembers({
  members = [],
  loading = false,
  isOrgAdmin = false,
  currentUserId,
  creatorId,
  onOpenRoleModal,
  onKickMember,
}) {
  const [feedback, setFeedback] = useState({ type: null, message: "" });

  const handleKick = async (memberId, memberName) => {
    if (!confirm(`Ви дійсно бажаєте виключити ${memberName} з організації?`)) {
      return;
    }

    try {
      const result = await onKickMember?.(memberId);

      if (result?.success) {
        setFeedback({
          type: "success",
          message:
            result.message || `Користувача ${memberName} успішно виключено.`,
        });
      } else {
        setFeedback({
          type: "danger",
          message: result?.error || "Не вдалося виключити користувача.",
        });
      }
    } catch (err) {
      setFeedback({
        type: "danger",
        message: "Сталася непередбачувана помилка при виключенні.",
      });
    }

    setTimeout(() => {
      setFeedback({ type: null, message: "" });
    }, 5000);
  };

  if (loading) return <Skeleton variant="rectangle" height="200px" />;

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

      <Table headers={["Користувач", "Роль в установі", "Дії"]}>
        {members.map((member) => {
          const memberId = member._id?.toString();
          const currentId = currentUserId?.toString();
          const ownerId = (creatorId?._id || creatorId)?.toString();

          const canKick =
            isOrgAdmin && memberId !== currentId && memberId !== ownerId;

          return (
            <TableRow key={member._id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar src={member.image} name={member.name} size="sm" />
                  <span className="font-bold text-xs text-text-primary">
                    {member.name}
                  </span>
                </div>
              </TableCell>

              <TableCell>
                <Badge
                  status={
                    member.role === "admin"
                      ? "warning"
                      : member.role === "reviewer"
                        ? "success"
                        : member.role === "superadmin"
                          ? "primary"
                          : "default"
                  }
                >
                  {member.role === "admin"
                    ? "Адміністратор"
                    : member.role === "reviewer"
                      ? "Рецензент"
                      : member.role === "content-manager"
                        ? "Контент-менеджер"
                        : member.role === "superadmin"
                          ? "Суперадмін"
                          : "Дослідник"}
                </Badge>
              </TableCell>

              <TableCell>
                <div className="flex items-center gap-2">
                  {isOrgAdmin && (
                    <Button
                      variant="outline"
                      size="sm"
                      icon={Shield}
                      onClick={() => onOpenRoleModal?.(member)}
                    >
                      Змінити роль
                    </Button>
                  )}

                  {canKick && (
                    <Button
                      variant="outline"
                      size="sm"
                      icon={UserMinus}
                      onClick={() => handleKick(member._id, member.name)}
                      className="border-red-500/30 text-red-500 hover:bg-red-500/10 hover:border-red-500/50 text-xs"
                    >
                      Виключити
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
