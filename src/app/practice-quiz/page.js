"use client";
import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";

// Fallback sample flashcards
const sampleFlashcards = [
  {
    question: "What is the capital of France?",
    answer: "Paris",
    options: ["Paris", "London", "Berlin", "Madrid"],
  },
  {
    question: "What is 2 + 2?",
    answer: "4",
    options: ["3", "4", "5", "6"],
  },
  {
    question: "Who wrote 'Hamlet'?",
    answer: "William Shakespeare",
    options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
  },
];

function generateOptions(flashcards) {
  // For each card, if options are missing, generate 4 options (answer + 3 random answers from other cards)
  return flashcards.map((card, idx, arr) => {
    if (card.options && card.options.length >= 2) return card;
    // Get other answers as distractors
    const distractors = arr
      .map((c, i) => (i !== idx ? c.answer : null))
      .filter(Boolean)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    const options = [...distractors, card.answer].sort(() => 0.5 - Math.random());
    return { ...card, options };
  });
}

function PracticeQuizPageInner() {
  const searchParams = useSearchParams();
  const flashcardsParam = searchParams.get("flashcards");
  let parsed = null;
  try {
    parsed = flashcardsParam ? JSON.parse(flashcardsParam) : null;
  } catch {
    parsed = null;
  }
  const allFlashcards = useMemo(() =>
    parsed && Array.isArray(parsed) && parsed.length > 0
      ? generateOptions(parsed)
      : sampleFlashcards,
    [flashcardsParam]
  );

  // All hooks must be at the top, before any return
  const [showOptions, setShowOptions] = useState(true);
  const [timer, setTimer] = useState(0); // 0 = no timer
  const maxQuestions = 5;
  const [numQuestions, setNumQuestions] = useState(Math.min(10, maxQuestions));
  const [quizStarted, setQuizStarted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const [quizFlashcards, setQuizFlashcards] = useState([]);
  const [timeLeft, setTimeLeft] = useState(timer);
  const [timedOut, setTimedOut] = useState(false);

  // Timer effects
  React.useEffect(() => {
    if (!quizStarted || timer === 0 || current >= quizFlashcards.length) return;
    setTimeLeft(timer);
    setTimedOut(false);
  }, [quizStarted, timer, current, quizFlashcards.length]);
  React.useEffect(() => {
    if (!quizStarted || timer === 0 || current >= quizFlashcards.length) return;
    if (showResult) return;
    if (timeLeft <= 0) {
      setShowResult(true);
      setIsCorrect(false);
      setSelected(null); // Ensure no answer is selected
      setTimedOut(true);
      return;
    }
    const interval = setInterval(() => {
      setTimeLeft(t => t - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [quizStarted, timer, timeLeft, showResult, current, quizFlashcards.length]);

  // Quiz options page
  if (showOptions) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-200 via-blue-300 to-blue-400 text-white">
        <h1 className="text-5xl font-bold mb-6">Quiz Options</h1>
        <div className="bg-white/80 text-blue-800 rounded-xl shadow-lg p-8 w-full max-w-lg text-center">
          <div className="text-xl font-semibold mb-6">Customize Your Quiz</div>
          <div className="mb-6">
            <label htmlFor="numQuestions" className="block mb-2 font-medium">Number of Questions</label>
            <input
              id="numQuestions"
              type="number"
              min={1}
              max={maxQuestions}
              value={numQuestions}
              onChange={e => {
                let val = Number(e.target.value);
                if (isNaN(val)) val = 1;
                if (val > maxQuestions) val = maxQuestions;
                if (val < 1) val = 1;
                setNumQuestions(val);
              }}
              className="w-24 px-3 py-2 border border-blue-200 rounded text-center text-lg font-semibold text-black placeholder:text-gray-400"
            />
            <div className="text-xs text-blue-700 mt-1">Max: 5 questions</div>
          </div>
          <div className="mb-6">
            <label className="block mb-2 font-medium">Timer Per Question</label>
            <select
              value={timer}
              onChange={e => setTimer(Number(e.target.value))}
              className="w-full px-3 py-2 border border-blue-200 rounded text-center text-lg font-semibold text-black"
            >
              <option value={0}>No timer</option>
              <option value={5}>5 seconds</option>
              <option value={10}>10 seconds</option>
              <option value={15}>15 seconds</option>
              <option value={30}>30 seconds</option>
            </select>
          </div>
          <div className="flex gap-4 justify-center">
            <button
              className="px-8 py-3 bg-gray-200 text-blue-700 rounded-lg font-semibold hover:bg-blue-100 text-lg"
              onClick={() => window.location.href = '/studybuddy'}
            >
              Back
            </button>
            <button
              className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 text-lg"
              onClick={() => setShowOptions(false)}
              disabled={allFlashcards.length === 0 || numQuestions < 1 || numQuestions > maxQuestions}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Start quiz: randomly select numQuestions flashcards
  const handleStartQuiz = () => {
    const shuffled = [...allFlashcards].sort(() => 0.5 - Math.random());
    setQuizFlashcards(shuffled.slice(0, numQuestions));
    setQuizStarted(true);
    setCurrent(0);
    setSelected(null);
    setShowResult(false);
    setIsCorrect(null);
    setScore(0);
    setTimeLeft(timer);
    setTimedOut(false);
  };

  // If not started, show setup
  if (!quizStarted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-200 via-blue-300 to-blue-400 text-white">
        <h1 className="text-5xl font-bold mb-6">Practice Quiz</h1>
        <div className="bg-white/80 text-blue-800 rounded-xl shadow-lg p-8 w-full max-w-lg text-center">
          <div className="text-xl font-semibold mb-6">Quiz Setup</div>
          <div className="mb-6">
            <label className="block mb-2 font-medium">Number of Questions</label>
            <div className="text-lg font-semibold text-blue-900 mb-2">{numQuestions}</div>
            <div className="text-xs text-blue-700 mt-1">Max: 5 questions</div>
          </div>
          <div className="mb-6">
            <label className="block mb-2 font-medium">Timer Per Question</label>
            <div className="text-lg font-semibold text-blue-900 mb-2">{timer === 0 ? 'No timer' : `${timer} seconds`}</div>
          </div>
          <div className="flex gap-4 justify-center">
            <button
              className="px-8 py-3 bg-gray-200 text-blue-700 rounded-lg font-semibold hover:bg-blue-100 text-lg"
              onClick={() => setShowOptions(true)}
            >
              Back
            </button>
            <button
              className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 text-lg"
              onClick={handleStartQuiz}
              disabled={allFlashcards.length === 0 || numQuestions < 1 || numQuestions > maxQuestions}
            >
              Start Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  const card = quizFlashcards[current];

  const handleSelect = (option) => {
    setSelected(option);
    const correct = option === card.answer;
    setIsCorrect(correct);
    setShowResult(true);
    if (correct) setScore((s) => s + 1);
  };

  const handleNext = () => {
    setSelected(null);
    setShowResult(false);
    setIsCorrect(null);
    setCurrent((c) => c + 1);
  };

  // Exit quiz handler
  const handleExitQuiz = () => {
    if (window.confirm('Are you sure you want to exit? Your quiz progress will not be saved.')) {
      window.location.href = '/studybuddy';
    }
  };

  if (current >= quizFlashcards.length) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-200 via-blue-300 to-blue-400 text-white">
        <h1 className="text-5xl font-bold mb-6">Practice Quiz</h1>
        <div className="bg-white/80 text-blue-800 rounded-xl shadow-lg p-8 w-full max-w-lg text-center">
          <div className="text-2xl font-semibold mb-4">Quiz Complete!</div>
          <div className="text-lg mb-2">Your Score: {score} / {quizFlashcards.length}</div>
          <div className="flex gap-4 justify-center mt-6">
            <button
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
              onClick={() => window.location.href = '/studybuddy'}
            >
              Back to Dashboard
            </button>
            <button
              className="px-6 py-2 bg-blue-100 text-blue-700 rounded-lg font-semibold hover:bg-blue-200"
              onClick={() => {
                setQuizStarted(false);
                setQuizFlashcards([]);
              }}
            >
              Start Another Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-200 via-blue-300 to-blue-400 text-white">
      <h1 className="text-5xl font-bold mb-6">Practice Quiz</h1>
      {/* Timer at top left */}
      {timer > 0 && quizStarted && current < quizFlashcards.length && !showResult && (
        <div className="fixed top-6 left-8 bg-blue-900 text-white px-4 py-2 rounded-lg text-lg font-bold z-50 shadow">
          Time Left: {timeLeft}s
        </div>
      )}
      {/* Exit Quiz button fixed top right */}
      <button
        className="fixed top-6 right-8 px-4 py-2 bg-red-100 text-red-700 rounded-lg font-semibold hover:bg-red-200 text-sm z-50 shadow"
        onClick={handleExitQuiz}
      >
        Exit Quiz
      </button>
      <div className="bg-white/80 text-blue-800 rounded-xl shadow-lg p-8 w-full max-w-xl text-center relative" style={{ minHeight: 'auto', maxWidth: '700px', paddingTop: '2rem', paddingBottom: '2rem' }}>
        <div className="text-base font-semibold text-blue-700 mb-2">Question {current + 1} of {quizFlashcards.length}</div>
        <div className="text-xl font-semibold mb-4">Q: {card.question}</div>
        <div className="flex flex-col gap-4 mb-4">
          {card.options.map((option, idx) => {
            const isCorrectAnswer = option === card.answer;
            const isSelected = selected === option;
            let btnClass = 'py-3 px-4 rounded-lg border transition-colors font-medium text-lg ';
            if (showResult) {
              if (isCorrectAnswer) {
                btnClass += 'bg-green-200 border-green-400 text-green-800';
              } else if (isSelected) {
                btnClass += 'bg-red-200 border-red-400 text-red-800';
              } else {
                btnClass += 'bg-blue-50 border-blue-200 text-blue-800';
              }
            } else {
              btnClass += 'bg-blue-50 border-blue-200 text-blue-800 hover:bg-blue-100';
            }
            return (
              <button
                key={idx}
                className={btnClass}
                disabled={showResult}
                onClick={() => handleSelect(option)}
              >
                {option}
              </button>
            );
          })}
        </div>
        {showResult && (
          <div className={`mb-4 text-lg font-bold ${isCorrect ? 'text-green-600' : timedOut ? 'text-yellow-600' : 'text-red-600'}`}>{isCorrect ? 'Correct!' : timedOut ? 'Times Up!' : 'Incorrect.'}</div>
        )}
        {showResult && (
          <button
            className="mt-2 px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
            onClick={handleNext}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}

export default function PracticeQuizPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PracticeQuizPageInner />
    </Suspense>
  );
} 