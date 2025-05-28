"use client";
import React, { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/firebase";
import FirebaseSignIn from "@/components/FirebaseSignIn";
import DropzoneUpload from '@/components/DropzoneUpload';
import FlashcardList from '@/components/FlashcardList';
import Quiz from '@/components/Quiz';
import ImprovementSuggestions from '@/components/ImprovementSuggestions';
import { useRouter } from 'next/navigation';
import { FiRefreshCw } from 'react-icons/fi';

export default function StudyBuddyPage() {
  const [user, setUser] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  const [quizResults, setQuizResults] = useState(null);
  const [suggestions, setSuggestions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [mode, setMode] = useState(null); // 'questions' or 'quiz'
  const [notification, setNotification] = useState("");
  const [showHelp, setShowHelp] = useState(false);
  const [helpForm, setHelpForm] = useState({ name: '', email: '', message: '' });
  const [helpStatus, setHelpStatus] = useState('');
  const [sessions, setSessions] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Load sessions from localStorage
  useEffect(() => {
    const userSessions = localStorage.getItem('studybuddy_sessions');
    if (userSessions) setSessions(JSON.parse(userSessions));
  }, []);

  // Save session to localStorage
  const saveSession = (fileName, mode) => {
    const newSession = { fileName, mode, date: new Date().toISOString() };
    const updated = [newSession, ...sessions].slice(0, 20);
    setSessions(updated);
    localStorage.setItem('studybuddy_sessions', JSON.stringify(updated));
  };

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
      saveSession(file.name, mode);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-blue-300 to-blue-400 flex">
      {/* Sidebar for previous sessions (placeholder) */}
      <aside className="w-64 bg-white/70 text-blue-900 p-6 border-r border-blue-100 flex flex-col gap-4 justify-between">
        <div>
          <div className="font-bold text-lg mb-4">Previous Sessions</div>
          {sessions.length === 0 ? (
            <div className="text-sm text-blue-700/70">No previous sessions yet.</div>
          ) : (
            <ul className="text-sm space-y-2">
              {sessions.map((s, i) => (
                <li key={i} className="flex flex-col border-b border-blue-100 pb-2">
                  <span className="font-semibold">{s.fileName}</span>
                  <span className="text-blue-700/80">{s.mode === 'quiz' ? 'Practice Quiz' : 'Practice Questions'}</span>
                  <span className="text-xs text-blue-400">{new Date(s.date).toLocaleString()}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <button
          className="mt-8 px-6 py-2 bg-blue-200 text-blue-900 rounded-lg font-semibold hover:bg-blue-300"
          onClick={() => setShowHelp(true)}
        >
          Help
        </button>
      </aside>
      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center text-center relative">
        <button
          onClick={() => { signOut(auth); setUser(null); }}
          className="absolute top-6 right-8 bg-white text-blue-700 px-4 py-2 rounded shadow font-semibold hover:bg-blue-100"
        >
          Sign Out
        </button>
        <h1 className="text-6xl font-extrabold mb-4 drop-shadow-lg">Study Buddy AI</h1>
        {!mode && (
          <div className="flex flex-col gap-8 mt-8 w-full max-w-2xl">
            <div
              className="bg-white/80 rounded-xl shadow-lg p-8 cursor-pointer hover:bg-blue-50 border border-blue-100 transition"
              onClick={() => setMode('questions')}
            >
              <div className="text-2xl font-bold text-blue-700 mb-2">Practice Questions</div>
              <div className="text-blue-800 text-base">Generate practice questions and answers based off your notes.</div>
            </div>
            <div
              className="bg-white/80 rounded-xl shadow-lg p-8 cursor-pointer hover:bg-blue-50 border border-blue-100 transition"
              onClick={() => setMode('quiz')}
            >
              <div className="text-2xl font-bold text-blue-700 mb-2">Practice Quiz</div>
              <div className="text-blue-800 text-base">Simulate a multiple choice quiz based off your notes.</div>
            </div>
          </div>
        )}
        {/* Practice Questions Mode */}
        {mode === 'questions' && (
          <div className="flex flex-col items-center w-full mt-8">
            <DropzoneUpload onFileUpload={handleFileUpload} />
            {uploadedFile && (
              <div className="w-full max-w-2xl mt-8 mx-auto">
                <FlashcardList flashcards={flashcards} isGenerating={isGenerating} />
              </div>
            )}
            {/* Generate New Questions button */}
            <button
              className="flex items-center gap-2 mt-8 px-6 py-2 bg-blue-100 text-blue-700 rounded-lg font-semibold hover:bg-blue-200"
              onClick={async () => {
                if (uploadedFile) {
                  setIsGenerating(true);
                  const formData = new FormData();
                  formData.append('files', uploadedFile);
                  const res = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                  });
                  const data = await res.json();
                  if (res.ok) {
                    setFlashcards(data.flashcards || []);
                    setNotification('New questions generated!');
                    setTimeout(() => setNotification(''), 2500);
                    saveSession(uploadedFile.name, mode);
                  } else {
                    setFlashcards([]);
                    alert(data.error || 'Failed to process file. Please upload a valid PDF, DOCX, or TXT file.');
                  }
                  setIsGenerating(false);
                } else {
                  setUploadedFile(null);
                  setFlashcards([]);
                  setQuizResults(null);
                }
              }}
            >
              <FiRefreshCw className="inline-block" /> Generate New Questions
            </button>
            {isGenerating && (
              <div className="flex flex-col items-center mt-6">
                <div className="h-10 w-10 border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent rounded-full animate-spin mb-2"></div>
                <div className="text-blue-900 font-semibold">Generating questions...</div>
              </div>
            )}
            {notification && (
              <div className="fixed top-8 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 font-semibold animate-fade-in">
                {notification}
              </div>
            )}
            <button
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
              onClick={() => setMode(null)}
            >
              Back to Dashboard
            </button>
          </div>
        )}
        {/* Practice Quiz Mode */}
        {mode === 'quiz' && (
          <div className="flex flex-col items-center w-full mt-8">
            <DropzoneUpload onFileUpload={handleFileUpload} isProcessing={isGenerating} />
            {uploadedFile && (
              <>
                {isGenerating ? (
                  <div className="flex flex-col items-center mt-8">
                    <div className="h-10 w-10 border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent rounded-full animate-spin mb-2"></div>
                    <div className="text-blue-900 font-semibold text-lg">Generating quiz questions...</div>
                  </div>
                ) : (
                  <button
                    className="mt-8 px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
                    onClick={() => {
                      if (flashcards.length > 0) {
                        router.push(`/practice-quiz?flashcards=${encodeURIComponent(JSON.stringify(flashcards))}`);
                        saveSession(uploadedFile.name, mode);
                      } else {
                        alert('Failed to generate flashcards. Please try again.');
                      }
                    }}
                  >
                    Start Quiz
                  </button>
                )}
              </>
            )}
            {notification && (
              <div className="fixed top-8 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 font-semibold animate-fade-in">
                {notification}
              </div>
            )}
            <button
              className="mt-8 px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
              onClick={() => setMode(null)}
            >
              Back to Dashboard
            </button>
          </div>
        )}
        {quizResults && (
          <ImprovementSuggestions suggestions={suggestions} />
        )}
      </main>
      {/* Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
            <button className="absolute top-2 right-2 text-blue-700 font-bold text-xl" onClick={() => setShowHelp(false)}>&times;</button>
            <h2 className="text-2xl font-bold mb-4 text-blue-700">Contact Support</h2>
            <form onSubmit={async e => {
              e.preventDefault();
              setHelpStatus('');
              try {
                // Replace with your real API endpoint
                const res = await fetch('/api/help', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ ...helpForm, to: 'elisareine.a.goncalves@gmail.com' }),
                });
                if (res.ok) {
                  setHelpStatus('Message sent! We will get back to you soon.');
                  setHelpForm({ name: '', email: '', message: '' });
                } else {
                  setHelpStatus('Failed to send message. Please try again.');
                }
              } catch {
                setHelpStatus('Failed to send message. Please try again.');
              }
            }}>
              <input type="text" required placeholder="Your Name" className="w-full mb-3 p-2 border rounded text-black placeholder:text-gray-400" value={helpForm.name} onChange={e => setHelpForm(f => ({ ...f, name: e.target.value }))} />
              <input type="email" required placeholder="Your Email" className="w-full mb-3 p-2 border rounded text-black placeholder:text-gray-400" value={helpForm.email} onChange={e => setHelpForm(f => ({ ...f, email: e.target.value }))} />
              <textarea required placeholder="How can we help you?" className="w-full mb-3 p-2 border rounded text-black placeholder:text-gray-400" rows={4} value={helpForm.message} onChange={e => setHelpForm(f => ({ ...f, message: e.target.value }))} />
              <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700">Send</button>
              {helpStatus && <div className="mt-3 text-center text-blue-700 font-semibold">{helpStatus}</div>}
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 