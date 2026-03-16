import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/images/logo.jfif';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-100 via-blue-50 to-blue-100 p-4">
      <div className="max-w-lg w-full bg-white rounded-3xl shadow-2xl p-10 text-center relative overflow-hidden">
        
        {/* Decorative background circles */}
        <div className="absolute top-0 -left-16 w-44 h-44 bg-purple-200 rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute bottom-0 -right-16 w-52 h-52 bg-blue-200 rounded-full opacity-30 animate-pulse"></div>

        <div className="relative z-10">
          {/* LOGO */}
          <div className="flex justify-center mb-8">
            <img src={logo} alt="Logo" className="w-32 h-32 rounded-full object-cover shadow-lg" />
          </div>

          {/* TITLE */}
          <h2 className="text-3xl font-extrabold text-gray-800 mb-2">
            تسجيل الدخول
          </h2>
          <p className="text-gray-500 mb-10">
            مرحباً بعودتك!
          </p>

          {/* FORM */}
          <form className="space-y-6">
            <div>
              <input
                type="email"
                placeholder="البريد الإلكتروني"
                className="w-full px-6 py-4 text-lg rounded-2xl bg-gray-100 border-2 border-gray-200 focus:border-purple-400 focus:bg-white focus:ring-0 transition duration-300 text-right shadow-sm"
                dir="rtl"
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="كلمة المرور"
                className="w-full px-6 py-4 text-lg rounded-2xl bg-gray-100 border-2 border-gray-200 focus:border-purple-400 focus:bg-white focus:ring-0 transition duration-300 text-right shadow-sm"
                dir="rtl"
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold py-4 text-lg rounded-2xl hover:from-purple-600 hover:to-blue-600 transition duration-300 transform hover:scale-105 shadow-md"
              >
                دخول
              </button>
            </div>
          </form>

          {/* SIGNUP LINK */}
          <div className="mt-8">
            <p className="text-sm text-gray-600">
              ليس لديك حساب؟{' '}
              <Link to="/signup" className="font-bold text-purple-600 hover:underline">
                أنشئ حساباً
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}