
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { Home } from './pages/Home';
import { AdminLogin } from './pages/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard';
import { Template, AppSettings } from './types';
import { DEFAULT_APP_SETTINGS, DEFAULT_TEMPLATE, ADMIN_URL_SLUG } from './constants';

const App: React.FC = () => {
  const [templates, setTemplates] = useState<Template[]>(() => {
    const saved = localStorage.getItem('ccp_templates');
    return saved ? JSON.parse(saved) : [DEFAULT_TEMPLATE];
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('ccp_settings');
    return saved ? JSON.parse(saved) : DEFAULT_APP_SETTINGS;
  });

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('ccp_admin_auth') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('ccp_templates', JSON.stringify(templates));
  }, [templates]);

  useEffect(() => {
    localStorage.setItem('ccp_settings', JSON.stringify(settings));
  }, [settings]);

  const handleAdminLogin = (password: string) => {
    if (password === settings.adminPassword) {
      setIsAdminAuthenticated(true);
      sessionStorage.setItem('ccp_admin_auth', 'true');
      return true;
    }
    return false;
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem('ccp_admin_auth');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Routes>
        <Route 
          path="/" 
          element={<Home templates={templates} settings={settings} />} 
        />
        <Route 
          path={`/${ADMIN_URL_SLUG}/login`} 
          element={<AdminLogin onLogin={handleAdminLogin} isAuthenticated={isAdminAuthenticated} />} 
        />
        <Route 
          path={`/${ADMIN_URL_SLUG}/dashboard/*`} 
          element={
            isAdminAuthenticated ? (
              <AdminDashboard 
                templates={templates} 
                setTemplates={setTemplates} 
                settings={settings} 
                setSettings={setSettings}
                onLogout={handleAdminLogout} 
              />
            ) : (
              <Navigate to={`/${ADMIN_URL_SLUG}/login`} />
            )
          } 
        />
        {/* Simple Redirection for 404s */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
};

export default App;
