import Button from "@/shared/ui/Button";
import { Save, FileText } from "lucide-react";

export default function PostContentPanel({
  isEdit,
  currentStatus,
  onPublish,
  onSaveDraft,
  isLoading,
}) {
  return (
    <div className="flex items-center justify-end gap-3 py-4 border-t border-border-color bg-transparent">
      {(!isEdit || currentStatus === "draft") && (
        <Button
          variant="outline"
          size="md"
          isLoading={isLoading}
          icon={Save}
          onClick={onSaveDraft}
        >
          {isEdit ? "Зберегти чернетку" : "В чернетки"}
        </Button>
      )}

      <Button
        variant="primary"
        size="md"
        isLoading={isLoading}
        icon={FileText}
        onClick={onPublish}
      >
        {isEdit ? "Зберегти зміни" : "Опублікувати"}
      </Button>
    </div>
  );
}
