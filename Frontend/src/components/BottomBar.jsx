import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { SelectionContext } from '../context/SelectionContext';

export default function BottomBar() {
  const { clearSelection, speakSentence } = useContext(SelectionContext);

  return (
    <div className="bottom-bar fixed bottom-0 left-0 right-0 bg-white shadow-2xl rounded-t-3xl p-4">
      <div className=" mx-auto flex justify-around items-center">
        {/* Trash Button */}
        <button
          onClick={clearSelection}
          className="bg-red-500 hover:bg-red-600 text-white rounded-full p-4 w-16 h-16 flex items-center justify-center text-2xl font-bold transition-all duration-300 transform hover:scale-110 hover:shadow-lg active:scale-95"
          title="حذف"
        >
          🗑️
        </button>

        {/* Home Button - Center */}
        <Link
          to="/"
          className="bg-[#7C5CBF] hover:bg-opacity-90 text-white rounded-full p-4 w-16 h-16 flex items-center justify-center text-2xl font-bold transition-all duration-300 transform hover:scale-110 hover:shadow-lg active:scale-95"
          title="الرئيسية"
        >
          🏠
        </Link>

        {/* Speaker Button */}
        <button
          onClick={speakSentence}
          className="bg-green-500 hover:bg-green-600 text-white rounded-full p-4 w-16 h-16 flex items-center justify-center text-2xl font-bold transition-all duration-300 transform hover:scale-110 hover:shadow-lg active:scale-95"
          title="نطق"
        >
          🔊
        </button>
      </div>
    </div>
  );
}
