import { useEffect, useState, useMemo, useCallback } from "react";
import { projectApi } from "@/features/projects/api/projectApi";

export function useProjects(projectId = null) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDomain, setSelectedDomain] = useState("Всі галузі");
  const [selectedType, setSelectedType] = useState("Всі типи");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentProject, setCurrentProject] = useState(null);

  useEffect(() => {
    if (projectId) return;
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchTerm, projectId]);

  useEffect(() => {
    if (projectId) return;

    const fetchArchive = async () => {
      try {
        setLoading(true);
        const data = await projectApi.getArchive();
        setItems(data || []);
      } catch (err) {
        console.error("Помилка завантаження публікацій Архіву:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchArchive();
  }, [projectId]);

  const filteredProjects = useMemo(() => {
    if (projectId) return [];

    return items.filter((project) => {
      const matchesSearch =
        !debouncedSearch.trim() ||
        project.title?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        project.authorId?.name
          ?.toLowerCase()
          .includes(debouncedSearch.toLowerCase());

      const matchesDomain =
        selectedDomain === "Всі галузі" || project.domain === selectedDomain;

      const matchesType =
        selectedType === "Всі типи" || project.programId?.type === selectedType;

      return matchesSearch && matchesDomain && matchesType;
    });
  }, [items, debouncedSearch, selectedDomain, selectedType, projectId]);

  const handleResetFilters = useCallback(() => {
    setSearchTerm("");
    setSelectedDomain("Всі галузі");
    setSelectedType("Всі типи");
  }, []);

  useEffect(() => {
    if (!projectId) return;

    const fetchProjectById = async () => {
      try {
        setLoading(true);
        const data = await projectApi.getById(projectId);
        setCurrentProject(data);
      } catch (err) {
        console.error("Помилка завантаження даних проекту:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjectById();
  }, [projectId]);

  return {
    projects: filteredProjects,
    totalCount: filteredProjects.length,
    loading,
    searchTerm,
    setSearchTerm,
    selectedDomain,
    setSelectedDomain,
    selectedType,
    setSelectedType,
    handleResetFilters,
    currentProject,
  };
}
