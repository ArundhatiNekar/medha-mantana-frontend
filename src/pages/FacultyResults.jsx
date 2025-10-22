// frontend/src/pages/FacultyResults.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import api from "../api/api";
import "../styles/FacultyResults.css";

export default function FacultyResults() {
  const [allQuizzes, setAllQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState("");
  const [results, setResults] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);
  const [showProfile, setShowProfile] = useState(false);

  const navigate = useNavigate();

  /* ---------------- FETCH QUIZZES ---------------- */
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await api.get("/api/quizzes");
        setAllQuizzes(res.data.quizzes || []);
      } catch (err) {
        console.error("❌ Error fetching quizzes:", err);
      }
    };

    fetchQuizzes();
  }, []);

  /* ---------------- FETCH RESULTS ---------------- */
  const fetchResults = async (quizId) => {
    try {
      if (!quizId) {
        setResults([]);
        return;
      }
      const res = await api.get(`/api/results/quiz/${quizId}`);
      setResults(res.data.results || []);
    } catch (err) {
      console.error("❌ Error fetching results:", err);
    }
  };

  /* ---------------- FILTER RESULTS ---------------- */
  useEffect(() => {
    if (!searchName.trim()) {
      setFilteredResults(results);
    } else {
      const query = searchName.toLowerCase();
      setFilteredResults(
        results.filter((r) => r.studentName?.toLowerCase().includes(query))
      );
    }
  }, [searchName, results]);

  /* ---------------- EXPORT TO EXCEL ---------------- */
  const exportToExcel = () => {
    if (!filteredResults.length)
      return alert("⚠️ No results to export!");

    const sorted = [...filteredResults].sort((a, b) => b.score - a.score);
    const ws = XLSX.utils.json_to_sheet(
      sorted.map((r, i) => ({
        Rank: i + 1,
        Student: r.studentName,
        Score: r.score,
        Total: r.total,
        Quiz: r.quizId?.title || "N/A",
        Date: new Date(r.date).toLocaleString(),
      }))
    );

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Results");
    XLSX.writeFile(wb, "quiz_results.xlsx");
  };

  /* ---------------- COMPONENT UI ---------------- */
  return (
    <div className="faculty-dashboard-wrapper">
      
      
      {/* 🧭 Navbar */}
      <nav className="dashboard-navbar">
        <div className="logo">
          <h1>Medha Mantana</h1>
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
                  <h3>
                    {JSON.parse(localStorage.getItem("user"))?.username || "Faculty"}
                  </h3>
                  <p>Role: Faculty</p>
                  <p>Email: {JSON.parse(localStorage.getItem("user"))?.email || "N/A"}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* 🧾 Main Content */}
      <div className="dashboard-content">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-indigo-700 mb-2">
            📊 Student Results
          </h2>
        </div>

        {/* 🧩 Quiz Selection */}
        <div className="quiz-selection-container">
          <div className="quiz-selection-box">
            <h2>Select Quiz</h2>
            <select
              value={selectedQuiz}
              onChange={(e) => {
                setSelectedQuiz(e.target.value);
                fetchResults(e.target.value);
              }}
            >
              <option value="">-- Select a Quiz --</option>
              {allQuizzes.map((q) => (
                <option key={q._id} value={q._id}>
                  {q.title}
                </option>
              ))}
            </select>

            {/* 🔍 Search */}
            {selectedQuiz && (
              <input
                type="text"
                placeholder="Search by student name..."
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
              />
            )}
          </div>
        </div>

        {/* 📋 Results Table */}
        {selectedQuiz && filteredResults.length > 0 ? (
          <div className="results-table-container">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Rank List</h2>
              <button
                onClick={exportToExcel}
                className="bg-green-500 text-white px-3 py-1 rounded"
              >
                ⬇️ Excel
              </button>
            </div>

            <table className="min-w-full bg-white shadow rounded">
              <thead className="bg-indigo-600 text-white">
                <tr>
                  <th>Rank</th>
                  <th>Student</th>
                  <th>Score</th>
                  <th>Total</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {[...filteredResults]
                  .sort((a, b) => b.score - a.score)
                  .map((r, i) => (
                    <tr key={r._id} className="border-b hover:bg-gray-100">
                      <td className="text-center font-bold">{i + 1}</td>
                      <td>
                        <button
                          onClick={() =>
                            navigate(`/faculty/results/${r.studentName}`)
                          }
                          className="text-indigo-600 hover:underline"
                        >
                          {r.studentName}
                        </button>
                      </td>
                      <td>{r.score}</td>
                      <td>{r.total}</td>
                      <td>{new Date(r.date).toLocaleString()}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ) : selectedQuiz ? (
          <p className="center-message">⚠️ No results found for this quiz</p>
        ) : (
          <p className="center-message">Please select a quiz to view results</p>

        )}
      </div>
    </div>
  );
}
