import { useState, useCallback } from "react";
import axiosInstance from "@/shared/api/axios";
import { useAuth } from "@/shared/lib/context/AuthContext";

export function useProfile() {
  const { user, updateUserState, logout } = useAuth();
  const [savedPosts, setSavedPosts] = useState([]);
  const [myProjects, setMyProjects] = useState([]);
  const [loadingSaved, setLoadingSaved] = useState(false);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);

  const [stats, setStats] = useState({
    total: 0,
    accepted: 0,
    pending: 0,
    needsRevision: 0,
  });

  const fetchSavedPosts = useCallback(async () => {
    try {
      setLoadingSaved(true);
      const res = await axiosInstance.get("/users/saved-posts");
      setSavedPosts(res.data || []);
    } catch (err) {
      console.error("💥 Помилка завантаження збережених постів:", err);
    } finally {
      setLoadingSaved(false);
    }
  }, []);

  const fetchMyProjects = useCallback(async (page = 1) => {
    try {
      setLoadingProjects(true);
      const res = await axiosInstance.get(`/projects/my?page=${page}`);
      const rawData = res.data;

      setMyProjects(rawData || []);

      const projectsArray = Array.isArray(rawData)
        ? rawData
        : rawData?.projects || [];

      setStats({
        total: rawData?.totalItems ?? projectsArray.length,
        accepted: projectsArray.filter((p) => p.status === "Прийнято").length,
        pending: projectsArray.filter(
          (p) => p.status === "На розгляді" || !p.status,
        ).length,
        needsRevision: projectsArray.filter(
          (p) => p.status === "На доопрацюванні",
        ).length,
      });
    } catch (err) {
      console.error("💥 Помилка завантаження моїх проєктів:", err);
    } finally {
      setLoadingProjects(false);
    }
  }, []);

  const updateProfile = async (formData) => {
    try {
      setUpdating(true);
      setError(null);
      const res = await axiosInstance.patch("/users/update-profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      updateUserState(res.data);
      return { success: true, data: res.data };
    } catch (err) {
      console.error("💥 Помилка оновлення даних профілю:", err);
      const msg = err.response?.data?.message || "Не вдалося оновити дані";
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setUpdating(false);
    }
  };

  const toggleBookmark = async (postId) => {
    try {
      const res = await axiosInstance.post(`/users/bookmarks/toggle/${postId}`);

      if (res.data?.bookmarks) {
        updateUserState({ ...user, bookmarks: res.data.bookmarks });
      }

      fetchSavedPosts();
      return { success: true, data: res.data };
    } catch (err) {
      console.error("💥 Помилка збереження посту:", err);
      return {
        success: false,
        error: err.response?.data?.message || "Помилка закладок",
      };
    }
  };

  const deleteAccount = async () => {
    try {
      const res = await axiosInstance.delete("/users/profile");
      await logout();
      return { success: true, message: res.data?.message };
    } catch (err) {
      return {
        success: false,
        error:
          err.response?.data?.error ||
          err.response?.data?.message ||
          "Не вдалося видалити профіль",
      };
    }
  };

  return {
    user,
    savedPosts,
    myProjects,
    stats,
    loadingSaved,
    loadingProjects,
    updating,
    error,
    fetchSavedPosts,
    fetchMyProjects,
    updateProfile,
    toggleBookmark,
    deleteAccount,
  };
}
