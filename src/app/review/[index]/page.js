"use client";
import { useRouter, useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function ReviewSessionPage() {
  const router = useRouter();
  const params = useParams();
  const index = parseInt(params.index, 10);
  const [session, setSession] = useState(null);

  useEffect(() => {
    const sessions = JSON.parse(localStorage.getItem("studybuddy_sessions") || "[]");
    if (sessions[index]) {
      setSession(sessions[index]);
    }
  }, [index]);

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center text-blue-900">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-lg w-full text-center">
          <div className="text-2xl font-bold mb-4">Session not found</div>
          <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700" onClick={() => router.push("/studybuddy")}>Back to Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-blue-300 to-blue-400 flex flex-col items-center justify-center text-blue-900 py-12">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl w-full">
        <button className="mb-4 px-6 py-2 bg-blue-100 text-blue-700 rounded-lg font-semibold hover:bg-blue-200" onClick={() => router.push("/studybuddy")}>Back to Dashboard</button>
        <h1 className="text-3xl font-bold mb-2 text-blue-700">Session Review</h1>
        <div className="mb-4 text-blue-800 font-semibold">{session.fileName} ({session.mode === 'quiz' ? 'Practice Quiz' : 'Practice Questions'})</div>
        {session.mode === 'questions' && Array.isArray(session.data) && (
          <ul className="space-y-4">
            {session.data.map((card, idx) => (
              <li key={idx} className="border-b border-blue-100 pb-2">
                <div className="font-bold text-blue-800">Q: {card.question}</div>
                <div className="text-blue-700 mt-1">A: {card.answer}</div>
              </li>
            ))}
          </ul>
        )}
        {session.mode === 'quiz' && session.data && (
          <ul className="space-y-6">
            {session.data.questions?.map((q, idx) => (
              <li key={idx} className="border-b border-blue-100 pb-2">
                <div className="font-bold text-blue-800 mb-1">Q{idx + 1}: {q.question}</div>
                <div className="text-blue-700">Your answer: <span className={q.correct ? 'text-green-600' : 'text-red-600'}>{q.userAnswer}</span></div>
                {!q.correct && (
                  <div className="text-blue-700">Correct answer: <span className="text-green-700">{q.correctAnswer}</span></div>
                )}
                {q.explanation && (
                  <div className="text-blue-500 text-sm mt-1">Explanation: {q.explanation}</div>
                )}
                <div className={q.correct ? 'text-green-600 font-semibold mt-1' : 'text-red-600 font-semibold mt-1'}>
                  {q.correct ? 'Correct' : 'Incorrect'}
                </div>
              </li>
            ))}
            <li className="mt-4 font-bold text-blue-900">Score: {session.data.score} / {session.data.questions?.length}</li>
          </ul>
        )}
      </div>
    </div>
  );
} 