import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function Upload() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const onDrop = useCallback((acceptedFiles) => {
    setFiles(acceptedFiles);
    setError(null);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    multiple: true,
    accept: {
      'text/plain': ['.txt'],
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (files.length === 0) {
      setError('Please upload at least one file');
      return;
    }

    setLoading(true);
    
    try {
      // Create form data for file upload
      const formData = new FormData();
      files.forEach(file => {
        formData.append('files', file);
      });

      // Upload the files to our API
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload files');
      }

      const data = await response.json();
      
      // Redirect to the quiz creation page with the document IDs
      router.push({
        pathname: '/create-quiz',
        query: { docIds: data.documentIds.join(',') }
      });
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <Head>
        <title>Upload Study Materials | SmartQuiz</title>
      </Head>
      
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center text-blue-800 mb-8">Upload Your Study Materials</h1>
        
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-6">
          <form onSubmit={handleSubmit}>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors ${
                isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
              }`}
            >
              <input {...getInputProps()} />
              <div className="space-y-4">
                <div className="text-4xl">📚</div>
                {isDragActive ? (
                  <p className="text-blue-600 font-medium">Drop your files here!</p>
                ) : (
                  <p className="text-gray-500">
                    Drag and drop your study materials here, or click to select files
                  </p>
                )}
                <p className="text-sm text-gray-400">
                  Supported formats: .txt, .pdf, .docx
                </p>
              </div>
            </div>

            {files.length > 0 && (
              <div className="mt-6">
                <h3 className="font-medium mb-2">Selected files ({files.length}):</h3>
                <ul className="space-y-2">
                  {files.map((file, index) => (
                    <li key={index} className="flex items-center bg-gray-50 p-2 rounded">
                      <span className="text-sm mr-2">📄</span>
                      <span className="text-sm truncate">{file.name}</span>
                      <span className="text-xs text-gray-500 ml-auto">
                        {(file.size / 1024).toFixed(1)} KB
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {error && (
              <div className="mt-4 text-red-500 text-sm">{error}</div>
            )}

            <div className="mt-6">
              <button
                type="submit"
                disabled={loading || files.length === 0}
                className={`w-full py-3 px-4 rounded-lg font-medium ${
                  loading || files.length === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {loading ? 'Processing...' : 'Generate Quiz'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}