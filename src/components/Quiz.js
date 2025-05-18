import React, { useState } from 'react';

export default function Quiz({ flashcards, onComplete }) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [finished, setFinished] = useState(false);

  if (!flashcards || flashcards.length === 0) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const newAnswers = [...answers, { question: flashcards[current].question, userAnswer: userInput, correctAnswer: flashcards[current].answer }];
    setAnswers(newAnswers);
    setUserInput('');
    if (current + 1 < flashcards.length) {
      setCurrent(current + 1);
    } else {
      setFinished(true);
      onComplete(newAnswers);
    }
  };

  if (finished) {
    return <div className="text-green-600 text-center">Quiz complete! See your results below.</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 bg-white p-6 rounded shadow">
      <div className="font-semibold mb-2">{flashcards[current].question}</div>
      <input
        className="border rounded px-3 py-2 w-full mb-4"
        value={userInput}
        onChange={e => setUserInput(e.target.value)}
        placeholder="Your answer..."
        required
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">{current + 1 === flashcards.length ? 'Finish' : 'Next'}</button>
    </form>
  );
} 