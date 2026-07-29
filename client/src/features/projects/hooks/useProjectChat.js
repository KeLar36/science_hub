import { useState, useEffect, useCallback } from "react";
import { projectCommentApi } from "@/shared/api/projectCommentApi";

export function useProjectChat(projectId) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  const fetchMessages = useCallback(async () => {
    if (!projectId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await projectCommentApi.getByProjectId(projectId);
      setMessages(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Помилка завантаження чату:", err);
      setError("Не вдалося завантажити історію обговорення");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const sendMessage = useCallback(
    async (text) => {
      if (!text.trim() || !projectId) return;
      setSending(true);
      try {
        const newMessage = await projectCommentApi.createProjectComment(
          projectId,
          text,
        );
        setMessages((prev) => [...prev, newMessage]);
        return newMessage;
      } catch (err) {
        console.error("Помилка надсилання повідомлення:", err);
        throw err;
      } finally {
        setSending(false);
      }
    },
    [projectId],
  );

  return {
    messages,
    loading,
    sending,
    error,
    sendMessage,
    refreshMessages: fetchMessages,
  };
}
