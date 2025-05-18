"use client";
import React, { useState } from 'react';
import DropzoneUpload from './components/DropzoneUpload';
import FlashcardList from './components/FlashcardList';
import Quiz from './components/Quiz';
import ImprovementSuggestions from './components/ImprovementSuggestions';

export default function StudyBuddy() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  const [quizResults, setQuizResults] = useState(null);
  const [suggestions, setSuggestions] = useState(null);

  // Handle file upload and get flashcards from backend
  const handleFileUpload = async (file) => {
    setUploadedFile(file);
    const formData = new FormData();
    formData.append('files', file);
    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    if (res.ok) {
      const data = await res.json();
      setFlashcards(data.flashcards || []);
    } else {
      setFlashcards([]);
    }
  };

  // Handle quiz completion and get suggestions from backend
  const handleQuizComplete = async (results) => {
    setQuizResults(results);
    const res = await fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quizResults: results }),
    });
    if (res.ok) {
      const data = await res.json();
      setSuggestions(data.suggestions || []);
    } else {
      setSuggestions([]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-blue-300 to-blue-500 py-8 px-4 flex flex-col items-center justify-center text-white text-center">
      <h1 className="text-6xl font-extrabold mb-4 drop-shadow-lg">Study Buddy AI</h1>
      <p className="mb-8 text-lg font-medium text-white/90 text-center max-w-xl mx-auto">Drop your notes below to generate questions and feedback to ace your exams!</p>
      <div className="flex flex-col items-center w-full">
        <DropzoneUpload onFileUpload={handleFileUpload} />
        {uploadedFile && (
          <div className="w-full max-w-2xl mt-8 mx-auto">
            <FlashcardList flashcards={flashcards} />
            <Quiz flashcards={flashcards} onComplete={handleQuizComplete} />
          </div>
        )}
        {quizResults && (
          <ImprovementSuggestions suggestions={suggestions} />
        )}
      </div>
    </div>
  );
} 