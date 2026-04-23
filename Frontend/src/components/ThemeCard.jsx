import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSearchPlus, FaTimes } from 'react-icons/fa';

export default function ThemeCard({ theme }) {
  const [isZoomed, setIsZoomed] = useState(false);

  const handleThemeClick = () => {
    try {
      const stored = localStorage.getItem('themeUsage');
      const usage = stored ? JSON.parse(stored) : {};
      usage[theme.id] = (usage[theme.id] || 0) + 1;
      localStorage.setItem('themeUsage', JSON.stringify(usage));
    } catch (err) {
      console.warn('Unable to save theme usage:', err);
    }
  };

  return (
    <>
      <Link
        to={`/theme/${theme.id}`}
        onClick={handleThemeClick}
        className="group flex flex-col items-center bg-white rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 cursor-pointer relative"
      >
        <div className="bg-white rounded-3xl shadow-md hover:shadow-xl 
  transition-all duration-300 transform hover:scale-105 
  p-6 flex flex-col items-center cursor-pointer">

          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-purple-200 mb-3 relative">
            <img
              src={theme.image}
              alt={theme.name}
              className="w-full h-full object-cover"
            />
            {/* Bouton Agrandir (Zoom) */}
            <button
              onClick={(e) => {
                e.preventDefault(); // Empêche la navigation du Link
                e.stopPropagation(); // Empêche le clic de se propager au Link
                setIsZoomed(true);
              }}
              className="absolute bottom-1 right-1 z-10 bg-white/90 text-purple-600 p-1.5 rounded-full shadow-md md:opacity-0 md:group-hover:opacity-100 transition-all active:scale-95"
              title="agrandir"
            >
              <FaSearchPlus size={14} />
            </button>
          </div>

          <p className="text-lg font-semibold text-gray-700 text-center">
            {theme.name}
          </p>
        </div>
      </Link>

      {/* Modal d'agrandissement (Zoom) */}
      {isZoomed && (
        <div 
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-[60] p-4 backdrop-blur-sm animate-fadeIn"
          onClick={() => setIsZoomed(false)}
        >
          <div className="relative max-w-full md:max-w-2xl w-full flex flex-col items-center">
            <button 
              className="absolute -top-12 right-0 text-white hover:text-red-400 transition-colors p-2"
              onClick={() => setIsZoomed(false)}
            >
              <FaTimes size={32} />
            </button>
            <img 
              src={theme.image} 
              alt={theme.name} 
              className="w-full h-auto max-h-[70vh] rounded-3xl shadow-2xl object-contain bg-white animate-popUp"
            />
            <div className="mt-6 bg-white/10 backdrop-blur-md px-6 py-2 rounded-full border border-white/20">
              <h3 className="text-white text-2xl font-bold">{theme.name}</h3>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
