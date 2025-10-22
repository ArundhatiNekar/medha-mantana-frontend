// frontend/src/pages/StudentDashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import jsPDF from "jspdf"; // ✅ Added
import { COLLEGE_LOGO, NAAC_LOGO } from "../utils/certificateLogos"; // ✅ Added
import "../styles/StudentDashboard.css"; // ✅ Import Student Dashboard styles

export default function StudentDashboard() {
  const student = JSON.parse(localStorage.getItem("user"));

  const [quizzes, setQuizzes] = useState([]);
  const [myResults, setMyResults] = useState([]);
  const [quizCode, setQuizCode] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showProfile, setShowProfile] = useState(false);


  const navigate = useNavigate();

  /* ✅ Apply Faculty Dashboard background & scroll fix for Student Dashboard */
  useEffect(() => {
    document.body.classList.remove("auth-page");
    document.body.classList.add("faculty-dashboard"); // ✅ Use same class as FacultyDashboard
    document.body.style.overflowY = "auto";
    document.body.style.minHeight = "100vh";

    window.scrollTo(0, 0);

    return () => {
      document.body.classList.remove("faculty-dashboard");
    };
  }, []);

  const DEMO_CATEGORIES = [
    "All",
    "Quantitative",
    "Logical",
    "Verbal",
    "Numerical",
    "Spatial",
    "Mechanical",
    "Technical",
    "Reasoning",
    "General",
  ];

  /* ---------------- FETCH DATA ---------------- */
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      await Promise.all([fetchQuizzes(), fetchMyResults()]);
    } catch (err) {
      console.error("❌ Error fetching data:", err);
      setError("Failed to load data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchQuizzes = async () => {
    try {
      const res = await api.get("/quizzes");
      if (res.data?.quizzes?.length > 0) {
        setQuizzes(res.data.quizzes);
      } else {
        setQuizzes([]);
      }
    } catch (err) {
      console.error("❌ Error fetching quizzes:", err.response || err);
      setError("Unable to fetch quizzes. Check backend connection.");
    }
  };

  const fetchMyResults = async () => {
    try {
      if (!student?.username) return;
      const res = await api.get(`/results/student/${student.username}`);
      setMyResults(res.data.results || []);
    } catch (err) {
      console.error("❌ Error fetching student results:", err.response || err);
    }
  };

  /* ---------------- LOGOUT ---------------- */
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };



  /* ---------------- JOIN QUIZ BY ID ---------------- */
  const handleJoinQuiz = async () => {
    const quizId = quizCode.trim();

    if (!quizId) {
      alert("⚠️ Please enter a valid Quiz ID");
      return;
    }

    try {
      const res = await api.get(`/quizzes/${quizId}`);

      if (res.data?.quiz) {
        const alreadyAttempted = myResults.some(
          (r) => String(r.quizId?._id).trim() === quizId
        );
        if (alreadyAttempted) {
          alert("❌ You have already attempted this quiz");
          return;
        }

        navigate(`/quiz/${quizId}/instructions`);
      } else {
        alert("❌ Invalid Quiz ID");
      }
    } catch (err) {
      console.error("❌ Error joining quiz:", err.response?.data || err.message);
      alert("❌ Quiz not found. Please check the ID and try again.");
    }
  };

  /* ---------------- START DEMO QUIZ ---------------- */
  const handleStartDemoQuiz = async () => {
    if (!selectedCategory) return alert("⚠️ Please choose a category");

    try {
      const categoryParam = selectedCategory.toLowerCase();
      const res = await api.get(`/quizzes/demo/${categoryParam}`);
      if (res.data?.quiz) {
        navigate(`/quiz/${res.data.quiz._id}`, {
          state: { demo: true, quiz: res.data.quiz },
        });
      }
    } catch (err) {
      console.error("❌ Error fetching demo quiz:", err.response || err);
      alert("❌ Failed to load demo quiz");
    }
  };

  /* ---------------- GENERATE CERTIFICATE ---------------- */
  const generateCertificate = (quiz, result) => {
    try {
      const doc = new jsPDF("landscape", "pt", "a4");
      const student = JSON.parse(localStorage.getItem("user"));
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      // Background
      doc.setFillColor(253, 251, 251);
      doc.rect(0, 0, pageWidth, pageHeight, "F");

      // Border
      doc.setDrawColor(218, 165, 32);
      doc.setLineWidth(10);
      doc.roundedRect(30, 30, pageWidth - 60, pageHeight - 60, 20, 20, "S");

      // Logos
      doc.addImage(COLLEGE_LOGO, "PNG", 60, 40, 100, 100);
      doc.addImage(NAAC_LOGO, "PNG", pageWidth - 160, 40, 100, 100);

      // Header
      doc.setFont("times", "bold");
      doc.setFontSize(22);
      doc.text("Smt. Kamala & Sri Venkappa M. Agadi", pageWidth / 2, 100, { align: "center" });
      doc.text("College of Engineering and Technology, Lakshmeshwar", pageWidth / 2, 130, { align: "center" });
      doc.setFontSize(18);
      doc.text("Department of Computer Science & Engineering", pageWidth / 2, 158, { align: "center" });
      doc.setFont("times", "bold");
      doc.setFontSize(25);
      doc.text("Medha Mantana Online Platform", pageWidth / 2, 192, { align: "center" });

      // Title
      doc.setFont("times", "bold");
      doc.setFontSize(45);
      doc.setTextColor(218, 165, 32);
      doc.text("CERTIFICATE", pageWidth / 2, 250, { align: "center" });
      doc.setFontSize(22);
      doc.setTextColor(0, 0, 0);
      doc.text("OF ACHIEVEMENT", pageWidth / 2, 280, { align: "center" });

      // Line
      doc.setDrawColor(255, 215, 0);
      doc.setLineWidth(3);
      doc.line(120, 300, pageWidth - 120, 300);

      // Presented To
      doc.setFont("times", "italic");
      doc.setFontSize(18);
      doc.text("This Certificate is Proudly Presented To", pageWidth / 2, 340, { align: "center" });

      // Student Name
      doc.setFontSize(42);
      doc.setTextColor(0, 102, 204);
      doc.text(student?.username || "Student", pageWidth / 2, 390, { align: "center" });

      // Quiz Details
      doc.setFont("times", "normal");
      doc.setFontSize(18);
      doc.setTextColor(0, 0, 0);
      doc.text(`For successfully completing the quiz "${quiz.title}"`, pageWidth / 2, 440, { align: "center", maxWidth: 700 });

      // Date & Seal
      doc.setFontSize(14);
      doc.text("Date: " + new Date(result.date).toLocaleDateString(), 100, pageHeight - 100);

      // Footer
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

  return (
    <div className="faculty-dashboard-wrapper">
     

      {/* Navbar-like Header */}
      <nav className="dashboard-navbar">
        <div className="logo">
          <h1>
            Medha Mantana
          </h1>
        </div>
        <div className="nav-buttons">
          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="profile-icon"
              title="Profile"
            >
              👤
            </button>
            {showProfile && (
              <div className="profile-dropdown">
                <div className="profile-info">
                  <h3>{student?.username || "Student"}</h3>
                  <p>Role: Student</p>
                  <p>Email: {student?.email || "N/A"}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="btn-logout"
                >
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="dashboard-content max-w-4xl mx-auto">

        {/* Student Zone */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-indigo-700 mb-2">
            🎓 ScholarSphere – Your Progress Space
          </h2>
        </div>

        {/* 🔑 Join Quiz by Code */}
        <div className="glass-section text-center">
          <h2 className="text-xl font-semibold mb-4 text-indigo-700">🔑 Join Quiz by ID</h2>
          <div className="flex justify-center">
            <input
              type="text"
              placeholder="Enter Quiz ID..."
              value={quizCode}
              onChange={(e) => setQuizCode(e.target.value)}
              className="dashboard-input flex-1 max-w-md"
            />
            <button
              onClick={handleJoinQuiz}
              className="btn-primary ml-2"
            >
              Join
            </button>
          </div>
        </div>

        {/* 🎯 Demo Quizzes */}
        <div className="glass-section text-center">
          <h2 className="text-xl font-semibold mb-4 text-indigo-700">🎯 Practice with Demo Quizzes</h2>
          <div className="flex items-center justify-center space-x-4 mb-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="dashboard-input max-w-xs"
            >
              {DEMO_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <button
              onClick={handleStartDemoQuiz}
              className="btn-primary"
            >
              ▶️ Start Demo Quiz
            </button>
          </div>
          <p className="text-sm text-gray-600">
            Demo quizzes are for practice purposes.
          </p>
        </div>

        {/* 📋 Available Quizzes */}
        <div className="glass-section text-center">
          <h2 className="text-xl font-semibold mb-4 text-indigo-700">📋 Available Quizzes</h2>

          {loading ? (
            <p className="text-gray-600">⏳ Loading quizzes...</p>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : quizzes.length === 0 ? (
            <p className="text-gray-500 text-center bg-white p-4 rounded shadow">
              No quizzes available at the moment.
            </p>
          ) : (
            <table className="min-w-full bg-white shadow rounded mb-6">
              <thead className="bg-indigo-500 text-white">
                <tr>
                  <th className="py-2 px-4 text-left">Quiz Title</th>
                  <th>Questions</th>
                  <th>Duration (min:sec)</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {quizzes.map((q) => {
                  const attempted = myResults.find((r) => r.quizId?._id === q._id);
                  return (
                    <tr key={q._id} className="border-b hover:bg-gray-100">
                      <td className="py-2 px-4">{q.title}</td>
                      <td>{q.numQuestions}</td>
                      <td>
                        {Math.floor(q.duration / 60)}:
                        {String(q.duration % 60).padStart(2, "0")}
                      </td>
                      <td className="space-x-2">
                        {attempted ? (
                          <>
                            <span className="text-gray-500">✔️ Attempted</span>
                            {q.certificateEnabled &&
                              attempted.score >= q.certificatePassingScore && (
                                <button
                                  onClick={() => generateCertificate(q, attempted)}
                                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                                >
                                  📜 Certificate
                                </button>
                              )}
                          </>
                        ) : (
                          <button
                            onClick={() => navigate(`/quiz/${String(q._id).trim()}/instructions`)}
                            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                          >
                            ▶️ Start
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* 📊 My Results */}
        <div className="glass-section text-center">
          <h2 className="text-xl font-semibold mb-4 text-indigo-700">📊 My Results</h2>
          <table className="min-w-full bg-white shadow rounded">
            <thead className="bg-green-600 text-white">
              <tr>
                <th>Quiz</th>
                <th>Score</th>
                <th>Total</th>
                <th>Time Taken</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {myResults.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-500">
                    No results yet
                  </td>
                </tr>
              ) : (
                myResults.map((r) => (
                    <tr key={r._id} className="border-b hover:bg-gray-100">
                      <td>{r.quizId?.title || "N/A"}</td>
                      <td>{r.score}</td>
                      <td>{r.total}</td>
                      <td>
                        {Math.floor(r.timeTaken / 60)}m {r.timeTaken % 60}s
                      </td>
                      <td>{new Date(r.date).toLocaleString()}</td>
                    </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
