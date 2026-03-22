import { useEffect, useRef, useState, useCallback } from "react";
import { API_BASE_URL } from '../config/api';

const VOICE_PRIORITY = ["ar-dz", "ar-ma", "ar-tn", "ar-eg", "ar"];

export default function useSpeech() {
  const [voices, setVoices]         = useState([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const currentAudioRef             = useRef(null);

  useEffect(() => {
    const loadVoices = () => {
      const available = window.speechSynthesis.getVoices();
      if (available.length > 0) setVoices(available);
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => { window.speechSynthesis.onvoiceschanged = null; };
  }, []);

  const stop = useCallback(() => {
    currentAudioRef.current?.pause();
    currentAudioRef.current = null;
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
  }, []);

  const playAudio = (blob) => {
    return new Promise((resolve, reject) => {
      const audioUrl = URL.createObjectURL(blob);
      const audio    = new Audio(audioUrl);
      currentAudioRef.current = audio;
      audio.onended = () => { URL.revokeObjectURL(audioUrl); currentAudioRef.current = null; resolve(); };
      audio.onerror = (e) => { URL.revokeObjectURL(audioUrl); currentAudioRef.current = null; reject(e); };
      audio.play();
    });
  };

  const speakWithEdge = async (text) => {
    const res = await fetch(
      `${API_BASE_URL}/api/tts/edge/?text=${encodeURIComponent(text)}&voice=ar-DZ-AminaNeural`
    );
    if (!res.ok) throw new Error(`Edge TTS ${res.status}`);
    await playAudio(await res.blob());
  };

  const speakWithGoogle = async (text) => {
    const res = await fetch(
      `${API_BASE_URL}/api/tts/?text=${encodeURIComponent(text)}&lang=ar-DZ`
    );
    if (!res.ok) throw new Error(`Google TTS ${res.status}`);
    await playAudio(await res.blob());
  };

  const speakWithBrowser = (text) => {
    return new Promise((resolve) => {
      const utter = new SpeechSynthesisUtterance(text);
      let chosenVoice = null;
      for (const tag of VOICE_PRIORITY) {
        chosenVoice = voices.find((v) => v.lang.toLowerCase().startsWith(tag));
        if (chosenVoice) break;
      }
      if (chosenVoice) { utter.voice = chosenVoice; utter.lang = chosenVoice.lang; }
      else { utter.lang = "ar-DZ"; }
      utter.rate = 0.9;
      utter.pitch = 1;
      utter.onend = resolve;
      utter.onerror = resolve;
      window.speechSynthesis.speak(utter);
    });
  };

  const speak = useCallback(async (text) => {
    if (!text?.trim()) {
      console.warn("No text provided");
      return;
    }
    stop();
    setIsSpeaking(true);
    try {
      console.log("🎙️ Speaking text:", text);
      console.log("🔗 Trying Edge TTS at:", API_BASE_URL);
      await speakWithEdge(text);
      console.log("✅ Edge TTS ok — ar-DZ-AminaNeural");
    } catch (edgeErr) {
      console.warn("❌ Edge failed:", edgeErr.message);
      try {
        console.log("🔗 Trying Google TTS at:", API_BASE_URL);
        await speakWithGoogle(text);
        console.log("✅ Google TTS ok");
      } catch (googleErr) {
        console.warn("❌ Google failed:", googleErr.message);
        console.log("📱 Falling back to browser speech synthesis");
        try {
          await speakWithBrowser(text);
          console.log("✅ Browser speech synthesis ok");
        } catch (browserErr) {
          console.error("❌ All TTS methods failed:", browserErr);
        }
      }
    } finally {
      setIsSpeaking(false);
    }
  }, [stop, voices]);

  return { speak, stop, isSpeaking, voices };
}