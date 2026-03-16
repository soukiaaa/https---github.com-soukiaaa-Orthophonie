import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
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

const AppContent = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const showBars = location.pathname !== '/login' && location.pathname !== '/signup';

  
useEffect(() => {
  fetch('http://10.0.24.23:8000/api/themes/')
    .then(res => res.json())
    .then(data => { setThemes(data); setLoading(false); })
    .catch(() => {
      console.warn("API indisponible, données locales utilisées");
      setThemes(localThemes); // ✅ fallback sur le JSON local
      setLoading(false);
    });
}, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen w-full" dir="rtl" lang="ar">
      {showBars && <TopBar />}
      <Routes>
        <Route path="/" element={<ThemeGrid themes={themes} />} />
        <Route path="/theme/:id" element={<SubcategoryPage />} />
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
