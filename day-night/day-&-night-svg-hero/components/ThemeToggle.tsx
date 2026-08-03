import React from 'react';
import { useTheme } from './ThemeContext';
import { Theme } from '../types';

const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const options: { value: Theme; label: string; icon: React.ReactNode }[] = [
    {
      value: 'light',
      label: 'Light',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    },
    {
      value: 'system',
      label: 'Auto',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      value: 'dark',
      label: 'Dark',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      )
    },
  ];

  return (
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-1 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 flex gap-1 items-center">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => setTheme(option.value)}
          className={`
            p-2 rounded-full transition-all duration-300
            ${theme === option.value 
              ? 'bg-blue-500 text-white shadow-sm' 
              : 'text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 dark:text-gray-400'
            }
          `}
          aria-label={`Switch to ${option.label} mode`}
          title={option.label}
        >
          {option.icon}
        </button>
      ))}
    </div>
  );
};

export default ThemeToggle;