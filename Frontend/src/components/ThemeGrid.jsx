import React, { useEffect, useState } from "react";
import ThemeCard from "./ThemeCard";

export default function ThemeGrid({ themes }) {
  const [sortedThemes, setSortedThemes] = useState(themes);

  useEffect(() => {
    const usage = typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem('themeUsage') || '{}')
      : {};

    setSortedThemes([
      ...themes
    ].sort((a, b) => {
      const aCount = usage[a.id] || 0;
      const bCount = usage[b.id] || 0;
      if (aCount !== bCount) return bCount - aCount;
      return a.name.localeCompare(b.name, 'ar', { sensitivity: 'base' });
    }));
  }, [themes]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-blue-50 px-4 pb-32 flex justify-center">
      <div className="max-w-6xl w-full pt-10 py-6">

        <h1 className="text-center text-5xl font-extrabold 
          bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 
          bg-clip-text text-transparent mb-4" style={{ lineHeight: 1.2 }}>
          محاور التطبيق
        </h1>

        <p className="text-center text-gray-500 text-xl mb-12 font-medium">
          اختر محورا
        </p>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-6">

          {sortedThemes.map((theme, idx) => (
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