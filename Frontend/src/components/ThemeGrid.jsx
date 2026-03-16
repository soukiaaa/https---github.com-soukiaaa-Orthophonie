import React from 'react';
import ThemeCard from './ThemeCard';

export default function ThemeGrid({ themes }) {
  return (
    <div align="center" className="min-h-screen bg-gradient-to-b from-purple-50 to-blue-50 px-4 pb-32">
      <div className="max-w-6xl mx-auto pt-10 w-full py-6">
        <h1 className="text-center text-4xl font-bold mb-2 min-h-16 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          المواضيع المتاحة
        </h1>

        <p className="text-center text-gray-600 mb-16 min-h-8">
          اختر موضوعاً لبدء الجلسة
        </p>

        {/* Important: force full width */}
        <div className="w-full grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 gap-6">
          {themes.map((theme, idx) => (
            <div
              key={theme.id}
              className="w-full"
              style={{
                animation: `fadeIn 0.5s ease-out ${idx * 50}ms forwards`,
                opacity: 0,
              }}
            >
              <ThemeCard theme={theme} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
