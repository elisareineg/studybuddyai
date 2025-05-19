import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

export default function DropzoneUpload({ onFileUpload, isProcessing = false }) {
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles?.[0] && !isProcessing) {
      onFileUpload(acceptedFiles[0]);
    }
  }, [onFileUpload, isProcessing]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
    },
    disabled: isProcessing,
    maxFiles: 1,
  });

  return (
    <div 
      {...getRootProps()} 
      className={`w-full max-w-xl p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${
        isDragActive ? 'border-white bg-blue-400/30' : 'border-white/50 hover:border-white'
      } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <input {...getInputProps()} />
      {isProcessing ? (
        <div className="flex flex-col items-center justify-center">
          <div className="h-12 w-12 border-4 border-t-white border-r-transparent border-b-white border-l-transparent rounded-full animate-spin mb-4"></div>
          <p>Processing your document...</p>
        </div>
      ) : isDragActive ? (
        <p className="text-lg">Drop your file here...</p>
      ) : (
        <div>
          <p className="text-lg mb-2">Drag & drop your course notes here, or click to select a file</p>
          <p className="text-sm text-white/70">Supports PDF, DOCX, and TXT files</p>
        </div>
      )}
    </div>
  );
}
