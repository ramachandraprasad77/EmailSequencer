import AuthForm from "../components/Auth/AuthForm";
import { useState } from "react";
import useAxios from "../hooks/useAxios";

const Signup = () => {
  const axios = useAxios();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async ({ name, email, password }) => {
    try {
      setLoading(true);
      setError("");
  
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/register`,  {
        name,
        email,
        password,
      });
  
      console.log("Response:", response.data);
  
      if (response.status === 201 && response.data.success) {
        alert(response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch (err) {
      if (err.response && err.response.status === 409) {
        const errorMessage = err.response.data.error || "User already exists";
        setError(errorMessage);
        console.log("Error:", errorMessage); 
      } else {
        setError("Something went wrong.");
        console.log("Error:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <AuthForm
        type="signup"
        onSubmit={handleSignup}
        loading={loading}
        error={error}
      />
    </div>
  );
};

export default Signup;
