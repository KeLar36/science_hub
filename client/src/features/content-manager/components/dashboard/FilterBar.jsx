import { Search } from "lucide-react";
import Input from "@/shared/ui/Input";
import Select from "@/shared/ui/Select";

export default function FilterBar({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
}) {
  const statusOptions = [
    { value: "", label: "Всі статуси" },
    { value: "published", label: "Опубліковані" },
    { value: "draft", label: "Чернетки" },
  ];

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-between items-end mb-6 bg-bg-secondary p-4 rounded-lg border border-border-color">
      <div className="w-full sm:w-80">
        <Input
          id="search-posts"
          label="Пошук публікацій"
          placeholder="Введіть назву статті..."
          icon={Search}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="w-full sm:w-52">
        <Select
          id="status-filter"
          label="Статус"
          options={statusOptions}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        />
      </div>
    </div>
  );
}
