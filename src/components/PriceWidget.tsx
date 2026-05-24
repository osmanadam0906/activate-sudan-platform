import React from 'react';

interface PriceWidgetProps {
  price: number;
  currency: 'USD' | 'SDG';
  periodAr: string;
  periodEn: string;
  usdToSdgRate: number;
  showEquivalent: boolean;
  lang: 'ar' | 'en';
  isDarkMode?: boolean;
}

export default function PriceWidget({
  price,
  currency,
  periodAr,
  periodEn,
  lang,
  usdToSdgRate = 4200,
  showEquivalent = true,
  isDarkMode = true,
}: PriceWidgetProps) {
  const isAr = lang === 'ar';
  const period = isAr ? periodAr : periodEn;

  // Static logic: $1 USD = 4200 SDG
  const STATIC_RATE = 4200;

  let usdPrice = 0;
  let sdgPrice = 0;

  if (currency === 'USD') {
    usdPrice = price;
    sdgPrice = price * STATIC_RATE;
  } else {
    usdPrice = price / STATIC_RATE;
    sdgPrice = price;
  }

  const formattedUsd = usdPrice.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const formattedSdg = Math.round(sdgPrice).toLocaleString('en-US');

  return (
    <div className={`p-4 rounded-2xl border transition-all duration-300 ${
      isDarkMode 
        ? 'bg-slate-950/85 border-slate-800' 
        : 'bg-slate-50 border-slate-200'
    }`} dir={isAr ? 'rtl' : 'ltr'}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-col text-right sm:text-right">
          {/* Top Line: Price in USD (professional, bold font) */}
          <div className="flex items-baseline gap-1 animate-fade-in justify-start">
            <span className={`text-sm sm:text-base font-extrabold font-sans tracking-tight ${
              isDarkMode ? 'text-amber-400' : 'text-slate-900'
            }`}>
              {formattedUsd} $
            </span>
            <span className={`text-[9px] sm:text-[10px] font-black uppercase tracking-wider ${
              isDarkMode ? 'text-slate-300' : 'text-slate-500'
            }`}>
              USD
            </span>
          </div>

          {/* Bottom Line: Equivalent price in SDG (slightly smaller, secondary font) */}
          {showEquivalent && (
            <div className="flex items-baseline gap-1 opacity-90 justify-start mt-1.5 pt-1.5 border-t border-dashed border-slate-800/45 dark:border-slate-800/40">
              <span className={`text-xs font-semibold font-sans tracking-normal ${
                isDarkMode ? 'text-slate-400' : 'text-slate-600'
              }`}>
                {formattedSdg}
              </span>
              <span className={`text-[9px] font-bold ${
                isDarkMode ? 'text-slate-500' : 'text-slate-400'
              }`}>
                {isAr ? 'ج.س (SDG)' : 'SDG'}
              </span>
            </div>
          )}
        </div>

        {/* Period Badge */}
        <span className={`text-[9.5px] font-extrabold px-2 py-1 rounded-lg shrink-0 ${
          isAr ? 'mr-auto' : 'ml-auto'
        } ${
          isDarkMode 
            ? 'bg-slate-900 border border-slate-800 text-slate-400' 
            : 'bg-slate-100 border border-slate-200 text-slate-500 shadow-3xs'
        }`}>
          {period}
        </span>
      </div>
    </div>
  );
}
