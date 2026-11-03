import React, { useState } from 'react';
import { Login } from './components/Login';
import { Signup } from './components/Signup';
import { Dashboard } from './components/Dashboard';

export function App() {
  const [currentView, setCurrentView] = useState<'login' | 'signup' | 'dashboard'>(
  () => (localStorage.getItem('token') ? 'dashboard' : 'login')
);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setCurrentView('login');
  };

  return (
    <>
      {currentView === 'login' && (
        <Login
          onNavigateToSignup={() => setCurrentView('signup')}
          onLoginSuccess={() => setCurrentView('dashboard')}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
        />
      )}

      {currentView === 'signup' && (
        <Signup
          onNavigateToLogin={() => setCurrentView('login')}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
        />
      )}

      {currentView === 'dashboard' && (
        <Dashboard
          onLogout={handleLogout}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
        />
      )}
    </>
  );
}

export default App;