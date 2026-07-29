import axiosInstance from "@/shared/api/axios";

export const userApi = {
  getSavedPosts: async () => {
    const res = await axiosInstance.get("/users/saved-posts");
    return res.data;
  },

  updateProfile: async (formData) => {
    const res = await axiosInstance.patch("/users/update-profile", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },

  toggleBookmark: async (postId) => {
    const res = await axiosInstance.post(`/users/bookmarks/toggle/${postId}`);
    return res.data;
  },

  deleteAccount: async () => {
    const res = await axiosInstance.delete("/users/profile");
    return res.data;
  },
};
