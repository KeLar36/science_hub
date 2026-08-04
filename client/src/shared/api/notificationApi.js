import axios from "@/shared/api/axios";

export const notificationApi = {
  getNotifications: async (page = 1, limit = 5) => {
    const res = await axios.get(`/notifications?page=${page}&limit=${limit}`);
    return res.data;
  },

  markAsRead: async (id) => {
    const res = await axios.patch(`/notifications/${id}/read`);
    return res.data;
  },

  markAllAsRead: async () => {
    const res = await axios.patch("/notifications/read-all");
    return res.data;
  },

  clearAllNotifications: async () => {
    const res = await axios.delete("/notifications/clear-all");
    return res.data;
  },
};
