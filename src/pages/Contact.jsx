import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../styles/Home.css";

export default function Contact() {
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

      {/* 📞 Contact Section */}
      <motion.section
        className="glass-section uniform-bg"
        variants={cardVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.h2 variants={itemVariants}>Get In Touch</motion.h2>
        <motion.p variants={itemVariants}>
          We're here to help you with any questions or support you may need. Feel free to reach out through any of the following channels.
        </motion.p>
        <motion.div className="contact-info" variants={itemVariants}>
          <h3>Contact Information</h3>
          <div className="contact-details">
            <div className="contact-item">
              <span className="contact-icon">📧</span>
              <div>
                <strong>Email</strong>
                <p>support@medhamanthana.com</p>
              </div>
            </div>
            <div className="contact-item">
              <span className="contact-icon">☎️</span>
              <div>
                <strong>Phone</strong>
                <p>+91 98765 43210</p>
              </div>
            </div>
            <div className="contact-item">
              <span className="contact-icon">📍</span>
              <div>
                <strong>Address</strong>
                <p>Smt. Kamala & Sri Venkappa M. Agadi College of Engineering and Technology, Lakshmeshwar</p>
              </div>
            </div>
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
          © {new Date().toLocaleDateString("en-GB")} Medha Mantana — "Sharpen Your Medha, Master Every Mantana"
        </p>
      </motion.footer>
    </motion.div>
  );
}
