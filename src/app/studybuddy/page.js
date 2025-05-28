"use client";
import React, { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/firebase";
import FirebaseSignIn from "@/components/FirebaseSignIn";
import DropzoneUpload from '@/components/DropzoneUpload';
import FlashcardList from '@/components/FlashcardList';
import Quiz from '@/components/Quiz';
import ImprovementSuggestions from '@/components/ImprovementSuggestions';

export default function StudyBuddyPage() {
  const [user, setUser] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  const [quizResults, setQuizResults] = useState(null);
  const [suggestions, setSuggestions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
  }

  if (!user) {
    return <FirebaseSignIn onSignIn={setUser} />;
  }

  // Handle file upload and get flashcards from backend
  const handleFileUpload = async (file) => {
    setUploadedFile(file);
    setIsGenerating(true);
    const formData = new FormData();
    formData.append('files', file);
    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    if (res.ok) {
      setFlashcards(data.flashcards || []);
    } else {
      setFlashcards([]);
      alert(data.error || 'Failed to process file. Please upload a valid PDF, DOCX, or TXT file.');
    }
    setIsGenerating(false);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-blue-300 to-blue-400 flex flex-col items-center justify-center text-white text-center relative">
      <button
        onClick={() => { signOut(auth); setUser(null); }}
        className="absolute top-6 right-8 bg-white text-blue-700 px-4 py-2 rounded shadow font-semibold hover:bg-blue-100"
      >
        Sign Out
      </button>
      <h1 className="text-6xl font-extrabold mb-4 drop-shadow-lg">Study Buddy AI</h1>
      <p className="mb-8 text-lg font-medium text-white/90 text-center max-w-xl mx-auto">Drop your notes below to generate questions and feedback to ace your exams!</p>
      <div className="flex flex-col items-center w-full">
        <DropzoneUpload onFileUpload={handleFileUpload} />
        {uploadedFile && (
          <div className="w-full max-w-2xl mt-8 mx-auto">
            <FlashcardList flashcards={flashcards} isGenerating={isGenerating} />
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