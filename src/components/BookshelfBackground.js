import React from "react";

export default function BookshelfBackground() {
  return (
    <div className="fixed inset-0 -z-10 w-full h-full overflow-hidden">
      {/* Bookshelf image, more transparent and blurred */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/bookshelf.jpg')",
          opacity: 0.22,
          filter: "blur(3px)",
          transform: "scale(1.1)", // Prevent white edges on mobile
        }}
      />
      {/* Blue-to-white gradient overlay */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-blue-200 via-blue-300 to-blue-500 opacity-90"
        style={{
          backgroundAttachment: "fixed", // Ensure gradient stays fixed on mobile
        }}
      />
      {/* Glassy overlay for extra readability */}
      <div 
        className="absolute inset-0 bg-white/30 backdrop-blur-md"
        style={{
          backgroundAttachment: "fixed", // Ensure blur stays fixed on mobile
        }}
      />
    </div>
  );
} 