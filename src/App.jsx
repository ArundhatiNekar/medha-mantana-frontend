import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import FacultyDashboard from "./pages/FacultyDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import StudentQuiz from "./pages/StudentQuiz";
import QuizInstructions from "./pages/QuizInstructions";
import FacultyResults from "./pages/FacultyResults";
import StudentResultDetail from "./pages/StudentResultDetail"; // ✅ reused for both faculty + student
import MyResultDetail from "./pages/MyResultDetail";
import Profile from "./pages/Profile";
import Home from "./pages/Home";

// ✅ Protected Route Component
const ProtectedRoute = ({ children, role }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* 🌐 Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 🧑‍🏫 Faculty Dashboard (Protected) */}
        <Route
          path="/faculty"
          element={
            <ProtectedRoute role="faculty">
              <FacultyDashboard />
            </ProtectedRoute>
          }
        />

        {/* ✅ Faculty Results Page (Protected) */}
        <Route
          path="/faculty/results"
          element={
            <ProtectedRoute role="faculty">
              <FacultyResults />
            </ProtectedRoute>
          }
        />

        {/* ✅ Faculty: View Student Result Detail (Protected) */}
        <Route
          path="/faculty/results/:studentName"
          element={
            <ProtectedRoute role="faculty">
              <StudentResultDetail />
            </ProtectedRoute>
          }
        />

        {/* 🎓 Student Dashboard (Protected) */}
        <Route
          path="/student"
          element={
            <ProtectedRoute role="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        {/* 📋 Quiz Instructions (Protected) */}
        <Route
          path="/quiz/:id/instructions"
          element={
            <ProtectedRoute role="student">
              <QuizInstructions />
            </ProtectedRoute>
          }
        />

        {/* 🎯 Student Quiz (Dynamic quizId, Protected) */}
        <Route
          path="/quiz/:id"
          element={
            <ProtectedRoute role="student">
              <StudentQuiz />
            </ProtectedRoute>
          }
        />

        {/* ✅ Student: Detailed Quiz Attempt Page (uses StudentResultDetail) */}
        <Route
          path="/student/result/:id"
          element={
            <ProtectedRoute role="student">
              <StudentResultDetail />
            </ProtectedRoute>
          }
        />

        {/* ✅ Student: My Result Detail (New route) */}
        <Route
          path="/student/myresult/:id"
          element={
            <ProtectedRoute role="student">
              <MyResultDetail />
            </ProtectedRoute>
          }
        />

        {/* 👤 Profile Page (Protected for both roles) */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* 🔁 Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
