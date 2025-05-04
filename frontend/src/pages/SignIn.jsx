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
      if (response.status === 200) {
        localStorage.setItem("schedulerUserName", response.data.data.name);
        console.log("Login successful:", response.data);
        window.location.href = "/";
      } else {
        setError("Invalid credentials.");
      }
    } catch (err) {
      setError("Something went wrong.");
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