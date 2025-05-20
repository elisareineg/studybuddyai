import React from "react";

export default function BooksBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Left stack of books */}
      <svg style={{position: 'absolute', bottom: '5%', left: '2%', opacity: 0.18, filter: 'blur(1.5px)'}} width="180" height="120" viewBox="0 0 180 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Bottom book */}
        <rect x="20" y="80" width="120" height="20" rx="4" fill="#bae6fd" stroke="#3b82f6" strokeWidth="3" fillOpacity="0.7" />
        {/* Red book */}
        <rect x="30" y="60" width="120" height="20" rx="4" fill="#fecaca" stroke="#f87171" strokeWidth="3" fillOpacity="0.7" />
        {/* Blue book */}
        <rect x="40" y="40" width="120" height="20" rx="4" fill="#e0e7ff" stroke="#3b82f6" strokeWidth="3" fillOpacity="0.7" />
        {/* Green book */}
        <rect x="50" y="20" width="120" height="20" rx="4" fill="#bbf7d0" stroke="#22c55e" strokeWidth="3" fillOpacity="0.7" />
      </svg>
      {/* Right stack of books */}
      <svg style={{position: 'absolute', bottom: '8%', right: '2%', opacity: 0.18, filter: 'blur(1.5px)'}} width="180" height="120" viewBox="0 0 180 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Bottom book */}
        <rect x="20" y="80" width="120" height="20" rx="4" fill="#e0e7ff" stroke="#3b82f6" strokeWidth="3" fillOpacity="0.7" />
        {/* Red book */}
        <rect x="30" y="60" width="120" height="20" rx="4" fill="#fecaca" stroke="#f87171" strokeWidth="3" fillOpacity="0.7" />
        {/* Blue book */}
        <rect x="40" y="40" width="120" height="20" rx="4" fill="#bae6fd" stroke="#3b82f6" strokeWidth="3" fillOpacity="0.7" />
        {/* Green book */}
        <rect x="50" y="20" width="120" height="20" rx="4" fill="#bbf7d0" stroke="#22c55e" strokeWidth="3" fillOpacity="0.7" />
      </svg>
    </div>
  );
} 