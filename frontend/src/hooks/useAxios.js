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
              const errorMessage = error.response?.data?.error;
  
              if (errorMessage === "User not found") {
                  console.warn("User does not exist. Preventing redirect.");
                  return Promise.reject(error); // Prevents reload
              }
  
              console.warn("Unauthorized, redirecting...");
              localStorage.removeItem("authToken");
              window.location.href = "/signin"; // Redirects only for actual unauthorized errors
          }
          return Promise.reject(error);
      }
  );
    return client;
  }, []);

  return instance;
};

export default useAxios;