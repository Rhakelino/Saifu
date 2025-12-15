import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Transactions from './pages/Transactions';
import Analytics from './pages/Analytics';
import Wallets from './pages/Wallets';
import Settings from './pages/Settings';
import Appearance from './pages/settings/Appearance';
import Language from './pages/settings/Language';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Check local storage for theme preference or default to dark
    const theme = localStorage.getItem('theme') || 'dark';
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <div className="flex h-screen w-full bg-background-light dark:bg-background-dark text-slate-900 dark:text-white font-display overflow-hidden relative">
      <Sidebar isOpen={sidebarOpen} />

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Routes>
        <Route path="/" element={<Dashboard onMenuClick={() => setSidebarOpen(true)} />} />
        <Route path="/transactions" element={<Transactions onMenuClick={() => setSidebarOpen(true)} />} />
        <Route path="/analytics" element={<Analytics onMenuClick={() => setSidebarOpen(true)} />} />
        <Route path="/wallets" element={<Wallets onMenuClick={() => setSidebarOpen(true)} />} />
        <Route path="/settings" element={<Settings onMenuClick={() => setSidebarOpen(true)} />} />
        <Route path="/settings/appearance" element={<Appearance onMenuClick={() => setSidebarOpen(true)} />} />
        <Route path="/settings/language" element={<Language onMenuClick={() => setSidebarOpen(true)} />} />
      </Routes>
    </div>
  );
}

export default App;
