import axiosInstance from "@/shared/api/axios";
const extractId = (target) =>
  typeof target === "object" && target !== null
    ? target._id || target.id
    : target;

export const programApi = {
  getPublicList: async (params = {}) => {
    const res = await axiosInstance.get("/programs/public", { params });
    return res.data;
  },

  getById: async (id) => {
    const res = await axiosInstance.get(`/programs/${id}`);
    return res.data;
  },

  create: async (programData) => {
    const res = await axiosInstance.post("/programs/", programData);
    return res.data;
  },

  update: async (idOrObject, programData) => {
    const id = extractId(idOrObject);
    const res = await axiosInstance.put(`/programs/${id}`, programData);
    return res.data;
  },

  toggleStatus: async (idOrObject) => {
    const id = extractId(idOrObject);
    const res = await axiosInstance.patch(`/programs/${id}/toggle-status`);
    return res.data;
  },

  delete: async (idOrObject) => {
    const id = extractId(idOrObject);
    const res = await axiosInstance.delete(`/programs/${id}`);
    return res.data;
  },

  getByOrganization: async (orgId, page = 1) => {
    const res = await axiosInstance.get(
      `/organizations/${orgId}/programs?page=${page}`,
    );
    return res.data;
  },
};
