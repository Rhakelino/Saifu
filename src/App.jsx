import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import { Routes, Route, useLocation } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Transactions from './pages/Transactions';
import TransactionHistory from './pages/TransactionHistory';
import Analytics from './pages/Analytics';
import Wallets from './pages/Wallets';
import Categories from './pages/Categories';
import Settings from './pages/Settings';
import Appearance from './pages/settings/Appearance';
import Login from './pages/Login';
import Register from './pages/Register';
import { DataProvider } from './context/DataContext';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

// Layout component for authenticated pages (with sidebar)
function AuthenticatedLayout({ children, sidebarOpen, setSidebarOpen }) {
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

      {children}
    </div>
  );
}

function AppRoutes() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Check if current route is auth page (no sidebar needed)
  const isAuthPage = ['/login', '/register'].includes(location.pathname);

  useEffect(() => {
    // Check local storage for theme preference or default to dark
    const theme = localStorage.getItem('theme') || 'dark';
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Auth pages don't need sidebar/layout
  if (isAuthPage) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    );
  }

  // Authenticated pages with sidebar
  return (
    <DataProvider>
      <AuthenticatedLayout sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}>
        <Routes>
          <Route path="/" element={<Dashboard onMenuClick={() => setSidebarOpen(true)} />} />
          <Route path="/transactions" element={<Transactions onMenuClick={() => setSidebarOpen(true)} />} />
          <Route path="/history" element={<TransactionHistory onMenuClick={() => setSidebarOpen(true)} />} />
          <Route path="/analytics" element={<Analytics onMenuClick={() => setSidebarOpen(true)} />} />
          <Route path="/wallets" element={<Wallets onMenuClick={() => setSidebarOpen(true)} />} />
          <Route path="/categories" element={<Categories onMenuClick={() => setSidebarOpen(true)} />} />
          <Route path="/settings" element={<Settings onMenuClick={() => setSidebarOpen(true)} />} />
          <Route path="/settings/appearance" element={<Appearance onMenuClick={() => setSidebarOpen(true)} />} />
        </Routes>
      </AuthenticatedLayout>
    </DataProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#182a25',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            padding: '12px 16px',
            fontSize: '14px',
            fontWeight: '500',
            backdropFilter: 'blur(10px)',
          },
          success: {
            iconTheme: {
              primary: '#13ecb6',
              secondary: '#10221d',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
