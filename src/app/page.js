"use client";

import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase";
import FirebaseSignIn from "@/components/FirebaseSignIn";
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
      // Redirect authenticated users to /studybuddy
      if (firebaseUser) {
        router.push('/studybuddy');
      }
    });
    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
  }

  if (!user) {
    return <FirebaseSignIn onSignIn={setUser} />;
  }

  // This should not render if user is authenticated (redirect happens above)
  return null;
}
