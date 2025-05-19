"use client";

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useSearchParams, useRouter } from 'next/navigation';
import { FcGoogle } from 'react-icons/fc';

export default function SignIn() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCredentialsSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });
      
      if (result?.error) {
        setError('Invalid email or password');
      } else {
        router.push(callbackUrl);
      }
    } catch (error) {
      setError('Something went wrong. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    setLoading(true);
    signIn('google', { callbackUrl });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-200 via-blue-300 to-blue-500">
      <div className="bg-white text-gray-900 rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-4xl font-bold mb-6 text-center text-blue-600">Study Buddy AI</h1>
        <p className="text-gray-600 mb-8 text-center">Sign in to generate flashcards and quizzes from your study notes</p>
        
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
            <p>{error}</p>
          </div>
        )}
        
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium mb-4 flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-70"
        >
          <FcGoogle className="mr-2 text-xl" />
          <span>Sign in with Google</span>
        </button>
        
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">or</span>
          </div>
        </div>
        
        <form onSubmit={handleCredentialsSubmit}>
          <div className="mb-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-6">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-70"
          >
            {loading ? 'Signing in...' : 'Sign in with Email'}
          </button>
        </form>
        
        <p className="mt-6 text-sm text-gray-500 text-center">
          Don't have an account?{" "}
          <a href="/auth/register" className="text-blue-600 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}