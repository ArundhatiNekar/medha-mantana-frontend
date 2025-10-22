// frontend/src/pages/Splash.jsx
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import "../styles/Splash.css";

export default function Splash() {
  useEffect(() => {
    const timer = setTimeout(() => {
      window.location.href = "/home"; // Redirect after 3 seconds
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const logoVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 1.2,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      className="splash-container"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="brand-logo" variants={logoVariants}>
        <motion.h1 variants={itemVariants}>
          🪔 Medha <motion.span variants={itemVariants}>Mantana</motion.span>
        </motion.h1>
        <motion.p className="tagline" variants={itemVariants}>
          Sharpen Your Medha, Master Every Mantana
        </motion.p>
        <motion.p className="subtext" variants={itemVariants}>
          — The Intelligent Platform for Learning & Growth —
        </motion.p>
      </motion.div>

      <motion.div className="zones" variants={containerVariants}>
        <motion.div className="zone faculty" variants={itemVariants}>
          <motion.h2 variants={itemVariants}>ज्ञानपीठ</motion.h2>
          <motion.p variants={itemVariants}>The Seat of Knowledge</motion.p>
        </motion.div>
        <motion.div className="zone student" variants={itemVariants}>
          <motion.h2 variants={itemVariants}>मेधाकक्ष</motion.h2>
          <motion.p variants={itemVariants}>Chamber of Intellect</motion.p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
