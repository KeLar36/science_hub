import React, { useState, useMemo, useEffect } from "react";
import { User, Mail, Lock, ChevronDown, Check } from "lucide-react";
import { UKRAINIAN_CITIES } from "@/shared/lib/constants/cities";
import { SCIENTIFIC_DOMAINS } from "@/shared/lib/constants/domains";
import Input from "@/shared/ui/Input";
import Button from "@/shared/ui/Button";
import Dropdown from "@/shared/ui/DropDown";
import Combobox from "@/shared/ui/Combobox";
import Alert from "@/shared/ui/Alert";

export default function RegisterForm({
  onSubmit,
  isSubmitting,
  error,
  clearError,
}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    city: "",
    domain: "Інше",
  });

  const sortedCities = useMemo(() => {
    return [...UKRAINIAN_CITIES].sort((a, b) => a.localeCompare(b, "uk"));
  }, []);

  useEffect(() => {
    if (error && clearError) {
      const timer = setTimeout(() => clearError(), 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const domainDropdownItems = useMemo(() => {
    return SCIENTIFIC_DOMAINS.map((domain) => ({
      label: domain,
      icon: formData.domain === domain ? Check : null,
      onClick: () => handleChange("domain", domain),
    }));
  }, [formData.domain]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="animate-reveal w-full space-y-5">
      {error && (
        <Alert variant="danger" title="Помилка реєстрації" onClose={clearError}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Повне ім'я (ПІБ науковця)"
          id="reg-name"
          placeholder="проф. Мельник Д. В."
          icon={User}
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Input
            label="Електронна пошта"
            id="reg-email"
            type="email"
            placeholder="name@university.edu"
            icon={Mail}
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            required
          />

          <Combobox
            label="Локація (Місто)"
            options={sortedCities}
            value={formData.city}
            onChange={(value) => handleChange("city", value)}
            placeholder="Оберіть місто"
            searchPlaceholder="Почніть вводити назву міста..."
            required
          />
        </div>

        <div className="space-y-1.5 flex flex-col items-stretch">
          <label className="text-[10px] uppercase tracking-wider text-text-muted font-mono block">
            Основна наукова галузь знань
          </label>
          <Dropdown
            className="w-full max-h-60 overflow-y-auto left-0 right-auto"
            trigger={() => (
              <div className="w-full flex items-center justify-between bg-bg-tertiary border border-border-color rounded px-3.5 py-2.5 text-sm transition-all duration-150 hover:border-brand/40 text-left cursor-pointer group">
                <span className="text-text-primary">{formData.domain}</span>
                <ChevronDown
                  size={16}
                  className="text-text-muted group-hover:text-brand transition-colors"
                />
              </div>
            )}
            items={domainDropdownItems}
          />
        </div>

        <Input
          label="Пароль доступу"
          id="reg-password"
          type="password"
          placeholder="••••••••"
          icon={Lock}
          value={formData.password}
          onChange={(e) => handleChange("password", e.target.value)}
          required
        />

        <Button
          type="submit"
          variant="primary"
          className="w-full py-3.5 text-xs font-bold uppercase tracking-widest font-mono mt-3"
          isLoading={isSubmitting}
        >
          Зареєструвати аккаунт
        </Button>
      </form>
    </div>
  );
}
