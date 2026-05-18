import React, { createContext, useState, useEffect, useContext } from 'react';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [isLightMode, setIsLightMode] = useState(() => {
    // Persist theme across navigations and page reloads
    const saved = localStorage.getItem('phishguard-theme');
    return saved === 'light';
  });

  useEffect(() => {
    if (isLightMode) {
      document.body.classList.add('light-theme');
      localStorage.setItem('phishguard-theme', 'light');
    } else {
      document.body.classList.remove('light-theme');
      localStorage.setItem('phishguard-theme', 'dark');
    }
  }, [isLightMode]);

  const toggleTheme = () => setIsLightMode(prev => !prev);

  return (
    <ThemeContext.Provider value={{ isLightMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
