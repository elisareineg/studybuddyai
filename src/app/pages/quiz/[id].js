import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function Quiz() {
  const router = useRouter();
  const { id } = router.query;
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [results, setResults] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchQuiz = async () => {
      try {
        const response = await fetch(`/api/quiz/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch quiz');
        }
        const data = await response.json();
        setQuiz(data);
        
        // Initialize answers object
        const initialAnswers = {};
        data.questions.forEach((q, index) => {
          initialAnswers[index] = null;
        });
        setAnswers(initialAnswers);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [id]);

  const handleAnswer = (questionIndex, answer) => {
    setAnswers({
      ...answers,
      [questionIndex]: answer
    });
  };

  const isLastQuestion = () => {
    return currentQuestionIndex === quiz?.questions.length - 1;
  };

  const moveToNextQuestion = () => {
    if (isLastQuestion()) {
      submitQuiz();
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const submitQuiz = async () => {
    setLoading(true);
    
    try {
      const response = await fetch('/api/submit-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          quizId: id,
          answers
        })
      });

      if (!response.ok) {
        throw new Error('Failed to submit quiz');
      }

      const data = await response.json();
      setResults(data);
      setQuizCompleted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !quiz) {
    return <div className="min-h-screen flex items-center justify-center">Loading quiz...</div>;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
          <p className="mb-4">{error}</p>
          <button
            onClick={() => router.push('/upload')}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (quizCompleted && results) {
    return <QuizResults results={results} />;
  }

  const currentQuestion = quiz?.questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <Head>
        <title>Quiz | SmartQuiz</title>
      </Head>
      
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-blue-800">Quiz</h1>
              <div className="text-sm text-gray-500">
                Question {currentQuestionIndex + 1} of {quiz?.questions.length}
              </div>
            </div>
            
            <div className="mb-8">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${((currentQuestionIndex + 1) / quiz?.questions.length) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className="space-y-6">
              <h2 className="text-xl font-medium">{currentQuestion?.question}</h2>
              
              {currentQuestion?.type === 'multiple-choice' && (
                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswer(currentQuestionIndex, index)}
                      className={`w-full text-left p-4 rounded-lg border transition-colors ${
                        answers[currentQuestionIndex] === index
                          ? 'bg-blue-50 border-blue-300 text-blue-800'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center">
                        <div className={`h-5 w-5 rounded-full mr-3 flex items-center justify-center ${
                          answers[currentQuestionIndex] === index
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200'
                        }`}>
                          {answers[currentQuestionIndex] === index && (
                            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        <span>{option}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
              
              {currentQuestion?.type === 'true-false' && (
                <div className="flex space-x-4">
                  {['True', 'False'].map((option, index) => (
                    <button
                      key={option}
                      onClick={() => handleAnswer(currentQuestionIndex, option)}
                      className={`flex-1 py-3 px-4 rounded-lg border transition-colors ${
                        answers[currentQuestionIndex] === option
                          ? 'bg-blue-50 border-blue-300 text-blue-800'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
              
              {currentQuestion?.type === 'short-answer' && (
                <div>
                  <textarea
                    value={answers[currentQuestionIndex] || ''}
                    onChange={(e) => handleAnswer(currentQuestionIndex, e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-3 h-32 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Type your answer here..."
                  ></textarea>
                </div>
              )}
              
              {currentQuestion?.type === 'fill-in-blank' && (
                <div>
                  <input
                    type="text"
                    value={answers[currentQuestionIndex] || ''}
                    onChange={(e) => handleAnswer(currentQuestionIndex, e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Fill in the blank..."
                  />
                </div>
              )}
            </div>
            
            <div className="mt-8 flex justify-between">
              <button
                onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                disabled={currentQuestionIndex === 0}
                className={`py-2 px-4 rounded ${
                  currentQuestionIndex === 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Previous
              </button>
              
              <button
                onClick={moveToNextQuestion}
                disabled={answers[currentQuestionIndex] === null || answers[currentQuestionIndex] === ''}
                className={`py-2 px-6 rounded ${
                  answers[currentQuestionIndex] === null || answers[currentQuestionIndex] === ''
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {isLastQuestion() ? 'Submit' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuizResults({ results }) {
  const router = useRouter();
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <Head>
        <title>Quiz Results | SmartQuiz</title>
      </Head>
      
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h1 className="text-2xl font-bold text-blue-800 mb-6">Your Results</h1>
            
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg font-medium">Score</span>
                <span className="text-xl font-bold">{results.score}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className={`h-3 rounded-full ${
                    results.score >= 80 ? 'bg-green-500' : 
                    results.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${results.score}%` }}
                ></div>
              </div>
            </div>
            
            <div className="mb-8">
              <h2 className="text-lg font-medium mb-4">Performance Analysis</h2>
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="mb-3">{results.analysis.summary}</p>
                <h3 className="font-medium mb-2">Areas to Improve:</h3>
                <ul className="list-disc list-inside space-y-1">
                  {results.analysis.areasToImprove.map((area, i) => (
                    <li key={i}>{area}</li>
                  ))}
                </ul>
              </div>
            </div>
            
            <h2 className="text-lg font-medium mb-4">Question Review</h2>
            <div className="space-y-6">
              {results.questions.map((question, i) => (
                <div 
                  key={i} 
                  className={`p-4 rounded-lg border ${
                    question.correct ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                  }`}
                >
                  <div className="flex justify-between">
                    <h3 className="font-medium">Question {i + 1}</h3>
                    <span className={question.correct ? 'text-green-600' : 'text-red-600'}>
                      {question.correct ? 'Correct' : 'Incorrect'}
                    </span>
                  </div>
                  <p className="mt-2">{question.question}</p>
                  
                  <div className="mt-3">
                    <div className="text-sm text-gray-600">Your answer:</div>
                    <div className={`mt-1 ${!question.correct && 'text-red-600'}`}>
                      {question.userAnswer}
                    </div>
                  </div>
                  
                  {!question.correct && (
                    <div className="mt-3">
                      <div className="text-sm text-gray-600">Correct answer:</div>
                      <div className="mt-1 text-green-600">{question.correctAnswer}</div>
                    </div>
                  )}
                  
                  {question.explanation && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="text-sm font-medium">Explanation:</div>
                      <p className="mt-1 text-sm">{question.explanation}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-8 flex space-x-4">
              <button
                onClick={() => router.push('/upload')}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
              >
                Create New Quiz
              </button>
              <button
                onClick={() => router.push(`/study-plan/${results.quizId}`)}
                className="flex-1 py-3 bg-white border border-blue-300 hover:bg-blue-50 text-blue-600 font-medium rounded-lg"
              >
                Generate Study Plan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}