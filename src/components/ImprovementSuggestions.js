"use client";
import React from 'react';

export default function ImprovementSuggestions({ suggestions }) {
  if (!suggestions) return null;
  return (
    <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
      <h2 className="font-bold text-yellow-700 mb-2">AI Suggestions for Improvement</h2>
      {Array.isArray(suggestions) ? (
        <ul className="list-disc ml-6">
          {suggestions.map((s, i) => <li key={i}>{s}</li>)}
        </ul>
      ) : (
        <p>{suggestions}</p>
      )}
    </div>
  );
} 