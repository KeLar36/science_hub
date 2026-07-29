import { useState, useCallback } from "react";
import { adminApi } from "@/features/admin/api/adminApi";

export function useAdminData() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [programs, setPrograms] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);

  const [programsPagination, setProgramsPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });

  const [orgsPagination, setOrgsPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });

  const [projectsPagination, setProjectsPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });

  const [usersPagination, setUsersPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });

  /* ------------------- PROGRAM METHODS ------------------- */
  const fetchPrograms = useCallback(
    async (page = 1, search = "", type = "") => {
      setLoading(true);
      setError(null);
      try {
        const data = await adminApi.getAllPrograms({ page, search, type });
        setPrograms(data.programs || data.items || []);
        setProgramsPagination({
          currentPage: data.currentPage || page,
          totalPages: data.totalPages || 1,
          totalItems: data.totalItems || 0,
        });
      } catch (err) {
        const msg =
          err.response?.data?.message || "Помилка завантаження програм";
        setError(msg);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const toggleProgramStatus = async (programId) => {
    try {
      const res = await adminApi.toggleProgramStatus(programId);
      setPrograms((prev) =>
        prev.map((p) =>
          p._id === programId
            ? { ...p, active: res.program?.active ?? !p.active }
            : p,
        ),
      );
      return { success: true, message: res.message };
    } catch (err) {
      const msg =
        err.response?.data?.message || "Помилка зміни статусу програми";
      return { success: false, message: msg };
    }
  };

  const deleteProgram = async (programId) => {
    try {
      const res = await adminApi.deleteProgram(programId);
      setPrograms((prev) => prev.filter((p) => p._id !== programId));
      return { success: true, message: res.message };
    } catch (err) {
      const msg = err.response?.data?.message || "Помилка видалення програми";
      return { success: false, message: msg };
    }
  };

  const forceCleanupProgram = async (programId) => {
    try {
      const res = await adminApi.forceCleanupProgram(programId);
      return { success: true, message: res.message };
    } catch (err) {
      const msg =
        err.response?.data?.message || "Помилка очищення даних програми";
      return { success: false, message: msg };
    }
  };

  /* ------------------- ORGANIZATION METHODS ------------------- */
  const fetchOrganizations = useCallback(
    async (page = 1, search = "", status = "") => {
      setLoading(true);
      setError(null);
      try {
        const data = await adminApi.getAllOrganizations({
          page,
          search,
          status,
        });
        setOrganizations(data.organizations || data.items || []);
        setOrgsPagination({
          currentPage: data.currentPage || page,
          totalPages: data.totalPages || 1,
          totalItems: data.totalItems || 0,
        });
      } catch (err) {
        setError(err.response?.data?.message || "Помилка завантаження установ");
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const updateOrgStatus = async (orgId, status) => {
    const res = await adminApi.updateOrgStatus(orgId, status);
    return res;
  };

  const toggleOrgVerified = async (orgId) =>
    await adminApi.toggleOrgVerified(orgId);

  const toggleOrgFeatured = async (orgId) =>
    await adminApi.toggleOrgFeatured(orgId);

  const deleteOrganization = async (orgId) =>
    await adminApi.deleteOrganizationCascade(orgId);

  /* ------------------- PROJECT METHODS ------------------- */
  const fetchProjects = useCallback(async (page = 1, filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page,
        search: filters.search || "",
        status: filters.status || "",
        reviewStatus: filters.reviewStatus || "",
        domain: filters.domain || "",
      };

      const data = await adminApi.getAllProjects(params);
      setProjects(data.projects || []);
      setProjectsPagination({
        currentPage: data.currentPage || page,
        totalPages: data.totalPages || 1,
        totalItems: data.totalItems || 0,
      });
    } catch (err) {
      setError(
        err.response?.data?.message || "Помилка завантаження наукових праць",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteProject = async (projectId) => {
    try {
      const res = await adminApi.deleteProject(projectId);
      setProjects((prev) => prev.filter((p) => p._id !== projectId));
      return { success: true, message: res.message };
    } catch (err) {
      const msg = err.response?.data?.message || "Помилка видалення праці";
      return { success: false, message: msg };
    }
  };

  /* ------------------- USER METHODS ------------------- */
  const fetchUsers = useCallback(async (page = 1, filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page,
        search: filters.search || "",
        role: filters.role || "",
      };
      const data = await adminApi.getAllUsers(params);
      setUsers(data.users || []);
      setUsersPagination({
        currentPage: data.currentPage || page,
        totalPages: data.totalPages || 1,
        totalItems: data.totalItems || 0,
      });
    } catch (err) {
      setError(
        err.response?.data?.message || "Помилка завантаження користувачів",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUserRole = async (userId, roleData) => {
    try {
      const res = await adminApi.updateUserRole(userId, roleData);
      setUsers((prev) => prev.map((u) => (u._id === userId ? res : u)));
      return { success: true, message: "Роль користувача оновлено" };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.error || "Помилка зміни ролі",
      };
    }
  };

  const toggleBanUser = async (userId, currentBanStatus) => {
    try {
      const res = await adminApi.banUser(userId, !currentBanStatus);
      setUsers((prev) => prev.map((u) => (u._id === userId ? res : u)));
      return {
        success: true,
        message: res.isBanned
          ? "Користувача заблоковано"
          : "Користувача розблоковано",
      };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.error || "Помилка зміни статусу бана",
      };
    }
  };

  const deleteUser = async (userId) => {
    try {
      const res = await adminApi.deleteUserCascade(userId);
      setUsers((prev) => prev.filter((u) => u._id !== userId));
      return { success: true, message: res.message };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.error || "Помилка видалення користувача",
      };
    }
  };

  return {
    loading,
    setLoading,
    error,
    setError,
    // Programs
    programs,
    pagination: programsPagination,
    programsPagination,
    fetchPrograms,
    toggleProgramStatus,
    deleteProgram,
    forceCleanupProgram,
    // Organizations
    organizations,
    orgsPagination,
    fetchOrganizations,
    updateOrgStatus,
    toggleOrgVerified,
    toggleOrgFeatured,
    deleteOrganization,
    // Projects
    projects,
    projectsPagination,
    fetchProjects,
    deleteProject,
    // Users
    users,
    usersPagination,
    fetchUsers,
    updateUserRole,
    toggleBanUser,
    deleteUser,
  };
}
