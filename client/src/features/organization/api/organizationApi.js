import axiosInstance from "@/shared/api/axios";

export const organizationApi = {
  getById: async (id) => {
    const res = await axiosInstance.get(`/organizations/${id}`);
    return res.data;
  },

  getPublicList: async () => {
    const res = await axiosInstance.get("/organizations/public/list");
    return res.data;
  },

  getUsers: async (orgId, page = 1) => {
    const res = await axiosInstance.get(
      `/organizations/${orgId}/users?page=${page}`,
    );
    return res.data;
  },

  updateOrganization: async (orgId, updateData) => {
    const res = await axiosInstance.patch(
      `/organizations/${orgId}`,
      updateData,
    );
    return res.data;
  },

  joinOrganization: async (orgId) => {
    const res = await axiosInstance.post("/organizations/join", {
      organizationId: orgId,
    });
    return res.data;
  },

  getPendingRequests: async (orgId, page = 1, search = "") => {
    const res = await axiosInstance.get(
      `/organizations/${orgId}/requests/pending?page=${page}&search=${search}`,
    );
    return res.data;
  },

  acceptRequest: async (userId) => {
    const res = await axiosInstance.post(
      `/organizations/requests/accept/${userId}`,
    );
    return res.data;
  },

  rejectRequest: async (userId) => {
    const res = await axiosInstance.post(
      `/organizations/requests/reject/${userId}`,
    );
    return res.data;
  },

  updateMemberRole: async (orgId, userId, roleData) => {
    const res = await axiosInstance.patch(
      `/organizations/${orgId}/members/${userId}/role`,
      roleData,
    );
    return res.data;
  },

  transferOwnership: async (orgId, newOwnerId) => {
    const res = await axiosInstance.patch(
      `/organizations/${orgId}/transfer-ownership`,
      { newOwnerId },
    );
    return res.data;
  },

  kickMember: async (orgId, targetUserId) => {
    const res = await axiosInstance.post(`/organizations/${orgId}/kick`, {
      targetUserId,
    });
    return res.data;
  },
};
