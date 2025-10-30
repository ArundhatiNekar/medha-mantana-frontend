import React, { useEffect, useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await api.get("/api/admin/summary");
        setStats(res.data.stats);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load summary");
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/admin/login");
  };

  if (loading) return <h3>Loading Dashboard...</h3>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ textAlign: "center", padding: "40px" }}>
      <h1>👑 Admin Dashboard</h1>
      <button onClick={handleLogout} style={{ marginBottom: "20px" }}>
        Logout
      </button>

      {stats && (
        <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "20px" }}>
          {Object.entries(stats).map(([key, value]) => (
            <div
              key={key}
              style={{
                border: "2px solid #4CAF50",
                borderRadius: "10px",
                padding: "20px",
                width: "180px",
                background: "#f8fff8",
              }}
            >
              <h3>{key.replace(/([A-Z])/g, " $1")}</h3>
              <h2>{value}</h2>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: "40px" }}>
        <h2>🧭 Manage</h2>
        <button onClick={() => navigate("/admin/users")}>Users</button>
        <button onClick={() => navigate("/admin/quizzes")}>Quizzes</button>
        <button onClick={() => navigate("/admin/results")}>Results</button>
      </div>
    </div>
  );
}
