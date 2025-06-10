"use client";
import React, { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/firebase";
import FirebaseSignIn from "@/components/FirebaseSignIn";
import DropzoneUpload from '@/components/DropzoneUpload';
import FlashcardList from '@/components/FlashcardList';
import Quiz from '@/components/Quiz';
import ImprovementSuggestions from '@/components/ImprovementSuggestions';
import { useRouter, usePathname } from 'next/navigation';
import { FiRefreshCw } from 'react-icons/fi';
import BookshelfBackground from '@/components/BookshelfBackground';

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
  const [selectedSession, setSelectedSession] = useState(null);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const [animatedText, setAnimatedText] = useState("");
  const subtitle = "Select a study option to help ace your exams!";

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
  const saveSession = (fileName, mode, data) => {
    const newSession = {
      fileName,
      mode,
      date: new Date().toISOString(),
      data, // flashcards or quizResults
    };
    const updated = [newSession, ...sessions].slice(0, 20);
    setSessions(updated);
    localStorage.setItem('studybuddy_sessions', JSON.stringify(updated));
  };

  useEffect(() => {
    let i = 0;
    setAnimatedText("");
    const interval = setInterval(() => {
      setAnimatedText(subtitle.slice(0, i + 1));
      i++;
      if (i === subtitle.length) clearInterval(interval);
    }, 30);
    return () => clearInterval(interval);
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
      if (mode === 'questions') {
        saveSession(file.name, mode, data.flashcards || []);
      }
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
      if (mode === 'quiz') {
        saveSession(uploadedFile?.name || 'Quiz', mode, results);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSessionClick = (session, idx) => {
    router.push(`/review/${idx}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-200 via-blue-300 to-blue-500 relative">
      <BookshelfBackground />
      {/* Main content */}
      <main className="flex-1 flex flex-col items-center text-center relative pt-8 w-full px-4">
        <button
          onClick={() => { signOut(auth); setUser(null); }}
          className="absolute top-6 right-8 bg-white text-blue-700 px-4 py-2 rounded shadow font-semibold hover:bg-blue-100"
        >
          Sign Out
        </button>
        <button
          className="absolute top-20 right-8 bg-red-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-600 shadow"
          onClick={() => setShowHelp(true)}
        >
          Help
        </button>
        {/* Only show Back to Dashboard if in questions or quiz mode */}
        {(mode === 'questions' || mode === 'quiz') && (
          <button
            className="fixed top-6 left-8 bg-white text-blue-700 px-6 py-2 rounded-lg font-semibold hover:bg-blue-100 shadow z-50"
            onClick={() => { window.location.href = '/studybuddy'; }}
          >
            Back to Dashboard
          </button>
        )}
        <h1 className="text-6xl font-extrabold mb-2 drop-shadow-lg mt-0">Study Buddy AI</h1>
        {/* Subtitle only visible when not in a mode */}
        {!mode && (
          <div className="mb-8 text-md font-medium text-white/90 text-center max-w-xl mx-auto min-h-[32px]" style={{ fontSize: '1.25rem', marginTop: '3rem' }}>
            {animatedText}<span className="animate-pulse text-blue-200">|</span>
          </div>
        )}
        {!mode && (
          <div className="flex flex-col gap-8 w-full max-w-2xl justify-center" style={{ minHeight: '30vh', marginTop: '2rem' }}>
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
                    saveSession(uploadedFile.name, mode, data.flashcards || []);
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
                        saveSession(uploadedFile.name, mode, null);
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
      {/* Session Review Modal */}
      {showSessionModal && selectedSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-2xl relative border-2 border-blue-200">
            <button className="absolute top-2 right-2 text-blue-700 font-bold text-xl" onClick={() => setShowSessionModal(false)}>&times;</button>
            <h2 className="text-2xl font-bold mb-4 text-blue-700">Session Review</h2>
            <div className="mb-4 text-blue-800 font-semibold">{selectedSession.fileName} ({selectedSession.mode === 'quiz' ? 'Practice Quiz' : 'Practice Questions'})</div>
            <div className="text-blue-900 max-h-[60vh] overflow-y-auto">
              {selectedSession.mode === 'questions' && Array.isArray(selectedSession.data) && (
                <ul className="space-y-4">
                  {selectedSession.data.map((card, idx) => (
                    <li key={idx} className="border-b border-blue-100 pb-2">
                      <div className="font-bold text-blue-800">Q: {card.question}</div>
                      <div className="text-blue-700 mt-1">A: {card.answer}</div>
                    </li>
                  ))}
                </ul>
              )}
              {selectedSession.mode === 'quiz' && selectedSession.data && (
                <ul className="space-y-6">
                  {selectedSession.data.questions?.map((q, idx) => (
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
                  <li className="mt-4 font-bold text-blue-900">Score: {selectedSession.data.score} / {selectedSession.data.questions?.length}</li>
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 