import { COLLEGE_LOGO, NAAC_LOGO } from "../utils/certificateLogos";  // ✅ use Base64 logos
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import api from "../api/api";
import jsPDF from "jspdf";
import "../styles/StudentQuiz.css"; // ✅ Import Student Quiz styles

export default function StudentQuiz() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const isDemo = location.state?.demo || false;

  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [justSubmittedResult, setJustSubmittedResult] = useState(null);
  const [questionOrder, setQuestionOrder] = useState([]);

  // ---------------- FETCH QUIZ ----------------
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        let quizData;

        if (isDemo && location.state?.quiz) {
          quizData = location.state.quiz;
        } else {
          const res = await api.get(`/api/quizzes/${id.trim()}`); // ✅ fixed path
          quizData = res.data.quiz;
        }

        if (!quizData) {
          alert("❌ Quiz not found");
          navigate("/student");
          return;
        }

        if (!quizData?.questions?.length) {
  alert("⚠️ This quiz has no questions!");
  navigate("/student");
  return;
        }

        // ✅ Shuffle questions
        const shuffled = [...quizData.questions].sort(() => 0.5 - Math.random());
        quizData.questions = shuffled;
        setQuiz({ ...quizData, questions: shuffled });
        setQuestionOrder(shuffled.map((q) => q._id));
        if (!isDemo) {
          const saved = JSON.parse(localStorage.getItem(`quiz_${id}`));
          if (saved) {
            setAnswers(saved.answers || {});
            setTimeLeft(saved.timeLeft || quizData.duration);
          } else {
            setTimeLeft(quizData.duration);
          }
        } else {
          setTimeLeft(quizData.duration);
        }
      } catch (err) {
        console.error("❌ Error fetching quiz:", err);
        alert("Failed to load quiz");
        navigate("/student");
      }
    };
    fetchQuiz();

    // ✅ Apply Student Quiz background
    document.body.classList.remove("faculty-dashboard");
    document.body.classList.add("student-quiz");
    document.body.style.overflowY = "auto";
    document.body.style.minHeight = "100vh";

    window.scrollTo(0, 0);

    // ✅ Prevent copy-paste and right-click
    const preventCopyPaste = (e) => {
      e.preventDefault();
      return false;
    };

    const preventRightClick = (e) => {
      e.preventDefault();
      return false;
    };

    const preventKeyboardShortcuts = (e) => {
      if (e.ctrlKey && (e.key === 'c' || e.key === 'v' || e.key === 'x' || e.key === 'a' || e.key === 'u')) {
        e.preventDefault();
        return false;
      }
      if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I')) {
        e.preventDefault();
        return false;
      }
    };

    document.addEventListener('contextmenu', preventRightClick);
    document.addEventListener('copy', preventCopyPaste);
    document.addEventListener('paste', preventCopyPaste);
    document.addEventListener('cut', preventCopyPaste);
    document.addEventListener('selectstart', preventCopyPaste);
    document.addEventListener('keydown', preventKeyboardShortcuts);

    // ✅ Prevent text selection and dragging
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';
    document.body.style.msUserSelect = 'none';

    return () => {
      document.removeEventListener('contextmenu', preventRightClick);
      document.removeEventListener('copy', preventCopyPaste);
      document.removeEventListener('paste', preventCopyPaste);
      document.removeEventListener('cut', preventCopyPaste);
      document.removeEventListener('selectstart', preventCopyPaste);
      document.removeEventListener('keydown', preventKeyboardShortcuts);
      document.body.style.userSelect = '';
      document.body.style.webkitUserSelect = '';
      document.body.style.msUserSelect = '';
      document.body.classList.remove("student-quiz");
    };
  }, [id, isDemo, location.state, navigate]);

  // ---------------- TIMER ----------------
  useEffect(() => {
    if (timeLeft === null || submitted) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmit();
          return 0;
        }

        const newTime = prev - 1;

        if (!isDemo) {
          localStorage.setItem(
            `quiz_${id}`,
            JSON.stringify({ answers, timeLeft: newTime })
          );
        }

        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, submitted, answers, id, isDemo]);

  // ---------------- FORMAT TIME ----------------
  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  // ---------------- HANDLE ANSWER ----------------
  const handleAnswer = (qId, option) => {
    if (submitted) return;
    const updated = { ...answers, [qId]: option };
    setAnswers(updated);

    if (!isDemo) {
      localStorage.setItem(
        `quiz_${id}`,
        JSON.stringify({ answers: updated, timeLeft })
      );
    }
  };

  // ---------------- SUBMIT ----------------
  const handleSubmit = async () => {
    if (!quiz || submitted) return;

    const total = quiz.questions.length;
    let score = 0;
    quiz.questions.forEach((q) => {
      if (answers[q._id] === q.answer) score++;
    });

    const allowedTime = quiz.duration;
    const timeTaken = allowedTime - timeLeft;

    if (isDemo) {
      const snapshotAnswers = quiz.questions.map((q) => ({
        questionId: q._id,
        question: q.question,
        options: q.options,
        correctAnswer: q.answer,
        explanation: q.explanation,
        chosenAnswer: answers[q._id],
        correct: answers[q._id] === q.answer,
      }));

      setJustSubmittedResult({
        score,
        total,
        timeTaken,
        answers: snapshotAnswers,
      });
      setSubmitted(true);
      return;
    }

    try {
      const res = await api.post("/api/results", { // ✅ fixed path
        quizId: quiz._id,
        studentName:
          JSON.parse(localStorage.getItem("user"))?.username || "Anonymous",
        answers,
        score,
        total,
        timeTaken,
        questionOrder,
      });

      setJustSubmittedResult(res.data.result);
      setSubmitted(true);
      localStorage.removeItem(`quiz_${id}`);
    } catch (err) {
      console.error("❌ Error submitting results:", err);
      alert("Failed to submit quiz");
    }
  };

  // ---------------- GENERATE CERTIFICATE ----------------
  const generateCertificate = async () => {
    try {
      const student = JSON.parse(localStorage.getItem("user"));
      const doc = new jsPDF("landscape", "pt", "a4");

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      // ===== BACKGROUND =====
      doc.setFillColor(253, 251, 251);
      doc.rect(0, 0, pageWidth, pageHeight, "F");

      // ===== BORDER =====
      doc.setDrawColor(218, 165, 32);
      doc.setLineWidth(10);
      doc.roundedRect(30, 30, pageWidth - 60, pageHeight - 60, 20, 20, "S");

      // ===== LOGOS =====
      doc.addImage(COLLEGE_LOGO, "PNG", 60, 40, 100, 100);
      doc.addImage(NAAC_LOGO, "PNG", pageWidth - 160, 40, 100, 100);

      // ===== HEADER =====
      doc.setFont("times", "bold");
      doc.setFontSize(22);
      doc.setTextColor(30, 30, 30);
      doc.text("Smt. Kamala & Sri Venkappa M. Agadi", pageWidth / 2, 100, { align: "center" });
      doc.text("College of Engineering and Technology, Lakshmeshwar", pageWidth / 2, 130, { align: "center" });
      doc.setFontSize(18);
      doc.text("Department of Computer Science & Engineering", pageWidth / 2, 158, { align: "center" });
      doc.setFont("times", "bold");
      doc.setFontSize(25);
      doc.text("Medha Mantana Online Platform", pageWidth / 2, 192, { align: "center" });

      // ===== TITLE =====
      doc.setFont("times", "bold");
      doc.setFontSize(45);
      doc.setTextColor(218, 165, 32);
      doc.text("CERTIFICATE", pageWidth / 2, 250, { align: "center" });
      doc.setFontSize(22);
      doc.setTextColor(0, 0, 0);
      doc.text("OF ACHIEVEMENT", pageWidth / 2, 280, { align: "center" });

      // ===== RIBBON =====
      doc.setDrawColor(255, 215, 0);
      doc.setLineWidth(3);
      doc.line(120, 300, pageWidth - 120, 300);

      // ===== PRESENTED TO =====
      doc.setFont("times", "italic");
      doc.setFontSize(18);
      doc.text("This Certificate is Proudly Presented To", pageWidth / 2, 340, { align: "center" });

      // ===== STUDENT NAME =====
      doc.setFont("times", "italic");
      doc.setFontSize(42);
      doc.setTextColor(0, 102, 204);
      doc.text(student?.username || "Student", pageWidth / 2, 390, { align: "center" });

      // ===== QUIZ DETAILS =====
      doc.setFont("times", "normal");
      doc.setFontSize(18);
      doc.setTextColor(0, 0, 0);
      doc.text(`For successfully completing the quiz "${quiz.title}"`, pageWidth / 2, 440, { align: "center", maxWidth: 700 });
    
      // ===== DATE & STAMP =====
      doc.setFontSize(14);
      doc.text("Date: " + new Date().toLocaleDateString(), 100, pageHeight - 100);

      // ===== FOOTER =====
      doc.setFont("helvetica", "italic");
      doc.setFontSize(14);
      doc.setTextColor(90, 90, 90);
      doc.text("Generated by Medha Mantana - Empowering Students with Practice", pageWidth / 2, pageHeight - 50, { align: "center" });

      doc.save(`Certificate_${quiz.title}_${student?.username}.pdf`);
    } catch (err) {
      console.error("❌ Error generating certificate:", err);
      alert("Failed to generate certificate. Please try again.");
    }
  };

  if (!quiz) return (
    <div className="quiz-container">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
      <p className="text-center mt-4 text-lg">⏳ Loading quiz...</p>
    </div>
  );

  return (
    <div className="quiz-container">
      <div className="timer-badge">
            ⏳ {timeLeft !== null ? formatTime(timeLeft) : "Loading..."}
          </div>
      <div className="quiz-card">
        {/* Header */}
        <div className="quiz-header">
          <div>
            <h1>
              {quiz.title} {isDemo && "(Demo)"}
            </h1>
            <p>
              Categories:{" "}
              {Array.isArray(quiz.categories)
                ? quiz.categories.map((c) => c.charAt(0).toUpperCase() + c.slice(1)).join(", ")
                : quiz.category || "General"}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="quiz-content">
          {/* Questions */}
          {quiz.questions.map((q, idx) => (
            <div key={q._id} className="question-card" style={{ userSelect: "none" }}>
              <p className="question-number">{idx + 1}.</p>
              <p className="question-text" style={{ userSelect: "none" }}>
                {q.question}
              </p>
              <div className="options-container">
                {q.options.map((opt, i) => (
                  <label key={i} className="option-label">
                    <input
                      type="radio"
                      name={q._id}
                      value={opt}
                      checked={answers[q._id] === opt}
                      onChange={() => handleAnswer(q._id, opt)}
                      disabled={submitted}
                      className="option-input"
                    />
                    {opt}
                  </label>
                ))}
              </div>
            </div>
          ))}

          {/* Submit button */}
          {!submitted && (
            <div className="submit-section">
              <button
                onClick={handleSubmit}
                className="btn-submit-quiz"
              >
                Submit Quiz
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Result Modal */}
      {justSubmittedResult && (
        <div className="result-modal-overlay">
          <div className="result-modal">
            <div className="result-header">
              <h2>📊 Your Result</h2>
            </div>
            <div className="result-content">
              <div className="result-summary">
                <div className="result-item">
                  <p>Score</p>
                  <p>{justSubmittedResult.score} / {justSubmittedResult.total}</p>
                </div>
                <div className="result-item">
                  <p>Time Taken</p>
                  <p>{justSubmittedResult.timeTaken} sec</p>
                </div>
                <div className="result-item">
                  <p>Percentage</p>
                  <p>{Math.round((justSubmittedResult.score / justSubmittedResult.total) * 100)}%</p>
                </div>
              </div>

              {/* 🏆 Certificate Section */}
              {quiz.certificateEnabled && justSubmittedResult.score >= quiz.certificatePassingScore && (
                <div className="certificate-section">
                  <p>
                    🎉 Congratulations! You passed and earned a certificate.
                  </p>
                  <button
                    onClick={generateCertificate}
                    className="btn-download-cert"
                  >
                    📜 Download Certificate
                  </button>
                </div>
              )}

              {/* Review Section */}
              <div className="review-section">
                <h3>📝 Review</h3>
                {justSubmittedResult.answers.map((q, idx) => (
                  <div
                    key={idx}
                    className={`review-item ${q.correct ? 'correct' : 'incorrect'}`}
                  >
                    <p className="review-question">{idx + 1}. {q.question}</p>

                    <ul className="options-list">
                      {q.options.map((opt, i) => (
                        <li
                          key={i}
                          className={`${
                            opt === q.correctAnswer
                              ? "option-correct"
                              : opt === q.chosenAnswer
                              ? "option-wrong"
                              : ""
                          }`}
                        >
                          {opt}
                        </li>
                      ))}
                    </ul>

                    <div className="answer-info">
                      <p>
                        <b>Your Answer:</b>{" "}
                        <span className={q.correct ? "text-green-700" : "text-red-600"}>
                          {q.chosenAnswer || "Not Answered"}
                        </span>{" "}
                        {q.correct ? "✅" : "❌"}
                      </p>
                      <p>
                        <b>Correct Answer:</b>{" "}
                        <span className="text-green-700">{q.correctAnswer}</span> ✅
                      </p>
                      <p className="explanation">
                        <b>Explanation:</b> 📘 {q.explanation}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Close Button */}
              <div className="text-center">
                <button
                  onClick={() => {
                    setJustSubmittedResult(null);
                    navigate("/student");
                  }}
                  className="btn-close-modal"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
