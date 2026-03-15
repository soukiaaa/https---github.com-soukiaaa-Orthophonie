import React from 'react';
import { Link } from 'react-router-dom';

export default function ThemeCard({ theme }) {
  return (
    <Link
      to={`/theme/${theme.id}`}
      className="group flex flex-col items-center bg-white rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 cursor-pointer"
    >
      <div className="relative w-28 h-28 mb-4">
        <div className="absolute inset-0 bg-gradient-to-r from-[#7C5CBF]/20 to-[#7C5CBF]/5 rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-all duration-300"></div>
        <img
          src={theme.image}
          alt={theme.name}
          className="relative w-full h-full rounded-full object-cover border-4 border-white shadow-lg"
        />
      </div>
      <h3 className="text-lg font-bold text-gray-800 text-center group-hover:text-[#7C5CBF] transition-all duration-300">
        {theme.name}
      </h3>
    </Link>
  );
}
