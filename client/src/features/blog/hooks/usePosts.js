import { useState, useEffect, useCallback } from "react";
import { postApi } from "../api/postApi";

export function usePosts(initialFilters = {}, limit = 8, isDashboard = false) {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });

  const [filters, setFilters] = useState({
    search: "",
    category: "Всі",
    domain: "Всі",
    status: "",
    organizationId: "",
    ...initialFilters,
  });

  const [debouncedSearch, setDebouncedSearch] = useState(filters.search);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(filters.search);
    }, 400);

    return () => {
      clearTimeout(handler);
    };
  }, [filters.search]);

  const fetchPosts = useCallback(
    async (pageToFetch, currentFilters) => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchMethod = isDashboard
          ? postApi.getMyDashboard
          : postApi.getAll;

        const data = await fetchMethod(currentFilters, pageToFetch, limit);
        setPosts(data.posts || []);
        setPagination({
          currentPage: data.currentPage || 1,
          totalPages: data.totalPages || 1,
          totalItems: data.totalItems || 0,
        });
      } catch (err) {
        setError(
          err.response?.data?.error || "Не вдалося завантажити публікації",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [limit, isDashboard],
  );

  useEffect(() => {
    fetchPosts(pagination.currentPage, filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    pagination.currentPage,
    filters.category,
    filters.domain,
    filters.status,
    filters.organizationId,
    debouncedSearch,
    fetchPosts,
  ]);

  const applySearch = useCallback(() => {
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
    fetchPosts(1, filters);
  }, [filters, fetchPosts]);

  const updateFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  }, []);

  const changePage = useCallback(
    (page) => {
      if (page >= 1 && page <= pagination.totalPages) {
        setPagination((prev) => ({ ...prev, currentPage: page }));
      }
    },
    [pagination.totalPages],
  );

  const refresh = useCallback(() => {
    fetchPosts(pagination.currentPage, filters);
  }, [pagination.currentPage, filters, fetchPosts]);

  const resetFilters = useCallback(() => {
    const clearedFilters = {
      search: "",
      category: "Всі",
      domain: "Всі",
      status: "",
      organizationId: "",
      ...initialFilters,
    };
    setFilters(clearedFilters);
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
    fetchPosts(1, clearedFilters);
  }, [initialFilters, fetchPosts]);

  return {
    posts,
    isLoading,
    error,
    filters,
    pagination,
    updateFilter,
    applySearch,
    changePage,
    refresh,
    resetFilters,
  };
}
