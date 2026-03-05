import React, { useContext } from 'react';
import { SelectionContext } from '../context/SelectionContext';

export default function TopBar() {
  const { selectedItems, sentence, addAudio, addImage } = useContext(SelectionContext);

  return (
    <div className="top-bar bg-white shadow-lg rounded-b-2xl p-4">
      <div className="mx-auto">
        {/* Menu Button */}
        <div className="flex justify-end mb-3">
          <button
            onClick={addAudio}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full p-2 w-10 h-10 flex items-center justify-center font-bold transition-all duration-300 transform hover:scale-110"
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
                  className="flex-shrink-0 w-20 h-20 rounded-xl shadow-md overflow-hidden border-2 border-purple-300 hover:border-purple-500 transition-all"
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
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border-2 border-blue-200 min-h-16 flex items-center justify-center">
          <p className="text-center text-lg font-semibold text-gray-800 text-rtl">
            {sentence || 'ابدأ باختيار الصور...'}
          </p>
        </div>
      </div>
    </div>
  );
}
