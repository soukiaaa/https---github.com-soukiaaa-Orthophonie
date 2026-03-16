import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './i18n';
import './App.css';
import { useTranslation } from 'react-i18next';
import ThemeGrid from './components/ThemeGrid';
import SubcategoryPage from './components/SubcategoryPage';
import { SelectionProvider } from './context/SelectionContext';
import TopBar from './components/TopBar';
import BottomBar from './components/BottomBar';
import { useState, useEffect } from 'react';// ✅ Import du JSON local
import localThemes from './data/themes.js';

function App() {
  const { t } = useTranslation();
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(true);

  
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
    <SelectionProvider>
      <BrowserRouter>
        <div className="min-h-screen w-full" dir="rtl" lang="ar">
          <TopBar />
          <Routes>
            <Route path="/" element={<ThemeGrid themes={themes} />} />
            <Route path="/theme/:id" element={<SubcategoryPage />} />
          </Routes>
          <BottomBar />
        </div>
      </BrowserRouter>
    </SelectionProvider>
  );
}

export default App;
