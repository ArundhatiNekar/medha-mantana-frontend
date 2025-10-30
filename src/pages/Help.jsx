import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../styles/Home.css";

export default function Help() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  // 🌈 Apply background animation
  useEffect(() => {
    document.body.classList.add("home-page");
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
        <div
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
        >
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

        {/* 👇 Navbar login buttons */}
        <div className="nav-buttons">
          <button
            className="btn-outline"
            onClick={() => (window.location.href = "/login/student")}
          >
            👨‍🎓 Student Login
          </button>

          <button
            className="btn-outline"
            onClick={() => (window.location.href = "/login/faculty")}
          >
            👩‍🏫 Faculty Login
          </button>
        </div>
      </motion.nav>

      {/* 🆘 Help Section */}
      <motion.section
        className="glass-section uniform-bg"
        variants={cardVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.h2 variants={itemVariants}>Need Help?</motion.h2>
        <motion.p variants={itemVariants}>
          Our support team is always available to assist with login, quiz access, or technical issues.
        </motion.p>

        <motion.div className="help-buttons" variants={itemVariants}>
          <motion.button
            className="btn-primary"
            onClick={() => (window.location.href = "mailto:support@medhamanthana.com")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            📧 Email Support
          </motion.button>

          <motion.button
            className="btn-outline"
            onClick={() => window.open("https://wa.me/919876543210", "_blank")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            💬 WhatsApp Chat
          </motion.button>
        </motion.div>

        <motion.p className="mt-4" variants={itemVariants}>
          Visit our <b>FAQs</b> for common issues or get personalized assistance.
        </motion.p>

        {/* 💡 FAQs Section */}
        <motion.div className="faq-section" variants={itemVariants}>
          <h3>Frequently Asked Questions</h3>

          <div className="faq-item">
            <h4>How do I register as a student?</h4>
            <p>Click on "Student Login" and then select "Register" to create your account.</p>
          </div>

          <div className="faq-item">
            <h4>How do I register as faculty?</h4>
            <p>You'll need a faculty code to register. Contact your administrator for the code.</p>
          </div>

          <div className="faq-item">
            <h4>How do I take a quiz?</h4>
            <p>Login as a student, go to your dashboard, and click on available quizzes.</p>
          </div>

          <div className="faq-item">
            <h4>How do I create a quiz?</h4>
            <p>Login as faculty, go to your dashboard, and use the "Create Quiz" option.</p>
          </div>

          <div className="faq-item">
            <h4>Forgot password?</h4>
            <p>Contact support via email or WhatsApp for password reset assistance.</p>
          </div>
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
          © {new Date().getFullYear()} Medha Mantana — "Sharpen Your Medha, Master Every Mantana"
        </p>
      </motion.footer>
    </motion.div>
  );
}
