import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import './i18n';
import './App.css';
import { useTranslation } from 'react-i18next';
import ThemeGrid from './components/ThemeGrid';
import SubcategoryPage from './components/SubcategoryPage';
import { SelectionProvider } from './context/SelectionContext';
import TopBar from './components/TopBar';
import BottomBar from './components/BottomBar';
import { useState, useEffect } from 'react';// ✅ Import du JSON local
import localThemes from './data/themes';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import logo from './assets/images/logo.jfif';
import SplashPage from './pages/SplashPage';
import { API_BASE_URL } from './config';

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
  const showBars = location.pathname !== '/' && location.pathname !== '/login' && location.pathname !== '/signup';

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/themes/`)
      .then(res => res.json())
      .then(data => {
        setThemes(data);
        setSubcategories(data.subcategories);
        setLoading(false);
      })
      .catch(() => {
        setThemes(localThemes);
        setSubcategories(localThemes.subcategories);
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
      {showBars && <BottomBar />}
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
