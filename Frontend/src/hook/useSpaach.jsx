import { useEffect, useState } from "react";

export default function useSpeech() {
  const [voices, setVoices] = useState([]);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      if (availableVoices.length > 0) setVoices(availableVoices);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const speak = (text) => {
    if (!("speechSynthesis" in window)) return;

    const utter = new SpeechSynthesisUtterance(text);

    // Choisir une voix arabe si disponible
    const arVoice = voices.find((v) => v.lang.toLowerCase().startsWith("ar"));
    if (arVoice) {
      utter.voice = arVoice;
      utter.lang = arVoice.lang;
    } else {
      utter.lang = "ar-SA"; // fallback
    }

    utter.rate = 0.9;
    window.speechSynthesis.speak(utter);
  };

  return { speak };
}