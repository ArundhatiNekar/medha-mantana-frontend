import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../styles/Home.css";
import Logo from "./Logo.jpg";

export default function Home() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  // 🌈 Apply background + scroll animation
  useEffect(() => {
    document.body.classList.add("home-page"); // ✅ Apply background image

    const handleScroll = () => {
      const navbar = document.querySelector(".home-navbar");
      if (window.scrollY > 60) navbar.classList.add("scrolled");
      else navbar.classList.remove("scrolled");
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      document.body.classList.remove("home-page");
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

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
          className={`hamburger ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>

        {/* Navbar links */}
        <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
          <li><button onClick={() => scrollToSection("about")}>About</button></li>
          <li><button onClick={() => scrollToSection("features")}>Features</button></li>
          <li><button onClick={() => scrollToSection("contact")}>Contact</button></li>
          <li><button onClick={() => scrollToSection("help")}>Help</button></li>
        </ul>

        <div className="nav-buttons">
          <button className="btn-outline" onClick={() => navigate("/login")}>
            Login
          </button>
        </div>
      </motion.nav>

      {/* 🌟 Hero Section */}
      <motion.section
        className="hero-section glass-card"
        variants={cardVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.div className="logo-image" variants={itemVariants}>
          <img src={Logo} alt="Medha Mantana Logo" />
        </motion.div>
        <motion.h1 variants={itemVariants}>
          Medha Mantana
          <br />
          <motion.span variants={itemVariants}>
            “Sharpen Your Medha, Master Every Mantana”
          </motion.span>
        </motion.h1>
        <motion.p variants={itemVariants}>
          A unified learning platform designed for aspiring students and
          dedicated faculty — enhancing analytical, reasoning, and technical
          skills through structured quizzes and intelligent insights.
        </motion.p>
        <motion.div className="hero-buttons" variants={itemVariants}>
          <motion.button
            className="btn-primary"
            onClick={() => navigate("/register")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🚀 Get Started
          </motion.button>
          <motion.button
            className="btn-outline"
            onClick={() => navigate("/login")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            🔑 Login
          </motion.button>
        </motion.div>
      </motion.section>

      {/* 💡 About */}
      <motion.section
        id="about"
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
      </motion.section>

      {/* ⚙️ Features */}
      <motion.section
        id="features"
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

      {/* 📞 Contact */}
      <motion.section
        id="contact"
        className="glass-section uniform-bg"
        variants={cardVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <motion.h2 variants={itemVariants}>Contact Us</motion.h2>
        <motion.p variants={itemVariants}>
          Have questions, suggestions, or collaboration ideas? Reach out to us anytime.
        </motion.p>
        <motion.p variants={itemVariants}>
          📧 <b>Email:</b> support@medhamanthana.com
        </motion.p>
        <motion.p variants={itemVariants}>
          ☎️ <b>Phone:</b> +91 98765 43210
        </motion.p>
        <motion.p variants={itemVariants}>
          📍 <b>Address:</b> Smt. Kamala & Sri Venkappa M. Agadi College of Engineering and Technology, Lakshmeshwar
        </motion.p>
      </motion.section>

      {/* 🆘 Help */}
      <motion.section
        id="help"
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
