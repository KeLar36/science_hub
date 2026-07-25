import { useState, useEffect, useCallback } from "react";
import { commentApi } from "@/shared/api/commentApi";

/**
 * @param {string} postId - ID публікації, для якої потрібно отримати коментарі
 */
export function useComments(postID) {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchComments = useCallback(async () => {
    if (!postID) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await commentApi.getByPostId(postID);
      setComments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Помилка при завантаженні коментарів:", err);
      setError("Не вдалося завантажити коментарі");
    } finally {
      setIsLoading(false);
    }
  }, [postID]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const addComment = useCallback(
    async (text) => {
      if (!text.trim()) return;
      try {
        const newComment = await commentApi.create(postID, text);
        setComments((prev) => [...prev, newComment]);
        return newComment;
      } catch (err) {
        console.error("Помилка при додаванні коментаря:", err);
        throw err;
      }
    },
    [postID],
  );

  const deleteComment = useCallback(async (commentId) => {
    if (!commentId) return;
    try {
      await commentApi.delete(commentId);
      setComments((prev) =>
        prev.filter((comment) => comment._id !== commentId),
      );
    } catch (err) {
      console.error("Помилка при аидаленні коментаря", err);
      throw err;
    }
  }, []);

  return {
    comments,
    isLoading,
    error,
    fetchComments,
    addComment,
    deleteComment,
    refreshComments: fetchComments,
  };
}
