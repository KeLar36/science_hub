import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

const instance = axios.create({
  baseURL: apiUrl.endsWith("/") ? `${apiUrl}api` : `${apiUrl}/api`,
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      console.warn("Сесія вичерпана, вихід з акаунта...");

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default instance;
