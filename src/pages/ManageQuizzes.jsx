import React, { useEffect, useState } from "react";
import api from "../api/api";

export default function ManageQuizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await api.get("/api/admin/quizzes");
        setQuizzes(res.data.quizzes);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load quizzes");
      }
    };
    fetchQuizzes();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this quiz?")) return;
    try {
      await api.delete(`/api/admin/quizzes/${id}`);
      setQuizzes(quizzes.filter((q) => q._id !== id));
      alert("Quiz deleted successfully!");
    } catch {
      alert("Failed to delete quiz");
    }
  };

  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "30px" }}>
      <h1>🧩 Manage Quizzes</h1>
      <table border="1" cellPadding="10" style={{ width: "100%", textAlign: "left" }}>
        <thead>
          <tr style={{ background: "#f3f3f3" }}>
            <th>Title</th>
            <th>Duration</th>
            <th>Questions</th>
            <th>Created By</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {quizzes.map((q) => (
            <tr key={q._id}>
              <td>{q.title}</td>
              <td>{q.duration} mins</td>
              <td>{q.numQuestions}</td>
              <td>{q.createdBy?.username}</td>
              <td>
                <button onClick={() => handleDelete(q._id)} style={{ color: "red" }}>
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
