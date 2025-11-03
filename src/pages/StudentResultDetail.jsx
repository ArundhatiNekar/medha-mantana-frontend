// frontend/src/pages/StudentResultDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";

export default function StudentResultDetail() {
  const { studentName, id } = useParams(); // can come from faculty (studentName) or student (id)
  const [results, setResults] = useState([]);
  const [singleResult, setSingleResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const isFacultyMode = Boolean(studentName);
  const isStudentMode = Boolean(id);

  /* ---------------- FETCH RESULTS ---------------- */
  useEffect(() => {
    const fetchResults = async () => {
      try {
        if (isFacultyMode) {
          const res = await api.get(`/api/results/student/${studentName}`);
          setResults(res.data.results || []);
        } else if (isStudentMode) {
          const res = await api.get(`/api/results/${id}`);
          setSingleResult(res.data.result || null);
        }
      } catch (err) {
        console.error("❌ Error fetching student results:", err);
        if (err.response?.status === 404) {
          setSingleResult(null);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [studentName, id, isFacultyMode, isStudentMode]);

  if (loading) return <div className="p-6">⏳ Loading results...</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {isFacultyMode ? (
            <>
              📊 Results for{" "}
              <span className="text-indigo-600">{studentName}</span>
            </>
          ) : (
            "📊 My Quiz Result"
          )}
        </h1>
        <button
          onClick={() => navigate(-1)}
          className="bg-indigo-500 text-white px-4 py-2 rounded"
        >
          ⬅️ Back
        </button>
      </div>

      {/* Faculty Mode → Multiple results */}
      {isFacultyMode && results.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <table className="min-w-full bg-white shadow rounded">
            <thead className="bg-indigo-600 text-white">
              <tr>
                <th>Quiz</th>
                <th>Score</th>
                <th>Total</th>
                <th>Percentage</th>
                <th>Time Taken (sec)</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r) => {
                // ✅ Fixed total & percentage handling
                const totalQ =
                  r.totalQuestions ||
                  r.total ||
                  r.quiz?.numQuestions ||
                  r.quiz?.questions?.length ||
                  r.answers?.length ||
                  1;
                const percent = ((r.score / totalQ) * 100).toFixed(2);
                const timeTaken = r.timeTaken || "N/A";
                return (
                  <tr key={r._id} className="border-b hover:bg-gray-100">
                    <td>{r.quiz?.title || "N/A"}</td>
                    <td className="font-bold">{r.score}</td>
                    <td>{totalQ}</td>
                    <td>{isNaN(percent) ? "0" : percent}%</td>
                    <td>{timeTaken}</td>
                    <td>
                      {r.attemptedAt
                        ? new Date(r.attemptedAt).toLocaleString()
                        : r.date
                        ? new Date(r.date).toLocaleString()
                        : "N/A"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Student Mode → Single attempt detail */}
      {isStudentMode && singleResult && (
        <div className="bg-white p-6 rounded-lg shadow">
          {/* ✅ Removed category from title */}
          <h2 className="text-xl font-semibold mb-4">
            {singleResult.quiz?.title || "Quiz Result"}
          </h2>

          {/* ✅ Fix total + percentage */}
          {(() => {
            // ✅ Safe total and percentage fix
            let totalQ =
              singleResult?.totalQuestions ??
              singleResult?.total ??
              singleResult?.quiz?.numQuestions ??
              singleResult?.quiz?.questions?.length ??
              singleResult?.answers?.length ??
              0;

            if (!totalQ || totalQ <= 0) totalQ = 1;

            const percent =
              singleResult?.score != null
                ? Math.round((singleResult.score / totalQ) * 100)
                : 0;

            return (
              <>
                <p>
                  <b>Score:</b> {singleResult.score}/{totalQ}
                </p>
                <p>
                  <b>Percentage:</b> {isNaN(percent) ? "0" : percent}%
                </p>
                <p>
                  <b>Time Taken:</b> {singleResult.timeTaken || "N/A"} sec
                </p>
                <p>
                  <b>Date:</b>{" "}
                  {singleResult.attemptedAt
                    ? new Date(singleResult.attemptedAt).toLocaleString()
                    : singleResult.date
                    ? new Date(singleResult.date).toLocaleString()
                    : "N/A"}
                </p>
                <p>
                  <b>Quiz Created:</b>{" "}
                  {singleResult.quiz?.createdAt
                    ? new Date(singleResult.quiz.createdAt).toLocaleString()
                    : "N/A"}
                </p>
              </>
            );
          })()}

          <h3 className="text-lg font-semibold mt-4 mb-2">
            Questions & Answers
          </h3>
          {singleResult.quiz?.questions.map((q, idx) => (
            <div key={q._id} className="mb-3 p-3 border rounded">
              <p>
                <b>{idx + 1}.</b> {q.question}
              </p>
              <ul className="ml-4">
                {q.options.map((opt, i) => {
                  const answerSnapshot = singleResult.answers.find(
                    (a) => a.questionId?.toString() === q._id?.toString()
                  );
                  const isCorrect = opt === q.answer;
                  const isChosen = opt === answerSnapshot?.chosenAnswer;
                  return (
                    <li
                      key={i}
                      className={`${
                        isCorrect
                          ? "text-green-600 font-semibold"
                          : isChosen
                          ? "text-red-600"
                          : ""
                      }`}
                    >
                      {opt}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Empty states */}
      {isFacultyMode && results.length === 0 && (
        <p className="text-gray-500">No results found for this student</p>
      )}
      {isStudentMode && !singleResult && (
        <p className="text-gray-500">No details found for this attempt</p>
      )}
    </div>
  );
}
