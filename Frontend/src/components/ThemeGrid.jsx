import React from "react";
import ThemeCard from "./ThemeCard";

export default function ThemeGrid({ themes }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-blue-50 px-4 pb-32 flex justify-center">
      <div className="max-w-6xl w-full pt-10 py-6">

        <h1 className="text-center text-5xl font-extrabold 
          bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 
          bg-clip-text text-transparent mb-4">
          المواضيع التعليمية
        </h1>

        <p className="text-center text-gray-500 text-lg mb-12">
          اختر موضوعاً لبدء تكوين الجملة
        </p>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-6">

          {themes.map((theme, idx) => (
            <div
              key={theme.id}
              className="w-full animate-fadeIn"
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              <ThemeCard theme={theme} />
            </div>
          ))}

        </div>
      </div>
    </div>
  );
}