import React, { useState, useEffect } from 'react';
import { FaMagic, FaPlay, FaRedo } from 'react-icons/fa';
import { API_BASE_URL } from '../config/api';

export default function PhraseSuggestions({ themeId, onPhraseSelect }) {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateSuggestions = async () => {
    if (!themeId) return;

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('access');
      const response = await fetch(`${API_BASE_URL}/api/ai/phrases/?theme=${themeId}&lang=ar`, {
        headers: token ? {
          'Authorization': `Bearer ${token}`,
        } : {}
      });

      if (!response.ok) {
        throw new Error('Failed to generate phrases');
      }

      const data = await response.json();
      setSuggestions(data.phrases || []);
    } catch (err) {
      console.error('Error generating phrases:', err);
      setError('فشل في توليد الجمل. جرب مرة أخرى.');
      // Fallback suggestions
      setSuggestions([
        'أنا أحب هذا النشاط',
        'أريد المزيد من هذا',
        'انظر إلى هذا الجميل'
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (themeId) {
      generateSuggestions();
    }
  }, [themeId]);

  const handlePhraseClick = (phrase) => {
    if (onPhraseSelect) {
      onPhraseSelect(phrase);
    }
  };

  if (!themeId) return null;

  return (
    <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <FaMagic className="text-purple-600" />
          <span className="text-sm font-semibold text-purple-700">
            اقتراحات الذكاء الاصطناعي
          </span>
        </div>
        <button
          onClick={generateSuggestions}
          disabled={loading}
          className="flex items-center gap-1 bg-purple-500 hover:bg-purple-600 disabled:opacity-50 text-white px-3 py-1 rounded-lg text-xs transition-colors"
          title="توليد جمل جديدة"
        >
          <FaRedo className={loading ? 'animate-spin' : ''} size={12} />
          جديد
        </button>
      </div>

      {error && (
        <div className="text-red-600 text-sm mb-3 bg-red-50 p-2 rounded-lg">
          {error}
        </div>
      )}

      <div className="space-y-2">
        {loading ? (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
            <span className="mr-2 text-sm text-purple-600">جاري التوليد...</span>
          </div>
        ) : (
          suggestions.map((phrase, index) => (
            <button
              key={index}
              onClick={() => handlePhraseClick(phrase)}
              className="w-full text-right bg-white hover:bg-purple-50 border border-purple-200 hover:border-purple-300 rounded-lg p-3 transition-all duration-200 transform hover:scale-102 active:scale-95 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-800">
                  {phrase}
                </span>
                <FaPlay className="text-purple-500" size={14} />
              </div>
            </button>
          ))
        )}
      </div>

      <div className="mt-3 text-xs text-gray-500 text-center">
        اضغط على الجملة لإضافتها إلى الجملة الحالية
      </div>
    </div>
  );
}