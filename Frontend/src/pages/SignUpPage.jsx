import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/images/logo.jfif';
import { API_BASE_URL } from '../config';

export default function SignUpPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    age: '',
    specialistName: '',
    email: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setMessageType('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/signup/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          password: formData.password,
          gender: formData.gender,
          age: formData.age,
          specialist_name: formData.specialistName,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('تم إنشاء الحساب بنجاح! سيتم توجيهك إلى صفحة تسجيل الدخول.');
        setMessageType('success');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setMessage(data.detail || 'حدث خطأ أثناء إنشاء الحساب. يرجى المحاولة مرة أخرى.');
        setMessageType('error');
      }
    } catch (error) {
      setMessage('حدث خطأ في الاتصال. يرجى التحقق من الإنترنت والمحاولة مرة أخرى.');
      setMessageType('error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 via-purple-50 to-purple-100 p-4">
      <div className="max-w-lg w-full bg-white rounded-3xl shadow-2xl p-10 text-center relative overflow-hidden">

        {/* Decorative background circles */}
        <div className="absolute top-0 -left-16 w-44 h-44 bg-blue-200 rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute bottom-0 -right-16 w-52 h-52 bg-purple-200 rounded-full opacity-30 animate-pulse"></div>

        <div className="relative z-10">
          {/* LOGO */}
          <div className="flex justify-center mb-8">
            <img src={logo} alt="Logo" className="w-32 h-32 rounded-full object-cover shadow-lg" />
          </div>

          {/* TITLE */}
          <h2 className="text-3xl font-extrabold text-gray-800 mb-2">
            إنشاء حساب جديد
          </h2>
          <p className="text-gray-500 mb-10">
            انضم إلينا لتبدأ رحلتك التعليمية.
          </p>

          {/* MESSAGE */}
          {message && (
            <div className={`mb-6 p-4 rounded-2xl text-center font-semibold ${
              messageType === 'success'
                ? 'bg-green-100 text-green-800 border border-green-300'
                : 'bg-red-100 text-red-800 border border-red-300'
            }`}>
              {message}
            </div>
          )}

          {/* FORM */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* First Name */}
            <div>
              <input
                type="text"
                name="firstName"
                placeholder="الاسم"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-6 py-3 text-lg rounded-2xl bg-gray-100 border-2 border-gray-200 focus:border-blue-400 focus:bg-white focus:ring-0 transition duration-300 text-right shadow-sm"
                dir="rtl"
                required
              />
            </div>

            {/* Last Name */}
            <div>
              <input
                type="text"
                name="lastName"
                placeholder="اللقب"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-6 py-3 text-lg rounded-2xl bg-gray-100 border-2 border-gray-200 focus:border-blue-400 focus:bg-white focus:ring-0 transition duration-300 text-right shadow-sm"
                dir="rtl"
                required
              />
            </div>

            {/* Gender */}
            <div>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-6 py-3 text-lg rounded-2xl bg-gray-100 border-2 border-gray-200 focus:border-blue-400 focus:bg-white focus:ring-0 transition duration-300 text-right shadow-sm"
                dir="rtl"
                required
              >
                <option value="">اختر الجنس</option>
                <option value="male">ذكر</option>
                <option value="female">أنثى</option>
              </select>
            </div>

            {/* Age */}
            <div>
              <input
                type="number"
                name="age"
                placeholder="العمر"
                value={formData.age}
                onChange={handleChange}
                className="w-full px-6 py-3 text-lg rounded-2xl bg-gray-100 border-2 border-gray-200 focus:border-blue-400 focus:bg-white focus:ring-0 transition duration-300 text-right shadow-sm"
                dir="rtl"
                required
              />
            </div>

            {/* Specialist/Companion Name */}
            <div>
              <input
                type="text"
                name="specialistName"
                placeholder="اسم الاخصائي او المرافق"
                value={formData.specialistName}
                onChange={handleChange}
                className="w-full px-6 py-3 text-lg rounded-2xl bg-gray-100 border-2 border-gray-200 focus:border-blue-400 focus:bg-white focus:ring-0 transition duration-300 text-right shadow-sm"
                dir="rtl"
                required
              />
            </div>

            {/* Email */}
            <div>
              <input
                type="email"
                name="email"
                placeholder="البريد الإلكتروني"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-6 py-3 text-lg rounded-2xl bg-gray-100 border-2 border-gray-200 focus:border-blue-400 focus:bg-white focus:ring-0 transition duration-300 text-right shadow-sm"
                dir="rtl"
                required
              />
            </div>

            {/* Password */}
            <div>
              <input
                type="password"
                name="password"
                placeholder="كلمة المرور"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-6 py-3 text-lg rounded-2xl bg-gray-100 border-2 border-gray-200 focus:border-blue-400 focus:bg-white focus:ring-0 transition duration-300 text-right shadow-sm"
                dir="rtl"
                required
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-4 text-lg rounded-2xl hover:from-blue-600 hover:to-purple-600 transition duration-300 transform hover:scale-105 shadow-md"
              >
                إنشاء الحساب
              </button>
            </div>
          </form>

          {/* LOGIN LINK */}
          <div className="mt-8">
            <p className="text-sm text-gray-600">
              لديك حساب بالفعل؟{' '}
              <Link to="/login" className="font-bold text-purple-600 hover:underline">
                سجل دخولك
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}