import React, { useState, useEffect } from "react";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Send,
} from "lucide-react";
import Modal from "@/shared/ui/Modal";
import Select from "@/shared/ui/Select";
import TextArea from "@/shared/ui/TextArea";
import Input from "@/shared/ui/Input";
import Button from "@/shared/ui/Button";
import Alert from "@/shared/ui/Alert";
import { reviewerApi } from "../api/reviewerApi";

const reviewActionOptions = [
  { label: "В процесі перевірки", value: "in_progress" },
  { label: "На доопрацюванні (повернути автору)", value: "needs_revision" },
  { label: "Прийняти роботу (Схвалити)", value: "approved" },
  { label: "Відхилити роботу", value: "rejected" },
];

export default function ReviewFormModal({
  isOpen,
  onClose,
  project,
  onSuccess,
}) {
  const [selectedAction, setSelectedAction] = useState("in_progress");
  const [reviewerComments, setReviewerComments] = useState("");
  const [reviewerRecommendation, setReviewerRecommendation] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && project) {
      if (project.status === "Прийнято") setSelectedAction("approved");
      else if (project.status === "Відхилено") setSelectedAction("rejected");
      else if (
        project.status === "На доопрацюванні" ||
        project.reviewStatus === "На доопрацюванні"
      )
        setSelectedAction("needs_revision");
      else setSelectedAction("in_progress");

      setReviewerComments(project.reviewerComments || "");
      setReviewerRecommendation(project.reviewerRecommendation || "");
      setError(null);
    }
  }, [isOpen, project]);

  if (!project) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reviewerComments.trim()) {
      setError("Будь ласка, вкажіть коментар чи зауваження рецензента!");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      let targetStatus = project.status;
      let targetReviewStatus = project.reviewStatus || "В процесі";

      switch (selectedAction) {
        case "approved":
          targetStatus = "Прийнято";
          targetReviewStatus = "Завершено";
          break;
        case "rejected":
          targetStatus = "Відхилено";
          targetReviewStatus = "Завершено";
          break;
        case "needs_revision":
          targetStatus = "На доопрацюванні";
          targetReviewStatus = "На доопрацюванні";
          break;
        case "in_progress":
        default:
          targetStatus = "На розгляді";
          targetReviewStatus = "В процесі";
          break;
      }

      const payload = {
        reviewStatus: targetReviewStatus,
        status: targetStatus,
        reviewerComments: reviewerComments.trim(),
        reviewerRecommendation: reviewerRecommendation.trim(),
      };

      await reviewerApi.submitReview(project._id, payload);

      onSuccess?.();
      onClose();
    } catch (err) {
      console.error("Помилка при збереженні рецензії:", err);
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Не вдалося зберегти рецензію",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusNotice = () => {
    switch (selectedAction) {
      case "approved":
        return {
          icon: CheckCircle2,
          color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
          text: "Робота буде схвалена та перенесена в прийняті матеріали. Чат з автором буде переведено в режим перегляду.",
        };
      case "needs_revision":
        return {
          icon: AlertTriangle,
          color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
          text: "Автор отримає можливість завантажити виправлену версію файлу з урахуванням ваших зауважень.",
        };
      case "rejected":
        return {
          icon: XCircle,
          color: "text-rose-500 bg-rose-500/10 border-rose-500/20",
          text: "Робота буде остаточно відхилена. Доступ до подальшого редагування матеріалів для автора буде закрито.",
        };
      default:
        return {
          icon: Clock,
          color: "text-blue-500 bg-blue-500/10 border-blue-500/20",
          text: "Робота перебуває на етапі активного перегляду та рецензування.",
        };
    }
  };

  const NoticeInfo = getStatusNotice();
  const NoticeIcon = NoticeInfo.icon;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Рецензування праці: ${project.title}`}
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        {error && (
          <Alert variant="danger" onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <div
          className={`p-3 rounded-xl border flex items-start gap-2.5 text-xs font-mono transition-colors duration-200 ${NoticeInfo.color}`}
        >
          <NoticeIcon size={18} className="shrink-0 mt-0.5" />
          <span>{NoticeInfo.text}</span>
        </div>

        <div>
          <Select
            label="Прийняте рішення за проєктом"
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value)}
            options={reviewActionOptions}
          />
        </div>

        <div>
          <Input
            label="Підсумкова рекомендація (опціонально)"
            placeholder="Наприклад: 'Рекомендовано до публікації' або 'Потрібна виправка методології'"
            value={reviewerRecommendation}
            onChange={(e) => setReviewerRecommendation(e.target.value)}
          />
        </div>

        <div>
          <TextArea
            label="Офіційний коментар та зауваження рецензента *"
            placeholder="Опишіть сильні сторони праці, виявлені недоліки, критичні зауваження або вимоги щодо доопрацювання..."
            value={reviewerComments}
            onChange={(e) => setReviewerComments(e.target.value)}
            rows={5}
            maxLength={2000}
            required
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-border-color">
          <Button
            variant="outline"
            size="sm"
            type="button"
            onClick={onClose}
            disabled={submitting}
          >
            Скасувати
          </Button>
          <Button
            variant="primary"
            size="sm"
            type="submit"
            icon={Send}
            isLoading={submitting}
          >
            Зберегти та надіслати рішення
          </Button>
        </div>
      </form>
    </Modal>
  );
}
