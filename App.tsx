import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import DisplayScreen from './components/DisplayScreen';
import AdminPanel from './components/AdminPanel';
import { AppSettings, DEFAULT_SETTINGS } from './types';

const STORAGE_KEY = 'school_display_settings_v1';

function App() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  // Load from local storage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSettings(JSON.parse(stored));
      } else {
        // First run, save defaults
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SETTINGS));
      }
    } catch (e) {
      console.error("Failed to load settings", e);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSaveSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
  };

  if (loading) return <div className="flex h-screen items-center justify-center">جاري التحميل...</div>;

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<DisplayScreen settings={settings} />} />
        <Route 
          path="/admin" 
          element={<AdminPanel settings={settings} onSave={handleSaveSettings} />} 
        />
      </Routes>
    </HashRouter>
  );
}

export default App;
