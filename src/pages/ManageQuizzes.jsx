import React, { useEffect, useState } from "react";
import api from "../api/api";
import { toast } from "react-toastify";

export default function ManageQuizzes() {
  const [quizzes, setQuizzes] = useState([]);

  const token = localStorage.getItem("token");

  /* -------------------------------------------------------------------------- */
  /*                                🔹 Fetch Quizzes                            */
  /* -------------------------------------------------------------------------- */
  const fetchQuizzes = async () => {
    try {
      const res = await api.get("/api/admin/quizzes", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data =
        Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.quizzes)
          ? res.data.quizzes
          : [];

      setQuizzes(data);
    } catch (err) {
      console.error("Error fetching quizzes:", err);
      toast.error("Failed to load quizzes");
      setQuizzes([]);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  /* -------------------------------------------------------------------------- */
  /*                                🗑️ Delete Quiz                              */
  /* -------------------------------------------------------------------------- */
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this quiz?")) return;
    try {
      await api.delete(`/api/admin/quizzes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("🗑️ Quiz deleted successfully!");
      setQuizzes((prev) => prev.filter((q) => q._id !== id));
    } catch (err) {
      console.error("Error deleting quiz:", err);
      toast.error("Failed to delete quiz");
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                               🎨 UI Rendering                              */
  /* -------------------------------------------------------------------------- */
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Manage Quizzes</h1>

      {/* 📋 Quiz List */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full table-auto">
          <thead className="bg-blue-100 text-left">
            <tr>
              <th className="p-3">Title</th>
              <th className="p-3">Description</th>
              <th className="p-3">Creator</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(quizzes) && quizzes.length > 0 ? (
              quizzes.map((quiz) => (
                <tr key={quiz._id} className="border-t">
                  <td className="p-3">{quiz.title}</td>
                  <td className="p-3">{quiz.description}</td>
                  <td className="p-3">{quiz.createdBy || "Unknown"}</td>
                  <td className="p-3 text-center">
                    <button
                      className="bg-red-500 px-3 py-1 rounded text-white hover:bg-red-600"
                      onClick={() => handleDelete(quiz._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-500">
                  No quizzes available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
