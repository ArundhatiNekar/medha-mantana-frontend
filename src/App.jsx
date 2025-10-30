import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import StudentLogin from "./pages/StudentLogin";
import FacultyLogin from "./pages/FacultyLogin";
import AdminLogin from "./pages/AdminLogin";
import About from "./pages/About";
import Features from "./pages/Features";
import Contact from "./pages/Contact";
import Help from "./pages/Help";
import FacultyDashboard from "./pages/FacultyDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import StudentQuiz from "./pages/StudentQuiz";
import QuizInstructions from "./pages/QuizInstructions";
import FacultyResults from "./pages/FacultyResults";
import StudentResultDetail from "./pages/StudentResultDetail";
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
    // Redirect to appropriate dashboard based on user role
    if (user.role === "faculty") {
      return <Navigate to="/faculty" replace />;
    } else if (user.role === "student") {
      return <Navigate to="/student" replace />;
    } else if (user.role === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* 🌐 Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/features" element={<Features />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/help" element={<Help />} />
        <Route path="/login" element={<Login />} />

        {/* 👥 Role-based Logins */}
        <Route path="/login/student" element={<StudentLogin />} />
        <Route path="/login/faculty" element={<FacultyLogin />} />

        {/* 🆕 Admin Login */}
        <Route path="/login/admin" element={<AdminLogin />} />

        {/* 🆕 Admin Dashboard */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* 🧑‍🏫 Faculty Dashboard */}
        <Route
          path="/faculty"
          element={
            <ProtectedRoute role="faculty">
              <FacultyDashboard />
            </ProtectedRoute>
          }
        />

        {/* ✅ Faculty Results */}
        <Route
          path="/faculty/results"
          element={
            <ProtectedRoute role="faculty">
              <FacultyResults />
            </ProtectedRoute>
          }
        />

        {/* ✅ Faculty: View Student Result Detail */}
        <Route
          path="/faculty/results/:studentName"
          element={
            <ProtectedRoute role="faculty">
              <StudentResultDetail />
            </ProtectedRoute>
          }
        />

        {/* 🎓 Student Dashboard */}
        <Route
          path="/student"
          element={
            <ProtectedRoute role="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        {/* 📋 Quiz Instructions */}
        <Route
          path="/quiz/:id/instructions"
          element={
            <ProtectedRoute role="student">
              <QuizInstructions />
            </ProtectedRoute>
          }
        />

        {/* 🎯 Student Quiz */}
        <Route
          path="/quiz/:id"
          element={
            <ProtectedRoute role="student">
              <StudentQuiz />
            </ProtectedRoute>
          }
        />

        {/* 🧾 Student: View Quiz Result */}
        <Route
          path="/student/result/:id"
          element={
            <ProtectedRoute role="student">
              <StudentResultDetail />
            </ProtectedRoute>
          }
        />

        {/* 📜 Student: My Result Detail */}
        <Route
          path="/student/myresult/:id"
          element={
            <ProtectedRoute role="student">
              <MyResultDetail />
            </ProtectedRoute>
          }
        />

        {/* 👤 Profile Page */}
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
