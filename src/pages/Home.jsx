import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../styles/Home.css";


export default function Home() {
  
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [backgroundParticles, setBackgroundParticles] = useState([]);
  const [waveOffset, setWaveOffset] = useState(0);

  // 🌈 Apply background + scroll animation
  useEffect(() => {
    document.body.classList.add("home-page"); // ✅ Apply background image

    const handleScroll = () => {
      const navbar = document.querySelector(".home-navbar");
      if (window.scrollY > 60) navbar.classList.add("scrolled");
      else navbar.classList.remove("scrolled");
      setWaveOffset(window.scrollY * 0.5); // Parallax effect for waves
    };

    window.addEventListener("scroll", handleScroll);

    // Generate background particles
    const generateParticles = () => {
      const particles = [];
      for (let i = 0; i < 20; i++) {
        particles.push({
          id: i,
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          size: Math.random() * 8 + 3,
          speed: Math.random() * 30 + 15,
          color: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dda0dd'][Math.floor(Math.random() * 6)],
          shape: Math.random() > 0.5 ? 'circle' : 'square',
          rotation: Math.random() * 360,
        });
      }
      setBackgroundParticles(particles);
    };

    generateParticles();

    return () => {
      document.body.classList.remove("home-page");
      window.removeEventListener("scroll", handleScroll);
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
      {/* 🌊 Animated Wave Background */}
      <div className="wave-container">
        <motion.svg
          className="wave wave-1"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          style={{ transform: `translateY(${waveOffset * 0.1}px)` }}
        >
          <motion.path
            d="M0,60 C300,100 600,20 900,60 C1050,80 1200,40 1200,60 L1200,120 L0,120 Z"
            fill="rgba(255,107,107,0.1)"
            animate={{
              d: [
                "M0,60 C300,100 600,20 900,60 C1050,80 1200,40 1200,60 L1200,120 L0,120 Z",
                "M0,40 C300,80 600,10 900,50 C1050,70 1200,30 1200,50 L1200,120 L0,120 Z",
                "M0,60 C300,100 600,20 900,60 C1050,80 1200,40 1200,60 L1200,120 L0,120 Z",
              ],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.svg>
        <motion.svg
          className="wave wave-2"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          style={{ transform: `translateY(${waveOffset * 0.2}px)` }}
        >
          <motion.path
            d="M0,80 C300,40 600,100 900,80 C1050,60 1200,80 1200,80 L1200,120 L0,120 Z"
            fill="rgba(78,205,196,0.1)"
            animate={{
              d: [
                "M0,80 C300,40 600,100 900,80 C1050,60 1200,80 1200,80 L1200,120 L0,120 Z",
                "M0,70 C300,30 600,90 900,70 C1050,50 1200,70 1200,70 L1200,120 L0,120 Z",
                "M0,80 C300,40 600,100 900,80 C1050,60 1200,80 1200,80 L1200,120 L0,120 Z",
              ],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
          />
        </motion.svg>
      </div>

      {/* 🌟 Background Animation */}
      <div className="background-animation">
        {backgroundParticles.map((particle) => (
          <motion.div
            key={particle.id}
            className={`background-particle ${particle.shape}`}
            style={{
              left: particle.x,
              top: particle.y,
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
              borderRadius: particle.shape === 'circle' ? '50%' : '0',
              transform: `rotate(${particle.rotation}deg)`,
            }}
            animate={{
              y: [0, -particle.speed, 0],
              x: [0, Math.random() * 40 - 20, 0],
              opacity: [0.1, 0.5, 0.1],
              scale: [0.8, 1.3, 0.8],
              rotate: [particle.rotation, particle.rotation + 180, particle.rotation],
            }}
            transition={{
              duration: particle.speed / 10 + 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 3,
            }}
          />
        ))}

        {/* Geometric Patterns */}
        <motion.div
          className="geometric-pattern pattern-1"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.2, 1],
            x: [0, 20, 0],
          }}
          transition={{
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
            x: { duration: 6, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          <svg width="100" height="100" viewBox="0 0 100 100">
            <polygon points="50,5 90,25 90,75 50,95 10,75 10,25" fill="none" stroke="#ff6b6b" strokeWidth="1" opacity="0.15" />
          </svg>
        </motion.div>

        <motion.div
          className="geometric-pattern pattern-2"
          animate={{
            rotate: [360, 0],
            scale: [1.1, 1, 1.1],
            y: [0, -15, 0],
          }}
          transition={{
            rotate: { duration: 25, repeat: Infinity, ease: "linear" },
            scale: { duration: 5, repeat: Infinity, ease: "easeInOut" },
            y: { duration: 7, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          <svg width="80" height="80" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="35" fill="none" stroke="#4ecdc4" strokeWidth="1" opacity="0.15" />
            <circle cx="40" cy="40" r="25" fill="none" stroke="#45b7d1" strokeWidth="1" opacity="0.15" />
            <circle cx="40" cy="40" r="15" fill="none" stroke="#96ceb4" strokeWidth="1" opacity="0.15" />
          </svg>
        </motion.div>

        <motion.div
          className="geometric-pattern pattern-3"
          animate={{
            rotate: [0, -360],
            scale: [1, 1.3, 1],
            x: [0, -25, 0],
          }}
          transition={{
            rotate: { duration: 30, repeat: Infinity, ease: "linear" },
            scale: { duration: 6, repeat: Infinity, ease: "easeInOut" },
            x: { duration: 8, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          <svg width="60" height="60" viewBox="0 0 60 60">
            <rect x="5" y="5" width="50" height="50" fill="none" stroke="#ffeaa7" strokeWidth="1" opacity="0.15" rx="5" />
            <rect x="15" y="15" width="30" height="30" fill="none" stroke="#ff6b6b" strokeWidth="1" opacity="0.15" rx="3" />
          </svg>
        </motion.div>

        {/* Floating Stars */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`star-${i}`}
            className="floating-star"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 0.8, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut",
              repeatDelay: 2,
            }}
          >
            ⭐
          </motion.div>
        ))}
      </div>

      {/* 🧭 Navbar */}
      <motion.nav
        className="home-navbar glass-nav"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        whileHover={{ boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
      >
        <motion.div
          className="logo"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <h1>
            Medha <span>Mantana</span>
          </h1>
        </motion.div>

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
          <motion.li whileHover={{ scale: 1.1, color: "#ff6b6b" }} transition={{ type: "spring", stiffness: 300 }}>
            <button onClick={() => navigate("/about")}>About</button>
          </motion.li>
          <motion.li whileHover={{ scale: 1.1, color: "#4ecdc4" }} transition={{ type: "spring", stiffness: 300 }}>
            <button onClick={() => navigate("/features")}>Features</button>
          </motion.li>
          <motion.li whileHover={{ scale: 1.1, color: "#45b7d1" }} transition={{ type: "spring", stiffness: 300 }}>
            <button onClick={() => navigate("/contact")}>Contact</button>
          </motion.li>
          <motion.li whileHover={{ scale: 1.1, color: "#96ceb4" }} transition={{ type: "spring", stiffness: 300 }}>
            <button onClick={() => navigate("/help")}>Help</button>
          </motion.li>
        </ul>

        <div className="nav-buttons">
          <motion.button
            className="btn-outline"
            onClick={() => navigate("/login/student")}
            whileHover={{ scale: 1.05, backgroundColor: "#ff6b6b", color: "#ffffff" }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            Student Login
          </motion.button>
          <motion.button
            className="btn-outline"
            onClick={() => navigate("/login/faculty")}
            whileHover={{ scale: 1.05, backgroundColor: "#4ecdc4", color: "#ffffff" }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            Faculty Login
          </motion.button>
          <motion.button
            className="btn-outline"
            onClick={() => navigate("/login/admin")}
            whileHover={{ scale: 1.05, backgroundColor: "#96ceb4", color: "#ffffff" }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
             Admin Login
          </motion.button>
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
        {/* Animated Background Illustration */}
        <motion.div
          className="background-illustration"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ delay: 1, duration: 2 }}
        >
          <motion.svg
            width="400"
            height="300"
            viewBox="0 0 400 300"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              position: "absolute",
              top: "20%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 0,
              opacity: 0.1,
            }}
            animate={{
              scale: [1, 1.02, 1],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {/* Brain Outline */}
            <motion.path
              d="M100 160 Q100 120 140 120 Q180 120 180 160 Q180 200 140 200 Q100 200 100 160"
              stroke="#ff6b6b"
              strokeWidth="4"
              fill="none"
              animate={{
                pathLength: [0, 1],
                stroke: ["#ff6b6b", "#4ecdc4", "#ff6b6b"],
              }}
              transition={{
                pathLength: { duration: 3, delay: 1 },
                stroke: { duration: 4, repeat: Infinity, ease: "easeInOut" },
              }}
            />
            {/* Left Hemisphere */}
            <motion.path
              d="M140 120 Q100 100 100 160 Q100 220 140 200"
              stroke="#4ecdc4"
              strokeWidth="4"
              fill="none"
              animate={{
                pathLength: [0, 1],
                stroke: ["#4ecdc4", "#45b7d1", "#4ecdc4"],
              }}
              transition={{
                pathLength: { duration: 3, delay: 1.5 },
                stroke: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 },
              }}
            />
            {/* Right Hemisphere */}
            <motion.path
              d="M140 120 Q180 100 180 160 Q180 220 140 200"
              stroke="#45b7d1"
              strokeWidth="4"
              fill="none"
              animate={{
                pathLength: [0, 1],
                stroke: ["#45b7d1", "#96ceb4", "#45b7d1"],
              }}
              transition={{
                pathLength: { duration: 3, delay: 2 },
                stroke: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 },
              }}
            />
            {/* Neural Connections */}
            <motion.line
              x1="140"
              y1="160"
              x2="120"
              y2="140"
              stroke="#ff6b6b"
              strokeWidth="3"
              animate={{
                opacity: [0, 0.3, 0],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2.5,
              }}
            />
            <motion.line
              x1="140"
              y1="160"
              x2="160"
              y2="140"
              stroke="#4ecdc4"
              strokeWidth="3"
              animate={{
                opacity: [0, 0.3, 0],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 3,
              }}
            />
            {/* Thought Bubbles */}
            <motion.circle
              cx="80"
              cy="80"
              r="12"
              fill="#ff6b6b"
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 0.2, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
            />
            <motion.circle
              cx="200"
              cy="70"
              r="10"
              fill="#4ecdc4"
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 0.2, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2,
              }}
            />
            <motion.circle
              cx="220"
              cy="100"
              r="8"
              fill="#45b7d1"
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 0.2, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2.5,
              }}
            />
          </motion.svg>
        </motion.div>

        <motion.div
          className="hero-content"
          variants={itemVariants}
          style={{ position: "relative", zIndex: 1 }}
        >

          <motion.h1
            variants={itemVariants}
            animate={{
              textShadow: [
                "0 0 5px rgba(255,255,255,0.5)",
                "0 0 20px rgba(255,255,255,0.8)",
                "0 0 5px rgba(255,255,255,0.5)",
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            Welcome to
            <motion.br />
            <motion.span
              variants={itemVariants}
              animate={{
                color: ["#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", "#ff6b6b"],
                textShadow: [
                  "0 0 10px rgba(255,107,107,0.5)",
                  "0 0 20px rgba(78,205,196,0.7)",
                  "0 0 10px rgba(255,107,107,0.5)",
                ],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              Medha Mantana
            </motion.span>
          </motion.h1>

          <motion.h2
            variants={itemVariants}
            style={{
              fontSize: "1.5rem",
              fontWeight: "300",
              color: "#666",
              margin: "1rem 0",
              textAlign: "center",
            }}
            animate={{
              textShadow: [
                "0 0 10px rgba(255,107,107,0.3)",
                "0 0 20px rgba(78,205,196,0.5)",
                "0 0 10px rgba(255,107,107,0.3)",
              ],
              color: ["#666", "#888", "#666"],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            "Sharpen Your Medha, Master Every Mantana"
          </motion.h2>



          <motion.div
            className="hero-buttons"
            variants={itemVariants}
          >
          </motion.div>
        </motion.div>
      </motion.section>

      {/* 🌎 Footer */}
      <motion.footer
        className="footer"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0, transition: { duration: 0.8 } }}
        viewport={{ once: true }}
        animate={{
          background: [
            "linear-gradient(45deg, rgba(255,107,107,0.1), rgba(78,205,196,0.1))",
            "linear-gradient(45deg, rgba(78,205,196,0.1), rgba(69,183,209,0.1))",
            "linear-gradient(45deg, rgba(255,107,107,0.1), rgba(78,205,196,0.1))",
          ],
        }}
        transition={{
          background: { duration: 5, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        <motion.p
          animate={{
            color: ["#666", "#888", "#666"],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          © {new Date().toLocaleDateString("en-GB")} Medha Mantana — "Sharpen Your Medha, Master Every Mantana"
        </motion.p>
      </motion.footer>
    </motion.div>
  );
}
