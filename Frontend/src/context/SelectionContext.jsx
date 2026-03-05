import React, { createContext, useState } from 'react';

export const SelectionContext = createContext();

export function SelectionProvider({ children }) {
  const [selectedItems, setSelectedItems] = useState([]); // {src, alt}
  const [sentence, setSentence] = useState('');

  const addItem = (item) => {
    setSelectedItems((prev) => [...prev, item]);
  };
  const clearSelection = () => {
    setSelectedItems([]);
    setSentence('');
  };
  const speakSentence = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(sentence);
      window.speechSynthesis.speak(utterance);
    }
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
    clearSelection,
    speakSentence,
    addAudio,
    addImage,
  };

  return <SelectionContext.Provider value={value}>{children}</SelectionContext.Provider>;
}
