import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function JoinQuiz() {
  const [quizId, setQuizId] = useState("");
  const navigate = useNavigate();

  const handleJoin = (e) => {
    e.preventDefault();
    if (!quizId.trim()) {
      alert("⚠️ Please enter a Quiz ID");
      return;
    }
    navigate(`/quiz/${quizId}/instructions`); // redirect student to instructions page
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleJoin}
        className="bg-white p-6 rounded-lg shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">🎯 Join a Quiz</h2>
        <input
          type="text"
          placeholder="Enter Quiz ID"
          value={quizId}
          onChange={(e) => setQuizId(e.target.value)}
          className="border p-2 w-full mb-4 rounded"
        />
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 transition"
        >
          🚀 Start Quiz
        </button>
      </form>
    </div>
  );
}
