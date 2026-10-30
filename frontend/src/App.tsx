import React, { useState } from 'react';
import { Login } from './components/Login';
import { Signup } from './components/Signup';
import { Dashboard } from './components/Dashboard';

export function App() {
  const [currentView, setCurrentView] = useState<'login' | 'signup' | 'dashboard'>('login');
  const [isDarkMode, setIsDarkMode] = useState(true);

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
          onLogout={() => setCurrentView('login')}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
        />
      )}
    </>
  );
}

export default App;