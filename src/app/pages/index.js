import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Head>
        <title>SmartQuiz - AI-Powered Study Tool</title>
        <meta name="description" content="Generate personalized quizzes from your notes" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-blue-800 mb-4">SmartQuiz</h1>
          <p className="text-xl text-gray-600 mb-8">Upload your notes. Get AI-generated quizzes. Ace your exams.</p>
          
          <div className="flex justify-center gap-4">
            <Link href="/upload">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-all">
                Start Learning
              </button>
            </Link>
            <Link href="/about">
              <button className="bg-white hover:bg-gray-100 text-blue-600 font-bold py-3 px-8 rounded-lg shadow-lg border border-blue-200 transition-all">
                Learn More
              </button>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <FeatureCard 
            title="Upload Your Notes" 
            description="Easily upload your class notes, textbooks, or study materials in various formats."
            icon="📄"
          />
          <FeatureCard 
            title="AI-Generated Questions" 
            description="Our AI creates personalized quiz questions based on your specific study materials."
            icon="🤖"
          />
          <FeatureCard 
            title="Smart Feedback" 
            description="Receive personalized learning recommendations to improve your weak areas."
            icon="📊"
          />
        </div>
      </main>
    </div>
  );
}

function FeatureCard({ title, description, icon }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all">
      <div className="text-4xl mb-4">{icon}</div>
      <h2 className="text-xl font-bold text-gray-800 mb-2">{title}</h2>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
