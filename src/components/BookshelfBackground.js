import React from "react";

export default function BookshelfBackground() {
  return (
    <div className="fixed inset-0 -z-10 w-full h-full">
      {/* Bookshelf image, more transparent and blurred */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/bookshelf.jpg')",
          opacity: 0.22,
          filter: "blur(3px)",
        }}
      />
      {/* Blue-to-white gradient overlay (now matches sign-in page) */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-200 via-blue-300 to-blue-500 opacity-80" />
      {/* Glassy overlay for extra readability */}
      <div className="absolute inset-0 bg-white/30 backdrop-blur-md" />
    </div>
  );
} 