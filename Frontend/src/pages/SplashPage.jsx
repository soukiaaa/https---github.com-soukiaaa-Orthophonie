import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/images/logo.jfif';

export default function SplashPage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 text-white flex flex-col justify-center items-center text-center p-6 relative overflow-hidden" dir="rtl" lang="ar">
      {/* Background decorative elements */}
      
      <div className="z-10 max-w-lg">
        {/* Logo with enhanced styling */}
        <div className="w-full h-64 mb-6 flex items-center justify-center">
          <img src={logo} alt="logo" className="w-full h-full object-cover rounded-2xl shadow-2xl animate-pulse" />
        </div>

        {/* Main title */}
        <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent">
          مرحباً بك في تطبيق التواصل البديل
        </h1>

        <br />
        {/* Subtitle */}
        {/* <h2 className="text-2xl font-semibold mb-3 text-yellow-200">
          Orthophonie App
        </h2> */}

        {/* Description */}
        <p className="text-lg mb-8 leading-relaxed text-white text-opacity-90">
         مرحباً بك في تطبيق الذي يمنحك الامل للتواصل
        </p>

        {/* Call to action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/home"
            className="bg-white text-purple-600 px-8 py-3 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 hover:bg-opacity-90"
          >
            🚀 ابدأ الآن
          </Link>

          {user ? (
            <Link
              to="/home"
              className="bg-yellow-400 text-purple-800 px-8 py-3 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 hover:bg-yellow-300"
            >
              مرحباً {user.first_name} 👋
            </Link>
          ) : (
            <Link
              to="/login"
              className="bg-yellow-400 text-purple-800 px-8 py-3 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 hover:bg-yellow-300"
            >
              🔐 تسجيل الدخول
            </Link>
          )}
        </div>

        {/* Footer text */}
        <p className="mt-8 text-sm text-white text-opacity-70">
          تطبيق التواصل البديل لتحسين القدرات التواصلية
        </p>
      </div>
    </div>
  );
}