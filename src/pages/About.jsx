import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../styles/Home.css";

export default function About() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  // 🌈 Apply background + scroll animation
  useEffect(() => {
    document.body.classList.add("home-page"); // ✅ Apply background image

    return () => {
      document.body.classList.remove("home-page");
    };
  }, []);

  // ✨ Animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.5, staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      className="home-wrapper"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* 🧭 Navbar */}
      <motion.nav
        className="home-navbar glass-nav"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="logo">
          <h1>
            Medha <span>Mantana</span>
          </h1>
        </div>

        {/* Hamburger icon */}
        <div className="hamburger">
          <span></span>
          <span></span>
          <span></span>
        </div>

        {/* Navbar links */}
        <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
          <li><button onClick={() => navigate("/")}>Home</button></li>
          <li><button onClick={() => navigate("/about")}>About</button></li>
          <li><button onClick={() => navigate("/features")}>Features</button></li>
          <li><button onClick={() => navigate("/contact")}>Contact</button></li>
          <li><button onClick={() => navigate("/help")}>Help</button></li>
        </ul>

        <div className="nav-buttons">
          <button className="btn-outline" onClick={() => window.location.href = "/login/student"}>
            👨‍🎓 Student Login
          </button>
          <button className="btn-outline" onClick={() => window.location.href = "/login/faculty"}>
            👩‍🏫 Faculty Login
          </button>
        </div>
      </motion.nav>

      {/* 💡 About Section */}
      <motion.section
        className="glass-section uniform-bg"
        variants={cardVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.h2 variants={itemVariants}>About Medha Mantana</motion.h2>
        <motion.p variants={itemVariants}>
          <b>Medha Mantana</b> is a next-generation aptitude and technical
          training platform designed to strengthen logical reasoning, problem
          solving, and communication abilities. It bridges the gap between
          academic learning and aptitude development through smart,
          performance-based quizzes.
        </motion.p>
        <motion.p variants={itemVariants}>
          Our platform serves three key user groups: students who want to excel in competitive exams,
          faculty members who create and manage educational content, and administrators who oversee
          the entire system. Each role has tailored tools and interfaces to maximize productivity and learning outcomes.
        </motion.p>
        <motion.p variants={itemVariants}>
          With features like automated quiz generation, real-time analytics, and comprehensive
          performance tracking, Medha Mantana provides a complete solution for modern education needs.
        </motion.p>
      </motion.section>

      {/* 🌎 Footer */}
      <motion.footer
        className="footer"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <p>
          © {new Date().toLocaleDateString("en-GB")} Medha Mantana — "Sharpen Your Medha, Master Every Mantana"
        </p>
      </motion.footer>
    </motion.div>
  );
}
