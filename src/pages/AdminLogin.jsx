import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api"; // ✅ Adjust path if needed

export default function AdminLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    adminCode: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // ✅ Correct backend route
      const res = await api.post("/api/auth/admin-login", formData);

      // ✅ Save token & user
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // ✅ Redirect only if admin
      if (res.data.user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        setError("You are not authorized as admin");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="login-page" style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>👑 Admin Login</h2>
      <form onSubmit={handleSubmit} className="login-form" style={{ display: "inline-block" }}>
        <input
          type="email"
          name="email"
          placeholder="Admin Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <br />
        <input
          type="password"
          name="password"
          placeholder="Admin Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <br />
        <input
          type="text"
          name="adminCode"
          placeholder="Admin Security Code"
          value={formData.adminCode}
          onChange={handleChange}
          required
        />
        <br />
        <button type="submit">Login</button>
        {error && <p className="error" style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
}
