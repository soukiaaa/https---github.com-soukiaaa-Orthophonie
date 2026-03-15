import React, { useContext, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import themes from '../data/themes';
import { SelectionContext } from '../context/SelectionContext';
import useSpeech from '../hook/useSpaach';

export default function SubcategoryPage() {
  const { id } = useParams();
  const theme = themes.find((t) => t.id === id);
  const { addItem, setSentence } = useContext(SelectionContext);
  const { t } = useTranslation();

  // Stocke les voix disponibles
  const [voices, setVoices] = useState([]);

  const { speak } = useSpeech();

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

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
    if (!('speechSynthesis' in window)) {
      console.warn("Speech synthesis not supported");
      return;
    }

    const speak = () => {
      const utter = new SpeechSynthesisUtterance(text);
      const arVoice = voices.find((v) => v.lang.toLowerCase().startsWith('ar'));
      if (arVoice) {
        utter.voice = arVoice;
        utter.lang = arVoice.lang;
      } else {
        utter.lang = 'ar-SA';
      }
      utter.rate = 0.9;
      window.speechSynthesis.speak(utter);
    };

    if (voices.length === 0) {
      window.speechSynthesis.onvoiceschanged = speak;
    } else {
      speak();
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF8F2] pt-6 pb-32 px-4" dir="rtl" lang="ar">
      <div className="w-full max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-center relative mb-12">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-2 text-[#7C5CBF]">
              {theme.name}
            </h2>
            <p className="text-gray-600">اختر العنصر الذي تريده</p>
          </div>
          <Link
            to="/"
            className="absolute top-1/2 -translate-y-1/2 left-0 text-5xl font-light text-gray-400 hover:text-[#7C5CBF] transition-all duration-300 transform hover:scale-125 active:scale-95"
            title="إغلاق"
          >
            &times;
          </Link>
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
              className="group flex flex-col items-center bg-white rounded-2xl p-4 hover:shadow-2xl transition-all duration-300 transform hover:scale-110 hover:-translate-y-3 cursor-pointer border-2 border-transparent hover:border-[#7C5CBF] active:scale-95"
            >
              {/* Image */}
              <div className="relative w-24 h-24 mb-3 overflow-hidden rounded-xl">
                <div className="absolute inset-0 bg-gradient-to-r from-[#7C5CBF]/20 to-[#7C5CBF]/5 blur-lg opacity-0 group-hover:opacity-40 transition-all duration-300"></div>
                <img
                  src={sub.image}
                  alt={sub.name}
                  className="relative w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>

              {/* Name + Voice */}
              <div className="flex items-center justify-between w-full">
                <span className="text-sm font-bold text-gray-800 text-center group-hover:text-[#7C5CBF] transition-colors duration-300">
                  {sub.name}
                </span>
                <button
    onClick={(e) => {
      e.stopPropagation();
      speak(sub.name); // déclenche la voix
    }}
    className="p-1 text-[#7C5CBF] hover:text-opacity-80 transition-colors"
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