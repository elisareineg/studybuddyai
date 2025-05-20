import React from "react";

export default function BooksBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Left stack of books - larger, more realistic */}
      <svg style={{position: 'absolute', bottom: '2%', left: '1%', opacity: 0.22, filter: 'blur(1.5px)'}} width="320" height="260" viewBox="0 0 320 260" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Bottom book */}
        <rect x="10" y="200" width="220" height="40" rx="8" fill="#fbbf24" stroke="#b45309" strokeWidth="6" />
        {/* Blue book */}
        <rect x="30" y="160" width="210" height="38" rx="8" fill="#60a5fa" stroke="#1e40af" strokeWidth="6" transform="rotate(-3 30 160)" />
        {/* Red book */}
        <rect x="50" y="120" width="200" height="36" rx="8" fill="#f87171" stroke="#991b1b" strokeWidth="6" transform="rotate(2 50 120)" />
        {/* Green book */}
        <rect x="70" y="80" width="180" height="34" rx="8" fill="#34d399" stroke="#065f46" strokeWidth="6" transform="rotate(-4 70 80)" />
        {/* Top book */}
        <rect x="90" y="40" width="160" height="32" rx="8" fill="#f3f4f6" stroke="#6b7280" strokeWidth="6" transform="rotate(5 90 40)" />
      </svg>
      {/* Right stack of books - larger, more realistic */}
      <svg style={{position: 'absolute', bottom: '4%', right: '1%', opacity: 0.22, filter: 'blur(1.5px)'}} width="320" height="260" viewBox="0 0 320 260" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Bottom book */}
        <rect x="90" y="200" width="220" height="40" rx="8" fill="#a5b4fc" stroke="#3730a3" strokeWidth="6" />
        {/* Green book */}
        <rect x="70" y="160" width="210" height="38" rx="8" fill="#bbf7d0" stroke="#166534" strokeWidth="6" transform="rotate(2 70 160)" />
        {/* Red book */}
        <rect x="50" y="120" width="200" height="36" rx="8" fill="#fecaca" stroke="#b91c1c" strokeWidth="6" transform="rotate(-3 50 120)" />
        {/* Blue book */}
        <rect x="30" y="80" width="180" height="34" rx="8" fill="#38bdf8" stroke="#0369a1" strokeWidth="6" transform="rotate(4 30 80)" />
        {/* Top book */}
        <rect x="10" y="40" width="160" height="32" rx="8" fill="#f3f4f6" stroke="#6b7280" strokeWidth="6" transform="rotate(-5 10 40)" />
      </svg>
    </div>
  );
} 