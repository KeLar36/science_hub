import axiosInstance from "@/shared/api/axios";

export const postApi = {
  async getAll(filters = {}, page = 1, limit = 8) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...Object.fromEntries(
        Object.entries(filters).filter(
          ([_, value]) => value !== undefined && value !== "",
        ),
      ),
    });

    const response = await axiosInstance.get(`/posts?${params.toString()}`);
    return response.data;
  },

  async getById(id) {
    const response = await axiosInstance.get(`/posts/${id}`);
    return response.data;
  },

  async toggleReaction(postId, type) {
    const response = await axiosInstance.post(`/posts/${postId}/react`, {
      type,
    });
    return response.data;
  },
};
