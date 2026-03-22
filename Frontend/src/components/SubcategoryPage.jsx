import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SelectionContext } from '../context/SelectionContext';
import { API_BASE_URL } from '../config';
import useSpeech from '../hook/useSpaach';
import { FaPlus, FaTimes, FaImage, FaTrash } from 'react-icons/fa';

export default function SubcategoryPage() {
  const { t } = useTranslation();
  const { speak, isSpeaking } = useSpeech();

  const { id: themeId } = useParams();
  const { addItem, setSentence } = useContext(SelectionContext);
  const [subcategories, setSubcategories] = useState([]);
  const [themeName, setThemeName] = useState('');
  
  // State for Add Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSubName, setNewSubName] = useState('');
  const [newSubImage, setNewSubImage] = useState('');

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/themes/${themeId}/`) // fetch du thème précis
      .then(res => res.json())
      .then(data => {
        setThemeName(data.name);
        
        // Merge server data with local user data
        let allSubs = data.subcategories || [];
        if (user && user.id) {
          const localKey = `custom_subs_${user.id}_${themeId}`;
          const localData = JSON.parse(localStorage.getItem(localKey) || '[]');
          allSubs = [...allSubs, ...localData];
        }
        setSubcategories(allSubs);
      })
      .catch(err => console.error(err));
  }, [themeId]);

  const handleAddSubcategory = () => {
    if (!newSubName || !newSubImage) return;

    const newSub = {
      id: Date.now(),
      name: newSubName,
      image: newSubImage,
      isCustom: true
    };

    if (user && user.id) {
      const localKey = `custom_subs_${user.id}_${themeId}`;
      const currentLocal = JSON.parse(localStorage.getItem(localKey) || '[]');
      const updatedLocal = [...currentLocal, newSub];
      localStorage.setItem(localKey, JSON.stringify(updatedLocal));
    }

    setSubcategories([...subcategories, newSub]);
    setIsModalOpen(false);
    setNewSubName('');
    setNewSubImage('');
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewSubImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteCustom = (e, subId) => {
    e.stopPropagation();
    if (user && user.id) {
      const localKey = `custom_subs_${user.id}_${themeId}`;
      const currentLocal = JSON.parse(localStorage.getItem(localKey) || '[]');
      const updatedLocal = currentLocal.filter(sub => sub.id !== subId);
      localStorage.setItem(localKey, JSON.stringify(updatedLocal));
      
      setSubcategories(prev => prev.filter(sub => sub.id !== subId));
    }
  };

  const handleClick = (sub) => {
    addItem({ src: sub.image, alt: sub.name });
    setSentence((prev) => (prev ? prev + ' ' : '') + sub.name);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 pt-6 pb-32 px-4" dir="rtl" lang="ar">
      <div className="w-full max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {themeName || 'التصنيف'}
          </h2>
          <p className="text-gray-600">اختر العنصر الذي تريده</p>
        </div>

        {/* Grid */}
        <div className="w-full grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 gap-6 justify-items-center">
          
          {/* Add New Card */}
          <div
            onClick={() => setIsModalOpen(true)}
            className="group flex flex-col items-center justify-center bg-white rounded-2xl p-4 hover:shadow-2xl transition-all duration-300 transform hover:scale-110 hover:-translate-y-3 cursor-pointer border-2 border-dashed border-purple-300 min-h-[150px] w-full"
          >
            <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mb-3 group-hover:bg-purple-100 transition-colors">
              <FaPlus size={30} className="text-purple-500" />
            </div>
            <span className="text-sm font-bold text-gray-500 group-hover:text-purple-600">إضافة جديد</span>
          </div>

          {subcategories.map((sub, idx) => (
            <div
              key={sub.id}
              onClick={() => handleClick(sub)}
              style={{
                animation: `scaleIn 0.4s ease-out ${idx * 80}ms forwards`,
                opacity: 0,
              }}
              className="group flex flex-col items-center bg-white rounded-2xl p-4 hover:shadow-2xl transition-all duration-300 transform hover:scale-110 hover:-translate-y-3 cursor-pointer border-2 border-transparent hover:border-purple-300 active:scale-95"
            >
              {/* Delete Button for Custom Items */}
              {sub.isCustom && (
                <button
                  onClick={(e) => handleDeleteCustom(e, sub.id)}
                  className="absolute top-2 left-2 z-10 bg-red-100 text-red-500 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-200"
                  title="حذف"
                >
                  <FaTrash size={12} />
                </button>
              )}

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
                    speak(sub.name);
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

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 flex justify-between items-center text-white">
              <h3 className="text-2xl font-bold">إضافة عنصر جديد</h3>
              <button onClick={() => setIsModalOpen(false)} className="hover:bg-white/20 p-2 rounded-full transition">
                <FaTimes size={20} />
              </button>
            </div>
            
            <div className="p-8 space-y-6">
              {/* Image Input */}
              <div className="flex justify-center">
                <label className="relative cursor-pointer w-40 h-40 border-4 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center hover:border-purple-500 hover:bg-purple-50 transition-all overflow-hidden group">
                  {newSubImage ? (
                    <img src={newSubImage} alt="preview" className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <FaImage size={40} className="text-gray-400 group-hover:text-purple-500 mb-2" />
                      <span className="text-gray-500 text-sm font-medium">اختر صورة</span>
                    </>
                  )}
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              </div>

              {/* Name Input */}
              <div>
                <label className="block text-gray-700 font-bold mb-2 text-right">اسم العنصر</label>
                <input
                  type="text"
                  value={newSubName}
                  onChange={(e) => setNewSubName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none text-right"
                  placeholder="مثلاً: تفاحة"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleAddSubcategory}
                  disabled={!newSubName || !newSubImage}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-3 rounded-xl hover:shadow-lg transform hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  حفظ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}