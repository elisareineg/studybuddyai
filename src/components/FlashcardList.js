"use client";
import React, { useState, useEffect } from 'react';

export default function FlashcardList({ flashcards, isGenerating }) {
  const [flipped, setFlipped] = useState(Array(flashcards?.length || 0).fill(false));

  useEffect(() => {
    setFlipped(Array(flashcards?.length || 0).fill(false));
  }, [flashcards]);

  if (!flashcards || flashcards.length === 0) {
    return <div className="text-gray-500 text-center">No flashcards generated yet.</div>;
  }

  const handleFlip = idx => {
    setFlipped(f => f.map((v, i) => (i === idx ? !v : v)));
  };

  return (
    <div className="space-y-6">
      <style jsx>{`
        .flip-card {
          perspective: 1200px;
        }
        .flip-inner {
          transition: transform 0.6s cubic-bezier(0.4,0.2,0.2,1);
          transform-style: preserve-3d;
          position: relative;
        }
        .flipped {
          transform: rotateY(180deg);
        }
        .flip-front, .flip-back {
          backface-visibility: hidden;
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
        }
        .flip-back {
          transform: rotateY(180deg);
        }
      `}</style>
      {flashcards.map((card, idx) => (
        <div key={idx} className="flex justify-center">
          <div
            className="flip-card w-full max-w-2xl h-40 cursor-pointer"
            onClick={() => handleFlip(idx)}
          >
            <div className={`flip-inner w-full h-full ${flipped[idx] ? 'flipped' : ''}`}>
              {/* Front */}
              <div className="flip-front bg-white rounded-xl shadow-lg flex flex-col items-center justify-center px-6 border-2 border-blue-100">
                <div className="font-bold text-blue-800 text-lg text-center mb-2">Q: {card.question}</div>
                <div className="text-blue-500 text-sm mt-2">Click To View Answer</div>
              </div>
              {/* Back */}
              <div className="flip-back bg-blue-50 rounded-xl shadow-lg flex flex-col items-center justify-center px-6 border-2 border-blue-200">
                <div className="font-bold text-blue-800 text-lg text-center mb-2">A:</div>
                <div className="text-gray-800 text-base text-center">{card.answer}</div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Add perspective utility if not present in Tailwind config:
// .perspective { perspective: 1200px; }
// .rotate-y-180 { transform: rotateY(180deg); } 