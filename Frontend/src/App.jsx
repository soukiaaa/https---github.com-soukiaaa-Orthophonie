import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import './i18n';
import './App.css';
import { useTranslation } from 'react-i18next';
import ThemeGrid from './components/ThemeGrid';
import SubcategoryPage from './components/SubcategoryPage';
import { SelectionProvider } from './context/SelectionContext';
import TopBar from './components/TopBar';
import BottomBar from './components/BottomBar';
import { useState, useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import HiddenSubcategoryPage from './pages/HiddenSubcategoryPage';
import logo from './assets/images/logo.jfif';
import SplashPage from './pages/SplashPage';
import { API_BASE_URL } from './config';
import AddThemeModal from './components/AddThemeModal';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('access');
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const AppContent = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const showBars = location.pathname !== '/' && location.pathname !== '/login' && location.pathname !== '/signup';

  const [isAddThemeOpen, setIsAddThemeOpen] = useState(false);

  const getThemeUsageCounts = () => {
    if (typeof window === 'undefined') return {};
    try {
      return JSON.parse(localStorage.getItem('themeUsage') || '{}');
    } catch {
      return {};
    }
  };

  const sortThemesByUsage = (themesList) => {
    const usage = getThemeUsageCounts();
    return [...themesList].sort((a, b) => {
      const aCount = usage[a.id] || 0;
      const bCount = usage[b.id] || 0;
      if (aCount !== bCount) return bCount - aCount;
      return a.name.localeCompare(b.name, 'ar', { sensitivity: 'base' });
    });
  };

  const refreshToken = async () => {
    const refresh = localStorage.getItem('refresh');
    if (!refresh) throw new Error('No refresh token');
    const response = await fetch(`${API_BASE_URL}/api/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh })
    });
    if (!response.ok) throw new Error('Refresh failed');
    const data = await response.json();
    localStorage.setItem('access', data.access);
    return data.access;
  };

  useEffect(() => {
    const fetchThemes = async () => {
      let token = localStorage.getItem('access');
      let response = await fetch(`${API_BASE_URL}/api/themes/`, {
        cache: 'no-cache',
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });

      if (response.status === 401 && token) {
        try {
          token = await refreshToken();
          response = await fetch(`${API_BASE_URL}/api/themes/`, {
            cache: 'no-cache',
            headers: { Authorization: `Bearer ${token}` }
          });
        } catch (refreshError) {
          console.warn('Theme load token refresh failed:', refreshError);
          response = await fetch(`${API_BASE_URL}/api/themes/`, {
            cache: 'no-cache'
          });
        }
      }

      if (!response.ok) {
        throw new Error(`Failed to load themes: ${response.status}`);
      }

      const data = await response.json();
      const themesData = Array.isArray(data) ? data : [];
      setThemes(sortThemesByUsage(themesData));
      setLoading(false);
    };

    fetchThemes().catch(error => {
      console.error('Failed to load themes:', error);
      setError('Failed to load themes. Please try again later.');
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (location.pathname === '/home' && themes.length > 0) {
      setThemes((currentThemes) => sortThemesByUsage(currentThemes));
    }
  }, [location.pathname]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-blue-50 flex items-center justify-center" dir="rtl" lang="ar">
        <div className="text-center">
          <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-2 rounded-full shadow-lg mb-4">
            <img
              src={logo}
              alt="logo"
              className="w-32 h-32 rounded-full object-cover bg-white animate-pulse"
            />
          </div>
          <p className="text-xl font-semibold text-gray-700">جارٍ التحميل...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-50 to-pink-50 flex items-center justify-center" dir="rtl" lang="ar">
        <div className="text-center">
          <div className="bg-red-500 p-4 rounded-full shadow-lg mb-4">
            <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-xl font-semibold text-red-700 mb-4">خطأ في التحميل</p>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50" dir="rtl" lang="ar">
      {showBars && <TopBar />}
      <div className={showBars ? 'pb-28' : ''}>
        <Routes>
          <Route path="/" element={<SplashPage />} />
          <Route path="/home" element={<ThemeGrid themes={themes} />} />
          <Route path="/theme/:id" element={
            <ProtectedRoute>
              <SubcategoryPage />
            </ProtectedRoute>
          } />
          <Route path="/theme/:id/hidden" element={
            <ProtectedRoute>
              <HiddenSubcategoryPage />
            </ProtectedRoute>
          } />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
        </Routes>
      </div>
      {showBars && (
        <>
          <BottomBar onOpenAddTheme={() => setIsAddThemeOpen(true)} />

          <AddThemeModal
            isOpen={isAddThemeOpen}
            onClose={() => setIsAddThemeOpen(false)}
          />
        </>
      )}
    </div>
  );
};

function App() {
  return (
    <SelectionProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </SelectionProvider>
  );
}

export default App;
