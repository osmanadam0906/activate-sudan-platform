import React from 'react';
import { Service, Plan } from '../types';
import * as LucideIcons from 'lucide-react';
import { PlatformLogo } from './PlatformLogo';
import PriceWidget from './PriceWidget';

interface ServiceCardProps {
  key?: string;
  service: Service;
  usdToSdgRate: number;
  showCurrencyEquivalent: boolean;
  selectedCurrency: 'SDG' | 'USD' | 'both';
  lang: 'ar' | 'en';
  onSelectPlan: (service: Service, plan: Plan) => void;
  onAddToCart: (service: Service, plan: Plan) => void;
  isDarkMode?: boolean;
}

export default function ServiceCard({
  service,
  usdToSdgRate,
  showCurrencyEquivalent,
  selectedCurrency,
  lang,
  onSelectPlan,
  onAddToCart,
  isDarkMode = true,
}: ServiceCardProps) {
  const isAr = lang === 'ar';

  return (
    <div
      id={`service-card-${service.id}`}
      className={`border rounded-3xl overflow-hidden transition-all duration-300 flex flex-col group shadow-lg ${
        isDarkMode
          ? 'bg-slate-900/60 border-slate-800/95 hover:border-slate-700 hover:shadow-cyan-950/10'
          : 'bg-white border-slate-200/80 hover:shadow-md hover:border-slate-300'
      }`}
    >
      {/* Service Header with Rounded Corners and Beautiful Background Gradient Overlays */}
      <div className={`p-6 relative overflow-hidden border-b ${
        isDarkMode 
          ? 'border-slate-850/80 bg-gradient-to-b from-slate-900 to-slate-950' 
          : `${service.bannerColor} border-slate-100`
      }`}>
        {/* Subtle backdrop glow */}
        <div className={`absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl pointer-events-none opacity-20 bg-${service.accentColor || 'blue-500'}`} />
        
        <div className="flex items-start justify-between relative z-10">
          <div className="flex items-center gap-4">
            {/* Rounded Corner Image Box resembling dynamic modern mobile app launcher icons */}
            <div className={`p-2.5 rounded-2xl flex items-center justify-center shrink-0 w-16 h-16 shadow-lg border transition-transform duration-300 group-hover:scale-105 ${
              isDarkMode 
                ? 'bg-slate-850 border-slate-700/60 shadow-slate-950/40' 
                : 'bg-white border-slate-200/80'
            }`}>
              <PlatformLogo serviceId={service.id} fallbackIconName={service.iconName} className="w-11 h-11" />
            </div>

            <div>
              <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full mb-1.5 inline-block border ${
                isAr ? 'tracking-normal' : 'tracking-wider'
              } ${
                isDarkMode
                  ? 'bg-slate-850 text-slate-300 border-slate-700/60'
                  : 'bg-white text-slate-600 border-slate-200/80 shadow-2xs'
              }`}>
                {service.category === 'subscriptions' && (isAr ? 'الاشتراكات والمنصات بريميوم' : 'Premium Subscriptions')}
                {service.category === 'apps' && (isAr ? 'أدوات وتطبيقات متقدمة' : 'Advanced Apps & Utilities')}
                {service.category === 'computer' && (isAr ? 'برامج وكمبيوتر' : 'Computer & Software')}
                {service.category === 'phones' && (isAr ? 'خدمات الهاتف والأرقام' : 'Phones & mobile services')}
                {service.category === 'games' && (isAr ? 'ألعاب وبطاقات شحن' : 'Games & digital cards')}
              </span>

              <h3 className={`text-xl font-black transition-colors ${
                isDarkMode ? 'text-white group-hover:text-amber-300' : 'text-slate-800 group-hover:text-blue-600'
              }`}>
                {isAr ? service.nameAr : service.nameEn}
              </h3>
            </div>
          </div>
        </div>

        <p className={`mt-4 text-xs leading-relaxed max-w-xl font-medium ${
          isDarkMode ? 'text-slate-400' : 'text-slate-600'
        }`}>
          {isAr ? service.descriptionAr : service.descriptionEn}
        </p>
      </div>

      {/* Plans Selection Area */}
      <div className={`p-6 flex-1 flex flex-col gap-4 ${
        isDarkMode ? 'bg-slate-950/30' : 'bg-white'
      }`}>
        <h4 className={`text-[10px] font-black uppercase tracking-widest ${
          isDarkMode ? 'text-slate-500' : 'text-slate-400'
        }`}>
          {isAr ? 'الباقات الرقمية والتفعيلات الفورية المتاحة' : 'Available Tiers & Activation Keys'}
        </h4>

        {/* Plan Responsive Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 flex-1">
          {service.plans.map((plan) => (
            <div
              key={plan.id}
              id={`plan-card-${plan.id}`}
              className={`relative rounded-3xl p-5 border flex flex-col justify-between transition-all duration-350 select-none ${
                plan.isPopular
                  ? (isDarkMode 
                      ? 'bg-slate-900/40 border-amber-500/40 shadow-[0_4px_20px_rgba(245,158,11,0.05)]' 
                      : 'bg-amber-50/15 border-amber-500/35')
                  : (isDarkMode 
                      ? 'bg-slate-900/20 border-slate-850 hover:bg-slate-900/40 hover:border-slate-800' 
                      : 'bg-slate-50/50 border-slate-200/60 hover:bg-white hover:border-slate-300')
              }`}
            >
              {/* Popular Tag Badge */}
              {plan.isPopular && (
                <span className={`absolute -top-3.5 left-5 px-3 py-1 rounded-full text-[9px] font-extrabold flex items-center gap-1 shadow-md border ${
                  isDarkMode 
                    ? 'bg-amber-500 text-slate-950 border-amber-400' 
                    : 'bg-amber-500 text-white border-transparent'
                }`}>
                  <LucideIcons.Sparkles className="w-3 h-3 shrink-0" />
                  <span>{isAr ? 'عالي الطلب الأسرع تفعيلاً' : 'BESTSELLER'}</span>
                </span>
              )}

              <div className="space-y-4">
                <div className="flex justify-between items-start gap-2">
                  <h5 className={`font-black text-sm leading-snug ${
                    isDarkMode ? 'text-white' : 'text-slate-800'
                  }`}>
                    {isAr ? plan.nameAr : plan.nameEn}
                  </h5>
                </div>

                {/* Highly Visual Custom Price Display Widget Hook */}
                <PriceWidget
                  price={plan.price}
                  currency={plan.currency}
                  periodAr={plan.periodAr || (isAr ? 'افتراضي' : 'Once')}
                  periodEn={plan.periodEn || (isAr ? 'Once' : 'Once')}
                  usdToSdgRate={usdToSdgRate}
                  showEquivalent={showCurrencyEquivalent}
                  lang={lang}
                  isDarkMode={isDarkMode}
                />



                {/* Bullet Points list */}
                <ul className="space-y-2.5">
                  {(isAr ? plan.featuresAr : plan.featuresEn).map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs">
                      <LucideIcons.CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${
                        isDarkMode ? 'text-emerald-500/80' : 'text-emerald-600'
                      }`} />
                      <span className={`leading-relaxed font-medium ${
                        isDarkMode ? 'text-slate-400' : 'text-slate-600'
                      }`}>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Twin CTA Buttons: Add to Cart & Instant Checkout */}
              <div className="flex flex-col gap-2 mt-5">
                <button
                  id={`btn-cart-${plan.id}`}
                  onClick={() => onAddToCart(service, plan)}
                  className={`w-full py-3 px-4 rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer active:scale-97 border ${
                    isDarkMode
                      ? 'bg-slate-900 border-slate-700/60 text-slate-200 hover:bg-slate-850 hover:text-white'
                      : 'bg-slate-100 border-slate-200 text-slate-755 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
                  }`}
                >
                  <LucideIcons.ShoppingCart className="w-4 h-4 shrink-0 text-amber-500" />
                  <span>{isAr ? 'إضافة إلى السلة 🛒' : 'Add to Cart 🛒'}</span>
                </button>

                <button
                  id={`btn-order-${plan.id}`}
                  onClick={() => onSelectPlan(service, plan)}
                  className="w-full py-3 px-4 rounded-xl text-xs font-black transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer active:scale-97 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 hover:brightness-110 shadow-lg shadow-orange-500/10"
                >
                  <LucideIcons.Zap className="w-3.5 h-3.5 shrink-0 animate-pulse" />
                  <span>{isAr ? 'خيارات وتفعيل سريع ⚡' : 'Get Instant Access'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
