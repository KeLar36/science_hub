import React, { useMemo } from "react";
import {
  SCIENTIFIC_DOMAINS,
  PROGRAM_TYPES,
} from "@/shared/lib/constants/domains";
import { Search } from "lucide-react";
import Input from "@/shared/ui/Input";
import Select from "@/shared/ui/Select";

export default function FilterBarPrograms({ filters, setFilters, setPage }) {
  const typeOptions = useMemo(
    () => [
      { label: "Всі типи конкурсу", value: "Всі типи" },
      ...PROGRAM_TYPES.map((type) => ({ label: type, value: type })),
    ],
    [],
  );

  const domainOptions = useMemo(
    () => [
      { label: "Всі галузі науки", value: "Всі галузі" },
      ...SCIENTIFIC_DOMAINS.map((domain) => ({ label: domain, value: domain })),
    ],
    [],
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-bg-secondary p-4 rounded-xl border border-border-color shadow-sm">
      <div className="md:col-span-2">
        <Input
          placeholder="Пошук конкурсу за ключовими словами..."
          icon={Search}
          value={filters.search}
          onChange={(e) => ("search", e.target.value)}
        />
      </div>

      <div>
        <Select
          options={typeOptions}
          value={filters.type}
          onChange={(e) => ("type", e.target.value)}
        />
      </div>

      <div>
        <Select
          options={domainOptions}
          value={filters.domain}
          onChange={(e) => ("domain", e.target.value)}
        />
      </div>
    </div>
  );
}
