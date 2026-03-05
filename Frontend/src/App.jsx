import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './i18n';
import './App.css';
import { useTranslation } from 'react-i18next';
import ThemeGrid from './components/ThemeGrid';
import SubcategoryPage from './components/SubcategoryPage';
import { SelectionProvider } from './context/SelectionContext';
import TopBar from './components/TopBar';
import BottomBar from './components/BottomBar';
import { useState, useEffect } from 'react';

function App() {
  const { t } = useTranslation();
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8000/api/themes/')
      .then(response => response.json())
      .then(data => {
        setThemes(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching themes:', error);
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
