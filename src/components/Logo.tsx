import React, { useState } from 'react';

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
  lang?: 'ar' | 'en';
}

export default function Logo({ className = '', iconOnly = false, lang = 'ar' }: LogoProps) {
  const isWhite = className.includes('text-white') || className.includes('text-slate-100');
  const [imgError, setImgError] = useState(false);

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Prime original logo file. Fallbacks to High-Fidelity brand SVG if local logo.png file has any trouble */}
      {!imgError ? (
        <div className="relative w-12 h-12 md:w-14 md:h-14 flex items-center justify-center shrink-0">
          <img
            src="logo.png"
            alt="Activate + Sudan"
            className="w-full h-full object-contain filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.2)] rounded-xl"
            onError={() => setImgError(true)}
            referrerPolicy="no-referrer"
          />
        </div>
      ) : (
        /* High-Fidelity SVG replicating the Concentric Arcs + Rounded Terminal Brand Image exactly */
        <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
          <svg
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            <defs>
              {/* Soft, premium drop shadow to give realistic brand-logo depth on any background */}
              <filter id="logo-drop-shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2.5" stdDeviation="2" floodColor="#000000" floodOpacity="0.14" />
              </filter>
            </defs>

            {/* Group wrapper applying the brand drop shadow and current dynamic color (white/blue/navy) */}
            <g filter="url(#logo-drop-shadow)" stroke="currentColor" fill="none">
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
                fill="currentColor"
                stroke="none"
              />
            </g>
          </svg>
        </div>
      )}

      {!iconOnly && (
        <div className="flex flex-col leading-none font-sans text-right">
          <span className={`text-lg font-black tracking-tight leading-none ${isWhite ? 'text-white' : 'text-slate-900'}`}>
            {lang === 'ar' ? 'تفعيلك' : 'Activate'}
          </span>
          <span className={`text-base font-bold flex items-center gap-1 mt-0.5 leading-none ${isWhite ? 'text-amber-400' : 'text-blue-600'}`}>
            <span className={isWhite ? 'text-amber-400/80' : 'text-slate-400'}>+</span> {lang === 'ar' ? 'سودان' : 'Sudan'}
          </span>
        </div>
      )}
    </div>
  );
}
