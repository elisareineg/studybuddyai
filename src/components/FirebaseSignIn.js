"use client";
import React, { useState, useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { auth } from "../firebase";
import BookshelfBackground from "./BookshelfBackground";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
} from "firebase/auth";

const actionCodeSettings = {
  url: process.env.NEXT_PUBLIC_FIREBASE_REDIRECT_URL || "https://studybuddyai-five.vercel.app/studybuddy",
  handleCodeInApp: true,
};

function SignUpModal({ open, onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const { createUserWithEmailAndPassword } = await import("firebase/auth");
      await createUserWithEmailAndPassword(auth, email, password);
      setSuccess("Account created! You can now sign in.");
      setEmail("");
      setPassword("");
    } catch (err) {
      setError(err.message);
    }
  };
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <BookshelfBackground />
      <div className="bg-white bg-opacity-80 backdrop-blur-md rounded-2xl shadow-2xl border border-blue-100 p-8 w-full max-w-md relative flex flex-col items-center">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl">&times;</button>
        <h2 className="text-2xl font-bold mb-2 text-gray-900 text-center">Sign Up</h2>
        <p className="text-gray-500 mb-6 text-center">Create your free account</p>
        <form className="flex flex-col gap-3 w-full" onSubmit={handleSignUp}>
          <label className="text-xs font-semibold text-gray-600 mt-2">EMAIL ADDRESS</label>
          <input type="email" placeholder="user@acme.com" className="border p-2 rounded" value={email} onChange={e => setEmail(e.target.value)} required />
          <label className="text-xs font-semibold text-gray-600 mt-2">PASSWORD</label>
          <input type="password" placeholder="Password" className="border p-2 rounded text-black" value={password} onChange={e => setPassword(e.target.value)} required />
          <button type="submit" className="w-full bg-gray-100 hover:bg-blue-100 text-gray-800 py-2 rounded font-semibold mt-2 border border-gray-200 transition btn-shine">Sign up</button>
        </form>
        {success && <div className="text-green-600 mt-2">{success}</div>}
        {error && <div className="text-red-500 mt-2">{error}</div>}
      </div>
    </div>
  );
}

function AnimatedPaper() {
  // Typing animation for the feedback message
  const feedbackLines = [
    "Based off your notes, here are some questions:",
    "    1. What is the main concept of photosynthesis?",
    "    2. How does light intensity affect the rate of photosynthesis?",
    "    3. Name two products of the photosynthesis process."
  ];
  const [displayed, setDisplayed] = useState(["", "", "", ""]);
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    let line = currentLine;
    let char = currentChar;
    let lines = [...displayed];
    if (line < feedbackLines.length) {
      const interval = setInterval(() => {
        lines[line] = feedbackLines[line].slice(0, char + 1);
        setDisplayed([...lines]);
        char++;
        if (char >= feedbackLines[line].length) {
          line++;
          char = 0;
          setCurrentLine(line);
          setCurrentChar(char);
          clearInterval(interval);
          if (line === feedbackLines.length) {
            setTimeout(() => setShowPrompt(true), 400);
          }
        } else {
          setCurrentChar(char);
        }
      }, 30);
      return () => clearInterval(interval);
    }
  }, [currentLine]);

  return (
    <div className="flex flex-col items-center justify-start ml-0 md:ml-12 mt-8 md:mt-0 w-full md:w-[520px] max-w-[98vw]">
      <div className="bg-white bg-opacity-90 backdrop-blur-md rounded-2xl shadow-2xl border border-blue-100 p-10 w-full min-h-[340px] flex flex-col relative">
        <div className="absolute left-1/2 -top-7 transform -translate-x-1/2 bg-blue-100 px-6 py-2 rounded-full shadow text-blue-700 font-bold text-lg tracking-wide border border-blue-200">Generating</div>
        <div className="text-gray-800 font-mono text-base whitespace-pre-line min-h-[180px] mt-6">
          {displayed.map((line, idx) => (
            <div key={idx}>{line}{idx === currentLine && <span className="animate-pulse text-blue-400">|</span>}</div>
          ))}
        </div>
        {showPrompt && (
          <div className="mt-8 text-center text-blue-700 font-semibold text-base">Would you like me to provide the answers?</div>
        )}
      </div>
    </div>
  );
}

export default function FirebaseSignIn({ onSignIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("password"); // "password" or "link"
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showSignUp, setShowSignUp] = useState(false);

  // Handle email link sign-in on page load
  useEffect(() => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      let emailForSignIn = window.localStorage.getItem("emailForSignIn");
      if (!emailForSignIn) {
        emailForSignIn = window.prompt("Please provide your email for confirmation");
      }
      signInWithEmailLink(auth, emailForSignIn, window.location.href)
        .then((result) => {
          window.localStorage.removeItem("emailForSignIn");
          setMessage("Signed in successfully!");
          onSignIn && onSignIn(result.user);
        })
        .catch((err) => {
          setError(err.message);
        });
    }
  }, [onSignIn]);

  const handleEmailPasswordSignIn = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      onSignIn && onSignIn(userCredential.user);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      onSignIn && onSignIn(userCredential.user);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSendLink = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem("emailForSignIn", email);
      setMessage("Sign-in link sent! Check your email.");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-200 via-blue-300 to-blue-500 relative">
      <BookshelfBackground />
      <h1 className="text-5xl md:text-6xl font-extrabold mb-2 mt-8 drop-shadow-lg text-white text-center">Study Buddy AI</h1>
      <p className="mb-8 text-lg md:text-2xl font-medium text-white/90 text-center max-w-xl mx-auto">Your #1 AI Powered Studying Tool For Exams</p>
      <div className="flex flex-col md:flex-row items-center justify-center w-full z-10">
        <div className="bg-white bg-opacity-80 backdrop-blur-md rounded-2xl shadow-xl p-8 w-full max-w-md flex flex-col items-center border border-blue-100">
          <h2 className="text-2xl font-bold mb-2 text-gray-900 text-center">Sign In</h2>
          <p className="text-gray-500 mb-6 text-center">Use your email and password to sign in</p>
          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-2 btn-shine text-black py-2 rounded font-semibold mb-4 transition shadow"
          >
            <FcGoogle className="text-2xl" />
            Sign in with Google
          </button>
          <div className="flex justify-center mb-4 w-full">
            <button
              className={`flex-1 px-4 py-2 rounded-l ${mode === "password" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}
              onClick={() => setMode("password")}
            >
              Email/Password
            </button>
            <button
              className={`flex-1 px-4 py-2 rounded-r ${mode === "link" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}
              onClick={() => setMode("link")}
            >
              Email Link
            </button>
          </div>
          {mode === "password" ? (
            <form onSubmit={handleEmailPasswordSignIn} className="flex flex-col gap-2 w-full">
              <label className="text-xs font-semibold text-gray-600 mt-2">EMAIL ADDRESS</label>
              <input
                type="email"
                placeholder="user@acme.com"
                className="border p-2 rounded"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label className="text-xs font-semibold text-gray-600 mt-2">PASSWORD</label>
              <input
                type="password"
                placeholder="Password"
                className="border p-2 rounded text-black"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="submit"
                className="w-full bg-gray-100 hover:bg-blue-100 text-gray-800 py-2 rounded font-semibold mt-2 border border-gray-200 transition btn-shine"
              >
                Sign in
              </button>
            </form>
          ) : (
            <form onSubmit={handleSendLink} className="flex flex-col gap-2 w-full">
              <label className="text-xs font-semibold text-gray-600 mt-2">EMAIL ADDRESS</label>
              <input
                type="email"
                placeholder="user@acme.com"
                className="border p-2 rounded"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button
                type="submit"
                className="w-full bg-gray-100 hover:bg-blue-100 text-gray-800 py-2 rounded font-semibold mt-2 border border-gray-200 transition btn-shine"
              >
                Send Sign-In Link
              </button>
            </form>
          )}
          {message && <div className="text-green-600 mt-2">{message}</div>}
          {error && <div className="text-red-500 mt-2">{error}</div>}
          <div className="mt-6 text-center text-gray-500 text-sm">
            Don&apos;t have an account? <button onClick={() => setShowSignUp(true)} className="text-blue-600 font-semibold hover:underline">Sign up for free.</button>
          </div>
        </div>
        <AnimatedPaper />
      </div>
      <SignUpModal open={showSignUp} onClose={() => setShowSignUp(false)} />
    </div>
  );
} 