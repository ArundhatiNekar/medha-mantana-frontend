import React, { useState } from "react";
import axios from "axios";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // 🔑 LOGIN
        const res = await axios.post("http://localhost:5000/api/auth/login", {
          email: form.email,
          password: form.password,
        });

        // Save user to localStorage
        localStorage.setItem("user", JSON.stringify(res.data.user));

        alert("✅ Login successful!");
        window.location.href =
          res.data.user.role === "faculty" ? "/faculty" : "/quiz";
      } else {
        // 📝 REGISTER
        await axios.post("http://localhost:5000/api/auth/register", form);
        alert("✅ Registered successfully, please login!");
        setIsLogin(true); // switch to login form
      }
    } catch (err) {
      alert("❌ " + (err.response?.data?.error || "Something went wrong"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-200 to-purple-300">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-96 transform transition-all">
        <h2 className="text-2xl font-bold mb-6 text-center text-indigo-700">
          {isLogin ? "🔑 Login to Apti_Quest" : "📝 Register for Apti_Quest"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:ring focus:ring-indigo-300"
              required
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg focus:ring focus:ring-indigo-300"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg focus:ring focus:ring-indigo-300"
            required
          />

          {!isLogin && (
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:ring focus:ring-indigo-300"
            >
              <option value="student">🎓 Student</option>
              <option value="faculty">👨‍🏫 Faculty</option>
            </select>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg text-white transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {loading ? "⏳ Please wait..." : isLogin ? "Login" : "Register"}
          </button>
        </form>

        <p
          className="text-center mt-4 text-blue-600 cursor-pointer hover:underline"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin
            ? "New here? Register"
            : "Already have an account? Login"}
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
