import React from 'react';
import * as LucideIcons from 'lucide-react';

interface PlatformLogoProps {
  serviceId: string;
  fallbackIconName: string;
  className?: string;
}

export function PlatformLogo({ serviceId, fallbackIconName, className = 'w-8 h-8' }: PlatformLogoProps) {
  const normalizedId = serviceId.toLowerCase().trim();

  switch (normalizedId) {
    case 'gemini':
      return (
        <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            {/* Real Google Gemini spark shape: 4-pointed star with a lovely gradient */}
            <path
              d="M12 2C12 7.5 16.5 12 22 12C16.5 12 12 16.5 12 22C12 16.5 7.5 12 2 12C7.5 12 12 7.5 12 2Z"
              fill="url(#geminiGradient)"
            />
            {/* Small yellow background spark of Gemini */}
            <path
              d="M19 5C19 6.5 20.2 7.7 21.7 7.7C20.2 7.7 19 8.9 19 10.4C19 8.9 17.8 7.7 16.3 7.7C17.8 7.7 19 6.5 19 5Z"
              fill="#FFD700"
            />
            <defs>
              <linearGradient id="geminiGradient" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#4A90E2" />
                <stop offset="35%" stopColor="#8E44AD" />
                <stop offset="70%" stopColor="#D35400" />
                <stop offset="100%" stopColor="#F1C40F" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      );

    case 'chatgpt':
      return (
        <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <rect width="24" height="24" rx="6" fill="#10A37F" />
            <path
              d="M17.8 10.8C18.2 10.1 18.2 9.2 17.7 8.5C17.2 7.9 16.3 7.6 15.6 7.9L14.7 8.3C14.7 8 14.6 7.6 14.3 7.3C13.9 6.8 13.1 6.5 12.3 6.7C11.6 6.9 11.1 7.4 10.9 8.1L10.1 8C9.5 8 8.9 8.4 8.6 9C8.3 9.6 8.4 10.4 8.8 10.9L9.4 11.4C9.2 11.6 9 11.9 8.9 12.2C8.7 12.9 8.9 13.6 9.4 14.1C9.9 14.5 10.6 14.6 11.2 14.3L11.7 15.1C12.1 15.6 12.8 15.9 13.5 15.8C14.2 15.7 14.7 15.2 14.9 14.5L15.3 14.8C15.9 15.2 16.7 15.1 17.2 14.6C17.7 14.1 17.8 13.3 17.5 12.7L16.9 12.2C17.4 11.9 17.7 11.4 17.8 10.8ZM12.3 8.1C12.4 8.1 12.5 8.2 12.5 8.3C12.5 8.5 12.4 8.6 12.3 8.6C11.8 8.6 11.4 9 11.3 9.5L10.3 8.9C10.6 8.4 11.4 8 12.3 8.1ZM9.8 10C9.9 9.9 10 9.9 10.1 10C10.2 10.1 10.2 10.2 10.1 10.3C9.9 10.8 10.1 11.3 10.5 11.5L9.5 12.1C9.1 11.6 9.2 10.5 9.8 10ZM10.8 13.3C10.7 13.2 10.7 13.1 10.7 13C10.7 12.9 10.8 12.8 10.9 12.8C11.4 12.8 11.8 12.4 11.9 11.9L12.9 12.5C12.6 13 11.8 13.4 10.8 13.3ZM13.8 13.7C13.7 13.7 13.6 13.6 13.6 13.5C13.6 13.4 13.7 13.3 13.8 13.3C14.3 13.3 14.7 12.9 14.8 12.4L15.8 13C15.5 13.5 14.7 13.8 13.8 13.7ZM14.3 11.2C14.2 11.3 14.1 11.3 14 11.2C13.9 11.1 13.9 11 14 10.9C14.2 10.4 14 9.9 13.6 9.7L14.6 9.1C15 9.6 14.9 10.7 14.3 11.2ZM12.7 11.5L11.7 10.9L12.7 10.3L13.7 10.9L12.7 11.5Z"
              fill="white"
            />
          </svg>
        </div>
      );

    case 'claude':
      return (
        <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            {/* Claude.ai distinctive orange hand-drawn organic style asterisk star / flower */}
            <path
              d="M12 2C11.3 2 10.7 2.5 10.6 3.2L9.8 7.3C9.7 7.7 9.4 8 9 8.1L4.9 8.9C4.2 9.1 3.8 9.7 3.8 10.4C3.8 11.1 4.3 11.7 5 11.9L9.1 12.7C9.5 12.8 9.8 13.1 9.9 13.5L10.7 17.6C10.8 18.3 11.4 18.8 12.1 18.8C12.8 18.8 13.4 18.3 13.5 17.6L14.3 13.5C14.4 13.1 14.7 12.8 15.1 12.7L19.2 11.9C19.9 11.7 20.3 11.1 20.3 10.4C20.3 9.7 19.8 9.1 19.1 8.9L15 8.1C14.6 8 14.3 7.7 14.2 7.3L13.4 3.2C13.3 2.5 12.7 2 12 2Z"
              fill="#D9502D"
            />
            <path
              d="M6.5 15.5C6 14.9 5.1 14.8 4.5 15.3C3.9 15.8 3.8 16.7 4.3 17.3L7.1 20.3C7.6 20.9 8.5 21 9.1 20.5C9.7 20 9.8 19.1 9.3 18.5L6.5 15.5Z"
              fill="#D9502D"
            />
            <path
              d="M17.5 15.5L14.7 18.5C14.2 19.1 14.3 20 14.9 20.5C15.5 21 16.4 20.9 16.9 20.3L19.7 17.3C20.2 16.7 20.1 15.8 19.5 15.3C18.9 14.8 18 14.9 17.5 15.5Z"
              fill="#D9502D"
            />
          </svg>
        </div>
      );

    case 'linkedin':
      return (
        <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <rect width="24" height="24" rx="4.8" fill="#0A66C2" />
            <path
              d="M8.22 18.5V9.45H5.18v9.05H8.22zM6.7 8.21c1.07 0 1.73-.71 1.73-1.61c0-.91-.66-1.61-1.71-1.61c-1.04 0-1.73.7-1.73 1.61c0 .91.67 1.61 1.7 1.61zm12.3 10.29V13.43c0-2.71-1.44-3.98-3.37-3.98c-1.56 0-2.26.86-2.65 1.46v-1.26H9.93c.04.85 0 9.05 0 9.05h3.04v-5.06c0-.27.02-.54.1-.73c.22-.54.7-.1.7-.93c.96 0 1.56.73 1.56 1.8v4.92h3.04z"
              fill="white"
            />
          </svg>
        </div>
      );

    case 'duolingo':
      return (
        <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            {/* DUOLINGO neon green mascot owl face */}
            <rect x="2" y="3" width="20" height="18" rx="6" fill="#58CC02" />
            <circle cx="8" cy="11.5" r="4" fill="white" />
            <circle cx="16" cy="11.5" r="4" fill="white" />
            <circle cx="8" cy="11.5" r="1.8" fill="#4B4B4B" />
            <circle cx="16" cy="11.5" r="1.8" fill="#4B4B4B" />
            {/* Beak */}
            <path d="M12 12.3L10.2 14.1H13.8L12 12.3Z" fill="#FF9600" />
            <path d="M10.2 14.1L12 16.2L13.8 14.1H10.2Z" fill="#FFAA00" />
            <path d="M4 7C5 6.2 6.2 5.8 7.5 5.8" stroke="#3DB000" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M20 7C19 6.2 17.8 5.8 16.5 5.8" stroke="#3DB000" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
      );

    case 'netflix':
      return (
        <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <rect width="24" height="24" rx="5" fill="#000000" />
            {/* Sleek perspective cinematic Netflix Red N */}
            <path d="M7 4H10.5V20H7V4Z" fill="#B20608" />
            <path d="M13.5 4H17V20H13.5V4Z" fill="#B20608" />
            <path d="M7 4H11L14 20H10L7 4Z" fill="#E50914" />
          </svg>
        </div>
      );

    case 'youtube':
      return (
        <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <rect x="1" y="4" width="22" height="16" rx="5" fill="#FF0000" />
            <path d="M9.5 8.5L16 12L9.5 15.5V8.5Z" fill="white" />
          </svg>
        </div>
      );

    case 'telegram':
      return (
        <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <circle cx="12" cy="12" r="11" fill="url(#tgComponentGrad)" />
            <path
              d="M17.8 7.2L5.8 11.8C5 12.1 5 12.6 5.6 12.8L8.7 13.8L15.9 9.3C16.2 9.1 16.5 9.2 16.3 9.4L10.5 14.6L10.2 17.8C10.5 17.8 10.6 17.7 10.8 17.5L12.3 16.1L15.4 18.4C16 18.7 16.4 18.5 16.5 17.8L18.6 7.9C18.8 7.2 18.3 6.9 17.8 7.2Z"
              fill="white"
            />
            <defs>
              <linearGradient id="tgComponentGrad" x1="12" y1="1" x2="12" y2="23" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#2AABEE" />
                <stop offset="100%" stopColor="#229ED9" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      );

    case 'cloudy':
      return (
        <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <rect width="24" height="24" rx="5" fill="url(#cloudyComponentGrad)" />
            <path
              d="M16.5 15.5C18.4 15.5 19.8 14.1 19.8 12.2C19.8 10.5 18.5 9.1 16.8 9.0C16.4 6.8 14.4 5.2 12.0 5.2C10.1 5.2 8.4 6.2 7.6 7.8C7.4 7.7 7.2 7.7 7.0 7.7C5.1 7.7 3.5 9.3 3.5 11.2C3.5 13.1 5.1 14.7 7.0 14.7H16.5Z"
              fill="white"
            />
            <defs>
              <linearGradient id="cloudyComponentGrad" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#0EA5E9" />
                <stop offset="100%" stopColor="#0284C7" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      );

    case 'windows':
      return (
        <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
          <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-[#0078D7]">
            <path d="M0 3.449L9.75 2.1v9.45H0V3.449zM0 12.45h9.75v9.45L0 20.551v-8.1zM10.8 1.95L24 .15v11.4H10.8V1.95zM10.8 12.45H24v11.4l-13.2-1.8v-9.6z" />
          </svg>
        </div>
      );

    case 'office':
      return (
        <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
          <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-[#D83B01]">
            <path d="M12.146 12L24 6.643V17.35l-11.854 5.357V12zM0 12l10.72 4.836V7.164L0 12z M12.146 1.357L24 6.643v5.357l-11.854-5.357V1.357z" opacity="0.9" />
            <path d="M10.72 7.164l1.426-5.807L24 6.643v5.357l-11.854-5.357V12l-1.426 4.836z" opacity="0.6" />
          </svg>
        </div>
      );

    case 'canva':
      return (
        <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <rect width="24" height="24" rx="5" fill="url(#canvaGrad)" />
            <path d="M7 15C7 15 10 9 12 9C14 9 14.5 11.5 15.5 11.5C16.5 11.5 18 10.5 18 10.5M12.5 11C11.5 12 11 14 9 14C7 14 6 12.5 6 12.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <defs>
              <linearGradient id="canvaGrad" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#00C4CC" />
                <stop offset="50%" stopColor="#7D2AE8" />
                <stop offset="100%" stopColor="#FF65C6" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      );

    case 'kaspersky':
      return (
        <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
          <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-[#006D5B]">
            <path d="M12 2L2 7v7c0 5.25 4.25 10.19 10 12 5.75-1.81 10-6.75 10-12V7L12 2zm0 18.5c-3.13-1-6-4.52-6-8V9.1l6-3 6 3v3.4c0 3.48-2.87 7-6 8z" />
            <path d="M12 8.5l-4 2v2.5l4-2 4 2V10.5l-4-2z" />
          </svg>
        </div>
      );

    case 'esim':
      return (
        <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
          <div className="bg-emerald-600 rounded-md p-1.5 text-white flex items-center justify-center w-full h-full">
            <LucideIcons.Wifi className="w-5 h-5 text-white" />
          </div>
        </div>
      );

    case 'icloud':
      return (
        <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
          <div className="bg-sky-400 rounded-md p-1.5 text-white flex items-center justify-center w-full h-full">
            <LucideIcons.Cloud className="w-5 h-5 text-white" />
          </div>
        </div>
      );

    case 'playstation':
      return (
        <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
          <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-[#0037AE]">
            <path d="M11.637 17.564c1.196.446 2.502.684 3.864.684 2.809 0 5.297-1.021 6.551-2.583v-4.116c.01-.01.01-.021.01-.031 0-1.884-2.861-3.411-6.395-3.411-1.014 0-1.956.126-2.776.354V17.56l-.254.004z M10.875 17.58V5.006c-1.002-.191-2.115-.295-3.291-.295C3.393 4.711.011 6.368.01 8.423v6.059c1.074 1.54 3.328 2.531 5.923 2.531 1.796 0 3.428-.48 4.686-1.282l.256-.151z M11.233 18.067H11.33c-.033.003-.064.005-.098.005a3.86 3.86 0 0 1-2.316-.76l-.248-.198 1.488-.501 1.059 1.454z" />
          </svg>
        </div>
      );

    case 'xbox':
      return (
        <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
          <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-[#107C10]">
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-1.125 21.75c-4.102-.352-7.242-2.766-8.203-6.141.938.984 2.227 1.805 3.516 2.344a16.891 16.891 0 0 0 4.688 3.797zm2.25 0c1.781-1.102 3.422-2.344 4.688-3.797 1.289-.539 2.578-1.36 3.516-2.344-.961 3.375-4.102 5.789-8.203 6.141zM1.875 9.375C2.625 6.094 5 3.516 8.25 2.25a17.925 17.925 0 0 0-4.688 4.688c-1.102 1.312-1.688 2.438-1.688 2.438zm20.25 0s-.586-1.125-1.688-2.438a17.925 17.925 0 0 0-4.688-4.688c3.25 1.266 5.625 3.844 6.375 7.125z" />
          </svg>
        </div>
      );

    case 'pubg':
      return (
        <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
          <div className="bg-[#E4A100] rounded-md p-1.5 text-slate-900 border border-[#FFF] flex items-center justify-center w-full h-full">
            <LucideIcons.Gamepad2 className="w-5 h-5 text-slate-900" />
          </div>
        </div>
      );

    default:
      // Fallback utilizing standard Lucide Icon
      const IconComponent = (LucideIcons as any)[fallbackIconName];
      if (IconComponent) {
        return <IconComponent className="w-5 h-5 text-slate-500" />;
      }
      return <LucideIcons.AppWindow className="w-5 h-5 text-slate-500" />;
  }
}
