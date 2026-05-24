import React from 'react';
import * as LucideIcons from 'lucide-react';
import { CategoryType } from '../types';

interface CategoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategory: CategoryType;
  onSelectCategory: (category: CategoryType) => void;
  lang: 'ar' | 'en';
  isDarkMode?: boolean;
}

export default function CategoryDrawer({
  isOpen,
  onClose,
  selectedCategory,
  onSelectCategory,
  lang,
  isDarkMode = true,
}: CategoryDrawerProps) {
  const isAr = lang === 'ar';

  const categoriesList: {
    id: CategoryType;
    nameAr: string;
    nameEn: string;
    icon: string;
    color: string;
    hoverColor: string;
    descriptionAr: string;
    descriptionEn: string;
  }[] = [
    {
      id: 'all',
      nameAr: 'كل الأقسام والخدمات 🌟',
      nameEn: 'All Departments',
      icon: 'LayoutGrid',
      color: 'from-blue-550 to-indigo-600',
      hoverColor: 'hover:border-blue-500/50',
      descriptionAr: 'استعراض كافة اشتراكات وتفعيلات المتجر المتاحة',
      descriptionEn: 'Browse all active digital licenses in store'
    },
    {
      id: 'subscriptions',
      nameAr: 'أولاً: الاشتراكات المميزة 💳',
      nameEn: '1st: Premium Subscriptions',
      icon: 'CreditCard',
      color: 'from-purple-500 to-indigo-550',
      hoverColor: 'hover:border-purple-500/50',
      descriptionAr: 'جيميناي، نتفليكس، يوتيوب، كانفا، فيسبوك، آيكلاود والألعاب بريميوم',
      descriptionEn: 'Gemini, Netflix, YouTube, Canva Pro, Facebook, iCloud+, PlayStation'
    },
    {
      id: 'apps',
      nameAr: 'ثانياً: التطبيقات وأدوات الأعمال 📱',
      nameEn: '2nd: Digital Tools & Apps',
      icon: 'Sparkles',
      color: 'from-emerald-500 to-teal-600',
      hoverColor: 'hover:border-emerald-500/50',
      descriptionAr: 'حزمة ميكروسوفت أوفيس 2026 للأعمال والأدوات المتطورة',
      descriptionEn: 'Microsoft Office 2026 suite and premium office utilities'
    },
    {
      id: 'computer',
      nameAr: 'ثالثاً: كمبيوتر وبرمجيات 💻',
      nameEn: '3rd: Computer & Software',
      icon: 'Monitor',
      color: 'from-blue-600 to-cyan-500',
      hoverColor: 'hover:border-blue-500/50',
      descriptionAr: 'تفعيلات ويندوز 11 الأصلي مدى الحياة وحماية كاسبرسكي وكلاودي',
      descriptionEn: 'Windows 11 retail licenses, Kaspersky security & local cloud'
    },
    {
      id: 'phones',
      nameAr: 'رابعاً: خدمات الهاتف والإنترنت الدولي 📞',
      nameEn: '4th: Phone Services',
      icon: 'Smartphone',
      color: 'from-sky-500 to-blue-400',
      hoverColor: 'hover:border-sky-500/50',
      descriptionAr: 'شرائح eSIM تجوال إنترنت فائق السرعة للسودان برقم عالمي',
      descriptionEn: 'eSIM global roaming internet profiles for Sudan'
    },
    {
      id: 'games',
      nameAr: 'خامساً: ألعاب وبطاقات 🎮',
      nameEn: '5th: Game Top-ups',
      icon: 'Gamepad2',
      color: 'from-amber-500 to-orange-650',
      hoverColor: 'hover:border-amber-500/50',
      descriptionAr: 'شدات ببجي بالمعرف ID والألعاب والبطاقات الفورية بأفضل تسعيرة',
      descriptionEn: 'PUBG Mobile UC via player ID instant top-up at best rates'
    }
  ];

  const getCategoryIcon = (iconName: string, active: boolean) => {
    const IconComp = (LucideIcons as any)[iconName];
    if (!IconComp) return <LucideIcons.Folder className="w-5 h-5" />;
    return (
      <IconComp
        className={`w-5 h-5 transition-transform duration-300 ${
          active ? 'scale-110 rotate-3' : 'group-hover:scale-110'
        }`}
      />
    );
  };

  return (
    <>
      {/* Backdrop overlay */}
      <div
        id="category-drawer-backdrop"
        onClick={onClose}
        className={`fixed inset-0 z-50 transition-opacity duration-300 ease-in-out ${
          isOpen ? 'opacity-100 pointer-events-auto bg-black/60 backdrop-blur-xs' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Vertical Navigation Drawer Panel Container */}
      <div
        id="category-drawer-aside"
        dir={isAr ? 'rtl' : 'ltr'}
        className={`fixed top-0 bottom-0 z-55 w-80 max-w-[90vw] flex flex-col justify-between shadow-2xl transition-all duration-300 ease-in-out ${
          isOpen
            ? (isAr ? 'right-0' : 'left-0')
            : (isAr ? '-right-96' : '-left-96')
        } ${
          isDarkMode
            ? 'bg-[#0a192f] text-white border-x border-slate-900/80'
            : 'bg-white text-slate-800 border-x border-slate-200'
        }`}
      >
        {/* Drawer Header */}
        <div className={`p-6 border-b flex items-center justify-between ${
          isDarkMode ? 'border-slate-900/80 bg-[#0a192f]' : 'border-slate-100 bg-slate-50'
        }`}>
          <div className="flex items-center gap-2.5">
            <span className={`p-2 rounded-xl flex items-center justify-center ${
              isDarkMode ? 'bg-sky-500/10 text-sky-400 border border-sky-400/20' : 'bg-blue-50 text-blue-650'
            }`}>
              <LucideIcons.MenuSquare className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-black text-sm tracking-tight">
                {isAr ? 'أقسام المتجر المتاحة 📂' : 'Store Directory 📂'}
              </h3>
              <p className={`text-[10px] font-medium ${
                isDarkMode ? 'text-slate-400' : 'text-slate-500'
              }`}>
                {isAr ? 'تصفية سريعة كمنصة تفعيلك الأصلي' : 'Quickly narrow down subscriptions'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition cursor-pointer ${
              isDarkMode ? 'hover:bg-slate-900 text-slate-400' : 'hover:bg-slate-200 text-slate-600'
            }`}
            title="Close menu"
          >
            <LucideIcons.X className="w-5 h-5" />
          </button>
        </div>

        {/* Categories Vertical Trigger Stack */}
        <div className="p-6 flex-1 overflow-y-auto space-y-4 scrollbar-none">
          <div className="mb-2">
            <span className={`text-[10px] font-bold tracking-widest uppercase block ${
              isDarkMode ? 'text-slate-500' : 'text-slate-400'
            }`}>
              {isAr ? 'الخيارات المتاحة للتفعيل' : 'CHOOSE SUBSCRIPTION CATEGORY'}
            </span>
          </div>

          <div className="space-y-3">
            {categoriesList.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  id={`drawer-category-pill-${cat.id}`}
                  onClick={() => {
                    onSelectCategory(cat.id);
                    onClose();
                  }}
                  className={`w-full text-right flex items-center gap-3.5 p-4 rounded-2xl border transition-all duration-300 text-right group cursor-pointer ${
                    isActive
                      ? (isDarkMode
                          ? 'bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border-sky-500/40 text-white shadow-lg shadow-sky-550/5'
                          : 'bg-blue-50 border-blue-200 text-blue-700 font-bold')
                      : (isDarkMode
                          ? 'bg-slate-900/40 border-slate-900/50 text-slate-350 hover:bg-slate-900 hover:border-slate-850 text-slate-300'
                          : 'bg-slate-50/50 border-slate-100 text-slate-650 hover:bg-slate-50')
                  } ${cat.hoverColor}`}
                >
                  {/* Category Styled Icon Frame */}
                  <div className={`p-2.5 rounded-xl shrink-0 flex items-center justify-center transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-650 text-white shadow-md'
                      : (isDarkMode ? 'bg-slate-850 text-slate-400 border border-slate-800' : 'bg-white text-slate-500 shadow-2xs')
                  }`}>
                    {getCategoryIcon(cat.icon, isActive)}
                  </div>

                  <div className="text-right flex-1 select-none">
                    <span className={`text-xs font-black block transition-colors ${
                      isActive 
                        ? (isDarkMode ? 'text-sky-300' : 'text-blue-700') 
                        : (isDarkMode ? 'text-slate-200' : 'text-slate-800')
                    }`}>
                      {isAr ? cat.nameAr : cat.nameEn}
                    </span>
                    <span className={`text-[10px] block mt-0.5 font-medium leading-tight ${
                      isActive 
                        ? (isDarkMode ? 'text-slate-400' : 'text-blue-600/80') 
                        : (isDarkMode ? 'text-slate-500' : 'text-slate-400')
                    }`}>
                      {isAr ? cat.descriptionAr : cat.descriptionEn}
                    </span>
                  </div>

                  <LucideIcons.ChevronLeft className={`w-4 h-4 shrink-0 transition-transform ${
                    isAr ? 'group-hover:-translate-x-1' : 'rotate-180 group-hover:translate-x-1'
                  } ${isActive ? (isDarkMode ? 'text-sky-400' : 'text-blue-600') : 'text-slate-500/60'}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Drawer Footer info (support contact details) */}
        <div className={`p-6 border-t ${
          isDarkMode ? 'border-slate-900/80 bg-[#0a192f]/80' : 'border-slate-100 bg-slate-50'
        }`}>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
              <span className={`text-[10px] font-bold ${
                isDarkMode ? 'text-emerald-400' : 'text-emerald-700'
              }`}>
                {isAr ? 'تفعيل فوري وآمن متاح الآن للسودان' : 'Direct secure activation active'}
              </span>
            </div>

            <div className="text-xs space-y-2">
              <a
                href="https://wa.me/249113411965"
                target="_blank"
                rel="noreferrer"
                className={`flex items-center justify-center gap-2 p-2.5 rounded-xl border font-bold transition ${
                  isDarkMode 
                    ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/25' 
                    : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-250'
                }`}
              >
                <LucideIcons.MessageCircle className="w-4 h-4" />
                <span>{isAr ? 'دعم الواتساب مباشر 💬' : 'WhatsApp Support'}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
