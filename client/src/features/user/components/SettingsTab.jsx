import React, { useState } from "react";
import { Trash2, AlertTriangle, X } from "lucide-react";
import Card from "@/shared/ui/Card";
import Button from "@/shared/ui/Button";
import Alert from "@/shared/ui/Alert";

export default function SettingsTab({ onDeleteAccount }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);

  const showError = (msg) => {
    setError(msg);
    setTimeout(() => {
      setError(null);
    }, 5000);
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      setError(null);

      const res = await onDeleteAccount?.();

      if (res && res.success === false) {
        showError(res.error || "Не вдалося видалити акаунт.");
      }
    } catch (err) {
      const serverError =
        err?.response?.data?.error ||
        err?.message ||
        "Не вдалося видалити акаунт. Спробуйте пізніше.";
      showError(serverError);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-4 text-left">
      {error && (
        <Alert
          variant="danger"
          onClose={() => setError(null)}
          className="animate-in fade-in slide-in-from-top-1"
        >
          {error}
        </Alert>
      )}

      <Card className="border-red-500/30 bg-red-500/5 space-y-4">
        <div className="space-y-1">
          <h3 className="text-xs font-bold font-mono text-red-500 uppercase tracking-wider">
            // Небезпечна зона (Danger Zone)
          </h3>
          <p className="text-xs text-text-muted leading-relaxed">
            Видалення акаунту призведе до незворотного вилучення або
            анонімізації ваших даних.
          </p>
        </div>

        {!showConfirm ? (
          <Button
            variant="danger"
            size="sm"
            icon={Trash2}
            onClick={() => {
              setError(null);
              setShowConfirm(true);
            }}
          >
            Видалити мій акаунт
          </Button>
        ) : (
          <div className="p-3.5 border border-red-500/40 bg-red-500/10 rounded-lg space-y-3 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="text-xs font-bold text-red-500 block">
                  Ви абсолютно впевнені?
                </span>
                <p className="text-[11px] text-text-secondary leading-snug">
                  Ця дія є остаточною. Ви втратите доступ до своїх публікацій,
                  поданих проектів та налаштувань.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <Button
                variant="danger"
                size="sm"
                icon={Trash2}
                isLoading={deleting}
                onClick={handleDelete}
              >
                Так, видалити
              </Button>
              <Button
                variant="outline"
                size="sm"
                icon={X}
                disabled={deleting}
                onClick={() => setShowConfirm(false)}
              >
                Скасувати
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
