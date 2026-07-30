import React, { useState } from "react";
import {
  AlertTriangle,
  Flame,
  Trash2,
  ShieldAlert,
  Building2,
  BookOpen,
} from "lucide-react";
import Card from "@/shared/ui/Card";
import Button from "@/shared/ui/Button";
import Alert from "@/shared/ui/Alert";
import Input from "@/shared/ui/Input";
import { adminApi } from "@/features/admin/api/adminApi";

export default function SuperadminDangerZoneTab() {
  const [feedback, setFeedback] = useState({ type: null, message: "" });
  const [loading, setLoading] = useState(false);

  const [cleanupProgramId, setCleanupProgramId] = useState("");
  const [deleteOrgId, setDeleteOrgId] = useState("");

  const showFeedback = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback({ type: null, message: "" }), 6000);
  };

  const handleForceCleanupProgram = async () => {
    if (!cleanupProgramId.trim()) {
      return showFeedback("danger", "Вкажіть ID програми!");
    }

    if (
      !confirm(
        `УВАГА! Ви дійсно бажаєте примусово закрити програму (${cleanupProgramId}) та видалити всі неприйняті файли з Cloudinary?`,
      )
    ) {
      return;
    }

    setLoading(true);
    try {
      const res = await adminApi.forceCleanupProgram(cleanupProgramId.trim());
      showFeedback(
        "success",
        res?.message || "Програму успішно закрито, чернетки очищено.",
      );
      setCleanupProgramId("");
    } catch (err) {
      showFeedback(
        "danger",
        err.response?.data?.message ||
          "Не вдалося виконати примусове очищення.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOrganization = async () => {
    if (!deleteOrgId.trim()) {
      return showFeedback("danger", "Вкажіть ID організації!");
    }

    if (
      !confirm(
        `НЕБЕЗПЕКА! Це незворотна дія! Видалення установи (${deleteOrgId}) знищить її медіа-блог, програму, логотипи та скине ролі учасників! Продовжити?`,
      )
    ) {
      return;
    }

    setLoading(true);
    try {
      const res = await adminApi.deleteOrganizationCascade(deleteOrgId.trim());
      showFeedback(
        "success",
        res?.message || "Установу каскадно видалено з системи.",
      );
      setDeleteOrgId("");
    } catch (err) {
      showFeedback(
        "danger",
        err.response?.data?.message || "Не вдалося видалити установу.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-left">
      {feedback.type && (
        <Alert
          variant={feedback.type}
          onClose={() => setFeedback({ type: null, message: "" })}
        >
          {feedback.message}
        </Alert>
      )}

      <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-500 text-xs font-mono">
        <ShieldAlert size={24} className="shrink-0" />
        <div>
          <strong className="block text-sm font-bold">
            Зона високої відповідальності (Superadmin Only)
          </strong>
          Операції в цьому розділі призводять до незворотного видалення
          ресурсів, файлів з хмари Cloudinary та скидання прав користувачів.
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 space-y-4 border-amber-500/30 bg-bg-secondary/40">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shrink-0">
              <Flame size={20} />
            </div>
            <div>
              <h3 className="font-bold text-sm text-text-primary font-mono">
                Program Force Cleanup
              </h3>
              <p className="text-xs text-text-muted mt-0.5">
                Закриває програму/грант та примусово видаляє з Cloudinary всі
                файли робіт, які не отримали статус "Прийнято".
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <Input
              placeholder="Вкажіть ID програми (MongoDB ObjectId)..."
              value={cleanupProgramId}
              onChange={(e) => setCleanupProgramId(e.target.value)}
              disabled={loading}
            />
            <Button
              variant="outline"
              size="sm"
              icon={Flame}
              onClick={handleForceCleanupProgram}
              disabled={loading || !cleanupProgramId.trim()}
              className="w-full text-xs text-amber-500 border-amber-500/40 hover:bg-amber-500/10"
            >
              Запустити Cleanup Програми
            </Button>
          </div>
        </Card>

        <Card className="p-6 space-y-4 border-red-500/30 bg-bg-secondary/40">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 shrink-0">
              <Trash2 size={20} />
            </div>
            <div>
              <h3 className="font-bold text-sm text-text-primary font-mono">
                Organization Cascade Delete
              </h3>
              <p className="text-xs text-text-muted mt-0.5">
                Повністю стирає установу, її медіа-блог, коментарі, логотипи,
                програми та скидає ролі всіх членів на "user".
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <Input
              placeholder="Вкажіть ID організації (MongoDB ObjectId)..."
              value={deleteOrgId}
              onChange={(e) => setDeleteOrgId(e.target.value)}
              disabled={loading}
            />
            <Button
              variant="outline"
              size="sm"
              icon={Trash2}
              onClick={handleDeleteOrganization}
              disabled={loading || !deleteOrgId.trim()}
              className="w-full text-xs text-red-500 border-red-500/40 hover:bg-red-500/10"
            >
              Каскадно видалити Установу
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
