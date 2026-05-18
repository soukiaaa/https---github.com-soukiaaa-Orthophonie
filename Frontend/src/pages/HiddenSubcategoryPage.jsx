import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SelectionContext } from '../context/SelectionContext';
import { API_BASE_URL } from '../config';
import useSpeech from '../hook/useSpaach';
import { FaArrowLeft, FaTrash, FaSearchPlus, FaEdit } from 'react-icons/fa';

export default function HiddenSubcategoryPage() {
  const { t } = useTranslation();
  const { speak, isSpeaking } = useSpeech();
  const navigate = useNavigate();
  const { id: themeId } = useParams();
  const { addItem } = useContext(SelectionContext);
  const [themeName, setThemeName] = useState('');
  const [hiddenSubcategories, setHiddenSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refreshToken = async () => {
    const refresh = localStorage.getItem('refresh');
    if (!refresh) throw new Error('No refresh token');
    const response = await fetch(`${API_BASE_URL}/api/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh }),
    });
    if (!response.ok) throw new Error('Refresh failed');
    const data = await response.json();
    localStorage.setItem('access', data.access);
    return data.access;
  };

  useEffect(() => {
    const fetchHidden = async () => {
      let token = localStorage.getItem('access');
      let response = await fetch(`${API_BASE_URL}/api/themes/${themeId}/`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (response.status === 401 && token) {
        try {
          token = await refreshToken();
          response = await fetch(`${API_BASE_URL}/api/themes/${themeId}/`, {
            headers: { Authorization: `Bearer ${token}` },
          });
        } catch {
          response = await fetch(`${API_BASE_URL}/api/themes/${themeId}/`);
        }
      }

      if (!response.ok) {
        throw new Error(`Failed to load hidden items: ${response.status}`);
      }

      const data = await response.json();
      setThemeName(data.name || '');
      setHiddenSubcategories(Array.isArray(data.subcategories) ? data.subcategories.filter(sub => sub.hidden) : []);
      setLoading(false);
    };

    fetchHidden().catch((err) => {
      console.error(err);
      setError('خطأ في تحميل العناصر المخفية');
      setLoading(false);
    });
  }, [themeId]);

  const resolveMediaUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('data:')) return url;
    if (/^https?:\/\//i.test(url)) return url;
    if (url.startsWith('/')) return `${API_BASE_URL}${url}`;
    return `${API_BASE_URL}/${url}`;
  };

  const handleToggleHidden = async (e, sub) => {
    e.stopPropagation();

    let token = localStorage.getItem('access');
    if (!token) {
      alert('Veuillez vous connecter.');
      return;
    }

    try {
      let response = await fetch(`${API_BASE_URL}/api/subcategories/${sub.id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ hidden: false }),
      });

      if (response.status === 401) {
        token = await refreshToken();
        response = await fetch(`${API_BASE_URL}/api/subcategories/${sub.id}/`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ hidden: false }),
        });
      }

      if (!response.ok) {
        throw new Error('Failed to unhide item');
      }

      setHiddenSubcategories((prev) => prev.filter((item) => item.id !== sub.id));
    } catch (error) {
      console.error(error);
      alert('حدث خطأ أثناء إظهار العنصر');
    }
  };

  const handleClick = (sub) => {
    addItem({ src: sub.image, alt: sub.name, voice: resolveMediaUrl(sub.voice) });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 flex items-center justify-center" dir="rtl" lang="ar">
        <div className="text-center">
          <p className="text-xl font-semibold text-gray-700">جارٍ تحميل العناصر المخفية...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center" dir="rtl" lang="ar">
        <div className="text-center p-6 bg-white rounded-3xl shadow-lg">
          <p className="text-red-600 font-bold mb-3">تعذر تحميل العناصر المخفية</p>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-6 bg-purple-600 text-white rounded-full px-6 py-3"
          >
            عودة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 pt-8 pb-72 px-4" dir="rtl" lang="ar">
      <div className="w-full max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div className="text-center flex-1 mb-2">
            <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">العناصر المخفية</h2>
            <p className="text-gray-600">{themeName}</p>
          </div>
        </div>

        {hiddenSubcategories.length === 0 ? (
          <div className="rounded-3xl bg-white p-10 text-center shadow-lg">
            <p className="text-lg font-semibold text-gray-700">لا توجد عناصر مخفية في هذا التصنيف.</p>
          </div>
        ) : (
          <div className="w-full grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 gap-6 justify-items-center">
            {hiddenSubcategories.map((sub, idx) => (
              <div
                key={sub.id}
                onClick={() => handleClick(sub)}
                style={{ animation: `scaleIn 0.4s ease-out ${idx * 80}ms forwards`, opacity: 0 }}
                className="relative group flex flex-col items-center bg-white rounded-3xl p-4 shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer"
              >
                <span className="absolute bottom-3 left-3 z-10 bg-yellow-100 text-yellow-800 text-[10px] font-semibold uppercase px-2 py-1 rounded-full">
                  مخفي
                </span>
                <div className="relative w-24 h-24 mb-3 overflow-hidden rounded-xl">
                  {sub.video ? (
                    <video src={resolveMediaUrl(sub.video)} className="w-full h-full object-cover" muted autoPlay loop playsInline />
                  ) : (
                    <img src={sub.image} alt={sub.name} className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="w-full text-right">
                  <h3 className="text-sm font-bold text-gray-900 mb-2">{sub.name}</h3>
                  <div className="flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (sub.voice) {
                          const audio = new Audio(resolveMediaUrl(sub.voice));
                          audio.play();
                        } else {
                          speak(sub.name);
                        }
                      }}
                      disabled={isSpeaking}
                      className="text-blue-500 hover:text-blue-700"
                      title="استمع"
                    >
                      🔊
                    </button>
                    <button
                      type="button"
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleToggleHidden(e, sub); }}
                      className="text-xs font-semibold rounded-full bg-green-100 text-green-700 px-3 py-1"
                    >
                      إظهار
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="h-28 md:h-32" aria-hidden="true" />
      </div>
    </div>
  );
}
