import React, { useState, useEffect } from "react";
import { Lock, CheckCircle2, ArrowRight } from "lucide-react";
import Input from "@/shared/ui/Input";
import Button from "@/shared/ui/Button";
import Alert from "@/shared/ui/Alert";

export default function ResetPasswordForm({
  onSubmit,
  isSubmitting,
  isSuccess,
  error,
  clearError,
  onBackToLoginClick,
}) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const passwordError =
    confirmPassword && password !== confirmPassword
      ? "Паролі не збігаються"
      : "";

  useEffect(() => {
    if (error && clearError) {
      const timer = setTimeout(() => clearError(), 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (passwordError || password.length < 8) return;
    onSubmit(password);
  };

  if (isSuccess) {
    return (
      <div className="text-center animate-reveal w-full py-4">
        <div className="w-12 h-12 bg-status-success/10 text-status-success flex items-center justify-center mx-auto mb-5 border border-status-success/20 rounded">
          <CheckCircle2 size={24} />
        </div>
        <h2 className="text-xl font-bold tracking-tight text-text-primary uppercase font-display mb-2">
          Пароль оновлено
        </h2>
        <p className="text-text-muted text-[10px] font-mono uppercase tracking-wider mb-6 leading-relaxed">
          Ваш доступ успішно відновлено
        </p>
        <button
          type="button"
          onClick={onBackToLoginClick}
          className="inline-flex items-center gap-2 text-brand font-bold text-[10px] uppercase tracking-widest hover:text-brand-hover transition-colors font-mono bg-transparent border-none cursor-pointer"
        >
          Увійти в систему <ArrowRight size={12} />
        </button>
      </div>
    );
  }

  return (
    <div className="animate-reveal w-full space-y-5">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-text-primary uppercase font-display">
          Новий пароль
        </h2>
        <p className="text-text-muted text-[10px] font-mono uppercase tracking-wider mt-1">
          Встановіть новий захисний ключ доступу
        </p>
      </div>

      {error && (
        <Alert variant="danger" title="Помилка збереження" onClose={clearError}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Новий пароль"
          id="reset-password"
          type="password"
          placeholder="••••••••"
          icon={Lock}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div className="space-y-1.5">
          <Input
            label="Підтвердження пароля"
            id="reset-confirm"
            type="password"
            placeholder="••••••••"
            icon={Lock}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className={
              passwordError
                ? "border-status-error focus:border-status-error"
                : ""
            }
          />
          {passwordError && (
            <p className="text-[10px] text-status-error font-bold uppercase font-mono tracking-tight mt-1">
              {passwordError}
            </p>
          )}
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full py-3.5 text-xs font-bold uppercase tracking-widest font-mono mt-2"
          isLoading={isSubmitting}
          disabled={!!passwordError || password.length < 8}
        >
          Оновити доступ
        </Button>
      </form>
    </div>
  );
}
