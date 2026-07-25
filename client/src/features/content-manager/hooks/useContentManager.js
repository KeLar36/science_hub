import { useState, useCallback } from "react";
import { contentManagerApi } from "@/features/content-manager/api/contentManagerApi";

export function useContentManager() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const createPost = useCallback(async (rawData, onSuccess) => {
    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("title", rawData.title);
    formData.append("content", rawData.content);
    formData.append("category", rawData.category);
    formData.append("status", rawData.status || "published");
    if (rawData.organizationId) {
      formData.append("organizationId", rawData.organizationId);
    }

    if (Array.isArray(rawData.file) && rawData.file.length > 0) {
      rawData.file.forEach((f) => {
        formData.append("coverImage", f);
      });
    }

    try {
      const responseData = await contentManagerApi.create(formData);
      if (onSuccess) onSuccess(responseData);
      return { success: true, data: responseData };
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Не вдалося створити публікацію.";
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updatePost = useCallback(async (postId, rawData, onSuccess) => {
    setIsLoading(true);
    setError(null);
    let payload;

    const hasFiles = Array.isArray(rawData.file) && rawData.file.length > 0;

    if (hasFiles) {
      const formData = new FormData();
      formData.append("title", rawData.title);
      formData.append("content", rawData.content);
      formData.append("category", rawData.category);
      formData.append("status", rawData.status);
      if (rawData.organizationId) {
        formData.append("organizationId", rawData.organizationId);
      }

      rawData.file.forEach((f) => {
        formData.append("coverImage", f);
      });
      payload = formData;
    } else {
      payload = {
        title: rawData.title,
        content: rawData.content,
        category: rawData.category,
        status: rawData.status,
        ...(rawData.organizationId && {
          organizationId: rawData.organizationId,
        }),
      };
    }

    try {
      const responseData = await contentManagerApi.update(postId, payload);
      if (onSuccess) onSuccess(responseData);
      return { success: true, data: responseData };
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Не вдалося оновити публікацію.";
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deletePost = useCallback(async (postId, onSuccess) => {
    setIsLoading(true);
    setError(null);
    try {
      const responseData = await contentManagerApi.delete(postId);
      if (onSuccess) onSuccess(responseData);
      return { success: true, data: responseData };
    } catch (err) {
      const errorMsg =
        err.response?.data?.message || "Не вдалося видалити публікацію.";
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchPostById = useCallback(async (postId, onDataLoaded) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await contentManagerApi.getById(postId);
      if (onDataLoaded) {
        onDataLoaded(data);
      }
      return data;
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Не вдалося завантажити дані для редагування.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    createPost,
    updatePost,
    deletePost,
    isLoading,
    error,
    setError,
    fetchPostById,
  };
}
