import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SelectionContext } from '../context/SelectionContext';
import { API_BASE_URL } from '../config';
import useSpeech from '../hook/useSpaach';
import { FaPlus, FaTimes, FaImage, FaTrash, FaMicrophone, FaUpload, FaVideo, FaSearchPlus, FaEdit } from 'react-icons/fa';

export default function SubcategoryPage() {
  const { t } = useTranslation();
  const { speak, isSpeaking } = useSpeech();

  const { id: themeId } = useParams();
  const { addItem } = useContext(SelectionContext);
  const [subcategories, setSubcategories] = useState([]);
  const [themeName, setThemeName] = useState('');
  
  // State for Add Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSubName, setNewSubName] = useState('');
  const [newSubImage, setNewSubImage] = useState('');
  const [newSubVideo, setNewSubVideo] = useState('');
  const [newSubVoice, setNewSubVoice] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [recordingTime, setRecordingTime] = useState(0);
  const [zoomedImage, setZoomedImage] = useState(null);
  const [editingSub, setEditingSub] = useState(null);

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    const token = localStorage.getItem('access');

    fetch(`${API_BASE_URL}/api/themes/${themeId}/`, {
      headers: token ? {
        'Authorization': `Bearer ${token}`,
      } : {}
    })
      .then(res => res.json())
      .then(data => {
        setThemeName(data.name);
        setSubcategories(data.subcategories || []);
      })
      .catch(err => console.error(err));
  }, [themeId]);

  const handleAddSubcategory = async () => {
    if (!newSubName || !newSubImage) return;

    try {
      // Prepare FormData for multipart upload
      const formData = new FormData();
      formData.append('name', newSubName);

      // Convert base64 image to blob
      if (newSubImage.startsWith('data:')) {
        const [header, data] = newSubImage.split(',');
        const mime = header.match(/:(.*?);/)[1];
        const bstr = atob(data);
        const n = bstr.length;
        const u8arr = new Uint8Array(n);
        for (let i = 0; i < n; i++) {
          u8arr[i] = bstr.charCodeAt(i);
        }
        const imageBlob = new Blob([u8arr], { type: mime });
        formData.append('image', imageBlob, 'image.jpg');
      }

      // Convert base64 voice to blob if provided
      if (newSubVoice && newSubVoice.startsWith('data:')) {
        const [header, data] = newSubVoice.split(',');
        const mime = header.match(/:(.*?);/)[1];
        const bstr = atob(data);
        const n = bstr.length;
        const u8arr = new Uint8Array(n);
        for (let i = 0; i < n; i++) {
          u8arr[i] = bstr.charCodeAt(i);
        }
        const voiceBlob = new Blob([u8arr], { type: mime });
        formData.append('voice', voiceBlob, 'voice.webm');
      }

      // Convert base64 video to blob if provided
      if (newSubVideo && newSubVideo.startsWith('data:')) {
        const [header, data] = newSubVideo.split(',');
        const mime = header.match(/:(.*?);/)[1];
        const bstr = atob(data);
        const n = bstr.length;
        const u8arr = new Uint8Array(n);
        for (let i = 0; i < n; i++) {
          u8arr[i] = bstr.charCodeAt(i);
        }
        const videoBlob = new Blob([u8arr], { type: mime });
        formData.append('video', videoBlob, 'video.mp4');
      }

      // Send to backend
      const token = localStorage.getItem('access');
      const response = await fetch(`${API_BASE_URL}/api/themes/${themeId}/custom-subcategories/`, {
        method: 'POST',
        headers: token ? {
          'Authorization': `Bearer ${token}`,
        } : {},
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to create subcategory');
      }

      const newSub = await response.json();
      
      // Also keep in localStorage as backup
      const newSubLocal = {
        id: newSub.id || Date.now(),
        name: newSub.name,
        image: newSub.image,
        video: newSub.video,
        voice: newSub.voice,
        isCustom: true
      };

      if (user && user.id) {
        const localKey = `custom_subs_${user.id}_${themeId}`;
        const currentLocal = JSON.parse(localStorage.getItem(localKey) || '[]');
        const updatedLocal = [...currentLocal, newSubLocal];
        localStorage.setItem(localKey, JSON.stringify(updatedLocal));
      }

      setSubcategories([...subcategories, newSubLocal]);
      setIsModalOpen(false);
      setNewSubName('');
      setNewSubImage('');
      setNewSubVideo('');
      setNewSubVoice('');
    } catch (error) {
      console.error('Error creating subcategory:', error);
      alert('حدث خطأ أثناء إضافة العنصر');
    }
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

  const handleVoiceUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewSubVoice(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewSubVideo(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleStartRecording = async () => {
    try {
      // Check if browser supports mediaDevices with proper fallback
      let mediaDevices = navigator.mediaDevices;
      
      // Fallback for older browsers
      if (!mediaDevices) {
        const getUserMedia = navigator.getUserMedia || 
                             navigator.webkitGetUserMedia || 
                             navigator.mozGetUserMedia || 
                             navigator.msGetUserMedia;
        
        if (!getUserMedia) {
          alert('متصفحك لا يدعم تسجيل الصوت. يرجى استخدام متصفح حديث مثل Chrome أو Firefox أو Edge.');
          return;
        }
        
        // Use legacy API
        mediaDevices = {
          getUserMedia: (constraints) => {
            return new Promise((resolve, reject) => {
              getUserMedia.call(navigator, constraints, resolve, reject);
            });
          }
        };
      }

      // Check if we're in a secure context (HTTPS or localhost)
      if (!window.isSecureContext && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        alert('تسجيل الصوت يتطلب اتصالاً آمناً (HTTPS). الرجاء استخدام HTTPS للوصول إلى الموقع.');
        return;
      }

      const stream = await mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm;codecs=opus' });
        const reader = new FileReader();
        reader.onloadend = () => {
          setNewSubVoice(reader.result);
          setRecordingTime(0);
        };
        reader.readAsDataURL(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      setMediaRecorder(recorder);
      setAudioChunks(chunks);
      recorder.start();
      setIsRecording(true);
      setRecordingTime(0);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        alert('تم رفض إذن الوصول إلى الميكروفون. يرجى السماح بالوصول إلى الميكروفون والمحاولة مرة أخرى.');
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        alert('لم يتم العثور على ميكروفون. يرجى التحقق من أن الميكروفون متصل ومفعل.');
      } else if (error.name === 'NotSupportedError') {
        alert('متصفحك لا يدعم تسجيل الصوت بهذه الطريقة. يرجى استخدام Chrome أو Firefox.');
      } else if (error.name === 'TypeError') {
        alert('تعذر الوصول إلى الميكروفون. تأكد من أن المتصفح يدعم هذه العملية على HTTPS.');
      } else {
        alert('حدث خطأ أثناء الوصول إلى الميكروفون: ' + error.message);
      }
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const handleDiscardRecording = () => {
    setNewSubVoice('');
    setRecordingTime(0);
  };

  const resolveMediaUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('data:')) return url;
    if (/^https?:\/\//i.test(url)) return url;
    if (url.startsWith('/')) return `${API_BASE_URL}${url}`;
    return `${API_BASE_URL}/${url}`;
  };

  const handlePlayRecordedAudio = () => {
    if (newSubVoice) {
      const audio = new Audio(resolveMediaUrl(newSubVoice));
      audio.play();
    }
  };

  // Timer for recording
  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

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

  const handleUpdateVoice = async () => {
    if (!editingSub || !newSubVoice || !editingSub.id) return;

    try {
      const formData = new FormData();
      // Conversion du base64 (enregistrement ou upload) en Blob
      if (newSubVoice.startsWith('data:')) {
        const [header, data] = newSubVoice.split(',');
        const mime = header.match(/:(.*?);/)[1];
        const bstr = atob(data);
        const n = bstr.length;
        const u8arr = new Uint8Array(n);
        for (let i = 0; i < n; i++) {
          u8arr[i] = bstr.charCodeAt(i);
        }
        const voiceBlob = new Blob([u8arr], { type: mime });
        formData.append('voice', voiceBlob, 'voice.webm');
      }

      let finalVoiceUrl = newSubVoice;

      if (typeof editingSub.id === 'number' && editingSub.id > 1000000000000) {
        console.log("Mise à jour locale uniquement (élément non synchronisé)");
      } else {
        const token = localStorage.getItem('access');
        const response = await fetch(`${API_BASE_URL}/api/subcategories/${editingSub.id}/`, {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: formData
        });

      if (!response.ok) {
        throw new Error('Failed to update voice');
      }

      const updatedSub = await response.json();
        
        finalVoiceUrl = updatedSub.voice;
      }
      
      // Mise à jour de l'état local
      setSubcategories(prev => prev.map(s => s.id === editingSub.id ? { ...s, voice: finalVoiceUrl } : s));

      // Mise à jour du localStorage si c'est un élément personnalisé
      if (editingSub.isCustom && user?.id) {
        const localKey = `custom_subs_${user.id}_${themeId}`;
        const currentLocal = JSON.parse(localStorage.getItem(localKey) || '[]');
        const updatedLocal = currentLocal.map(s => s.id === editingSub.id ? { ...s, voice: finalVoiceUrl } : s);
        localStorage.setItem(localKey, JSON.stringify(updatedLocal));
      }

      setEditingSub(null);
      setNewSubVoice('');
    } catch (error) {
      console.error('Error updating subcategory:', error);
      alert('حدث خطأ أثناء تحديث الصوت');
    }
  };

  const isActions = themeId === 'actions';

  const playSubVoice = (sub) => {
    if (!sub) return;
    if (sub.voice) {
      const audio = new Audio(resolveMediaUrl(sub.voice));
      audio.play().catch(() => {
        // ignore playback errors
      });
    } else {
      speak(sub.name);
    }
  };

  const handleClick = (sub) => {
    addItem({ src: sub.image, alt: sub.name, voice: resolveMediaUrl(sub.voice) });
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
              className={`group flex flex-col items-center bg-white rounded-2xl p-4 hover:shadow-2xl transition-all duration-300 transform hover:scale-110 hover:-translate-y-3 cursor-pointer border-2 border-transparent hover:border-purple-300 active:scale-95 ${isActions ? 'action-card' : ''}`}
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

              {/* Button Edit (Voice) */}
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setEditingSub(sub); setNewSubVoice(''); }}
                className="absolute top-2 right-2 z-10 bg-blue-100 text-blue-500 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-200"
                title="تعديل الصوت"
              >
                <FaEdit size={12} />
              </button>

              {/* Image */}
              <div className={`relative w-24 h-24 mb-3 overflow-hidden rounded-xl ${isActions ? 'action-image' : ''}`}>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-purple-300 blur-lg opacity-0 group-hover:opacity-40 transition-all duration-300"></div>
                {/* Button Agrandir (Zoom) */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setZoomedImage(sub);
                    playSubVoice(sub);
                  }}
                  className="absolute bottom-1 right-1 z-10 bg-white/90 text-purple-600 p-2 rounded-lg shadow-md md:opacity-0 md:group-hover:opacity-100 transition-all active:scale-95"
                  title="agrandir"
                >
                  <FaSearchPlus size={16} />
                </button>
                {isActions && sub.video ? (
                  <video
                    src={resolveMediaUrl(sub.video)}
                    className="relative w-full h-full object-cover"
                    muted
                    autoPlay
                    loop
                    playsInline
                  />
                ) : (
                  <img
                    src={sub.image}
                    alt={sub.name}
                    className="relative w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                )}
              </div>

              {/* Name + Voice */}
              <div className="flex items-center justify-between w-full">
                <span className="text-sm font-bold text-gray-800 text-center group-hover:text-purple-600 transition-colors duration-300">
                  {sub.name}
                </span>
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

              {/* Video Input (only for actions theme) */}
              {isActions && (
                <div className="flex justify-center">
                  <label className="relative cursor-pointer w-40 h-40 border-4 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center hover:border-red-500 hover:bg-red-50 transition-all overflow-hidden group">
                    {newSubVideo ? (
                      <video src={newSubVideo} className="w-full h-full object-cover" controls />
                    ) : (
                      <>
                        <FaVideo size={40} className="text-gray-400 group-hover:text-red-500 mb-2" />
                        <span className="text-gray-500 text-sm font-medium">اختر فيديو</span>
                      </>
                    )}
                    <input type="file" accept="video/*" onChange={handleVideoUpload} className="hidden" />
                  </label>
                </div>
              )}

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

              {/* Voice Input */}
              <div>
                <label className="block text-gray-700 font-bold mb-2 text-right">ملف الصوت (اختياري)</label>
                <div className="space-y-3">
                  {/* Recording Controls */}
                  <div className="flex gap-2">
                    {!isRecording ? (
                      <button
                        onClick={handleStartRecording}
                        disabled={newSubVoice !== ''}
                        className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                      >
                        <FaMicrophone size={18} />
                        تسجيل
                      </button>
                    ) : (
                      <button
                        onClick={handleStopRecording}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 animate-pulse"
                      >
                        <span className="w-3 h-3 bg-red-300 rounded-full animate-pulse"></span>
                        إيقاف ({recordingTime}s)
                      </button>
                    )}
                  </div>

                  {/* File Upload Fallback */}
                  <label className="relative cursor-pointer w-full border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center hover:border-green-500 hover:bg-green-50 transition-all overflow-hidden group p-3">
                    {!newSubVoice && (
                      <>
                        <FaUpload size={18} className="text-gray-400 group-hover:text-green-500 mb-1" />
                        <span className="text-gray-500 text-xs font-medium">أو رفع ملف صوت</span>
                      </>
                    )}
                    <input type="file" accept="audio/*" onChange={handleVoiceUpload} className="hidden" />
                  </label>

                  {/* Recorded Audio Preview */}
                  {newSubVoice && (
                    <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-blue-600 font-medium">✓ تم تسجيل الصوت</span>
                        <button
                          onClick={handlePlayRecordedAudio}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm transition-colors"
                        >
                          ► استمع
                        </button>
                      </div>
                      <button
                        onClick={handleDiscardRecording}
                        className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 rounded-lg transition-colors"
                      >
                        تسجيل جديد
                      </button>
                    </div>
                  )}
                </div>
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

      {/* Modal d'agrandissement (Zoom) */}
      {zoomedImage && (
        <div 
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-[60] p-4 backdrop-blur-sm animate-fadeIn"
          onClick={() => setZoomedImage(null)}
        >
          <div className="relative max-w-full md:max-w-2xl w-full flex flex-col items-center">
            <button 
              className="absolute -top-12 right-0 text-white hover:text-red-400 transition-colors p-2"
              onClick={() => setZoomedImage(null)}
            >
              <FaTimes size={32} />
            </button>
            <img 
              src={zoomedImage.image} 
              alt={zoomedImage.name} 
              className="w-full h-auto max-h-[70vh] rounded-3xl shadow-2xl object-contain bg-white animate-popUp"
            />
            <div className="mt-6 bg-white/10 backdrop-blur-md px-6 py-2 rounded-full border border-white/20">
              <h3 className="text-white text-2xl font-bold">{zoomedImage.name}</h3>
            </div>
          </div>
        </div>
      )}

      {/* Modal de modification du son (Edit Voice) */}
      {editingSub && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[70] p-4 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 flex justify-between items-center text-white">
              <h3 className="text-2xl font-bold">تعديل صوت: {editingSub.name}</h3>
              <button onClick={() => { setEditingSub(null); setNewSubVoice(''); }} className="hover:bg-white/20 p-2 rounded-full transition">
                <FaTimes size={20} />
              </button>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="space-y-3">
                <div className="flex gap-2">
                  {!isRecording ? (
                    <button
                      onClick={handleStartRecording}
                      disabled={newSubVoice !== ''}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                      <FaMicrophone size={18} />
                      تسجيل صوت جديد
                    </button>
                  ) : (
                    <button
                      onClick={handleStopRecording}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 animate-pulse"
                    >
                      <span className="w-3 h-3 bg-red-300 rounded-full animate-pulse"></span>
                      إيقاف ({recordingTime}s)
                    </button>
                  )}
                </div>

                <label className="relative cursor-pointer w-full border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center hover:border-green-500 hover:bg-green-50 transition-all overflow-hidden group p-3">
                  {!newSubVoice && (
                    <>
                      <FaUpload size={18} className="text-gray-400 group-hover:text-green-500 mb-1" />
                      <span className="text-gray-500 text-xs font-medium">أو رفع ملف صوت</span>
                    </>
                  )}
                  <input type="file" accept="audio/*" onChange={handleVoiceUpload} className="hidden" />
                </label>

                {newSubVoice && (
                  <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-blue-600 font-medium">✓ تم اختيار الصوت</span>
                      <button onClick={handlePlayRecordedAudio} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm">► استمع</button>
                    </div>
                    <button onClick={handleDiscardRecording} className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 rounded-lg">إلغاء</button>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleUpdateVoice}
                  disabled={!newSubVoice}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 rounded-xl hover:shadow-lg transform hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  حفظ الصوت الجديد
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}