import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { notificationApi } from "@/shared/api/notificationApi";

export function useNotifications(limit = 5) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const fetchNotifications = useCallback(
    async (page = currentPage) => {
      try {
        setLoading(true);
        const data = await notificationApi.getNotifications(page, limit);
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
        setTotalPages(data.totalPages || 1);
        setCurrentPage(data.currentPage || 1);
      } catch (err) {
        console.error("Помилка завантаження сповіщень:", err);
      } finally {
        setLoading(false);
      }
    },
    [currentPage, limit],
  );

  useEffect(() => {
    fetchNotifications(currentPage);
  }, [currentPage, fetchNotifications]);

  const handleNotificationClick = async (notification) => {
    try {
      if (!notification.isRead) {
        await notificationApi.markAsRead(notification._id);
        setNotifications((prev) =>
          prev.map((item) =>
            item._id === notification._id ? { ...item, isRead: true } : item,
          ),
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }

      if (notification.link) {
        navigate(notification.link);
      }
    } catch (err) {
      console.error("Помилка при позначанні прочитаним:", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      setNotifications((prev) =>
        prev.map((item) => ({ ...item, isRead: true })),
      );
      setUnreadCount(0);
    } catch (err) {
      console.error("Помилка при позначанні всіх прочитаними:", err);
    }
  };

  const clearAll = async () => {
    try {
      await notificationApi.clearAllNotifications();
      setNotifications([]);
      setUnreadCount(0);
      setTotalPages(1);
      setCurrentPage(1);
    } catch (err) {
      console.error("Помилка при очищенні сповіщень:", err);
    }
  };

  return {
    notifications,
    unreadCount,
    currentPage,
    totalPages,
    loading,
    setCurrentPage,
    fetchNotifications,
    handleNotificationClick,
    markAllAsRead,
    clearAll,
  };
}
