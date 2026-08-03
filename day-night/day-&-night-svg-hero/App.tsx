import React from 'react';
import { ThemeProvider } from './components/ThemeContext';
import HeroSVG from './components/HeroSVG';
import ThemeToggle from './components/ThemeToggle';

const Content: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header/Nav */}
      <nav className="w-full fixed top-0 z-50 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-emerald-600 dark:from-blue-400 dark:to-emerald-400">
            DayNight
          </h1>
          <ThemeToggle />
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow">
        <section className="relative">
          <HeroSVG />
          
          {/* Overlay Text */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center px-4 transition-opacity duration-700 delay-300">
              <h2 className="text-4xl md:text-6xl font-extrabold text-white drop-shadow-lg mb-4 opacity-90">
                Building Tomorrow
              </h2>
              <p className="text-lg md:text-xl text-white/90 drop-shadow-md max-w-2xl mx-auto">
                Experience the transition. Seamlessly toggle between day and night modes with pure SVG animations.
              </p>
            </div>
          </div>
        </section>

        {/* Feature Section to show readability */}
        <section className="py-20 px-4 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-xl border border-gray-100 dark:border-gray-700 transition-colors duration-500">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4 text-blue-600 dark:text-blue-300">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h3 className="text-xl font-bold mb-2">High Performance</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Built with React 18 and optimized inline SVGs. No heavy image assets, ensuring blazing fast load times and perfect scaling.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-xl border border-gray-100 dark:border-gray-700 transition-colors duration-500">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4 text-purple-600 dark:text-purple-300">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Themeable</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Full support for system preferences and manual toggles. The SVG elements react dynamically to the Tailwind dark class.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-xl border border-gray-100 dark:border-gray-700 transition-colors duration-500">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900 rounded-lg flex items-center justify-center mb-4 text-emerald-600 dark:text-emerald-300">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Beautiful UX</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Smooth CSS transitions on all elements. Parallax-inspired layers create depth without complex JavaScript libraries.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white dark:bg-gray-900 py-8 border-t border-gray-200 dark:border-gray-800 transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 dark:text-gray-400">
          <p>&copy; {new Date().getFullYear()} DayNight App. Built with React & Tailwind.</p>
        </div>
      </footer>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <Content />
    </ThemeProvider>
  );
};

export default App;