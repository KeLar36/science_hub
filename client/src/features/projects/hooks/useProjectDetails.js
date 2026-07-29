import { useState, useEffect, useCallback } from "react";
import { projectApi } from "../api/projectApi";

export function useProjectDetails(projectId) {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProject = useCallback(async () => {
    if (!projectId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await projectApi.getById(projectId);
      setProject(data);
    } catch (err) {
      console.error("Помилка завантаження проєкту:", err);
      setError(
        err.response?.data?.message || "Не вдалося завантажити деталі проєкту",
      );
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  return {
    project,
    loading,
    error,
    refreshProject: fetchProject,
  };
}
