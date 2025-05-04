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

     
      const response = await axios.post("/auth/register", {
        name,
        email,
        password,
      });

      if (response.status === 201) {
       
        console.log("Signup successful:", response.data);
      } else {
        setError("Something went wrong. Please try again.");
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
        type="signup"
        onSubmit={handleSignup}
        loading={loading}
        error={error}
      />
    </div>
  );
};

export default Signup;