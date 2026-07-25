import axiosInstance from "@/shared/api/axios";

export const projectApi = {
  getArchive: async () => {
    const res = await axiosInstance.get("/projects/archive");
    return res.data;
  },

  getById: async (id) => {
    const res = await axiosInstance.get(`/projects/${id}`);
    return res.data;
  },

  getMyProjects: async (page = 1) => {
    const res = await axiosInstance.get(`/projects/my?page=${page}`);
    return res.data;
  },

  create: async (projectData) => {
    const res = await axiosInstance.post("/projects/create", projectData);
    return res.data;
  },

  getByOrganization: async (orgId, page = 1) => {
    const res = await axiosInstance.get(`/projects?page=${page}`);
    return res.data;
  },
};
