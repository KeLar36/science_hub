import { useState } from "react";
import PostContentAssets from "@/features/content-manager/components/post-form/PostContentAssets";
import PostContentForm from "@/features/content-manager/components/post-form/PostContentForm";
import PostContentPanel from "@/features/content-manager/components/post-form/PostContentPanel";
import Alert from "@/shared/ui/Alert";
import Card from "@/shared/ui/Card";

export default function CreatePostForm({
  initialData = null,
  onSubmit,
  onSuccess,
  isLoading = false,
}) {
  const isEdit = Boolean(initialData?._id);

  const getInitialValues = (data) => ({
    title: data?.title || "",
    content: data?.content || "",
    category: data?.category || "Інтерв'ю",
    status: data?.status || "published",
    existingCover: data?.coverImage || "",
    file: [],
  });

  const [formData, setFormData] = useState(() => getInitialValues(initialData));
  const [prevInitialData, setPrevInitialData] = useState(initialData);

  if (initialData !== prevInitialData) {
    setPrevInitialData(initialData);
    setFormData(getInitialValues(initialData));
  }

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const showError = (msg) => {
    setError(msg);
    setTimeout(() => {
      setError(null);
    }, 5000);
  };

  const handleAction = async (targetStatus) => {
    setSubmitting(true);
    setError(null);

    const payload = {
      title: formData.title,
      content: formData.content,
      category: formData.category,
      status: targetStatus,
      file: formData.file,
    };

    try {
      const res = await onSubmit(payload);
      if (res?.success) {
        onSuccess?.();
      } else {
        showError(res?.error || "Не вдалося зберегти публікацію");
      }
    } catch {
      showError("Сталася неочікувана помилка при збереженні");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="p-6 bg-bg-secondary/80 border-border-color text-left space-y-6">
      <div className="border-b border-border-color/60 pb-4">
        <h3 className="text-base font-bold uppercase text-text-primary">
          {isEdit
            ? formData.status === "draft"
              ? "Редагування чернетки"
              : "Редагування публікації"
            : "Створення нової публікації"}
        </h3>
        <p className="text-xs text-text-muted mt-1">
          Заповніть інформацію, завантажте обкладинку та підготуйте текст
          статті.
        </p>
      </div>

      {error && (
        <Alert variant="danger" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <div className="space-y-6">
        <PostContentAssets
          title={formData.title}
          setTitle={(val) => setFormData((prev) => ({ ...prev, title: val }))}
          category={formData.category}
          setCategory={(val) =>
            setFormData((prev) => ({ ...prev, category: val }))
          }
          file={formData.file}
          setFile={(val) => setFormData((prev) => ({ ...prev, file: val }))}
          existingCover={formData.existingCover}
        />

        <PostContentForm
          content={formData.content}
          setContent={(val) =>
            setFormData((prev) => ({ ...prev, content: val }))
          }
        />

        <PostContentPanel
          isEdit={isEdit}
          currentStatus={formData.status}
          isLoading={submitting || isLoading}
          onPublish={() => handleAction("published")}
          onSaveDraft={() => handleAction("draft")}
        />
      </div>
    </Card>
  );
}
