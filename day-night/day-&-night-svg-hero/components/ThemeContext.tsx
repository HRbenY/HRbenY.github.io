import React, { createContext, useContext, useEffect, useState } from 'react';
import { Theme, ThemeContextType } from '../types';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme-preference');
    return (saved as Theme) || 'system';
  });

  const [currentMode, setCurrentMode] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const root = document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = () => {
      let resolvedMode: 'light' | 'dark' = 'light';

      if (theme === 'system') {
        resolvedMode = mediaQuery.matches ? 'dark' : 'light';
      } else {
        resolvedMode = theme;
      }

      if (resolvedMode === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }

      setCurrentMode(resolvedMode);
      localStorage.setItem('theme-preference', theme);
    };

    applyTheme();

    const handleChange = () => {
        if (theme === 'system') {
            applyTheme();
        }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, currentMode }}>
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