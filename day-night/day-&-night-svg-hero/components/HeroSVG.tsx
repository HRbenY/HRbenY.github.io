import React, { useMemo } from 'react';
import { useTheme } from './ThemeContext';

const HeroSVG: React.FC = () => {
  const { currentMode } = useTheme();

  // Generate random faint background stars
  const backgroundStars = useMemo(() => {
    return Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      cx: Math.random() * 2560,
      cy: Math.random() * 800, // Top part of sky
      r: Math.random() * 2 + 1, // Scaled up stars
      animationClass: i % 2 === 0 ? 'animate-twinkle-1' : 'animate-twinkle-3',
      opacity: Math.random() * 0.4 + 0.2
    }));
  }, []);

  return (
    <div className="w-full relative overflow-hidden bg-gray-100 dark:bg-gray-900 transition-colors duration-700">
      <svg
        viewBox="0 0 2560 1440"
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-auto min-h-[400px] max-h-[90vh] block transition-all duration-700"
        role="img"
        aria-label="Animated landscape changing between day and night"
      >
        <defs>
          {/* Day Sky Gradient */}
          <linearGradient id="skyDay" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#60A5FA" /> {/* Blue-400 */}
            <stop offset="100%" stopColor="#DBEAFE" /> {/* Blue-100 */}
          </linearGradient>

          {/* Night Sky Gradient */}
          <linearGradient id="skyNight" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#0F172A" /> {/* Slate-900 */}
            <stop offset="50%" stopColor="#1E1B4B" /> {/* Indigo-950 */}
            <stop offset="100%" stopColor="#312E81" /> {/* Indigo-900 */}
          </linearGradient>

          {/* Sun Glow */}
          <filter id="sunGlow">
            <feGaussianBlur stdDeviation="12" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Moon Glow */}
          <filter id="moonGlow">
            <feGaussianBlur stdDeviation="8" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* --- Layer 1: Background Sky --- */}
        {/* Day Background */}
        <rect
          x="0"
          y="0"
          width="2560"
          height="1440"
          fill="url(#skyDay)"
          className="transition-opacity duration-1000 ease-in-out"
          style={{ opacity: currentMode === 'light' ? 1 : 0 }}
        />
        {/* Night Background */}
        <rect
          x="0"
          y="0"
          width="2560"
          height="1440"
          fill="url(#skyNight)"
          className="transition-opacity duration-1000 ease-in-out"
          style={{ opacity: currentMode === 'dark' ? 1 : 0 }}
        />

        {/* --- Layer 2: Background Stars (Static/Subtle) --- */}
        <g
          id="bg-stars"
          className="transition-opacity duration-1000 delay-200"
          style={{ opacity: currentMode === 'dark' ? 1 : 0 }}
        >
          {backgroundStars.map((star) => (
            <circle
              key={star.id}
              cx={star.cx}
              cy={star.cy}
              r={star.r}
              fill="white"
              fillOpacity={star.opacity}
              className={star.animationClass}
            />
          ))}
        </g>

        {/* --- Layer 3: Celestial Bodies (Sun, Moon, Big Dipper) --- */}
        <g id="celestial-bodies">
          {/* Sun */}
          <g
            className="transition-all duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)]"
            style={{
              transform: currentMode === 'light' ? 'translate(0, 0)' : 'translate(0, 800px)',
              opacity: currentMode === 'light' ? 1 : 0,
            }}
          >
            {/* Core Sun */}
            <circle
              cx="1280"
              cy="500"
              r="100"
              fill="#FDB813"
              filter="url(#sunGlow)"
              className="text-yellow-400"
            />
            {/* Sun Rays (Decorative) */}
            <circle cx="1280" cy="500" r="140" fill="white" opacity="0.1" />
            <circle cx="1280" cy="500" r="180" fill="white" opacity="0.05" />
          </g>

          {/* Night Group: Moon + Big Dipper */}
          <g
             className="transition-all duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)]"
             style={{
               transform: currentMode === 'dark' ? 'translate(0, 0)' : 'translate(0, -500px)',
               opacity: currentMode === 'dark' ? 1 : 0,
             }}
          >
            {/* Moon */}
            <g>
                <circle
                  cx="1280"
                  cy="350"
                  r="70"
                  fill="#F4F4F5"
                  filter="url(#moonGlow)"
                />
                <circle cx="1260" cy="330" r="10" fill="#E4E4E7" opacity="0.5" />
                <circle cx="1300" cy="370" r="14" fill="#E4E4E7" opacity="0.4" />
                <circle cx="1290" cy="320" r="8" fill="#E4E4E7" opacity="0.4" />
            </g>

            {/* Big Dipper (Ursa Major) - Scaled Up */}
            <g transform="translate(300, 200) scale(2.5) rotate(-15)">
                {/* 1. Dubhe */}
                <circle cx="0" cy="0" r="2" fill="white" className="animate-twinkle-1" />
                {/* 2. Merak */}
                <circle cx="0" cy="25" r="2" fill="white" className="animate-twinkle-2" />
                {/* 3. Phecda */}
                <circle cx="28" cy="28" r="2" fill="white" className="animate-twinkle-1" />
                {/* 4. Megrez */}
                <circle cx="30" cy="5" r="2" fill="white" className="animate-twinkle-2" />
                {/* 5. Alioth */}
                <circle cx="55" cy="8" r="2" fill="white" className="animate-twinkle-1" />
                {/* 6. Mizar */}
                <circle cx="75" cy="15" r="2" fill="white" className="animate-twinkle-2" />
                {/* 7. Alkaid */}
                <circle cx="100" cy="35" r="2" fill="white" className="animate-twinkle-1" />
                
                {/* Constellation Lines */}
                <path 
                    d="M0,0 L0,25 L28,28 L30,5 L0,0 M30,5 L55,8 L75,15 L100,35" 
                    fill="none" 
                    stroke="white" 
                    strokeWidth="0.5" 
                    strokeOpacity="0.15" 
                />
            </g>
          </g>
        </g>

        {/* --- Layer 4: Mountains/Landscapes (Parallax-ish) --- */}
        
        {/* Back Mountain Range */}
        <path
          d="M0 1440 L0 1000 Q600 600 1280 1000 T2560 900 L2560 1440 Z"
          className="transition-colors duration-700 ease-in-out"
          fill={currentMode === 'light' ? '#93C5FD' : '#312E81'} // blue-300 : indigo-900
          opacity="0.8"
        />

        {/* Middle Mountain Range */}
        <path
          d="M0 1440 L0 1150 Q800 800 1600 1250 T2560 1150 L2560 1440 Z"
          className="transition-colors duration-700 ease-in-out"
          fill={currentMode === 'light' ? '#60A5FA' : '#1E1B4B'} // blue-400 : indigo-950
        />

        {/* Foreground Land & City */}
        <g>
           {/* 1. Ground curve */}
           <path
             d="M0 1440 L0 1300 C400 1400 800 1200 1280 1350 S2100 1250 2560 1350 L2560 1440 Z"
             className="transition-colors duration-700 ease-in-out"
             fill={currentMode === 'light' ? '#4ADE80' : '#064E3B'} // green-400 : emerald-900
           />
           
           {/* 2. City Silhouette (Buildings) - Scaled and Positioned */}
           <g 
             className="transition-colors duration-700 ease-in-out"
             fill={currentMode === 'light' ? '#94A3B8' : '#020617'} // slate-400 : slate-950
           >
                {/* Left Cluster (Sitting on curve around x=200, y=1330 approx) */}
                <rect x="200" y="1295" width="25" height="60" rx="4" className="opacity-90" />
                <rect x="235" y="1315" width="18" height="40" rx="4" className="opacity-90" />
                
                {/* Right Cluster (Sitting on curve around x=1800, y=1300 approx) */}
                {/* Moved down to y=1330/1350 to match the curve valley */}
                <rect x="1800" y="1330" width="30" height="80" rx="2" className="opacity-90" />
                <rect x="1840" y="1350" width="25" height="60" rx="2" className="opacity-90" />
                
                {/* Extra Cluster for width */}
                <rect x="2200" y="1290" width="20" height="50" rx="2" className="opacity-90" />
           </g>
           
           {/* Windows (Only visible in dark mode) */}
           <g className="transition-opacity duration-500" style={{ opacity: currentMode === 'dark' ? 1 : 0 }}>
             {/* Right Cluster Windows - Updated Y coordinates */}
             <rect x="1808" y="1340" width="6" height="6" fill="#FEF3C7" />
             <rect x="1808" y="1355" width="6" height="6" fill="#FEF3C7" />
             <rect x="1818" y="1345" width="6" height="6" fill="#FEF3C7" />
             <rect x="1848" y="1360" width="6" height="6" fill="#FEF3C7" />
             
             {/* Left Cluster Windows - Updated Y coordinates */}
             <rect x="208" y="1305" width="5" height="5" fill="#FEF3C7" />
             <rect x="208" y="1315" width="5" height="5" fill="#FEF3C7" />
           </g>
        </g>

        {/* --- Layer 5: Atmosphere Overlay --- */}
        <rect
          x="0"
          y="0"
          width="2560"
          height="1440"
          fill={currentMode === 'light' ? '#FEF3C7' : '#111827'} // amber-100 : gray-900
          className="mix-blend-overlay pointer-events-none transition-colors duration-700"
          opacity="0.2"
        />

      </svg>
    </div>
  );
};

export default HeroSVG;