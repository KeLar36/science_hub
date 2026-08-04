import React, { useState, useEffect } from "react";
import { Mail, Send } from "lucide-react";
import Input from "@/shared/ui/Input";
import Button from "@/shared/ui/Button";
import Alert from "@/shared/ui/Alert";

export default function ForgotPasswordForm({
  onSubmit,
  isSubmitting,
  error,
  clearError,
  successMessage,
  clearSuccess,
  onBackToLoginClick,
}) {
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (error && clearError) {
      const timer = setTimeout(() => clearError(), 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  useEffect(() => {
    if (successMessage && clearSuccess) {
      const timer = setTimeout(() => clearSuccess(), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, clearSuccess]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(email);
  };

  return (
    <div className="animate-reveal w-full">
      <div className="mb-6">
        <h2 className="text-xl font-bold tracking-tight text-text-primary uppercase font-display">
          Відновлення доступу
        </h2>
        <p className="text-text-muted text-[10px] font-mono uppercase tracking-wider mt-1 leading-relaxed">
          Введіть адресу пошти для отримання інструкцій
        </p>
      </div>

      <div className="space-y-5">
        {error && (
          <Alert variant="danger" title="Помилка" onClose={clearError}>
            {error}
          </Alert>
        )}

        {successMessage && (
          <Alert
            variant="success"
            title="Лист надіслано"
            onClose={clearSuccess}
          >
            {successMessage}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Електронна адреса"
            id="forgot-email"
            type="email"
            placeholder="your-email@science.com"
            icon={Mail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Button
            type="submit"
            variant="primary"
            className="w-full py-3.5 text-xs font-bold uppercase tracking-widest font-mono mt-2"
            isLoading={isSubmitting}
            icon={Send}
          >
            Надіслати запит
          </Button>
        </form>
      </div>

      <div className="mt-6 pt-5 border-t border-border-color/60 text-center">
        <button
          type="button"
          onClick={onBackToLoginClick}
          className="text-[10px] font-mono text-text-muted hover:text-brand uppercase tracking-wider transition-colors bg-transparent border-none cursor-pointer"
        >
          Повернутися до авторизації
        </button>
      </div>
    </div>
  );
}
