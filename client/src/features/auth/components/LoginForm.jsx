import React, { useState, useEffect } from "react";
import { Mail, Lock } from "lucide-react";
import Input from "@/shared/ui/Input";
import Button from "@/shared/ui/Button";
import Alert from "@/shared/ui/Alert";

export default function LoginForm({
  onSubmit,
  isSubmitting,
  error,
  clearError,
  onForgotPasswordClick,
}) {
  const [email, setEmail] = useState(() => {
    const saved = localStorage.getItem("registeredEmail");
    if (saved) {
      localStorage.removeItem("registeredEmail");
      return saved;
    }
    return "";
  });
  const [password, setPassword] = useState("");

  const [regSuccessMessage, setRegSuccessMessage] = useState(() => {
    const success = localStorage.getItem("registrationSuccess");
    if (success) {
      localStorage.removeItem("registrationSuccess");
      return success;
    }
    return null;
  });

  useEffect(() => {
    if (regSuccessMessage) {
      const timer = setTimeout(() => setRegSuccessMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [regSuccessMessage]);

  useEffect(() => {
    if (error && clearError) {
      const timer = setTimeout(() => clearError(), 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(email, password);
  };

  return (
    <div className="animate-reveal w-full space-y-5">
      {regSuccessMessage && (
        <Alert
          variant="success"
          title="Обліковий запис створено"
          onClose={() => setRegSuccessMessage(null)}
        >
          {regSuccessMessage}
        </Alert>
      )}

      {error && (
        <Alert variant="danger" title="Помилка входу" onClose={clearError}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Електронна пошта"
          id="login-email"
          type="email"
          placeholder="name@university.edu"
          icon={Mail}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div className="space-y-1">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] uppercase tracking-wider text-text-muted font-mono">
              Пароль
            </span>
            <button
              type="button"
              onClick={onForgotPasswordClick}
              className="text-[10px] font-bold text-brand hover:text-brand-hover hover:underline tracking-wide transition-colors bg-transparent border-none cursor-pointer"
            >
              Відновити доступ
            </button>
          </div>
          <Input
            id="login-password"
            type="password"
            placeholder="••••••••"
            icon={Lock}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full py-3.5 text-xs font-bold uppercase tracking-widest font-mono mt-2"
          isLoading={isSubmitting}
        >
          Увійти в систему
        </Button>
      </form>
    </div>
  );
}
