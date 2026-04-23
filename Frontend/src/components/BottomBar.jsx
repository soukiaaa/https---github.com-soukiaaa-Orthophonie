import React, { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SelectionContext } from '../context/SelectionContext';
import AddThemeModal from './AddThemeModal';

export default function BottomBar({ onOpenAddTheme }) {
  const { clearSelection, speakSentence } = useContext(SelectionContext);
  const location = useLocation();
  const [isAddThemeOpen, setIsAddThemeOpen] = useState(false);
  const [user, setUser] = useState(null);

  // Load user from localStorage
  React.useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const isHomePage = location.pathname === '/home';
  const isAdmin = user?.is_staff || user?.is_superuser;

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2
      shadow-2xl rounded-full px-8 py-3
      flex gap-10 items-center">
      <div className="mx-auto flex justify-around items-center">
        {/* Add Theme Button - Only for admin on home page */}
        {isAdmin && isHomePage && (
          <button
            onClick={onOpenAddTheme}
            className="text-white rounded-full p-4 w-16 h-16 flex items-center justify-center text-2xl font-bold transition-all duration-300 transform hover:scale-110 hover:shadow-lg active:scale-95"
            title="إضافة موضوع جديد"
          >
            ➕
          </button>
        )}

        {/* Trash Button */}
        <button
          onClick={clearSelection}
          className="text-white rounded-full p-4 w-16 h-16 flex items-center justify-center text-2xl font-bold transition-all duration-300 transform hover:scale-110 hover:shadow-lg active:scale-95"
          title="حذف"
        >
          🗑️
        </button>

        {/* Home Button - Center */}
        <Link
          to="/"
          className="text-white rounded-full p-4 w-16 h-16 flex items-center justify-center text-2xl font-bold transition-all duration-300 transform hover:scale-110 hover:shadow-lg active:scale-95"
          title="الرئيسية"
        >
          🏠
        </Link>

        {/* Speaker Button */}
        <button
          onClick={speakSentence}
          className="text-white rounded-full p-4 w-16 h-16 flex items-center justify-center text-2xl font-bold transition-all duration-300 transform hover:scale-110 hover:shadow-lg active:scale-95"
          title="نطق"
        >
          🔊
        </button>
      </div>

    </div>
  );
}
