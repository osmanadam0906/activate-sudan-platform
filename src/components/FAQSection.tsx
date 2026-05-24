import React, { useState } from 'react';
import { FAQS } from '../data';
import * as LucideIcons from 'lucide-react';

interface FAQSectionProps {
  lang: 'ar' | 'en';
  isDarkMode?: boolean;
}

export default function FAQSection({ lang, isDarkMode = true }: FAQSectionProps) {
  const isAr = lang === 'ar';
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <div className={`border rounded-3xl p-6 shadow-md transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-slate-900/60 border-slate-850 text-white' 
        : 'bg-white border-slate-200 rounded-2xl shadow-xs text-slate-800'
    }`}>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1.5">
          <div className={`p-1 px-2.5 rounded text-[10px] font-black uppercase tracking-wider ${
            isDarkMode ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20' : 'bg-blue-50 text-blue-700'
          }`}>
            {isAr ? 'التعليمات والدعم وكيف نضمن التفعيل' : 'Assistance & Guides'}
          </div>
        </div>
        <h3 className={`text-base font-black ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
          {isAr ? 'الأسئلة الشائعة وكيفية عمل المنصة' : 'Frequently Asked Questions'}
        </h3>
        <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          {isAr
            ? 'كل ما تود معرفته عن تفعيل البرامج وحلول تخطي الحدود في السودان.'
            : 'All you need to know about processing service subscriptions within Sudan.'}
        </p>
      </div>

      <div className="space-y-3">
        {FAQS.map((faq, idx) => {
          const isOpen = openIdx === idx;
          const question = isAr ? faq.qAr : faq.qEn;
          const answer = isAr ? faq.aAr : faq.aEn;

          return (
            <div
              key={idx}
              className={`rounded-2xl border transition-all duration-300 ${
                isOpen 
                  ? (isDarkMode ? 'bg-slate-900/90 border-sky-500/30' : 'bg-blue-50/20 border-blue-200')
                  : (isDarkMode ? 'bg-slate-900/20 border-slate-850 hover:bg-slate-900/40 hover:border-slate-800' : 'bg-slate-50/50 border-slate-200/60 hover:bg-white hover:border-slate-300')
              }`}
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full py-4 px-4 text-right flex items-center justify-between gap-4 focus:outline-none cursor-pointer"
                dir={isAr ? 'rtl' : 'ltr'}
              >
                <span className={`text-xs font-bold text-right leading-snug transition-colors ${
                  isOpen 
                    ? (isDarkMode ? 'text-sky-305 text-sky-300' : 'text-blue-700') 
                    : (isDarkMode ? 'text-slate-205 text-slate-200 hover:text-sky-300' : 'text-slate-850 hover:text-blue-600')
                }`}>
                  {question}
                </span>
                <span className={`shrink-0 p-1 rounded-lg transition-colors ${
                  isDarkMode ? 'bg-slate-850 text-slate-400' : 'bg-slate-100 text-slate-500'
                }`}>
                  {isOpen ? (
                    <LucideIcons.Minus className="w-3.5 h-3.5" />
                  ) : (
                    <LucideIcons.Plus className="w-3.5 h-3.5" />
                  )}
                </span>
              </button>

              {isOpen && (
                <div
                  className={`px-4 pb-4 text-xs leading-relaxed border-t pt-3 font-medium ${
                    isDarkMode ? 'border-slate-850 text-slate-400' : 'border-slate-100 text-slate-600'
                  }`}
                  dir={isAr ? 'rtl' : 'ltr'}
                >
                  {answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
