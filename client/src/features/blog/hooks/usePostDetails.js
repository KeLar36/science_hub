import { useState, useEffect, useCallback } from "react";
import { postApi } from "../api/postApi";
import { useProfile } from "@/features/user/hooks/useProfile";

export function usePostDetails(postId) {
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);

  const { user, toggleBookmark } = useProfile();

  const fetchPost = useCallback(async () => {
    if (!postId) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await postApi.getById(postId);
      setPost(data);
    } catch (err) {
      setError(err.response?.data?.error || "Не вдалося завантажити статтю");
    } finally {
      setIsLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  const actualPostId = post?._id?.$oid || post?._id;
  const isBookmarked =
    user?.bookmarks?.some(
      (bId) => (bId?.$oid || bId?.toString()) === actualPostId?.toString(),
    ) || false;

  const handleReactionToggle = useCallback(
    async (type, currentUserId) => {
      if (!post || !currentUserId) return;
      const previousReactions = { ...post.reactions };

      const currentUsersList = Array.isArray(post.reactions?.[type])
        ? [...post.reactions[type]]
        : [];
      const hasReacted = currentUsersList.includes(currentUserId);

      const updatedUsersList = hasReacted
        ? currentUsersList.filter((id) => id !== currentUserId)
        : [...currentUsersList, currentUserId];

      setPost((prev) => ({
        ...prev,
        reactions: {
          ...prev?.reactions,
          [type]: updatedUsersList,
        },
      }));

      try {
        const data = await postApi.toggleReaction(actualPostId, type);
        setPost((prev) => ({ ...prev, reactions: data.reactions }));
      } catch (err) {
        console.error(err);
        setPost((prev) => ({ ...prev, reactions: previousReactions }));
      }
    },
    [post, actualPostId],
  );

  const handleBookmarkToggle = useCallback(async () => {
    if (!actualPostId) return;
    try {
      setBookmarkLoading(true);
      await toggleBookmark(actualPostId);
    } catch (err) {
      console.error("Помилка додавання в закладки:", err);
    } finally {
      setBookmarkLoading(false);
    }
  }, [actualPostId, toggleBookmark]);

  return {
    post,
    isLoading,
    error,
    isBookmarked,
    handleReactionToggle,
    handleBookmarkToggle,
    bookmarkLoading,
    refreshPost: fetchPost,
  };
}
