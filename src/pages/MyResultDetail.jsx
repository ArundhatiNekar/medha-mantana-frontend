// frontend/src/pages/MyResultDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import api from "../api/api";

export default function MyResultDetail() {
  const { id } = useParams(); // resultId from URL
  const location = useLocation();
  const navigate = useNavigate();

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ✅ Prefer state result if available (immediate after submit)
    if (location.state?.result) {
      console.log("⚡ Using result from navigation state:", location.state.result);
      setResult(location.state.result);
      setLoading(false);
      return;
    }

    // Otherwise, fetch from API
    const fetchResultDetail = async () => {
      try {
        const res = await api.get(`/api/results/${id}`);
        console.log("✅ Result Data from API:", res.data);

        // handle both {result: {...}} and direct object {...}
        const data = res.data.result ? res.data.result : res.data;
        setResult(data);
      } catch (err) {
        console.error("❌ Error fetching result detail:", err);
        alert("Failed to load result details");
      } finally {
        setLoading(false);
      }
    };

    fetchResultDetail();
  }, [id, location.state]);

  if (loading) return <div className="p-6">⏳ Loading result...</div>;
  if (!result) return <div className="p-6 text-red-500">❌ Result not found</div>;

  // ✅ Maintain same shuffled order if questionOrder exists
  const orderedAnswers = result.questionOrder
    ? result.questionOrder
        .map((qid) => result.answers.find((a) => String(a.questionId) === String(qid)))
        .filter(Boolean)
    : result.answers;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          📊 My Quiz Result –{" "}
          <span className="text-indigo-600">{result.quiz?.title || "N/A"}</span>
        </h1>
        <button
          onClick={() => navigate("/student")}
          className="bg-indigo-500 text-white px-4 py-2 rounded"
        >
          ⬅️ Back to Dashboard
        </button>
      </div>

      {/* Summary */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <p>
          <b>Score:</b> {result.score} / {result.totalQuestions || result.total}
        </p>
        <p>
          <b>Percentage:</b> {(() => {
            const total = result.totalQuestions || result.total || 1;
            const percentage = total > 0 ? ((result.score / total) * 100).toFixed(2) : 0;
            return `${percentage}%`;
          })()}
        </p>
        <p>
          <b>Time Taken:</b> {result.timeTaken} sec
        </p>
        <p>
          <b>Date:</b> {new Date(result.attemptedAt || result.date).toLocaleString()}
        </p>
      </div>

      {/* Questions Review */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">📝 Review</h2>

        {orderedAnswers && orderedAnswers.length > 0 ? (
          orderedAnswers.map((q, idx) => (
            <div
              key={q._id || idx}
              className={`p-4 mb-3 rounded border ${
                q.correct
                  ? "border-green-500 bg-green-50"
                  : "border-red-500 bg-red-50"
              }`}
            >
              <p className="font-medium">
                {idx + 1}. {q.question}
              </p>

              {/* Options */}
              <ul className="ml-6 mt-2 list-disc">
                {q.options?.map((opt, i) => (
                  <li
                    key={i}
                    className={`${
                      opt === q.correctAnswer
                        ? "font-bold text-green-700" // ✅ correct
                        : opt === q.chosenAnswer
                        ? "text-red-600" // ❌ wrong chosen
                        : ""
                    }`}
                  >
                    {opt}
                  </li>
                ))}
              </ul>

              {/* Your Answer */}
              <p className="mt-2">
                <b>Your Answer:</b>{" "}
                <span className={q.correct ? "text-green-700" : "text-red-600"}>
                  {q.chosenAnswer || "Not Answered"}
                </span>
              </p>

              {/* Correct Answer */}
              <p>
                <b>Correct Answer:</b>{" "}
                <span className="text-green-700">{q.correctAnswer || "N/A"}</span>
              </p>

              {/* Explanation */}
              <p className="mt-1 text-sm text-gray-600">
                <b>Explanation:</b>{" "}
                {q.explanation && q.explanation.trim() !== ""
                  ? q.explanation
                  : "No explanation provided."}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">⚠️ No questions found for this quiz.</p>
        )}
      </div>
    </div>
  );
}
