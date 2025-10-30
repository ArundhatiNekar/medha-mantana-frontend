import React from "react";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <div className="admin-dashboard">
      <h1>Welcome, Admin </h1>
      <p>Manage users, quizzes, and reports here.</p>

      <div className="admin-actions">
        <button onClick={() => navigate("/admin/faculties")}>Manage Faculties</button>
        <button onClick={() => navigate("/admin/students")}>Manage Students</button>
        <button onClick={() => navigate("/admin/quizzes")}>Manage Quizzes</button>
        <button onClick={logout}>Logout</button>
      </div>
    </div>
  );
}
