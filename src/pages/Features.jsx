import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../styles/Home.css";

export default function Features() {
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

      {/* ⚙️ Features Section */}
      <motion.section
        className="glass-section uniform-bg"
        variants={cardVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.h2 variants={itemVariants}>Key Features</motion.h2>
        <motion.div className="features-grid" variants={containerVariants}>
          {[
            { icon: "🎯", title: "Smart Quiz Generation", desc: "Topic-wise and difficulty-based quizzes with auto evaluation." },
            { icon: "📊", title: "Performance Analytics", desc: "Track progress with accuracy and time insights." },
            { icon: "👩‍🏫", title: "Faculty Tools", desc: "Create quizzes, manage results, and view analytics seamlessly." },
            { icon: "🧠", title: "Multi-Category Learning", desc: "Quantitative, Logical, Verbal, Reasoning, and Technical skills." },
            { icon: "💬", title: "Modern UI", desc: "Interactive, fast, and responsive design for better engagement." },
            { icon: "🔒", title: "Role-Based Access", desc: "Secure authentication with dedicated interfaces for students, faculty, and admins." },
            { icon: "📱", title: "Responsive Design", desc: "Optimized for desktop, tablet, and mobile devices." },
            { icon: "🌐", title: "Google Integration", desc: "Easy sign-in with Google OAuth for quick access." },
            { icon: "📈", title: "Progress Tracking", desc: "Detailed analytics and performance reports." },
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="feature-card"
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {feature.icon} <b>{feature.title}</b>
              <br />
              <span>{feature.desc}</span>
            </motion.div>
          ))}
        </motion.div>
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
