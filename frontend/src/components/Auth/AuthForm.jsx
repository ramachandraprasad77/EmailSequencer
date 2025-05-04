import { useState } from "react";

const AuthForm = ({ type = "signin", onSubmit, loading, error }) => {
  const isSignup = type === "signup";
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = isSignup
      ? formData
      : { email: formData.email, password: formData.password };
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl shadow-md w-full max-w-md">
      <h2 className="text-2xl font-semibold text-center">
        {isSignup ? "Create an Account" : "Sign In"}
      </h2>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {isSignup && (
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full border rounded px-3 py-2 mt-1"
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full border rounded px-3 py-2 mt-1"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full border rounded px-3 py-2 mt-1"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        {loading ? "Please wait..." : isSignup ? "Sign Up" : "Sign In"}
      </button>
    </form>
  );
};

export default AuthForm;