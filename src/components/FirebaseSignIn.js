"use client";
import React, { useState, useEffect } from "react";
import { auth } from "../firebase";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
} from "firebase/auth";

const actionCodeSettings = {
  url: "http://localhost:3000", // Change to your production URL when deploying
  handleCodeInApp: true,
};

export default function FirebaseSignIn({ onSignIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("password"); // "password" or "link"
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 via-blue-300 to-blue-500">
      <div className="bg-white p-8 rounded shadow w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Sign In</h1>
        <button
          onClick={handleGoogleSignIn}
          className="w-full bg-red-500 text-white py-2 rounded font-semibold mb-4"
        >
          Sign in with Google
        </button>
        <div className="flex justify-center mb-4">
          <button
            className={`px-4 py-2 rounded-l ${mode === "password" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            onClick={() => setMode("password")}
          >
            Email/Password
          </button>
          <button
            className={`px-4 py-2 rounded-r ${mode === "link" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            onClick={() => setMode("link")}
          >
            Email Link
          </button>
        </div>
        {mode === "password" ? (
          <form onSubmit={handleEmailPasswordSignIn} className="flex flex-col gap-2">
            <input
              type="email"
              placeholder="Email"
              className="border p-2 rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="border p-2 rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded font-semibold"
            >
              Sign in with Email/Password
            </button>
          </form>
        ) : (
          <form onSubmit={handleSendLink} className="flex flex-col gap-2">
            <input
              type="email"
              placeholder="Email"
              className="border p-2 rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded font-semibold"
            >
              Send Sign-In Link
            </button>
          </form>
        )}
        {message && <div className="text-green-600 mt-2">{message}</div>}
        {error && <div className="text-red-500 mt-2">{error}</div>}
      </div>
    </div>
  );
} 