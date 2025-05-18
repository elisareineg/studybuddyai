import React from 'react';

export default function FlashcardList({ flashcards }) {
  if (!flashcards || flashcards.length === 0) {
    return <div className="text-gray-500 text-center">No flashcards generated yet.</div>;
  }
  return (
    <div className="space-y-4">
      {flashcards.map((card, idx) => (
        <div key={idx} className="bg-white shadow rounded p-4">
          <div className="font-semibold text-blue-700">Q: {card.question}</div>
          <div className="mt-2 text-gray-700">A: {card.answer}</div>
        </div>
      ))}
    </div>
  );
} 