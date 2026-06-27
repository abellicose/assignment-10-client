import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const apiPublic = axios.create({ baseURL });

export const apiSecure = axios.create({ baseURL });

apiSecure.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access-token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiSecure.interceptors.response.use(
  (res) => res,
  (error) => {
    if (typeof window !== "undefined") {
      const status = error?.response?.status;
      if (status === 401 || status === 403) {
        localStorage.removeItem("access-token");
      }
    }
    return Promise.reject(error);
  }
);
