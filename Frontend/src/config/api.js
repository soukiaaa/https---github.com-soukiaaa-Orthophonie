const DEFAULT_API_BASE_URL = 'https://orthophonie-backend.onrender.com';
// http://127.0.0.1:8000
// https://elamal-orthophonie.com.ilm-edu.com

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || DEFAULT_API_BASE_URL;

export const API_ROUTES = {
  themes: `${API_BASE_URL}/api/themes/`,
  tts: `${API_BASE_URL}/api/tts/`,
  edgeTts: `${API_BASE_URL}/api/tts/edge/`,
};
