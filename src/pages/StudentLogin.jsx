import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import API from "../api/api"; // ✅ use axios instance
import "../styles/AnimatedAuth.css";

// ✅ Google Login
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

const StudentLogin = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  /* ✅ Gradient background for Login page */
  useEffect(() => {
    document.body.classList.add("auth-page");
    return () => {
      document.body.classList.remove("auth-page");
    };
  }, []);

  // 🔹 Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 Manual login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.post("/api/auth/login", form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      alert("✅ Login successful!");

      // Redirect based on role
      if (res.data.user.role === "admin") navigate("/admin");
      else if (res.data.user.role === "faculty") navigate("/faculty");
      else navigate("/student");
    } catch (err) {
      alert("❌ " + (err.response?.data?.error || "Login failed"));
    } finally {
      setLoading(false);
    }
  };

  // ✅ Google login success
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      console.log("✅ Google User:", decoded);

      const res = await API.post("/api/auth/google-login", {
        email: decoded.email,
        name: decoded.name,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      alert(`✅ Welcome back, ${res.data.user.username}!`);

      if (res.data.user.role === "admin") navigate("/admin");
      else if (res.data.user.role === "faculty") navigate("/faculty");
      else navigate("/student");
    } catch (error) {
      console.error("Google login error:", error);
      alert("❌ Google login failed. Please try again.");
    }
  };

  const handleGoogleError = () => {
    alert("❌ Google Sign-In failed. Please try again.");
  };

  // ✅ Animations
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut", staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      className="auth-wrapper"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="auth-card glass-effect" variants={itemVariants}>
        {/*  Brand Section */}
        <motion.div className="auth-brand" variants={itemVariants}>
          <motion.h1 variants={itemVariants}>Medha Mantana</motion.h1>
          <motion.p variants={itemVariants}>
            “Sharpen Your Medha, Master Every Mantana”
          </motion.p>
        </motion.div>

        <motion.h2
          className="text-2xl font-bold text-center mb-6 text-indigo-700"
          variants={itemVariants}
        >
           Login as Student
        </motion.h2>

        {/* 🧾 Login Form */}
        <motion.form
          onSubmit={handleSubmit}
          className="auth-form space-y-4"
          variants={containerVariants}
        >
          <motion.input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg focus:ring focus:ring-indigo-300"
            required
            variants={itemVariants}
            whileFocus={{ scale: 1.02 }}
          />
          <motion.input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg focus:ring focus:ring-indigo-300"
            required
            variants={itemVariants}
            whileFocus={{ scale: 1.02 }}
          />

          <motion.button
            type="submit"
            disabled={loading}
            className={`auth-btn w-full py-2 rounded-lg text-white transition ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {loading ? "⏳ Logging in..." : " Login"}
          </motion.button>
        </motion.form>

        {/* Divider */}
        <motion.div
          className="text-center my-4 text-gray-500 text-sm"
          variants={itemVariants}
        >
          ────── or ──────
        </motion.div>

        {/*  Google Login */}
        <motion.div
          className="flex justify-center mb-4"
          variants={itemVariants}
        >
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            theme="filled_blue"
            size="large"
            shape="pill"
            text="signin_with"
          />
        </motion.div>

        {/*  Register Link */}
        <motion.p
          className="text-sm text-center mt-4"
          variants={itemVariants}
        >
          New here?{" "}
          <motion.span
            className="auth-link"
            whileHover={{ scale: 1.05 }}
          >
            <a href="/register/student">Register here</a>
          </motion.span>
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

export default StudentLogin;
