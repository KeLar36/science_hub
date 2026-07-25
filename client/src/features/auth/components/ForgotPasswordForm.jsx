import React, { useState } from "react";
import { Mail, Send } from "lucide-react";
import Input from "@/shared/ui/Input";
import Button from "@/shared/ui/Button";

export default function ForgotPasswordForm({
  onSubmit,
  isSubmitting,
  onBackToLoginClick,
}) {
  const [email, setEmail] = useState("");

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
