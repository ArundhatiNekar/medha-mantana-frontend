import React, { useEffect, useState } from "react";
import api from "../api/api";

export default function ManageResults() {
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await api.get("/api/admin/results");
        setResults(res.data.results);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load results");
      }
    };
    fetchResults();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this result?")) return;
    try {
      await api.delete(`/api/admin/results/${id}`);
      setResults(results.filter((r) => r._id !== id));
      alert("Result deleted successfully!");
    } catch {
      alert("Failed to delete result");
    }
  };

  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "30px" }}>
      <h1>📊 Manage Results</h1>
      <table border="1" cellPadding="10" style={{ width: "100%", textAlign: "left" }}>
        <thead>
          <tr style={{ background: "#f3f3f3" }}>
            <th>Student</th>
            <th>Quiz</th>
            <th>Score</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {results.map((r) => (
            <tr key={r._id}>
              <td>{r.studentId?.username}</td>
              <td>{r.quiz?.title}</td>
              <td>{r.score}</td>
              <td>
                <button onClick={() => handleDelete(r._id)} style={{ color: "red" }}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
