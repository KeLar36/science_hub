import axiosInstance from "@/shared/api/axios";

export const commentApi = {
  /**
   * @param {string} postId - ID публікації
   */
  async getByPostId(postId) {
    const response = await axiosInstance.get(`/posts/${postId}/comments`);
    return response.data;
  },

  /**
   * @param {string} postId - ID публікації
   * @param {string} text - Текст коментаря
   */
  async create(postId, text) {
    const response = await axiosInstance.post(`/posts/${postId}/comment`, {
      text,
    });
    return response.data;
  },

  /**
   * @param {string} commentId - ID коментаря
   */
  async delete(commentId) {
    const response = await axiosInstance.delete(`/posts/comment/${commentId}`);
    return response.data;
  },
};
