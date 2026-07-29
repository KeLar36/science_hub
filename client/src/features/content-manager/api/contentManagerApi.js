import axiosInstance from "@/shared/api/axios";

export const contentManagerApi = {
  async create(formData) {
    const response = await axiosInstance.post("/posts", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  async update(id, postData) {
    const headers =
      postData instanceof FormData
        ? { "Content-Type": "multipart/form-data" }
        : { "Content-Type": "application/json" };

    const response = await axiosInstance.put(`/posts/${id}`, postData, {
      headers,
    });
    return response.data;
  },

  async delete(id) {
    const response = await axiosInstance.delete(`/posts/${id}`);
    return response.data;
  },

  async getById(id) {
    const response = await axiosInstance.get(`/posts/${id}`);
    return response.data;
  },

  async getDashboardData(filters = {}, page = 1, limit = 8) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...Object.fromEntries(
        Object.entries(filters).filter(
          ([_, value]) => value !== undefined && value !== null && value !== "",
        ),
      ),
    });

    const response = await axiosInstance.get(
      `/posts/my-dashboard?${params.toString()}`,
    );
    return response.data;
  },
};
