import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
// themes now provided via props rather than static import
import { SelectionContext } from '../context/SelectionContext';
import useSpeech from '../hook/useSpaach';

export default function SubcategoryPage(props) {
  const { id } = useParams();
  const theme = props.themes?.find((t) => t.id === id) || null;
  const { addItem, setSentence } = useContext(SelectionContext);
  const { t } = useTranslation();

  const { speak, isSpeaking } = useSpeech();

  if (!theme) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-50 to-pink-50 flex items-center justify-center pb-32">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <p className="text-2xl font-bold text-gray-800">{t('not_found')}</p>
        </div>
      </div>
    );
  }

  const handleClick = (sub) => {
    addItem({ src: sub.image, alt: sub.name });
    setSentence((prev) => (prev ? prev + ' ' : '') + sub.name);
  };

  const handleSpeak = (text) => {
    speak(text);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 pt-6 pb-32 px-4" dir="rtl" lang="ar">
      <div className="w-full max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {theme.name}
          </h2>
          <p className="text-gray-600">اختر العنصر الذي تريده</p>
        </div>

        {/* Grid */}
        <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 justify-items-center">
          {theme.subcategories.map((sub, idx) => (
            <div
              key={sub.id}
              onClick={() => handleClick(sub)}
              style={{
                animation: `scaleIn 0.4s ease-out ${idx * 80}ms forwards`,
                opacity: 0,
              }}
              className="group flex flex-col items-center bg-white rounded-2xl p-4 hover:shadow-2xl transition-all duration-300 transform hover:scale-110 hover:-translate-y-3 cursor-pointer border-2 border-transparent hover:border-purple-300 active:scale-95"
            >
              {/* Image */}
              <div className="relative w-24 h-24 mb-3 overflow-hidden rounded-xl">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-purple-300 blur-lg opacity-0 group-hover:opacity-40 transition-all duration-300"></div>
                <img
                  src={sub.image}
                  alt={sub.name}
                  className="relative w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>

              {/* Name + Voice */}
              <div className="flex items-center justify-between w-full">
                <span className="text-sm font-bold text-gray-800 text-center group-hover:text-purple-600 transition-colors duration-300">
                  {sub.name}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSpeak(sub.name);
                  }}
                  disabled={isSpeaking}
                  className="p-1 text-blue-500 hover:text-blue-700 disabled:opacity-50 transition-colors"
                  title="استمع"
                >
                  🔊
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}