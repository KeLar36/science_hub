import { useState } from "react";
import { useAuth } from "@/shared/lib/hooks/useAuth";
import CommentCard from "./CommentCard";
import Button from "@/shared/ui/Button";
import TextArea from "@/shared/ui/TextArea";

export default function CommentSection({
  post,
  comments = [],
  onCommentSubmit,
  onCommentDelete,
  isLoading,
}) {
  const { user } = useAuth();
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) {
      setError("Текст коментаря не може бути порожнім");
      return;
    }

    setError("");
    setIsSubmitting(true);
    try {
      await onCommentSubmit(text.trim());
      setText("");
    } catch (err) {
      setError(err.response?.data?.error || "Не вдалося відправити коментар");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (window.confirm("Ви впевнені, що хочете видалити цей коментар?")) {
      setDeletingId(commentId);
      try {
        await onCommentDelete(commentId);
      } catch (err) {
        alert(`Помилка під час видалення коментаря: ${err.message || err}`);
      } finally {
        setDeletingId(null);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full text-left mt-8 space-y-6">
      <h3 className="text-md  uppercase tracking-widest text-text-muted font-mono">
        Обговорення матеріалу ({comments.length})
      </h3>

      {user ? (
        <form onSubmit={handleSubmit} className="space-y-3">
          <TextArea
            placeholder="Залиште свій науковий коментар або відгук..."
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              if (error) setError("");
            }}
            disabled={isSubmitting}
            maxLength={1000}
            rows={3}
            error={error}
          />

          <div className="flex items-center justify-between mt-1.5 w-full">
            <span className="text-[10px] text-text-muted font-mono uppercase tracking-wider">
              Максимум 1000 символів ({text.length}/1000)
            </span>

            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isSubmitting}
            >
              Відправити
            </Button>
          </div>
        </form>
      ) : (
        <div className="p-4 border border-border-color bg-bg-secondary/40 rounded-lg text-xs text-text-muted text-center font-medium">
          Тільки авторизовані користувачі можуть брати участь в обговоренні.
        </div>
      )}

      <div className="space-y-3">
        {isLoading ? (
          <div className="space-y-3 animate-pulse">
            <div className="h-16 bg-bg-secondary border border-border-color rounded-lg w-full" />
            <div className="h-16 bg-bg-secondary border border-border-color rounded-lg w-full" />
          </div>
        ) : comments.length === 0 ? (
          <div className="text-xs text-text-muted font-mono uppercase tracking-wider py-4 text-center">
            Коментарів ще немає. Будьте першим!
          </div>
        ) : (
          comments.map((comment) => (
            <CommentCard
              key={comment._id}
              comment={comment}
              post={post}
              onDelete={handleDelete}
              isDeleting={deletingId === comment._id}
            />
          ))
        )}
      </div>
    </div>
  );
}
