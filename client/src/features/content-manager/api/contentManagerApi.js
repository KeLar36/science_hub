import axiosInstance from "@/shared/api/axios";

export const contentManagerApi = {
  async create(rawData) {
    const response = await axiosInstance.post("/posts/create", rawData);
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

  async getDashboarData() {
    const response = await axiosInstance.get("/posts/my-dashboard");
    return response.data;
  },
};
