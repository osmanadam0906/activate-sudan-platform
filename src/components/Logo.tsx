import React, { useState } from 'react';

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
  lang?: 'ar' | 'en';
  imageSizeClass?: string;
}

export default function Logo({ className = '', iconOnly = false, lang = 'ar', imageSizeClass = 'w-12 h-12 md:w-14 md:h-14' }: LogoProps) {
  const isWhite = className.includes('text-[#fff]') || className.includes('text-white') || className.includes('text-slate-100');

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* High-Fidelity brand vector SVG rendered directly, styled with a modern premium blue brand gradient */}
      <div className={`relative flex items-center justify-center shrink-0 ${imageSizeClass}`}>
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_2px_8px_rgba(37,99,235,0.25)]"
        >
          <defs>
            {/* Soft, premium drop shadow to give realistic brand-logo depth on any background */}
            <filter id="logo-drop-shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.1" />
            </filter>
            {/* Vibrant premium blue brand gradient (primary blue to deep royal blue) */}
            <linearGradient id="blue-brand-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#1d4ed8" />
            </linearGradient>
          </defs>

          {/* Group wrapper applying the brand drop shadow and the blue brand gradient */}
          <g filter="url(#logo-drop-shadow)" stroke="url(#blue-brand-gradient)" fill="none">
            {/* Concentric Arc 1 (Innermost brand arc) */}
            <path
              d="M 39.5 54 A 16 16 0 1 1 66 48 L 66 53"
              strokeWidth="7.5"
              strokeLinecap="round"
            />
            
            {/* Concentric Arc 2 (Middle brand arc) */}
            <path
              d="M 30.5 62 A 27 27 0 1 1 77 48 L 77 65"
              strokeWidth="7.5"
              strokeLinecap="round"
            />
            
            {/* Concentric Arc 3 (Outermost brand arc) */}
            <path
              d="M 21.5 70 A 38 38 0 1 1 88 48 L 88 65"
              strokeWidth="7.5"
              strokeLinecap="round"
            />

            {/* Solid Capsule/Pill Terminal representing the lowercase "a" brand stem */}
            <rect
              x="73.25"
              y="48"
              width="18.5"
              height="34"
              rx="9.25"
              fill="url(#blue-brand-gradient)"
              stroke="none"
            />
          </g>
        </svg>
      </div>

      {!iconOnly && (
        <div className="flex flex-col leading-none font-sans text-right">
          <span className={`text-lg font-black tracking-tight leading-none ${isWhite ? 'text-white' : 'text-slate-900'}`}>
            {lang === 'ar' ? 'تفعيلك' : 'Activate'}
          </span>
          <span className={`text-base font-bold flex items-center gap-1 mt-0.5 leading-none ${isWhite ? 'text-sky-450 text-sky-400' : 'text-blue-600'}`}>
            <span className={isWhite ? 'text-sky-400/80' : 'text-slate-400'}>+</span> {lang === 'ar' ? 'سودان' : 'Sudan'}
          </span>
        </div>
      )}
    </div>
  );
}
