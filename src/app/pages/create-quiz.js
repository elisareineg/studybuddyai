import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function CreateQuiz() {
  const router = useRouter();
  const { docIds } = router.query;
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quizOptions, setQuizOptions] = useState({
    numQuestions: 10,
    difficulty: 'medium',
    questionTypes: ['multiple-choice', 'true-false'],
  });
  const [documentData, setDocumentData] = useState(null);

  useEffect(() => {
    if (!docIds) return;

    const fetchDocumentData = async () => {
      try {
        const response = await fetch(`/api/documents?ids=${docIds}`);
        if (!response.ok) {
          throw new Error('Failed to fetch document data');
        }
        const data = await response.json();
        setDocumentData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDocumentData();
  }, [docIds]);

  const handleOptionChange = (e) => {
    const { name, value } = e.target;
    setQuizOptions({
      ...quizOptions,
      [name]: value,
    });
  };

  const handleQuestionTypeChange = (type) => {
    const currentTypes = [...quizOptions.questionTypes];
    if (currentTypes.includes(type)) {
      setQuizOptions({
        ...quizOptions,
        questionTypes: currentTypes.filter(t => t !== type)
      });
    } else {
      setQuizOptions({
        ...quizOptions,
        questionTypes: [...currentTypes, type]
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          documentIds: docIds.split(','),
          options: quizOptions
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate quiz');
      }

      const data = await response.json();
      
      // Redirect to the quiz page
      router.push(`/quiz/${data.quizId}`);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading && !documentData) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
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

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <Head>
        <title>Create Your Quiz | SmartQuiz</title>
      </Head>
      
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center text-blue-800 mb-8">Create Your Quiz</h1>
        
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-6">
          <h2 className="text-lg font-medium mb-4">Customize Your Quiz</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Questions
                </label>
                <input
                  type="range"
                  name="numQuestions"
                  min="5"
                  max="30"
                  value={quizOptions.numQuestions}
                  onChange={handleOptionChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>5</span>
                  <span>{quizOptions.numQuestions}</span>
                  <span>30</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Difficulty
                </label>
                <div className="flex space-x-4">
                  {['easy', 'medium', 'hard'].map((level) => (
                    <label key={level} className="flex items-center">
                      <input
                        type="radio"
                        name="difficulty"
                        value={level}
                        checked={quizOptions.difficulty === level}
                        onChange={handleOptionChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700 capitalize">
                        {level}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Question Types
                </label>
                <div className="flex flex-wrap gap-3">
                  {[
                    { id: 'multiple-choice', label: 'Multiple Choice' },
                    { id: 'true-false', label: 'True/False' },
                    { id: 'short-answer', label: 'Short Answer' },
                    { id: 'fill-in-blank', label: 'Fill in the Blank' }
                  ].map((type) => (
                    <label
                      key={type.id}
                      className={`inline-flex items-center px-3 py-2 rounded-lg border cursor-pointer ${
                        quizOptions.questionTypes.includes(type.id)
                          ? 'bg-blue-50 border-blue-200 text-blue-700'
                          : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={quizOptions.questionTypes.includes(type.id)}
                        onChange={() => handleQuestionTypeChange(type.id)}
                      />
                      <span className="text-sm">{type.label}</span>
                    </label>
                  ))}
                </div>
                {quizOptions.questionTypes.length === 0 && (
                  <p className="text-sm text-red-500 mt-1">
                    Please select at least one question type.
                  </p>
                )}
              </div>
            </div>
            
            <div className="mt-8">
              <button
                type="submit"
                disabled={loading || quizOptions.questionTypes.length === 0}
                className={`w-full py-3 px-4 rounded-lg font-medium ${
                  loading || quizOptions.questionTypes.length === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {loading ? 'Generating Quiz...' : 'Start Quiz'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
