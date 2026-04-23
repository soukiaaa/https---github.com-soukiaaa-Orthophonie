import React, { useState } from 'react';
import { API_BASE_URL } from '../config';
import { MdClose, MdImage } from 'react-icons/md';

export default function AddThemeModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      if (!formData.name.trim()) {
        throw new Error('اسم الموضوع مطلوب');
      }

      const token = localStorage.getItem('access');
      if (!token) {
        throw new Error('انتهت الجلسة، يرجى تسجيل الدخول مرة أخرى');
      }

      const form = new FormData();
      form.append('name', formData.name);
      form.append('slug', formData.slug);
      if (formData.image) {
        form.append('image', formData.image);
      }

      const response = await fetch(`${API_BASE_URL}/api/addthemes/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: form,
      });

      if (!response.ok) {
        let errorMessage = 'فشل في إضافة الموضوع';
        const contentType = response.headers.get('content-type');
        
        // On vérifie si la réponse est bien du JSON avant de tenter de la parser
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          errorMessage = errorData.detail || errorMessage;
        } else {
          if (response.status === 403) errorMessage = 'عذراً، ليس لديك الصلاحية لإضافة موضوع أو انتهت الجلسة (403)';
          else errorMessage = `خطأ في الخادم (${response.status})`;
        }
        throw new Error(errorMessage);
      }

      alert('تم إضافة الموضوع بنجاح!');
      setFormData({ name: '', slug: '', image: null });
      setImagePreview(null);
      onClose();
      
      // Reload page to show new theme
      window.location.reload();
    } catch (err) {
      setError(err.message || 'حدث خطأ في إضافة الموضوع');
      console.error('Error adding theme:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
      {/* Modal Container */}
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative overflow-hidden animate-popUp" dir="rtl">
        {/* Decorative gradient backgrounds */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-200 to-blue-200 rounded-full -mr-20 -mt-20 opacity-40"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-blue-100 to-purple-100 rounded-full -ml-16 -mb-16 opacity-40"></div>

        {/* Enhanced Close Button */}
        <button
            onClick={onClose}
            className="absolute top-6 left-6 bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-red-600 p-3 rounded-full transition-all duration-300 z-20 hover:scale-110 active:scale-95 shadow-lg"
          >
            <MdClose size={26} />
          </button>

        {/* Content */}
        <div className="relative z-10">
          {/* Header */}
          <div className="mb-8 text-center pt-2">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full mb-4 shadow-lg">
              <MdImage className="text-purple-600" size={32} />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
              إضافة محور جديد
            </h2>
            <p className="text-gray-500 text-sm">أثري المكتبة بمحتوى جديد وشيق</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Theme Name */}
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></span>
                اسم الموضوع
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="مثال: الفواكه"
                  className="w-full pr-10 pl-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 bg-gray-50 hover:bg-white font-semibold"
                  disabled={loading}
                />
              </div>
            </div>

            {/* slug */}
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                slug
              </label>
              <div className="relative">
                <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    placeholder="مثال: fruits"
                    className="w-full pr-10 pl-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-200 bg-gray-50 hover:bg-white font-semibold"
                    disabled={loading}
                />
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"></span>
                صورة الموضوع
              </label>
              <label className="relative cursor-pointer group">
                <div className="w-full border-3 border-dashed border-purple-300 rounded-2xl p-8 text-center bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 hover:from-purple-100 hover:via-blue-100 hover:to-indigo-100 transition-all duration-300 group-hover:border-purple-500 group-hover:shadow-lg">
                  <MdImage className="mx-auto text-purple-400 mb-2 text-4xl group-hover:text-purple-600 transition-all duration-300 group-hover:scale-110" size={48} />
                  <p className="text-sm font-bold text-gray-700">
                    اختر صورة أو اسحب وأسقط
                  </p>
                  <p className="text-xs text-gray-500 mt-1">JPG, PNG أو GIF - الحد الأقصى 5MB</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  disabled={loading}
                />
              </label>

              {/* Image Preview */}
              {imagePreview && (
                <div className="mt-4 animate-slideUp">
                  <div className="relative group">
                    <div className="relative rounded-2xl overflow-hidden shadow-xl">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-30 transition-all duration-200"></div>
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview(null);
                          setFormData((prev) => ({ ...prev, image: null }));
                        }}
                        className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 font-semibold flex items-center gap-1 transform group-hover:scale-110 active:scale-95"
                      >
                        ✕ حذف
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl animate-shake flex items-start gap-3 shadow-md">
                <span className="text-xl mt-0.5">⚠️</span>
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-purple-500 via-purple-500 to-blue-500 hover:from-purple-600 hover:via-purple-600 hover:to-blue-600 text-white font-bold py-3 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-2xl flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    جاري...
                  </>
                ) : (
                  <>
                    ✓ إضافة
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
              >
                إلغاء
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
