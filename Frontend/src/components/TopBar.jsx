import React, { useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { SelectionContext } from "../context/SelectionContext";
import logo from "../assets/images/logo.jfif";
import { CgArrowLeft } from "react-icons/cg";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";

export default function TopBar() {
  const { selectedItems, sentence, addItem, removeSelectedItem } = useContext(SelectionContext);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <div className="bg-white shadow-xl rounded-b-3xl p-4">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">

        {/* LOGO */}
        <div className="flex items-center gap-3">

          <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-1 rounded-full shadow-md">
            <img
              src={logo}
              alt="logo"
              className="w-20 h-20 rounded-full object-cover bg-white" // augmenté de w-12/h-12 à w-20/h-20
            />
          </div>

          {user && (
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 focus:outline-none hover:bg-gray-100 p-2 rounded-xl transition-colors duration-200"
              >
                <FaUserCircle size={24} className="text-gray-600" />
                <span className="font-semibold text-gray-700">
                  {user.first_name}
                </span>
              </button>

              {isDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-fadeIn">
                  <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 border-b border-gray-100 text-right">
                    <p className="font-bold text-gray-800">{user.first_name} {user.last_name}</p>
                    <p className="text-sm text-gray-500 truncate">{user.email}</p>
                    {user.age && <p className="text-xs text-gray-400 mt-1">العمر: {user.age}</p>}
                  </div>
                  
                  <button
                    onClick={handleLogout}
                    className="w-full text-right px-4 py-3 text-red-500 hover:bg-red-50 hover:text-red-600 flex items-center gap-3 transition-colors duration-200"
                  >
                    <FaSignOutAlt />
                    <span>تسجيل الخروج</span>
                  </button>
                </div>
              )}
            </div>
          )}

        </div>

        {/* MENU */}
        <button
          onClick={() => navigate(-1)}
          className="bg-purple-500 text-white w-10 h-10 rounded-full flex items-center justify-center hover:scale-110 transition"
        >
          <CgArrowLeft size={25} />
        </button>

      </div>

      {/* Selected Images */}
      <div className="flex justify-center gap-3 overflow-x-auto pb-2">
        {selectedItems.length > 0 ? (
          selectedItems.map((item, idx) => (
            <div
              key={idx}
              className="relative w-20 h-20 rounded-xl overflow-hidden shadow border-2 border-purple-300"
            >
              <img
                src={item.src}
                alt={item.alt}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => removeSelectedItem(idx)}
                className="absolute -top-2 -left-2 bg-white text-gray-700 rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-md hover:bg-gray-100 transition-colors"
                title="حذف العنصر"
              >
                ✕
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-sm">
            اختر الصور لإنشاء جملة
          </p>
        )}
      </div>

      {/* Sentence */}
      <div className="mt-3 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-3 text-center">
        <p className="text-lg font-semibold text-gray-700">
          {sentence || "ابدأ باختيار الصور..."}
        </p>
      </div>

    </div>
  );
}