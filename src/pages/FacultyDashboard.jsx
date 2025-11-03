
// frontend/src/pages/FacultyDashboard.jsx
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import api from "../api/api";
import "../styles/FacultyDashboard.css";

export default function FacultyDashboard() {
  const [questions, setQuestions] = useState([]);
  const [form, setForm] = useState({
    question: "",
    options: ["", "", "", ""],
    answer: "",
    category: "",
  });
  const [csvFile, setCsvFile] = useState(null);
  const [uploadedCSVs, setUploadedCSVs] = useState([]); // ✅ track uploaded files
  const [editingId, setEditingId] = useState(null);

  const [results, setResults] = useState([]);
  const [allQuizzes, setAllQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState("");

  const [quizTitle, setQuizTitle] = useState("");
  const [quizCategories, setQuizCategories] = useState(["all"]);
  const [quizCount, setQuizCount] = useState(0);
  const [quizDuration, setQuizDuration] = useState(0);
  const [quizCertificate, setQuizCertificate] = useState(false);
  const [quizPassingScore, setQuizPassingScore] = useState(0);

  const [quizId, setQuizId] = useState(null);
  // 📋 Toggle All Questions section visibility
  const [showAllQuestions, setShowAllQuestions] = useState(false);
  const questionsRef = useRef(null);
  const [questionsHeight, setQuestionsHeight] = useState(0);
  const [showProfile, setShowProfile] = useState(false);
  const fileInputRef = useRef(null);

  const navigate = useNavigate();

  const faculty = JSON.parse(localStorage.getItem("user"));

  /* ✅ Fix page background & enable scrolling */
  useEffect(() => {
    document.body.classList.remove("auth-page");
    document.body.style.overflowY = "auto";
    document.body.style.minHeight = "100vh";
    document.body.classList.add("faculty-dashboard");

    // Scroll to top on mount
    window.scrollTo(0, 0);

    return () => {
      document.body.classList.remove("faculty-dashboard");
    };
  }, []);

  /* ---------------- LIFECYCLE ---------------- */
  useEffect(() => {
    fetchQuestions();
    fetchCSVFiles();
    fetchQuizzes();
    fetchResults();
  }, []);

// ✅ Adjust collapsible height whenever questions change
useEffect(() => {
  if (questionsRef.current) {
    setTimeout(() => {
      setQuestionsHeight(questionsRef.current.scrollHeight);
    }, 100);
  }
}, [questions]);

  /* ---------------- FETCH DATA ---------------- */
  const fetchQuestions = async () => {
    try {
      const res = await api.get("/api/questions");
      setQuestions(res.data);
    } catch (err) {
      console.error("Error fetching questions:", err);
    }
  };



  const fetchQuizzes = async () => {
    try {
      const res = await api.get("/api/quizzes");
      setAllQuizzes(res.data.quizzes || []);
    } catch (err) {
      console.error("Error fetching quizzes:", err);
    }
  };

  const fetchResults = async (quizId = "") => {
    try {
      const res = quizId
        ? await api.get(`/api/results/quiz/${quizId}`)
        : await api.get("/api/results");
      setResults(res.data.results || []);
    } catch (err) {
      console.error("Error fetching results:", err);
    }
  };

  const fetchCSVFiles = async () => {
    try {
      const res = await api.get("/api/questions/csv-files");
      setUploadedCSVs(res.data || []);
    } catch (err) {
      console.error("Error fetching CSV files:", err);
    }
  };
  
  /* ---------------- LOGOUT ---------------- */
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

 /* ---------------- QUIZ CREATION ---------------- */
const handleCreateQuiz = async (payload) => {
  try {
    const faculty = JSON.parse(localStorage.getItem("user"));

    // ✅ Send request to backend
   const res = await api.post("/api/quizzes", {
  ...payload,
  createdBy: faculty?.username || "faculty",
  certificateEnabled: quizCertificate,
  certificatePassingScore: quizPassingScore,
});

    // ✅ Handle response structure safely
    const newQuizId =
      res?.data?.quizId ||
      res?.data?.id ||
      res?.data?._id ||
      res?.data?.quiz?._id ||
      res?.data?.quiz?.quizId ||
      "Unknown_ID";

    setQuizId(newQuizId);

    alert(`✅ Quiz created successfully! (ID: ${newQuizId})`);

    // ✅ Reset fields
    setQuizTitle("");
    setQuizCategories(["all"]);
    setQuizCount(5);
    setQuizDuration(10);
    setQuizCertificate(false);
    setQuizPassingScore(0);

    fetchQuizzes();
  } catch (err) {
    console.error("❌ Quiz creation error:", err.response || err);
    alert("⚠️ Error creating quiz. Check console for details.");
  }
};

  /* ---------------- EXPORT RESULTS ---------------- */
  const exportToExcel = () => {
    if (!results || results.length === 0)
      return alert("⚠️ No results to export");
    const sorted = [...results].sort((a, b) => b.score - a.score);
    const ws = XLSX.utils.json_to_sheet(
      sorted.map((r, i) => ({
        Rank: i + 1,
        Student: r.studentName,
        Score: r.score,
        Total: r.total,
        Date: new Date(r.date).toLocaleString(),
        Quiz: r.quiz?.title || "N/A",
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Results");
    XLSX.writeFile(wb, "student_results.xlsx");
  };

  const exportToPDF = () => {
    if (!results || results.length === 0)
      return alert("⚠️ No results to export");
    const sorted = [...results].sort((a, b) => b.score - a.score);
    const doc = new jsPDF();
    doc.text("📊 Student Results Rank List", 14, 15);
    doc.autoTable({
      head: [["Rank", "Student", "Score", "Total", "Date", "Quiz"]],
      body: sorted.map((r, i) => [
        i + 1,
        r.studentName,
        r.score,
        r.total,
        new Date(r.date).toLocaleString(),
        r.quiz?.title || "N/A",
      ]),
      startY: 25,
    });
    doc.save("student_results.pdf");
  };

   /* ---------------- QUESTION FORM ---------------- */
  const handleChange = (e, i = null) => {
    if (i !== null) {
      const opts = [...form.options];
      opts[i] = e.target.value;
      setForm({ ...form, options: opts });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  if (!form.question || !form.answer || form.options.some((o) => !o)) {
    alert("Fill all fields");
    return;
  }
  try {
    if (editingId) {
      await api.put(`/api/questions/${editingId}`, form);
      setEditingId(null);
    } else {
      await api.post("/api/questions", { ...form, source: "manual" });
    }
    setForm({
      question: "",
      options: ["", "", "", ""],
      answer: "",
      explanation: "",
      category: "",
    });
    fetchQuestions();
  } catch (err) {
    console.error("Error saving:", err);
  }
};
  const handleEdit = (q) => {
    setForm(q);
    setEditingId(q._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this question?")) return;
    await api.delete(`/api/questions/${id}`);
    fetchQuestions();
  };

  /* ---------------- DELETE FUNCTIONS ---------------- */
  const handleDeleteAll = async () => {
    if (!window.confirm("⚠️ Delete ALL questions?")) return;
    await api.delete("/api/questions");
    fetchQuestions();
    fetchCSVFiles();
  };

  const handleDeleteCSVFile = async (fileId) => {
    if (!window.confirm("⚠️ Delete this CSV file & its questions?")) return;
    try {
      const res = await api.delete(`/api/questions/delete-csv/${fileId}`);
      alert(res.data.message + ` (Deleted: ${res.data.deleted})`);
      fetchQuestions();
      fetchCSVFiles();
    } catch (err) {
      alert("❌ Error deleting CSV file");
    }
  };

  const downloadCSVFile = async (fileId) => {
    try {
      const res = await api.get(`/api/questions/download-csv/${fileId}`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      // Find the file name from uploadedCSVs
      const file = uploadedCSVs.find(f => f._id === fileId);
      const filename = file ? file.originalname : `uploaded_csv_${fileId}.csv`;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download error:", err);
      alert("❌ Error downloading CSV file: " + (err.response?.data?.error || err.message));
    }
  };

  /* ---------------- FILE UPLOAD ---------------- */
  const uploadFile = async (type, file) => {
    if (!file) return alert("Choose a file first");
    const fd = new FormData();
    fd.append("file", file);
    const res = await api.post(`/api/questions/upload-${type}`, fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    alert(
      `${type.toUpperCase()} Uploaded ✅ Inserted: ${res.data.inserted}, Skipped: ${res.data.skipped}`
    );
    fetchQuestions();
    fetchCSVFiles();
    if (type === "csv") {
      setCsvFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

   /* ---------------- SAMPLE DOWNLOAD ---------------- */
   const downloadSampleCSV = () => {
     const sample = [
       ["question","option1","option2","option3","option4","answer","category","explanation"],
       ["What is 2+2?", "2", "3", "4", "5", "4","quantitative","because 2 +2 is 4"],
       ["Which planet is red?", "Earth", "Mars", "Jupiter", "Saturn", "Mars", "general", "Mars is red"],
     ];
     const ws = XLSX.utils.aoa_to_sheet(sample);
     const wb = XLSX.utils.book_new();
     XLSX.utils.book_append_sheet(wb, ws, "Sample");
     XLSX.writeFile(wb, "sample_questions.csv");
   };

 /* ---------------- UI ---------------- */
  return (
    <div className="faculty-dashboard-wrapper">
      

    {/* Navbar-like Header */}
<nav className="dashboard-navbar">
  <div className="logo">
    <h1>Medha Mantana</h1>
  </div>

  <div className="nav-buttons">
    <div className="relative">
      <button
        onClick={(e) => {
          const dropdown = document.querySelector(".profile-dropdown");
          if (dropdown) dropdown.classList.remove("flip-left");

          const rect = e.target.getBoundingClientRect();
          const isNearRightEdge = window.innerWidth - rect.right < 250;

          setShowProfile((prev) => {
            const next = !prev;
            setTimeout(() => {
              const dropdownEl = document.querySelector(".profile-dropdown");
              if (dropdownEl && next && isNearRightEdge) {
                dropdownEl.classList.add("flip-left");
              }
            }, 50);
            return next;
          });
        }}
        className="profile-icon"
        title="Profile"
      >
        👤
      </button>

      {showProfile && (
        <div className="profile-dropdown">
          <div className="arrow-up"></div> {/* 👇 Tiny pointer arrow */}
          <div className="profile-info">
            <h3>{faculty?.username || "Faculty"}</h3>
            <p>Role: Faculty</p>
            <p>Email: {faculty?.email || "N/A"}</p>
          </div>
          <button onClick={handleLogout} className="btn-logout">
            🚪 Logout
          </button>
        </div>
      )}
    </div>
  </div>
</nav>

      {/* Main Content */}
      <div className="dashboard-content max-w-4xl mx-auto">

      {/* Faculty Zone */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-indigo-700 mb-2">
          🌐 MentorSphere – Faculty Insight Hub
        </h2>
      </div>

{/* Quiz Creation */}
<div className="glass-section text-center">
  <h2 className="text-2xl font-semibold mb-4 text-indigo-700">Create Quiz</h2>
  <form
    onSubmit={(e) => {
      e.preventDefault();

      // ✅ Validate categories
      if (quizCategories.length === 0) {
        alert("⚠️ Please select at least one category.");
        return;
      }

      // ✅ Normalize before sending
      const normalizedCategories = quizCategories.map((cat) =>
        cat.toLowerCase() === "all" ? "All" : cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase()
      );

      handleCreateQuiz({
        title: quizTitle,
        categories: normalizedCategories,
        count: Number(quizCount),
        duration: Number(quizDuration),
        certificateEnabled: quizCertificate,
        certificatePassingScore: quizPassingScore,
      });
    }}
  >
    {/* Title */}
    <input
      type="text"
      placeholder="Quiz Title"
      value={quizTitle}
      onChange={(e) => setQuizTitle(e.target.value)}
      className="dashboard-input"
      required
    />

    {/* ✅ Category Selection with Checkboxes */}
    <p className="font-semibold text-lg mb-4 text-gray-700">Select Categories:</p>
    <div className="grid grid-cols-1 gap-4 mb-4">
      {[
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
      ].map((cat) => (
        <label key={cat} className="flex items-center space-x-3 cursor-pointer bg-white p-4 rounded-lg shadow-sm border hover:shadow-md transition-all duration-300 hover:bg-indigo-50 hover:border-indigo-300">
          <input
            type="checkbox"
            checked={quizCategories.includes(cat)}
            onChange={(e) => {
              if (e.target.checked) {
                if (cat === "All") {
                  setQuizCategories(["All"]);
                } else {
                  setQuizCategories((prev) =>
                    prev.filter((c) => c !== "All").concat(cat)
                  );
                }
              } else {
                setQuizCategories((prev) => prev.filter((c) => c !== cat));
              }
            }}
            className="h-5 w-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
          />
          <span className="text-gray-800 font-medium">{cat}</span>
        </label>
      ))}
    </div>

    {/* Show selected categories as removable badges */}
    {quizCategories.length > 0 && (
      <div className="flex flex-col gap-2 mb-3">
        {quizCategories.map((cat, idx) => (
          <span
            key={idx}
            className="category-badge"
          >
            {cat}
            <button
              type="button"
              onClick={() =>
                setQuizCategories(quizCategories.filter((c) => c !== cat))
              }
              className="ml-2 text-red-500 hover:text-red-700"
            >
              ❌
            </button>
          </span>
        ))}
      </div>
    )}

   {/* Number of Questions */}
<p className="font-medium mb-2">Number of Questions:</p>
<input
  type="number"
  placeholder="Enter number of questions"
  value={quizCount === 0 ? "" : quizCount}
  onChange={(e) =>
    setQuizCount(e.target.value === "" ? 0 : Number(e.target.value))
  }
  className="dashboard-input"
  min="1"
/>

{/* Duration (Minutes & Seconds) */}
<p className="font-medium mb-2">Quiz Duration:</p>
<div className="grid grid-cols-2 gap-2 mb-3">
  <input
    type="number"
    placeholder="Minutes"
    value={
      Math.floor(quizDuration / 60) === 0
        ? ""
        : Math.floor(quizDuration / 60)
    }
    onChange={(e) => {
      const minutes = e.target.value === "" ? 0 : parseInt(e.target.value);
      const seconds = quizDuration % 60;
      setQuizDuration(minutes * 60 + seconds);
    }}
    className="dashboard-input"
    min="0"
  />

  <input
    type="number"
    placeholder="Seconds"
    value={quizDuration % 60 === 0 ? "" : quizDuration % 60}
    onChange={(e) => {
      const seconds = e.target.value === "" ? 0 : parseInt(e.target.value);
      const minutes = Math.floor(quizDuration / 60);
      setQuizDuration(minutes * 60 + seconds);
    }}
    className="dashboard-input"
    min="0"
    max="59"
  />
</div>



{/* ✅ Certificate Options */}
<div className="mb-3 p-3 border rounded bg-gray-50">
  <label className="flex items-center space-x-2 mb-2">
    <input
      type="checkbox"
      checked={quizCertificate}
      onChange={(e) => setQuizCertificate(e.target.checked)}
      className="h-4 w-4 text-indigo-600"
    />
    <span className="font-medium">Enable Certificate for this Quiz</span>
  </label>

  {quizCertificate && (
    <div className="mt-2">
      <label className="block mb-1 text-sm">Passing Score (%)</label>
      <input
        type="number"
        value={quizPassingScore}
        onChange={(e) => setQuizPassingScore(Number(e.target.value))}
        min="0"
        max="100"
        className="dashboard-input"
        placeholder="Enter passing score percentage"
        required
      />
    </div>
  )}
</div>

    <button
      type="submit"
      className="btn-primary"
    >
      🎯 Generate Quiz
    </button>
  </form>

  {quizId && (
    <div className="mt-4 p-4 border rounded bg-green-50">
      <p>
        ✅ Quiz Created! ID: <b>{quizId}</b>
      </p>
    </div>
  )}
</div>

      {/* Add/Edit Question */}
      <form
        onSubmit={handleSubmit}
        className="glass-section text-center"
      >
        <h2 className="text-xl font-semibold mb-4 text-indigo-700">
          {editingId ? "Edit Question" : "Add Question"}
        </h2>
        <input
          type="text"
          name="question"
          placeholder="Question"
          value={form.question}
          onChange={handleChange}
          className="dashboard-input"
          required
        />
        {form.options.map((opt, i) => (
          <input
            key={i}
            type="text"
            placeholder={`Option ${i + 1}`}
            value={opt}
            onChange={(e) => handleChange(e, i)}
            className="dashboard-input"
            required
          />
        ))}
        <input
          type="text"
          name="answer"
          placeholder="Answer"
          value={form.answer}
          onChange={handleChange}
          className="dashboard-input"
          required
        />
        <input
          type="text"
          name="explanation"
          placeholder="Explanation (Reason for correct/incorrect answer)"
          value={form.explanation || ""}
          onChange={handleChange}
          className="dashboard-input"
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
          className="dashboard-input"
        />
        <button
          type="submit"
          className="btn-secondary"
        >
          {editingId ? "Update Question" : "Add Question"}
        </button>
      </form>

       {/* Manage CSV */}
      <div className="glass-section text-center">
        <h2 className="text-xl font-semibold mb-4 text-indigo-700">Bulk Question Import</h2>
        <div className="flex flex-col items-center space-y-4">
           <input ref={fileInputRef} type="file" accept=".csv" onChange={(e)=>setCsvFile(e.target.files[0])} className="dashboard-input"/>
           <div className="flex space-x-4">
             <button disabled={!csvFile} onClick={()=>uploadFile("csv",csvFile)} className="btn-secondary">Upload CSV</button>
             <button onClick={downloadSampleCSV} className="btn-primary">Sample CSV</button>
           </div>
         </div>

        {/* ✅ Uploaded CSV Files List */}
        <h3 className="mt-6 font-semibold text-lg text-gray-700">Uploaded CSV Files</h3>
        <ul className="mt-4 space-y-2">
          {uploadedCSVs.map(file => (
            <li key={file._id} className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm border">
              <span className="text-gray-800">{file.originalname} ({new Date(file.uploadedAt).toLocaleString()})</span>
              <div className="flex space-x-2">
                <button onClick={()=>downloadCSVFile(file._id)} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">Download</button>
                <button onClick={()=>handleDeleteCSVFile(file._id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Delete</button>
              </div>
            </li>
          ))}
          {uploadedCSVs.length===0 && <p className="text-gray-500 mt-4">No CSV files uploaded</p>}
        </ul>
      </div>

      {/* 🔥 Delete All */}
      <div className="glass-section text-center">
        <h2 className="text-xl font-semibold mb-4 text-indigo-700">Data Management</h2>
        <button
          onClick={handleDeleteAll}
          className="btn-danger"
        >
          ❌ Delete All Questions
        </button>
      </div>
{/* 📋 All Questions (Collapsible Section) */}
<div className="glass-section text-center">
  {/* Header */}
  <div
    className="flex items-center justify-between cursor-pointer select-none mb-4"
    onClick={() => setShowAllQuestions((prev) => !prev)}
  >
    <h2 className="text-xl font-semibold text-indigo-700">📋 All Questions</h2>
    <span className="text-sm text-indigo-600 font-medium">
      {showAllQuestions ? "▲ Hide" : "▼ Show"}
    </span>
  </div>

  {/* Collapsible container */}
  <div
    ref={questionsRef}
    className="questions-collapse"
    style={{
      height: showAllQuestions ? `${questionsHeight}px` : "0px",
      overflow: "hidden",
      transition: "height 400ms ease",
    }}
  >
    <table className="min-w-full bg-white shadow rounded mb-6">
      <thead className="bg-indigo-500 text-white">
        <tr>
          <th className="py-2 px-4 text-left">#</th>
          <th className="py-2 px-4 text-left">Question</th>
          <th>Answer</th>
          <th>Category</th>
          <th>Source</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {questions.length > 0 ? (
          questions.map((q, index) => (
            <tr key={q._id} className="border-b hover:bg-gray-100">
              <td className="py-2 px-4 font-bold">{index + 1}</td>
              <td className="py-2 px-4">{q.question}</td>
              <td>{q.answer}</td>
              <td>{q.category}</td>
              <td>{q.source || "manual"}</td>
              <td>
                <button
                  onClick={() => handleEdit(q)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(q._id)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="6" className="text-center py-4 text-gray-500">
              No questions
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</div>
    
{/* 📊 Student Results */}
<div className="glass-section text-center">
  <h2 className="text-xl font-semibold mb-4 text-indigo-700">📊 Student Results</h2>

  <button
    onClick={() => navigate("/faculty-results")}
    className="btn-primary px-6 py-3 text-lg rounded-lg"
  >
    📈 View Student Results
  </button>

  <p className="mt-2 text-gray-600 text-sm">
    Click to view all quiz performance, ranks, and export options.
  </p>
</div>
    </div>
  </div>
);
}
 