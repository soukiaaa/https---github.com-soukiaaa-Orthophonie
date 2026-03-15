import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { SelectionContext } from '../context/SelectionContext';
import logo from '../assets/icon/Logo.jpg';

export default function TopBar() {
  const { selectedItems, sentence, addAudio, addImage } = useContext(SelectionContext);

  return (
    <div className="top-bar bg-white shadow-lg rounded-b-2xl p-4">
      <div className="mx-auto">
        <div className="flex justify-between items-center mb-3">
          <Link to="/" title="الرئيسية" className="transition-all duration-300 transform hover:scale-110 active:scale-95">
            <div className="h-14 w-14 rounded-full p-1 bg-[#FDF8F2] shadow-inner">
              <img
                src={logo}
                alt="Logo"
                className="h-full w-full object-cover rounded-full"
              />
            </div>
          </Link>
          <button
            onClick={addAudio}
            className="bg-[#7C5CBF] hover:bg-opacity-90 text-white rounded-full p-2 w-10 h-10 flex items-center justify-center font-bold transition-all duration-300 transform hover:scale-110"
            title="خيارات إضافية"
          >
            ⋮
          </button>
        </div>

        {/* Selected Images */}
        <div className="mb-4">
          <div className="flex items-center justify-center gap-3 overflow-x-auto pb-2">
            {selectedItems.length > 0 ? (
              selectedItems.map((item, idx) => (
                <div
                  key={idx}
                  className="flex-shrink-0 w-20 h-20 rounded-xl shadow-md overflow-hidden border-2 border-[#7C5CBF]/30 hover:border-[#7C5CBF] transition-all"
                >
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))
            ) : (
              <div className="text-gray-400 text-sm">
                اختر الصور لإنشاء جملة
              </div>
            )}
          </div>
        </div>

        {/* Sentence Display */}
        <div className="bg-[#FDF8F2] rounded-xl p-4 border-2 border-[#7C5CBF]/20 min-h-16 flex items-center justify-center">
          <p className="text-center text-lg font-semibold text-gray-800 text-rtl">
            {sentence || 'ابدأ باختيار الصور...'}
          </p>
        </div>
      </div>
    </div>
  );
}
