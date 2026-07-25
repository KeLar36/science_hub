import React from "react";
import { UserCheck, Check, X, Clock } from "lucide-react";
import Card from "@/shared/ui/Card";
import Skeleton from "@/shared/ui/Skeleton";
import Button from "@/shared/ui/Button";
import Avatar from "@/shared/ui/Avatar";
import { Table, TableRow, TableCell } from "@/shared/ui/Table";

export default function OrganizationJoinRequests({
  requests = [],
  loading = false,
  actionLoading = false,
  onAccept,
  onReject,
}) {
  if (loading) return <Skeleton variant="rectangle" height="200px" />;

  if (requests.length === 0) {
    return (
      <Card className="p-8 text-center space-y-2 bg-bg-secondary/40">
        <UserCheck className="mx-auto text-text-muted" size={32} />
        <p className="text-xs font-mono text-text-muted">
          Немає нових заявок на вступ.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Table headers={["Кандидат", "Дата заявки", "Рішення"]}>
        {requests.map((reqItem) => (
          <TableRow key={reqItem._id}>
            <TableCell>
              <div className="flex items-center gap-3">
                <Avatar
                  src={reqItem.user?.image}
                  name={reqItem.user?.name}
                  size="sm"
                />
                <div>
                  <div className="font-bold text-xs text-text-primary">
                    {reqItem.user?.name}
                  </div>
                  <div className="text-[10px] font-mono text-text-muted">
                    {reqItem.user?.email}
                  </div>
                </div>
              </div>
            </TableCell>

            <TableCell>
              <span className="text-xs font-mono flex items-center gap-1">
                <Clock size={12} />
                {new Date(reqItem.createdAt).toLocaleDateString()}
              </span>
            </TableCell>

            <TableCell>
              <div className="flex items-center gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  icon={Check}
                  disabled={actionLoading}
                  onClick={() => onAccept(reqItem.user?._id)}
                >
                  Прийняти
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  icon={X}
                  disabled={actionLoading}
                  onClick={() => onReject(reqItem.user?._id)}
                >
                  Відхилити
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </Table>
    </div>
  );
}
