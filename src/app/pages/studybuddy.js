import React, { useState } from 'react';
import DropzoneUpload from '../../components/DropzoneUpload';
import FlashcardList from '../../components/FlashcardList';
import Quiz from '../../components/Quiz';
import ImprovementSuggestions from '../../components/ImprovementSuggestions';

export default function StudyBuddy() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  const [quizResults, setQuizResults] = useState(null);
  const [suggestions, setSuggestions] = useState(null);

  // Placeholder handlers
  const handleFileUpload = (file) => {
    setUploadedFile(file);
    // TODO: Send file to backend and get flashcards
  };

  const handleQuizComplete = (results) => {
    setQuizResults(results);
    // TODO: Send results to backend and get suggestions
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6">Study Buddy: AI-Powered Quizlet Clone</h1>
      <DropzoneUpload onFileUpload={handleFileUpload} />
      {uploadedFile && (
        <div className="w-full max-w-2xl mt-8">
          <FlashcardList flashcards={flashcards} />
          <Quiz flashcards={flashcards} onComplete={handleQuizComplete} />
        </div>
      )}
      {quizResults && (
        <ImprovementSuggestions suggestions={suggestions} />
      )}
    </div>
  );
} 