import React from 'react';
import { Link } from 'react-router-dom';

export default function ThemeCard({ theme }) {
  return (
    <Link
      to={`/theme/${theme.id}`}
      className="group flex flex-col items-center bg-white rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 cursor-pointer"
    >
      <div className="bg-white rounded-3xl shadow-md hover:shadow-xl 
transition-all duration-300 transform hover:scale-105 
p-6 flex flex-col items-center cursor-pointer">

  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-purple-200 mb-3">
    <img
      src={theme.image}
      alt={theme.name}
      className="w-full h-full object-cover"
    />
  </div>

  <p className="text-lg font-semibold text-gray-700 text-center">
    {theme.name}
  </p>

</div>
    </Link>
  );
}
