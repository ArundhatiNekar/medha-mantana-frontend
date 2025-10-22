import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../api/api";
import "../styles/QuizInstructions.css"; // ✅ Import Quiz Instructions styles

export default function QuizInstructions() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ✅ Apply Quiz Instructions background */
  useEffect(() => {
    document.body.classList.remove("faculty-dashboard");
    document.body.classList.add("quiz-instructions");
    document.body.style.overflowY = "auto";
    document.body.style.minHeight = "100vh";

    window.scrollTo(0, 0);

    return () => {
      document.body.classList.remove("quiz-instructions");
    };
  }, []);

  useEffect(() => {
    const fetchQuiz = async () => {
      // ✅ Handle demo quiz from state
      if (location.state?.demo && location.state?.quiz) {
        setQuiz(location.state.quiz);
        setLoading(false);
        return;
      }

      try {
        const res = await api.get(`/api/quizzes/${id.trim()}`);
        setQuiz(res.data.quiz);
      } catch (err) {
        console.error("❌ Error fetching quiz:", err);
        alert("Failed to load quiz");
        navigate("/student");
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [id, location.state?.session, navigate]);

  const handleStartQuiz = () => {
  const isDemo = location.state?.demo;
  const sessionKey = Date.now(); // unique per attempt
  navigate(`/quiz/${id}`, { 
    state: { instructionsRead: true, demo: isDemo, sessionKey } 
  });
};

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-600 to-cyan-600 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
    </div>
  );
  if (!quiz) return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-600 to-cyan-600 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-4">❌ Quiz Not Found</h2>
        <p className="text-white">Please check the quiz ID and try again.</p>
      </div>
    </div>
  );

  return (
    <div className="quiz-instructions-wrapper">
      <div className="quiz-instructions-card">
        {/* Header */}
        <div className="quiz-instructions-header">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Quiz Instructions
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Please read carefully before starting
          </motion.p>
        </div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="quiz-instructions-content"
        >
          {/* Quiz Details */}
          <div className="quiz-details-section">
            <h3>Quiz Details</h3>
            <div className="quiz-details-grid">
              <div className="detail-item">
                <p>Quiz Title</p>
                <p>{quiz.title}</p>
              </div>
              <div className="detail-item">
                <p>Number of Questions</p>
                <p>{quiz.numQuestions}</p>
              </div>
              <div className="detail-item">
                <p>Duration</p>
                <p>{Math.floor(quiz.duration / 60)} minutes</p>
              </div>
              <div className="detail-item">
                <p>Categories</p>
                <p>
                  {Array.isArray(quiz.categories)
                    ? quiz.categories.map((c) => c.charAt(0).toUpperCase() + c.slice(1)).join(", ")
                    : quiz.category || "General"}
                </p>
              </div>
              {quiz.certificateEnabled && (
                <div className="detail-item">
                  <p>Certificate</p>
                  <p>Enabled (Passing Score: {quiz.certificatePassingScore})</p>
                </div>
              )}
            </div>
          </div>

          <div className="guidelines-section">
            <h3>Important Guidelines:</h3>
            <div className="guidelines-grid">
              <div className="guideline-item">
                <h4>Read Carefully</h4>
                <p>Take your time to understand each question before selecting an answer.</p>
              </div>
              <div className="guideline-item">
                <h4>Single Correct Answer</h4>
                <p>Each question has only one correct answer. Choose the best option.</p>
              </div>
              <div className="guideline-item">
                <h4>Timer</h4>
                <p>The quiz has a fixed time limit. Once started, the timer cannot be paused.</p>
              </div>
              <div className="guideline-item">
                <h4>No External Help</h4>
                <p>Do not use any external resources or assistance from others.</p>
              </div>
              <div className="guideline-item">
                <h4>Navigation</h4>
                <p>You can change answers before submitting. Review if time permits.</p>
              </div>
              <div className="guideline-item">
                <h4>Submission</h4>
                <p>Click "Submit Quiz" when done or when time expires.</p>
              </div>
            </div>
          </div>

          <div className="warning-section">
            <p>
              <strong>Academic Integrity:</strong> By starting the quiz, you agree to follow these instructions and maintain honesty.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="start-quiz-section"
          >
            <button
              onClick={handleStartQuiz}
              className="btn-start-quiz"
            >
              Start Quiz
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
