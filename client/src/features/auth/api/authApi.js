import axiosInstance from "@/shared/api/axios";

export const authApi = {
  login: async (email, password) => {
    const res = await axiosInstance.post("/auth/login", { email, password });
    return res.data;
  },

  register: async (formData) => {
    const res = await axiosInstance.post("/auth/register", {
      ...formData,
      role: "user",
    });
    return res.data;
  },

  forgotPassword: async (email) => {
    const res = await axiosInstance.post("/auth/forgot-password", { email });
    return res.data;
  },

  resetPassword: async (token, password) => {
    const res = await axiosInstance.post(`/auth/reset-password/${token}`, {
      password,
    });
    return res.data;
  },
};
