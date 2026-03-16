import { useEffect, useRef, useState, useCallback } from 'react';
import { API_ROUTES } from '../config/api';

const VOICE_PRIORITY = ['ar-dz', 'ar-ma', 'ar-tn', 'ar-eg', 'ar'];

export default function useSpeech() {
  const [voices, setVoices] = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const currentAudioRef = useRef(null);

  useEffect(() => {
    const loadVoices = () => {
      const available = window.speechSynthesis.getVoices();
      if (available.length > 0) {
        setVoices(available);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const stop = useCallback(() => {
    currentAudioRef.current?.pause();
    currentAudioRef.current = null;
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
  }, []);

  const playAudio = (blob) =>
    new Promise((resolve, reject) => {
      const audioUrl = URL.createObjectURL(blob);
      const audio = new Audio(audioUrl);

      currentAudioRef.current = audio;

      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        currentAudioRef.current = null;
        resolve();
      };

      audio.onerror = (error) => {
        URL.revokeObjectURL(audioUrl);
        currentAudioRef.current = null;
        reject(error);
      };

      audio.play();
    });

  const speakWithEdge = async (text) => {
    const response = await fetch(
      `${API_ROUTES.edgeTts}?text=${encodeURIComponent(text)}&voice=ar-DZ-AminaNeural`,
    );

    if (!response.ok) {
      throw new Error(`Edge TTS ${response.status}`);
    }

    await playAudio(await response.blob());
  };

  const speakWithGoogle = async (text) => {
    const response = await fetch(
      `${API_ROUTES.tts}?text=${encodeURIComponent(text)}&lang=ar-DZ`,
    );

    if (!response.ok) {
      throw new Error(`Google TTS ${response.status}`);
    }

    await playAudio(await response.blob());
  };

  const speakWithBrowser = (text) =>
    new Promise((resolve) => {
      const utterance = new SpeechSynthesisUtterance(text);
      let selectedVoice = null;

      for (const tag of VOICE_PRIORITY) {
        selectedVoice = voices.find((voice) =>
          voice.lang.toLowerCase().startsWith(tag),
        );

        if (selectedVoice) {
          break;
        }
      }

      if (selectedVoice) {
        utterance.voice = selectedVoice;
        utterance.lang = selectedVoice.lang;
      } else {
        utterance.lang = 'ar-DZ';
      }

      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.onend = resolve;
      utterance.onerror = resolve;

      window.speechSynthesis.speak(utterance);
    });

  const speak = useCallback(
    async (text) => {
      if (!text?.trim()) {
        return;
      }

      stop();
      setIsSpeaking(true);

      try {
        await speakWithEdge(text);
      } catch {
        try {
          await speakWithGoogle(text);
        } catch {
          await speakWithBrowser(text);
        }
      } finally {
        setIsSpeaking(false);
      }
    },
    [stop, voices],
  );

  return { speak, stop, isSpeaking, voices };
}
