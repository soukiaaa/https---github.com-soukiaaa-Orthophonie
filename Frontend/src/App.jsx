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
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const showBars = location.pathname !== '/' && location.pathname !== '/login' && location.pathname !== '/signup';

  const [isAddThemeOpen, setIsAddThemeOpen] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/themes/`, { cache: 'no-cache' })
      .then(res => res.json())
      .then(data => {
        setThemes(data);
        setSubcategories(data.subcategories);
        setLoading(false);
      })
      .catch(error => {
        console.error('Failed to load themes:', error);
        setError('Failed to load themes. Please try again later.');
        setLoading(false);
      });
  }, []);

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
      <Routes>
        <Route path="/" element={<SplashPage />} />
        <Route path="/home" element={<ThemeGrid themes={themes} />} />
        <Route path="/theme/:id" element={
          <ProtectedRoute>
            <SubcategoryPage />
          </ProtectedRoute>
        } />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
      </Routes>
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
