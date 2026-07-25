import { useState, useCallback } from "react";
import { organizationApi } from "@/features/organization/api/organizationApi";

export function useOrganization() {
  const [publicOrgs, setPublicOrgs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const fetchPublicList = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await organizationApi.getPublicList();
      setPublicOrgs(data || []);
    } catch (err) {
      console.error("Помилка завантаження списку організацій:", err);
      setError("Не вдалося завантажити список організацій");
    } finally {
      setLoading(false);
    }
  }, []);

  const joinOrganization = async (orgId) => {
    try {
      setSubmitting(true);
      setError(null);

      const res = await organizationApi.joinOrganization(orgId);
      return { success: true, message: res.message };
    } catch (err) {
      console.error(
        "Деталі помилки joinOrganization:",
        err.response?.data || err,
      );

      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Не вдалося надіслати запит на вступ";

      setError(msg);
      return { success: false, error: msg };
    } finally {
      setSubmitting(false);
    }
  };
  const createOrganization = async (formData) => {
    try {
      setSubmitting(true);
      setError(null);
      const res = await organizationApi.createOrganization(formData);
      return { success: true, data: res };
    } catch (err) {
      const msg =
        err.response?.data?.error || "Не вдалося створити організацію";
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setSubmitting(false);
    }
  };

  return {
    publicOrgs,
    loading,
    submitting,
    error,
    fetchPublicList,
    joinOrganization,
    createOrganization,
  };
}
