import React, { useEffect, useState } from "react";
import api from "../api/api";
import { toast } from "react-toastify";

const API_BASE = "https://medha-mantana-backend.onrender.com/api/admin";

export default function ManageQuizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [newQuiz, setNewQuiz] = useState({ title: "", description: "" });
  const [editQuiz, setEditQuiz] = useState(null);

  // ✅ Get token from localStorage
  const token = localStorage.getItem("token");

  // ✅ Fetch quizzes
  const fetchQuizzes = async () => {
    try {
      const res = await api.get("/api/admin/quizzes");
      setQuizzes(res.data);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        toast.error("Unauthorized — Please log in again.");
      } else {
        toast.error("Failed to load quizzes");
      }
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  // ✅ Add new quiz
  const handleAddQuiz = async (e) => {
    e.preventDefault();
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const payload = { ...newQuiz, createdBy: user?.name || "Admin" };
      await api.post("/api/admin/quizzes", payload);
      toast.success("Quiz added successfully!");
      setNewQuiz({ title: "", description: "" });
      fetchQuizzes();
    } catch (err) {
      console.error(err);
      toast.error("Error adding quiz");
    }
  };

  // ✅ Delete quiz
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this quiz?")) return;
    try {
      await api.delete(`/api/admin/quizzes/${id}`);
      toast.success("Quiz deleted successfully!");
      setQuizzes(quizzes.filter((q) => q._id !== id));
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete quiz");
    }
  };

  // ✅ Update quiz
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/api/admin/quizzes/${editQuiz._id}`, editQuiz);
      toast.success("Quiz updated successfully!");
      setEditQuiz(null);
      fetchQuizzes();
    } catch (err) {
      console.error(err);
      toast.error("Error updating quiz");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Manage Quizzes</h1>

      {/* ➕ Add Quiz Form */}
      <form
        onSubmit={editQuiz ? handleUpdate : handleAddQuiz}
        className="mb-6 bg-gray-50 p-4 rounded-lg shadow"
      >
        <h2 className="text-lg font-semibold mb-3">
          {editQuiz ? "Edit Quiz" : "Add New Quiz"}
        </h2>
        <input
          type="text"
          placeholder="Quiz Title"
          className="w-full border p-2 mb-3 rounded"
          value={editQuiz ? editQuiz.title : newQuiz.title}
          onChange={(e) =>
            editQuiz
              ? setEditQuiz({ ...editQuiz, title: e.target.value })
              : setNewQuiz({ ...newQuiz, title: e.target.value })
          }
          required
        />
        <textarea
          placeholder="Description"
          className="w-full border p-2 mb-3 rounded"
          value={editQuiz ? editQuiz.description : newQuiz.description}
          onChange={(e) =>
            editQuiz
              ? setEditQuiz({ ...editQuiz, description: e.target.value })
              : setNewQuiz({ ...newQuiz, description: e.target.value })
          }
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {editQuiz ? "Update Quiz" : "Add Quiz"}
        </button>
        {editQuiz && (
          <button
            type="button"
            className="ml-3 bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
            onClick={() => setEditQuiz(null)}
          >
            Cancel
          </button>
        )}
      </form>

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
            {quizzes.map((quiz) => (
              <tr key={quiz._id} className="border-t">
                <td className="p-3">{quiz.title}</td>
                <td className="p-3">{quiz.description}</td>
                <td className="p-3">{quiz.createdBy || "Unknown"}</td>
                <td className="p-3 text-center">
                  <button
                    className="bg-yellow-400 px-3 py-1 rounded mr-2 hover:bg-yellow-500"
                    onClick={() => setEditQuiz(quiz)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 px-3 py-1 rounded text-white hover:bg-red-600"
                    onClick={() => handleDelete(quiz._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {quizzes.length === 0 && (
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
