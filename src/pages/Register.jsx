
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode"; // ✅ Correct modern import
import "../styles/AnimatedAuth.css";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "",
    facultyCode: "",
  });

  const [googleUser, setGoogleUser] = useState(null); // 🌐 Holds Google user info
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  /* ✅ Apply gradient background for Register page */
  useEffect(() => {
    document.body.classList.add("auth-page");

    // 🧹 Clean up when leaving register page
    return () => {
      document.body.classList.remove("auth-page");
    };
  }, []);

  // 🔹 Handle input field updates
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 Handle manual register
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", form);

      if (res.data && res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        alert("✅ Registration successful!");
        navigate(res.data.user.role === "faculty" ? "/faculty" : "/student");
      }
    } catch (err) {
      setError(err.response?.data?.error || "❌ Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle Google success
  const handleGoogleSuccess = (credentialResponse) => {
    try {
      const data = jwtDecode(credentialResponse.credential);
      console.log("Google User:", data);

      // Prefill form with Google data
      setForm({
        ...form,
        username: data.name || "",
        email: data.email || "",
        password: data.sub, // using Google unique ID as placeholder
      });

      setGoogleUser(data); // Save to state to switch view
    } catch (error) {
      console.error("Google decode error:", error);
      alert("❌ Google sign-in failed. Try again.");
    }
  };

  const handleGoogleError = () => {
    alert("❌ Google sign-in failed. Please try again.");
  };

  // ✅ Continue after selecting role (for Google user)
  const handleContinue = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/google-register", form);
      if (res.data && res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        alert("✅ Account created via Google!");
        navigate(res.data.user.role === "faculty" ? "/faculty" : "/student");
      }
    } catch (err) {
      console.error(err);
      alert("❌ Account creation failed. Try again.");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      className="auth-wrapper"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >

      {/* 🪄 Card Container */}
      <motion.div
        className="auth-card glass-effect"
        variants={itemVariants}
      >
        <motion.div className="auth-brand" variants={itemVariants}>
          <motion.h1 variants={itemVariants}>Medha Mantana</motion.h1>
          <motion.p variants={itemVariants}>“Sharpen Your Medha, Master Every Mantana”</motion.p>
        </motion.div>

        {/* 🧾 IF NOT LOGGED IN WITH GOOGLE */}
        {!googleUser ? (
          <>
            <motion.h2
              className="text-2xl font-bold text-center mb-4 text-indigo-700"
              variants={itemVariants}
            >
              📝 Create an Account
            </motion.h2>

            {error && (
              <motion.p
                className="text-red-500 mb-3 text-center"
                variants={itemVariants}
              >
                {error}
              </motion.p>
            )}

            <motion.form
              onSubmit={handleRegister}
              className="auth-form space-y-4"
              variants={containerVariants}
            >
              <motion.input
                type="text"
                name="username"
                placeholder="Username"
                className="border p-2 w-full mb-3 rounded-lg focus:ring focus:ring-indigo-300"
                value={form.username}
                onChange={handleChange}
                required
                variants={itemVariants}
                whileFocus={{ scale: 1.02 }}
              />

              <motion.input
                type="email"
                name="email"
                placeholder="Email"
                className="border p-2 w-full mb-3 rounded-lg focus:ring focus:ring-indigo-300"
                value={form.email}
                onChange={handleChange}
                required
                variants={itemVariants}
                whileFocus={{ scale: 1.02 }}
              />

              <motion.input
                type="password"
                name="password"
                placeholder="Password"
                className="border p-2 w-full mb-3 rounded-lg focus:ring focus:ring-indigo-300"
                value={form.password}
                onChange={handleChange}
                required
                variants={itemVariants}
                whileFocus={{ scale: 1.02 }}
              />

              {/* ✅ Added placeholder option for role */}
              <motion.select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="border p-2 w-full mb-3 rounded-lg focus:ring focus:ring-indigo-300"
                required
                variants={itemVariants}
                whileFocus={{ scale: 1.02 }}
              >
                <option value="" disabled>
                  Select your role
                </option>
                <option value="student">👨‍🎓 Student</option>
                <option value="faculty">👩‍🏫 Faculty</option>
              </motion.select>

              {form.role === "faculty" && (
                <motion.input
                  type="text"
                  name="facultyCode"
                  placeholder="Enter Faculty Code"
                  className="border p-2 w-full mb-3 rounded-lg focus:ring focus:ring-indigo-300"
                  value={form.facultyCode}
                  onChange={handleChange}
                  required
                  variants={itemVariants}
                  whileFocus={{ scale: 1.02 }}
                />
              )}

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
                {loading ? "⏳ Registering..." : "🚀 Register"}
              </motion.button>
            </motion.form>

            {/* 🌐 Google Sign-Up Section */}
            <motion.div
              className="flex flex-col items-center mt-4"
              variants={itemVariants}
            >
              <motion.p
                className="text-gray-500 mb-2"
                variants={itemVariants}
              >
                or sign up with
              </motion.p>
              <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} />
            </motion.div>

            <motion.p
              className="text-sm text-center mt-4"
              variants={itemVariants}
            >
              Already have an account?{" "}
              <motion.span
                className="auth-link"
                whileHover={{ scale: 1.05 }}
              >
                <Link to="/login">Login here</Link>
              </motion.span>
            </motion.p>
          </>
        ) : (
          <>
            {/* 🧩 AFTER GOOGLE LOGIN */}
            <motion.h2
              className="text-xl font-bold text-center mb-4 text-indigo-700"
              variants={itemVariants}
            >
              Welcome {form.username}! 🎉
            </motion.h2>
            <motion.p
              className="text-center text-gray-600 mb-3"
              variants={itemVariants}
            >
              Please select your role to continue:
            </motion.p>

            <motion.select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="border p-2 w-full mb-3 rounded-lg focus:ring focus:ring-indigo-300"
              required
              variants={itemVariants}
              whileFocus={{ scale: 1.02 }}
            >
              <option value="" disabled>
                Select your role
              </option>
              <option value="student">👨‍🎓 Student</option>
              <option value="faculty">👩‍🏫 Faculty</option>
            </motion.select>

            {form.role === "faculty" && (
              <motion.input
                type="text"
                name="facultyCode"
                placeholder="Enter Faculty Code"
                className="border p-2 w-full mb-3 rounded-lg focus:ring focus:ring-indigo-300"
                value={form.facultyCode}
                onChange={handleChange}
                required
                variants={itemVariants}
                whileFocus={{ scale: 1.02 }}
              />
            )}

            <motion.button
              onClick={handleContinue}
              className="auth-btn w-full py-2 rounded-lg text-white"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Continue
            </motion.button>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
