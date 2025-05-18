"use client";
import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';

export default function DropzoneUpload({ onFileUpload }) {
  const [loading, setLoading] = useState(false);

  const onDrop = React.useCallback(async (acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setLoading(true);
      await onFileUpload(acceptedFiles[0]);
      setLoading(false);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, disabled: loading });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed border-blue-400 rounded-lg p-8 w-full max-w-xl text-center cursor-pointer bg-white hover:bg-blue-50 transition ${loading ? 'opacity-50 pointer-events-none' : ''}`}
    >
      <input {...getInputProps()} disabled={loading} />
      {loading ? (
        <p className="text-blue-600 animate-pulse">Uploading and generating flashcards...</p>
      ) : isDragActive ? (
        <p className="text-blue-600">Drop the file here ...</p>
      ) : (
        <p className="text-gray-600">Drag & drop your course notes here, or click to select a file</p>
      )}
    </div>
  );
} 