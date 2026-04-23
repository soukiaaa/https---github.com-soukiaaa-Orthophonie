import React, { createContext, useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

export const SelectionContext = createContext();

export function SelectionProvider({ children }) {
  const [selectedItems, setSelectedItems] = useState([]); // {src, alt}
  const [sentence, setSentence] = useState('');
  const MAX_RECENT_ITEMS = 10; // Maximum number of recent items to keep

  // Initialize recentItems from localStorage
  const [recentItems, setRecentItems] = useState(() => {
    try {
      const stored = localStorage.getItem('recentItems');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load recent items from localStorage:', error);
      return [];
    }
  });

  // Save recentItems to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('recentItems', JSON.stringify(recentItems));
    } catch (error) {
      console.error('Failed to save recent items to localStorage:', error);
    }
  }, [recentItems]);

  const addItem = (item) => {
    setSelectedItems((prev) => {
      const updated = [...prev, item];
      setSentence(updated.map((item) => item.alt).join(' '));
      return updated;
    });
    // Add to recent items
    addToRecent(item);
  };

  const removeSelectedItem = (index) => {
    setSelectedItems((prev) => {
      const updated = prev.filter((_, idx) => idx !== index);
      setSentence(updated.map((item) => item.alt).join(' '));
      return updated;
    });
  };

  const addToRecent = (item) => {
    // Avoid duplicates by checking if item already exists in recent
    setRecentItems((prev) => {
      const filtered = prev.filter(recent => recent.src !== item.src);
      const updated = [item, ...filtered];
      // Keep only the last MAX_RECENT_ITEMS
      return updated.slice(0, MAX_RECENT_ITEMS);
    });
  };

  const removeFromRecent = (itemSrc) => {
    setRecentItems((prev) => prev.filter(item => item.src !== itemSrc));
  };

  const clearSelection = () => {
    setSelectedItems([]);
    setSentence('');
  };

  const resolveVoiceUrl = (url) => {
    if (!url) return '';
    if (/^https?:\/\//i.test(url)) return url;
    if (url.startsWith('/')) return `${API_BASE_URL}${url}`;
    return `${API_BASE_URL}/${url}`;
  };

  const speakSentence = () => {
    const text = sentence.trim();
    const voiceItems = selectedItems.filter(item => item.voice && item.voice.trim());

    if (voiceItems.length > 0) {
      let currentIndex = 0;

      const playNext = () => {
        if (currentIndex >= voiceItems.length) {
          return;
        }

        const audio = new Audio(resolveVoiceUrl(voiceItems[currentIndex].voice));
        audio.onended = () => {
          currentIndex += 1;
          playNext();
        };
        audio.onerror = () => {
          currentIndex += 1;
          playNext();
        };
        audio.play().catch(() => {
          currentIndex += 1;
          playNext();
        });
      };

      playNext();
      return;
    }

    if (!text) {
      alert('لا يوجد نص للنطق. يرجى اختيار عناصر أولاً.');
      return;
    }

    if (!('speechSynthesis' in window)) {
      alert('متصفحك لا يدعم تحويل النص إلى كلام. الرجاء استخدام Chrome أو Firefox.');
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ar-SA';
    utterance.rate = 0.95;
    utterance.pitch = 1;

    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }

    window.speechSynthesis.speak(utterance);
  };
  const addAudio = () => {
    // placeholder for adding audio
    const audioUrl = prompt('Enter audio URL');
    if (audioUrl) {
      console.log('audio added', audioUrl);
    }
  };
  const addImage = () => {
    const imgUrl = prompt('Enter image URL');
    if (imgUrl) {
      addItem({ src: imgUrl, alt: 'custom' });
    }
  };

  const value = {
    selectedItems,
    sentence,
    setSentence,
    addItem,
    removeSelectedItem,
    clearSelection,
    speakSentence,
    addAudio,
    addImage,
    recentItems,
    addToRecent,
    removeFromRecent,
  };

  return <SelectionContext.Provider value={value}>{children}</SelectionContext.Provider>;
}
