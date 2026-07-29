import axiosInstance from "@/shared/api/axios";

export const projectCommentApi = {
  getByProjectId: async (projectId) => {
    const res = await axiosInstance.get(`/comments/project/${projectId}`);
    return res.data;
  },

  createProjectComment: async (projectId, text) => {
    const res = await axiosInstance.post(`/comments/project/${projectId}`, {
      text,
    });
    return res.data;
  },
};
