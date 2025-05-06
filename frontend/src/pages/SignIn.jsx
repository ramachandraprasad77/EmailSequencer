import AuthForm from "../components/Auth/AuthForm";
import { useState } from "react";
import useAxios from "../hooks/useAxios";

const SignIn = () => {
  const axios = useAxios();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignin = async ({ email, password }) => {
  try {
    setLoading(true);
    setError("");

    const response = await axios.post("/auth/login", { email, password });

    console.log("Login Response:", response.data);

    if (response.status === 200 && response.data.success) {
      localStorage.setItem("schedulerUserName", response.data.data.name);
      console.log("Login successful:", response.data);
      window.location.href = "/";
    } else {
      setError(response.data.error || "Invalid credentials.");
    }
  } catch (err) {
    console.error("❌ Login Error:", err.response?.data || err.message);

    if (err.response?.status === 401) {
      setError(err.response?.data?.error || "User not found");
    } else {
      setError("Something went wrong.");
    }
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <AuthForm
        type="signin"
        onSubmit={handleSignin}
        loading={loading}
        error={error}
      />
    </div>
  );
};

export default SignIn;