import axios from "axios";
import { useMemo } from "react";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const useAxios = () => {
  const instance = useMemo(() => {
    const client = axios.create({
      baseURL: BASE_URL,
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });

    client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          console.warn("Unauthorized, redirecting...");
          localStorage.removeItem("schedulerUserName");
          window.location.href = "/signin";
        }
        return Promise.reject(error);
      },
    );

    return client;
  }, []);

  return instance;
};

export default useAxios;