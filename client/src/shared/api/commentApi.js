import axiosInstance from "@/shared/api/axios";

export const commentApi = {
  getByPostId: async (postId) => {
    const res = await axiosInstance.get(`/comments/post/${postId}`);
    return res.data;
  },
  createPostComment: async (postId, text) => {
    const res = await axiosInstance.post(`/comments/post/${postId}`, { text });
    return res.data;
  },

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

  delete: async (id) => {
    const res = await axiosInstance.delete(`/comments/${id}`);
    return res.data;
  },
};
