import React, { useState, useEffect } from 'react';
// Note: In Next.js App Router projects, change this import to: import { SignInButton, UserButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { 
  SignInButtonBridge as SignInButton, 
  UserButtonBridge as UserButton, 
  SignedInBridge as SignedIn, 
  SignedOutBridge as SignedOut, 
  useUserBridge as useUser, 
  useClerkBridge as useClerk 
} from './lib/clerk-bridge';
import { CategoryType, Service, Plan, Order, Advertisement, SpecialOffer, CartItem } from './types';
import { SERVICES, DEFAULT_USD_TO_SDG } from './data';
import Logo from './components/Logo';
import ServiceCard from './components/ServiceCard';
import { PlatformLogo } from './components/PlatformLogo';
import OrderDrawer from './components/OrderDrawer';
import CartDrawer from './components/CartDrawer';
import FAQSection from './components/FAQSection';
import StoreReviews from './components/StoreReviews';
import WhatsAppWidget from './components/WhatsAppWidget';
import CategoryDrawer from './components/CategoryDrawer';
import * as LucideIcons from 'lucide-react';

const SPECIAL_OFFERS = [
  {
    id: 'tg-premium-special',
    serviceId: 'telegram',
    planId: 'tg-premium-monthly',
    nameAr: 'تليجرام بريميوم النخبوي (شهر)',
    nameEn: 'Telegram Premium Elite (1 Month)',
    discountBadge: '-40%',
    iconName: 'Send',
    oldPrice: '120K',
    newPrice: '57K',
    oldPriceUsd: '13.0',
    newPriceUsd: '7.2',
    directIconUrl: 'https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg'
  },
  {
    id: 'duo-plus-special',
    serviceId: 'duolingo',
    planId: 'duo-personal-yearly',
    nameAr: 'سوبر دولينجو بلس لتعلم اللغات (سنة)',
    nameEn: 'Super Duolingo Plus (1 Year)',
    discountBadge: '-58%',
    iconName: 'GraduationCap',
    oldPrice: '282K',
    newPrice: '141K',
    oldPriceUsd: '80.0',
    newPriceUsd: '33.6',
    directIconUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/15/Duolingo_logo_%282019%29.svg'
  },
  {
    id: 'yt-premium-special',
    serviceId: 'youtube',
    planId: 'yt-individual-plan',
    nameAr: 'يوتيوب بريميوم السلس بدون إعلانات (شهر)',
    nameEn: 'YouTube Premium No-Ads (1 Month)',
    discountBadge: '-40%',
    iconName: 'Youtube',
    oldPrice: '44K',
    newPrice: '26K',
    oldPriceUsd: '10.3',
    newPriceUsd: '6.22',
    directIconUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg'
  }
];


export default function App() {
  const { user, isSignedIn } = useUser();
  const clerk = useClerk();

  // Cart & Toast States
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  // Localization defaulting to Arabic (Sudanese audience first)
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  
  // Luxury Dark Mode state (defaults to FALSE for the high-end bright Tafeelak feel)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('activate_sudan_dark_mode');
    return saved ? saved === 'true' : false;
  });

  // Category Drawer Menu state
  const [isCategoryDrawerOpen, setIsCategoryDrawerOpen] = useState(false);

  // Static exchange rate locked to 6000 SDG
  const [usdToSdgRate] = useState<number>(6000);
  const [showCurrencyEquivalent, setShowCurrencyEquivalent] = useState(true);

  // أسعار الصرف الثابتة المعتمدة في تفعيل الاشتراكات الرقمية (يمكن تغييرها يدوياً هنا)
  const USD_TO_SDG_EXCHANGE = 6000; // 1 دولار = 6000 جنيه سوداني
  const USD_TO_SAR_EXCHANGE = 4; // 1 دولار = 4 ريال سعودي
  const USD_TO_EGP_EXCHANGE = 55; // 1 دولار = 55 جنيه مصري

  // العملة النشطة (محددة جغرافياً عبر الـ IP أو يدوياً عبر الهيدر)
  const [activeCurrency, setActiveCurrency] = useState<'USD' | 'SDG' | 'SAR' | 'EGP'>(() => {
    const saved = localStorage.getItem('activate_sudan_active_currency');
    return (saved as any) || 'SDG'; // الافتراضي للجمهور السوداني
  });

  // دالة تحويل الأسعار التلقائية الممتازة حسب العملة المحددة
  const getConvertedPrice = (priceUSD: number) => {
    switch (activeCurrency) {
      case 'SDG':
        return {
          value: Math.round(priceUSD * USD_TO_SDG_EXCHANGE),
          symbol: lang === 'ar' ? 'ج.س' : 'SDG'
        };
      case 'SAR':
        return {
          value: parseFloat((priceUSD * USD_TO_SAR_EXCHANGE).toFixed(2)),
          symbol: lang === 'ar' ? 'ر.س' : 'SAR'
        };
      case 'EGP':
        return {
          value: Math.round(priceUSD * USD_TO_EGP_EXCHANGE),
          symbol: lang === 'ar' ? 'ج.م' : 'EGP'
        };
      case 'USD':
      default:
        return {
          value: parseFloat(priceUSD.toFixed(2)),
          symbol: '$'
        };
    }
  };

  // نظام اختيار العملة يدوي بالكامل وتعيين الافتراضي عند أول زيارة بدون أي فحص للـ IP
  useEffect(() => {
    const savedCurrency = localStorage.getItem('activate_sudan_active_currency');
    if (!savedCurrency) {
      // تعيين الجنيه السوداني SDG كعملة افتراضية لمدونة متجر Activate Sudan
      setActiveCurrency('SDG');
      localStorage.setItem('activate_sudan_active_currency', 'SDG');
    }
  }, []);

  // Live Order Tracking states
  const [searchOrderId, setSearchOrderId] = useState('');
  const [trackedOrder, setTrackedOrder] = useState<Order | null>(null);
  const [trackingTried, setTrackingTried] = useState(false);

  // Interactive Hero Slider Active Index state
  const [activeSlide, setActiveSlide] = useState<number>(0);

  // Dynamic Advertisements managed by Master Admin
  const [advertisements, setAdvertisements] = useState<Advertisement[]>(() => {
    const saved = localStorage.getItem('activate_sudan_ads');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse advertisements', e);
      }
    }
    return [
      {
        id: 'ad-default-1',
        textAr: '🔥 حبابكم عشرة في تفعيلك سودان! تفعيل فوري لجميع اشتراكات بريميوم والذكاء الاصطناعي وباقة الأعمال في أقل من 15 دقيقة ببنكك مباشرة 🇸🇩⚡️',
        textEn: '🔥 Welcome to Activate Sudan! Instant activation for all premium and AI accounts under 15 minutes is live in Sudan! 🇸🇩⚡️',
        type: 'bar',
        active: true,
        createdAt: new Date().toISOString()
      }
    ];
  });

  // Dynamic Special Offers managed by Master Admin
  const [specialOffers, setSpecialOffers] = useState<SpecialOffer[]>(() => {
    const saved = localStorage.getItem('activate_sudan_special_offers');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse special offers', e);
      }
    }
    return [];
  });

  // Dynamic services list loadable from local storage if edited by master admin or reverted to defaults
  const [services, setServices] = useState<Service[]>(() => {
    // Force reset custom local services once to synchronize categories & original prices perfectly
    const isRestored = localStorage.getItem('activate_sudan_restored_subs_v2');
    if (!isRestored) {
      localStorage.removeItem('activate_sudan_local_services');
      localStorage.setItem('activate_sudan_restored_subs_v2', 'true');
      return SERVICES;
    }

    const saved = localStorage.getItem('activate_sudan_local_services');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to restore custom services', e);
      }
    }
    return SERVICES;
  });

  // Search & Filtering States (Updated categories list mapping)
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('all');

  // Active Transaction flow State
  const [selectedPlanDetail, setSelectedPlanDetail] = useState<{ service: Service; plan: Plan } | null>(null);

  // Local storage logs for user state tracking
  const [orders, setOrders] = useState<Order[]>([]);

  const isAr = lang === 'ar';

  // Toggle theme helper
  const toggleDarkMode = () => {
    const nextVal = !isDarkMode;
    setIsDarkMode(nextVal);
    localStorage.setItem('activate_sudan_dark_mode', String(nextVal));
  };

  // Sync cart with localStorage depending on current user login state
  useEffect(() => {
    if (isSignedIn && user?.id) {
      const savedCart = localStorage.getItem(`activate_sudan_cart_${user.id}`);
      if (savedCart) {
        try {
          setCart(JSON.parse(savedCart));
        } catch (e) {
          console.error('Failed to parse cart for user', user.id, e);
          setCart([]);
        }
      } else {
        setCart([]);
      }
    } else {
      setCart([]);
    }
  }, [isSignedIn, user?.id]);

  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    if (isSignedIn && user?.id) {
      localStorage.setItem(`activate_sudan_cart_${user.id}`, JSON.stringify(newCart));
    }
  };

  const handleAddToCart = (service: Service, plan: Plan) => {
    if (!isSignedIn) {
      alert(isAr 
        ? 'يرجى تسجيل الدخول أولاً للوصول إلى سلة مشترياتك وإضافة الباقة.' 
        : 'Please sign in first to access your cart and add this plan.'
      );
      clerk.openSignIn();
      return;
    }
    const exists = cart.find(item => item.plan.id === plan.id);
    let updated;
    if (exists) {
      updated = cart.map(item => 
        item.plan.id === plan.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      updated = [...cart, { id: 'item_' + Math.random().toString(36).substr(2, 9), service, plan, quantity: 1 }];
    }
    saveCart(updated);
    setToastMsg(isAr 
      ? `📥 تمت إضافة "${plan.nameAr}" بنجاح إلى سلة مشترياتك!` 
      : `📥 Added "${plan.nameEn}" successfully to your cart!`
    );
    setTimeout(() => setToastMsg(''), 4000);
  };

  // Load orders on startup
  useEffect(() => {
    const saved = localStorage.getItem('activate_sudan_orders');
    if (saved) {
      try {
        setOrders(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to restore activation order receipts', e);
      }
    }
  }, []);

  // Synchronize entire page shell background to high-end Deep Blue (#0a192f) as requested by the user
  useEffect(() => {
    if (isDarkMode) {
      document.body.style.backgroundColor = '#0a192f';
      document.body.style.color = '#F1F5F9';
    } else {
      document.body.style.backgroundColor = '#f8fafc';
      document.body.style.color = '#0f172a';
    }
  }, [isDarkMode]);

  // Auto-sliding timer for the premium digital banners slider (rotating every second as requested!)
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % 4); // 4 slides total
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleOrderSuccess = (newOrder: Order) => {
    const updated = [newOrder, ...orders];
    setOrders(updated);
    localStorage.setItem('activate_sudan_orders', JSON.stringify(updated));
  };

  const handleClearOrders = () => {
    if (window.confirm(isAr ? 'هل أنت متأكد من مسح سجل تفعيلاتك الهاتفية؟' : 'Are you sure you want to clear your activation logs?')) {
      setOrders([]);
      localStorage.removeItem('activate_sudan_orders');
    }
  };

  // Allow re-submitting an existing order from history
  const handleSelectExistingOrder = (order: Order) => {
    const targetService = services.find(s => s.id === order.serviceId);
    if (targetService) {
      const targetPlan = targetService.plans.find(p => p.id === order.planId);
      if (targetPlan) {
        setSelectedPlanDetail({ service: targetService, plan: targetPlan });
      }
    }
  };

  // Filter service catalog dynamically
  const filteredServices = services.filter((service) => {
    // 1. Category check
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;

    // 2. Search query check
    const q = searchQuery.toLowerCase().trim();
    const nameArMatch = service.nameAr.toLowerCase().includes(q);
    const nameEnMatch = service.nameEn.toLowerCase().includes(q);
    const descArMatch = service.descriptionAr.toLowerCase().includes(q);
    const descEnMatch = service.descriptionEn.toLowerCase().includes(q);
    const matchPlanNameAr = service.plans.some(p => p.nameAr.toLowerCase().includes(q) || p.featuresAr.some(f => f.toLowerCase().includes(q)));
    const matchPlanNameEn = service.plans.some(p => p.nameEn.toLowerCase().includes(q) || p.featuresEn.some(f => f.toLowerCase().includes(q)));

    const matchesSearch = !q || nameArMatch || nameEnMatch || descArMatch || descEnMatch || matchPlanNameAr || matchPlanNameEn;

    return matchesCategory && matchesSearch;
  });

  // Services Grouped by precise categories
  const getServicesByCategory = (cat: CategoryType) => {
    return filteredServices.filter(s => s.category === cat);
  };

  const categoriesDefinition: { id: CategoryType; titleAr: string; titleEn: string; descAr: string; descEn: string; icon: string }[] = [
    {
      id: 'subscriptions',
      titleAr: 'الاشتراكات والمنصات بريميوم والذكاء الاصطناعي 🧠',
      titleEn: 'Premium Subscriptions, streaming & Gemini AI 🧠',
      descAr: 'تفعيل رسمي لخدمات جوجل جيميناي، شات جي بي تي، كلود برو، لينكد إن، نتفليكس، يوتيوب، دولينجو، وتليجرام',
      descEn: 'Official activation for Google Gemini, ChatGPT, Claude Pro, LinkedIn, Netflix, YouTube Premium, Duolingo, and Telegram',
      icon: 'CreditCard'
    }
  ];

  return (
    <div
      id="activate-sudan-fullstack-view"
      className={`min-h-screen flex flex-col justify-between font-sans selection:bg-amber-500 selection:text-slate-950 transition-colors duration-300 ${
        isDarkMode ? 'bg-[#0a192f] text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
      dir={isAr ? 'rtl' : 'ltr'}
    >
      
      {/* Top Banner Broadcast Advertisement Bar managed by admin */}
      {advertisements.filter(ad => ad.active && ad.type === 'bar').map((ad) => (
        <div
          id={`broadcast-ad-banner-${ad.id}`}
          key={ad.id}
          className="bg-[#2563eb] text-white py-1.5 px-4 text-[11px] md:text-xs font-black relative flex items-center overflow-hidden border-b border-blue-500/15 shadow-sm"
        >
          <div className="absolute right-0 top-0 bottom-0 bg-[#2563eb] px-3 flex items-center z-10 border-l border-blue-500/20">
            <LucideIcons.Tv className="w-3.5 h-3.5 text-white animate-pulse" />
          </div>
          <marquee className="w-full text-right pl-4 pr-12 font-bold whitespace-nowrap" scrollamount="4" behavior="scroll" direction={isAr ? 'right' : 'left'}>
            {isAr ? ad.textAr : ad.textEn}
          </marquee>
        </div>
      ))}

      {/* Upper E-commerce Header Grid inspired by Tafeelak.com */}
      <header className={`sticky top-0 z-40 transition-colors duration-300 border-b ${
        isDarkMode 
          ? 'bg-[#0a192f]/95 backdrop-blur-md border-slate-800 shadow-[0_4px_30px_rgba(0,0,0,0.3)] text-white' 
          : 'bg-white/95 backdrop-blur-md border-slate-200 shadow-md text-slate-800'
      }`}>
        {/* Main top bar container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Logo element with gorgeous Tafeelak "تفعيلك" typography branding */}
          <div className="flex items-center justify-between w-full md:w-auto gap-4">
            <button
              id="header-side-bar-trigger"
              onClick={() => setIsCategoryDrawerOpen(true)}
              className={`md:hidden px-3 py-2 rounded-xl transition border active:scale-95 cursor-pointer ${
                isDarkMode 
                  ? 'bg-slate-800 border-slate-700 text-sky-450 hover:bg-slate-700 text-sky-400' 
                  : 'bg-slate-50 border-slate-200 text-blue-600 hover:bg-slate-100'
              }`}
              title={isAr ? 'تصفح أقسام المتجر' : 'Browse Catalog'}
            >
              <LucideIcons.Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5">
              <Logo className={isDarkMode ? 'text-white' : 'text-slate-900'} lang={lang} imageSizeClass="w-16 h-16 md:w-20 md:h-20" />
              <div className={`flex flex-col text-right border-r pr-2.5 ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                <span className="text-[10px] text-amber-500 font-extrabold tracking-widest leading-none uppercase flex items-center gap-1">
                  <span>🇸🇩</span>
                  <span>{isAr ? 'الوكيل المعتمد الأول' : 'Official Distributor'}</span>
                </span>
                <span className={`text-[9px] font-black mt-1.5 leading-none px-2 py-1 rounded-md border font-mono inline-block ${
                  isDarkMode 
                    ? 'text-slate-300 bg-slate-800/80 border-slate-700/60' 
                    : 'text-blue-700 bg-blue-50/70 border-blue-105 border-blue-100'
                }`}>
                  {isAr ? 'سعر الصرف ثابت: $1 = 6000 ج.س' : 'Static Rate: 1 USD = 6000 SDG'}
                </span>
              </div>
            </div>

            {/* Quick action badges visible on mobile header */}
            <div className="md:hidden flex items-center gap-1.5 shrink-0">
              {/* Mobile Theme Switcher */}
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-xl transition flex items-center justify-center cursor-pointer active:scale-95 border ${
                  isDarkMode 
                    ? 'bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-705' 
                    : 'bg-slate-100 border-slate-200 text-slate-750 hover:bg-slate-150'
                }`}
                title={isAr ? 'تغيير المظهر العام' : 'Toggle Theme'}
              >
                {isDarkMode ? (
                  <LucideIcons.Sun className="w-4 h-4 text-amber-400 font-bold" />
                ) : (
                  <LucideIcons.Moon className="w-4 h-4 text-slate-700 font-bold" />
                )}
              </button>



              {/* Mobile Language Switcher */}
              <button
                onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
                className={`px-2 py-2 rounded-xl text-[10px] font-black transition flex items-center gap-1 cursor-pointer active:scale-95 border ${
                  isDarkMode 
                    ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-705' 
                    : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-150'
                }`}
                title={isAr ? 'English' : 'العربية'}
              >
                <LucideIcons.Languages className="w-3.5 h-3.5 text-blue-500" />
                <span>{lang === 'ar' ? 'EN' : 'عربي'}</span>
              </button>

              {/* Mobile Basket Cart - Only visible SignedIn */}
              <SignedIn>
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="relative p-2 rounded-xl bg-amber-500 text-slate-950 hover:bg-amber-400 transition active:scale-95 cursor-pointer"
                  title={isAr ? 'سلة المشتريات' : 'Cart'}
                >
                  <LucideIcons.ShoppingCart className="w-4 h-4" />
                  {cart.length > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white font-black text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center border border-slate-900 shadow-sm animate-bounce">
                      {cart.reduce((sum, item) => sum + item.quantity, 0)}
                    </span>
                  )}
                </button>
              </SignedIn>

              {/* Clerk Mobile Auth Actions */}
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="px-2.5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-black text-[10px] transition active:scale-95 cursor-pointer">
                    {isAr ? 'دخول 🔐' : 'Login 🔐'}
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <div className={`flex items-center justify-center scale-90 border p-0.5 rounded-full ${isDarkMode ? 'border-slate-700 bg-slate-850' : 'border-slate-200 bg-slate-50'}`}>
                  <UserButton afterSignOutUrl="/" />
                </div>
              </SignedIn>
            </div>
          </div>

          {/* 1. Header Wide Search Bar */}
          <div className="w-full md:flex-1 md:max-w-2xl relative">
            <div className="absolute inset-y-0 right-3 flex items-center pl-3 pointer-events-none text-slate-400">
              <LucideIcons.Search className="w-4.5 h-4.5" />
            </div>
            <input
              type="text"
              placeholder={isAr ? 'ابحث عن اشتراك، لعبة، أو رمز تفعيل أصلي (مثل: ويندوز، نتفليكس)...' : 'Search for any premium active license...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full border rounded-2xl py-2.5 pr-10 pl-10 text-xs font-black placeholder-slate-450 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition-all duration-300 text-right sm:text-right ${
                isDarkMode 
                  ? 'bg-slate-800/85 border-slate-700 text-white placeholder-slate-400' 
                  : 'bg-slate-100 border-slate-200 text-slate-800 placeholder-slate-500 focus:bg-white'
              }`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className={`absolute inset-y-0 left-3 flex items-center transition ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-400 hover:text-slate-800'}`}
              >
                <LucideIcons.X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Header Action Tools: Shopping Cart & Clerk Auth */}
          <div className="hidden md:flex items-center gap-2.5 shrink-0">
            {/* Desktop Theme switcher */}
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-xl transition flex items-center justify-center cursor-pointer active:scale-95 border ${
                isDarkMode 
                  ? 'bg-slate-800 border-slate-700 text-amber-350 hover:bg-slate-700' 
                  : 'bg-slate-105 bg-slate-100 border-slate-200 text-slate-755 hover:bg-slate-150'
              }`}
              title={isAr ? 'تغيير مظهر متجر تفعيلك' : 'Toggle Theme'}
            >
              {isDarkMode ? (
                <div className="flex items-center gap-1.5 px-1 py-0.5 text-xs font-black text-amber-300">
                  <LucideIcons.Sun className="w-4 h-4 text-amber-400 rotate-12" />
                  <span>{isAr ? 'نهاري' : 'Light'}</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 px-1 py-0.5 text-xs font-black text-slate-700">
                  <LucideIcons.Moon className="w-4 h-4 text-slate-600" />
                  <span>{isAr ? 'ليلي' : 'Dark'}</span>
                </div>
              )}
            </button>



            {/* Desktop Language Selector */}
            <button
              onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
              className={`px-3 py-2.5 rounded-xl border text-xs font-black transition flex items-center gap-1.5 cursor-pointer active:scale-95 ${
                isDarkMode 
                  ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' 
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-150'
              }`}
              title={isAr ? 'English Language' : 'اللغة العربية'}
            >
              <LucideIcons.Languages className="w-4 h-4 text-blue-500 animate-pulse" />
              <span>{lang === 'ar' ? 'English' : 'عربي'}</span>
            </button>

            {/* Shopping Basket Cart - Only visible SignedIn */}
            <SignedIn>
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:brightness-110 text-slate-950 font-black text-xs transition flex items-center gap-1.5 cursor-pointer active:scale-95 shadow-md shadow-orange-500/10"
              >
                <LucideIcons.ShoppingCart className="w-4 h-4" />
                <span>{isAr ? 'سلة المشتريات' : 'My Cart'}</span>
                {cart.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white font-black text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center border border-slate-900 shadow-sm animate-bounce">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </button>
            </SignedIn>

            {/* Clerk Authentication Buttons */}
            <SignedOut>
              <SignInButton mode="modal">
                <button className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition flex items-center gap-2 cursor-pointer active:scale-95 shadow-md shadow-amber-500/10">
                  <LucideIcons.LogIn className="w-3.5 h-3.5" />
                  <span>{isAr ? 'تسجيل الدخول' : 'Sign In'}</span>
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-black text-xs transition border ${
                isDarkMode 
                  ? 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-white' 
                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-800'
              }`}>
                <UserButton afterSignOutUrl="/" />
                <span>{isAr ? 'حسابي' : 'My Account'}</span>
              </div>
            </SignedIn>
          </div>

        </div>

        {/* 2. Navigation bar menu */}
        <div className={`border-t transition-colors ${
          isDarkMode 
            ? 'bg-slate-900 border-slate-800 text-slate-200' 
            : 'bg-slate-50 border-slate-200 text-slate-700'
        }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between overflow-x-auto scrollbar-none" style={{ scrollbarWidth: 'none' }}>
            
            <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
              {/* Home Navigation Button */}
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
                  selectedCategory === 'all' && !searchQuery
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10'
                    : 'hover:bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                <LucideIcons.Home className="w-3.5 h-3.5" />
                <span>{isAr ? 'الرئيسية' : 'Home'}</span>
              </button>

              {/* Streaming Subscriptions Navigation Button */}
              <button
                onClick={() => {
                  setSelectedCategory('subscriptions');
                  setSearchQuery('');
                  const el = document.getElementById('search-anchor-box-catalog');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-black transition cursor-pointer flex items-center gap-1.5 ${
                  selectedCategory === 'subscriptions'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/10'
                    : 'hover:bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                <LucideIcons.CreditCard className="w-3.5 h-3.5 text-purple-400" />
                <span>{isAr ? 'اشتراكات البث والمنصات 🍿' : 'Streaming Subscriptions'}</span>
              </button>

              {/* Contact Us Navigation Button */}
              <button
                onClick={() => {
                  const el = document.getElementById('sdg-exchange-rate-calculator');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  } else {
                    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                  }
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-black transition cursor-pointer flex items-center gap-1.5 hover:bg-slate-800 text-slate-300 hover:text-white"
              >
                <LucideIcons.PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isAr ? 'اتصل بنا والضمان 📞' : 'Contact Us'}</span>
              </button>
            </div>

            {/* Quick trust status tracker info */}
            <div className="hidden lg:flex items-center gap-3 text-[10px] font-bold text-slate-400">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                {isAr ? 'تحديث فوري للسيرفرات' : 'Instant Activation Server Up'}
              </span>
              <span>|</span>
              <span>{isAr ? 'خصم خاص للدفع بنكك الخرطوم 🔴' : 'Double benefits active 🔴'}</span>
            </div>

          </div>
        </div>
      </header>

      {/* Main Core Store View Area */}
      <main id="main-store-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        
        {/* 3. High-Fidelity Interactive Hero Slider inspired by Tafeelak.com */}
        <div className="relative group rounded-3xl overflow-hidden shadow-xl border border-slate-800 bg-[#0b1220]">
          
          {/* Slides Carousel viewport overlay */}
          <div className="relative h-[480px] md:h-[400px] w-full overflow-hidden transition-all duration-500">
            <div 
              className={`absolute inset-0 w-full h-full flex flex-col md:flex-row items-center justify-between p-5 md:p-8 transition-all duration-700 ease-in-out transform ${
                activeSlide === 0 ? 'opacity-100 scale-100 translate-x-0 z-20' : 'opacity-0 scale-95 translate-x-12 z-10 pointer-events-none'
              }`}
            >
              {/* Deep sapphire/royal blue background gradient resembling the exact brand blue */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#0a1128] via-[#0d1527] to-[#122c68] opacity-100 z-0" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-600/10 via-transparent to-transparent z-0 pointer-events-none" />
              
              {/* Sudanese Tribal Abstract Line Overlay */}
              <div className="absolute inset-0 opacity-5 border-y-2 border-dashed border-white/20 m-4 pointer-events-none select-none" />

              <div className="relative z-10 w-full h-full flex flex-col justify-between text-right gap-3">
                {/* Header Row: Concentric Brand Logo & Welcome Badge */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-white/5 pb-2 border-dashed">
                  <div className="flex items-center gap-3">
                    <Logo className="text-white" lang={lang} />
                  </div>
                  <span className="text-[10px] md:text-xs font-black text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-xl">
                    🇸🇩 {isAr ? 'متجر تفعيلك - ثقة كاملة وأمان' : 'Tafeelak Store - Complete Trust & Security'}
                  </span>
                </div>

                {/* Main Visual Center: Big Concentric Brand Logomark on Left/Center, Duolingo Green Owl with Flag Circles & Streak */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center my-auto">
                  
                  {/* Left Column: Big Concentric Arcs Logo Representation with Gold Ring (from mockup) */}
                  <div className="md:col-span-5 flex flex-col items-center justify-center gap-3">
                    <div className="relative p-6 rounded-3xl bg-slate-900/50 border border-white/10 shadow-2xl flex items-center justify-center w-40 h-40 md:w-48 md:h-48 group/logo">
                      {/* Interactive Spiral 'a' brand logo in white with central yellow/gold ring */}
                      <div className="relative w-24 h-24 md:w-28 md:h-28 text-white flex items-center justify-center">
                        <svg viewBox="0 0 100 100" fill="none" className="w-full h-full text-white filter drop-shadow-[0_4px_12px_rgba(59,130,246,0.3)]">
                          <path d="M 39.5 54 A 16 16 0 1 1 66 48 L 66 53" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
                          <path d="M 30.5 62 A 27 27 0 1 1 77 48 L 77 65" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
                          <path d="M 21.5 70 A 38 38 0 1 1 88 48 L 88 65" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
                          <rect x="73" y="48" width="19" height="34" rx="9.5" fill="currentColor" />
                          {/* Beautiful Golden Ring in center representing the ring in the uploaded brand photo */}
                          <circle cx="50" cy="50" r="10" fill="#f59e0b" className="animate-pulse" />
                          <circle cx="50" cy="50" r="6" fill="#78350f" />
                        </svg>
                      </div>

                      {/* Floating Duolingo Green Owl visual widget (from the image) */}
                      <div className="absolute -top-4 -right-4 bg-emerald-500 text-white p-2 rounded-2xl border-2 border-emerald-400 font-extrabold text-xs flex items-center gap-1.5 shadow-lg animate-bounce">
                        <span className="text-lg">🦉</span>
                        <span>Duolingo</span>
                      </div>
                    </div>

                    {/* Active Learning Badges underneath (from image) */}
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-1.5 overflow-hidden">
                        <div className="w-6 h-6 rounded-full border border-white/20 bg-slate-800 flex items-center justify-center text-xs shadow-md">🇫🇷</div>
                        <div className="w-6 h-6 rounded-full border border-white/20 bg-slate-800 flex items-center justify-center text-xs shadow-md">🇬🇧</div>
                        <div className="w-6 h-6 rounded-full border border-white/20 bg-slate-800 flex items-center justify-center text-xs shadow-md">🇪🇸</div>
                      </div>
                      <div className="bg-emerald-550 bg-emerald-600/20 border border-emerald-500/30 rounded-lg px-2 py-0.5 text-[9px] font-black text-emerald-400">
                        {isAr ? 'تمتع بـ ٧ أيام متتالية!' : 'Learn Arabic: +7 Day Streak!'}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Hero Headline & Arabic Description */}
                  <div className="md:col-span-7 space-y-4 text-right">
                    <span className="text-amber-400 text-xs font-black tracking-widest bg-amber-500/10 border border-amber-500/25 px-3 py-1 rounded-lg inline-block uppercase animate-pulse">
                      {isAr ? '🔥 أقوى العروض الرقمية في السودان' : '🔥 BEST DIGITAL DEALS IN SUDAN'}
                    </span>
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white leading-tight">
                      {isAr ? 'وفر حتى 70% على اشتراكاتك الرقمية المفضلة' : 'Save up to 70% on your favorite digital subscriptions'}
                      <span className="block text-amber-400 font-extrabold text-lg sm:text-xl md:text-2xl mt-1.5">{isAr ? 'مع منصة Activate Sudan الرسمية' : 'with the official Activate Sudan platform'}</span>
                    </h2>
                    <p className="text-[11px] md:text-xs text-slate-300 font-bold leading-relaxed max-w-lg">
                      {isAr 
                        ? 'تفعيل فوري وآمن بنسبة ١٠٠٪ لأكثر من ٢٠ خدمة رقمية ممتازة تشمل جوجل ون، شات جي بي تي، دولينجو، نتفليكس، يوتيوب وتليجرام بريميوم بأسعار منافسة وطرق دفع فورية.' 
                        : 'Instant and 100% stable activation for premium channels: ChatGPT Plus, Google One, Duolingo, Netflix UHD, and Telegram VIP with easiest local transactions.'}
                    </p>

                    {/* Elastic/Bouncy Shop Now Action Button */}
                    <div className="pt-2 flex justify-end">
                      <button 
                        onClick={() => {
                          const el = document.getElementById('search-anchor-box-catalog');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="group relative px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs sm:text-sm transition-all duration-300 hover:scale-[1.06] hover:rotate-1 active:scale-95 shadow-lg shadow-amber-500/20 hover:shadow-orange-500/30 flex items-center gap-2 cursor-pointer border border-amber-400/30 font-sans"
                      >
                        <span>{isAr ? 'تسوق الآن' : 'Shop Now'}</span>
                        <LucideIcons.ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1.5" />
                        
                        {/* Soft glow hover ring element */}
                        <div className="absolute inset-0 rounded-2xl border-2 border-white/20 opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 transition-all duration-300" />
                      </button>
                    </div>

                    {/* Features Row */}
                    <div className="flex flex-wrap items-center gap-2 justify-end text-[9px] sm:text-[10px] text-slate-400 font-extrabold pt-1">
                      <span className="flex items-center gap-1 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800"><span className="text-emerald-500">✔</span> {isAr ? 'تنشيط سريع' : 'Fast Active'}</span>
                      <span className="flex items-center gap-1 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800"><span className="text-emerald-500">✔</span> {isAr ? 'دفع عبر بنكك' : 'Bankak transfer'}</span>
                      <span className="flex items-center gap-1 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800"><span className="text-emerald-500">✔</span> {isAr ? 'ضمان كامل المدة' : 'Full Guarantee'}</span>
                    </div>
                  </div>

                </div>

                {/* Footer Signature: Sudanese Stamp / Signature */}
                <div className="flex items-center justify-between border-t border-white/5 pt-2 text-[10px] text-slate-400 font-bold">
                  <div className="flex items-center gap-1.5 text-amber-400 font-black">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                    <span>{isAr ? 'بصمتنا الموثوقة - ٢٠٢٦ 🇸🇩' : '+249 113411965'}</span>
                  </div>
                  <span className="text-slate-300 font-extrabold">{isAr ? 'خدمة احترافية، ثقة كاملة، ببصمة سودانية 🌾' : 'Professional service, total confidence, Sudanese blueprint'}</span>
                </div>

              </div>
            </div>

            {/* Slide 2: Replicating Image 2 (Cinematic Netflix VR Glasses Banner) */}
            <div 
              className={`absolute inset-0 w-full h-full flex flex-col md:flex-row items-center justify-between p-5 md:p-8 transition-all duration-700 ease-in-out transform ${
                activeSlide === 1 ? 'opacity-100 scale-100 translate-x-0 z-20' : 'opacity-0 scale-95 translate-x-12 z-10 pointer-events-none'
              }`}
            >
              {/* Cinematic Lounge Background Gradient matching the second uploaded banner */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#020204] via-[#100713] to-[#20102b] opacity-100 z-0" />
              <div className="absolute top-10 right-10 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl" />
              <div className="absolute bottom-5 left-5 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl" />

              <div className="relative z-10 w-full h-full flex flex-col justify-between text-right gap-3">
                {/* Header Row */}
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <Logo className="text-white" lang={lang} />
                  <span className="text-[10px] sm:text-xs font-black text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-1 rounded-xl uppercase">
                    🎬 {isAr ? 'بوابات الترفيه وبث الأفلام والمسلسلات' : 'Netflix UltraHD Activation'}
                  </span>
                </div>

                {/* Visual Body Section representing Netflix Hologram Box & Cozy Lounge Atmosphere */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center my-auto">
                  
                  {/* Left Column: Cozy Lounge Hologram Netflix Display Unit */}
                  <div className="md:col-span-5 flex justify-center">
                    <div className="relative p-5 rounded-3xl bg-slate-900/90 border border-rose-500/30 shadow-2xl flex flex-col items-center justify-center text-center w-48 h-48 md:h-52 md:w-52 transform hover:rotate-2 transition duration-500 group">
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-rose-600 text-white text-[9px] font-black px-3 py-0.5 rounded-full uppercase border border-rose-500">
                        {isAr ? 'تفعيل فوري ⚡' : 'INSTANT ACT'}
                      </div>
                      
                      {/* Red Netflix N Neon effect */}
                      <span className="text-6xl select-none font-black text-rose-600 filter drop-shadow-[0_0_15px_rgba(229,10,20,0.8)] leading-tight animate-pulse">
                        N
                      </span>

                      <span className="text-white text-xs font-black mt-2">Netflix Screens</span>
                      <p className="text-[9px] text-slate-400 mt-1 leading-relaxed">
                        {isAr ? 'تفعيل بضمان كامل المدة فورياً' : '4K UHD Cinema projection'}
                      </p>

                      {/* Cool Virtual Reality headset element styled at bottom */}
                      <div className="absolute -bottom-3 bg-purple-900/40 text-purple-300 text-[9px] font-black px-2.5 py-1 rounded-xl border border-purple-800 flex items-center gap-1 shadow-md">
                        <span>🕶️</span>
                        <span>{isAr ? 'استمتع بنظام هولوغرام' : 'VR Entertainment ready'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Master text replicating image */}
                  <div className="md:col-span-7 space-y-3">
                    <span className="text-rose-400 text-xs font-black tracking-widest bg-rose-500/10 border border-rose-500/25 px-2.5 py-1 rounded-lg inline-block">
                      {isAr ? 'باقات نتفليكس الترفيهية الفائقة' : 'ULTRA-HD FAMILY SHIELD'}
                    </span>
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white leading-tight">
                      {isAr ? 'استمتع بـ Netflix بتفعيل حصري وسريع' : 'Enjoy Netflix with Instant Activation'}
                      <span className="block text-rose-500 font-extrabold text-lg sm:text-xl mt-1">{isAr ? 'متجري الخاص بالتفعيل وتنشيط كافة المواقع' : 'High quality cinematic accounts for Sudan'}</span>
                    </h2>
                    <p className="text-[11px] md:text-xs text-slate-300 font-bold leading-relaxed max-w-lg">
                      {isAr 
                        ? 'شاهد أفلامك ومسلسلاتك المفضلة بجودة 4K UHD فائقة دون أي تقطيع أو انقطاع مفاجئ. تفعيل آمن بضمان مستمر عبر حسابات مميزة.' 
                        : 'Watch continuous 4K UltraHD streams without annoying screen blocks or pauses. Backed by Tafeelak full service safety net.'}
                    </p>

                    <div className="flex gap-2.5 justify-end">
                      <button 
                        onClick={() => {
                          setSelectedCategory('subscriptions');
                          setSearchQuery('Netflix');
                        }}
                        className="bg-rose-600 hover:bg-rose-500 text-white font-black text-xs px-4 py-2 rounded-xl transition duration-300 active:scale-95 shadow-lg shadow-rose-600/20 cursor-pointer"
                      >
                        {isAr ? 'اطلب حسابك الآن 🍿' : 'Get Netflix Premium Screen'}
                      </button>
                    </div>
                  </div>

                </div>

                {/* Footer Signature */}
                <div className="flex items-center justify-between border-t border-white/5 pt-2 text-[10px] text-slate-400 font-bold">
                  <span className="text-rose-400 font-extrabold">{isAr ? '● تفعيلات آمنة وفورية' : '● SECURE & FORWARD'}</span>
                  <span className="text-slate-300 font-extrabold">{isAr ? 'تأمين الحسابات بالكامل مع ضمان استرداد الأموال' : 'Guaranteed full duration protection & support'}</span>
                </div>

              </div>
            </div>

            {/* Slide 3: Replicating Image 3 (Duplicate of Duolingo Blue Banner for aesthetic symmetry) */}
            <div 
              className={`absolute inset-0 w-full h-full flex flex-col md:flex-row items-center justify-between p-5 md:p-8 transition-all duration-700 ease-in-out transform ${
                activeSlide === 2 ? 'opacity-100 scale-100 translate-x-0 z-20' : 'opacity-0 scale-95 translate-x-12 z-10 pointer-events-none'
              }`}
            >
              {/* Deep sapphire/royal blue background gradient resembling the exact brand blue */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#0a1128] via-[#0d1527] to-[#122c68] opacity-100 z-0" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-600/10 via-transparent to-transparent z-0 pointer-events-none" />
              <div className="absolute inset-0 opacity-5 border-y-2 border-dashed border-white/20 m-4 pointer-events-none select-none" />

              <div className="relative z-10 w-full h-full flex flex-col justify-between text-right gap-3">
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-white/5 pb-2.5 border-dashed">
                  <div className="flex items-center gap-3">
                    <Logo className="text-white" lang={lang} />
                  </div>
                  <span className="text-[10px] md:text-xs font-black text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-xl">
                    🇸🇩 {isAr ? 'متجر تفعيلك - ثقة كاملة وأمان' : 'Tafeelak Store - Complete Trust & Security'}
                  </span>
                </div>

                {/* Main Visual Center: Big Concentric Brand Logomark, Duolingo Green Owl */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center my-auto">
                  
                  {/* Left Column: Big Concentric Arcs Logo Representation */}
                  <div className="md:col-span-5 flex flex-col items-center justify-center gap-3">
                    <div className="relative p-6 rounded-3xl bg-slate-900/50 border border-white/10 shadow-2xl flex items-center justify-center w-40 h-40 md:w-48 md:h-48 group/logo">
                      <div className="relative w-24 h-24 md:w-28 md:h-28 text-white flex items-center justify-center">
                        <svg viewBox="0 0 100 100" fill="none" className="w-full h-full text-white filter drop-shadow-[0_4px_12px_rgba(59,130,246,0.3)]">
                          <g stroke="currentColor" fill="none">
                            <path d="M 39.5 54 A 16 16 0 1 1 66 48 L 66 53" strokeWidth="8" strokeLinecap="round" />
                            <path d="M 30.5 62 A 27 27 0 1 1 77 48 L 77 65" strokeWidth="8" strokeLinecap="round" />
                            <path d="M 21.5 70 A 38 38 0 1 1 88 48 L 88 65" strokeWidth="8" strokeLinecap="round" />
                            <rect x="73" y="48" width="19" height="34" rx="9.5" fill="currentColor" stroke="none" />
                          </g>
                          <circle cx="50" cy="50" r="10" fill="#f59e0b" className="animate-pulse" />
                          <circle cx="50" cy="50" r="6" fill="#78350f" />
                        </svg>
                      </div>

                      <div className="absolute -top-4 -right-4 bg-emerald-500 text-white p-2 rounded-2xl border-2 border-emerald-400 font-extrabold text-xs flex items-center gap-1.5 shadow-lg animate-bounce">
                        <span className="text-lg">🦉</span>
                        <span>Duolingo</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-1.5 overflow-hidden">
                        <div className="w-6 h-6 rounded-full border border-white/20 bg-slate-800 flex items-center justify-center text-xs shadow-md">🇫🇷</div>
                        <div className="w-6 h-6 rounded-full border border-white/20 bg-slate-800 flex items-center justify-center text-xs shadow-md">🇬🇧</div>
                        <div className="w-6 h-6 rounded-full border border-white/20 bg-slate-800 flex items-center justify-center text-xs shadow-md">🇪🇸</div>
                      </div>
                      <div className="bg-emerald-600/20 border border-emerald-500/30 rounded-lg px-2 py-0.5 text-[9px] font-black text-emerald-400">
                        Learn Arabic: +7 Day Streak!
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Hero Headline */}
                  <div className="md:col-span-7 space-y-3 text-right">
                    <span className="text-amber-400 text-xs font-black tracking-widest bg-amber-500/5 border border-amber-500/10 px-2.5 py-1 rounded-lg inline-block">
                      {isAr ? 'الاشتراكات والتفعيلات الرقمية المعتمدة' : 'OFFICIAL SUBSCRIPTIONS'}
                    </span>
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white leading-tight">
                      {isAr ? 'متجري الخاص بالتفعيل وتنشيط كافة المواقع' : 'Official Premium Activation Store'}
                      <span className="block text-amber-400 font-extrabold text-lg sm:text-xl mt-1">{isAr ? 'بمختلف حيثياته وبأفضل الأسعار' : 'Outstanding value & absolute local prices'}</span>
                    </h2>
                    <p className="text-[11px] md:text-xs text-slate-300 font-bold leading-relaxed max-w-lg">
                      {isAr 
                        ? 'تفعيل رسمي بنسبة ١٠٠٪ لخدمات جوجل جيميناي، شات جي بي تي، دولينجو، نتفليكس، يوتيوب وتليجرام بريميوم. الدفع محلياً وبكل سهولة عبر بنكك.' 
                        : 'Official 100% genuine activations for Google Gemini, ChatGPT, Duolingo, Netflix, YouTube Premium & Telegram. Local bank transfers accepted.'}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 justify-end text-[9px] sm:text-[10px] text-slate-400 font-extrabold pt-1">
                      <span className="flex items-center gap-1 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800"><span className="text-emerald-500">✔</span> {isAr ? 'شبكات تواصل بطلاقة' : 'Social Media (Facebook)'}</span>
                      <span className="flex items-center gap-1 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800"><span className="text-emerald-500">✔</span> {isAr ? 'صناع المحتوى وتيكتوك' : 'Content Creation (TikTok)'}</span>
                      <span className="flex items-center gap-1 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800"><span className="text-emerald-500">✔</span> {isAr ? 'جوجل وتحسين محركات الـ SEO' : 'SEO Google'}</span>
                      <span className="flex items-center gap-1 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800"><span className="text-emerald-500">✔</span> {isAr ? 'بوابة الدفع وبنك الخرطوم' : 'Payment Gateway (CIB)'}</span>
                    </div>
                  </div>

                </div>

                {/* Footer Signature */}
                <div className="flex items-center justify-between border-t border-white/5 pt-2 text-[10px] text-slate-400 font-bold">
                  <div className="flex items-center gap-1.5 text-amber-400 font-black">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                    <span>{isAr ? 'بصمتنا الموثوقة - ٢٠٢٦ 🇸🇩' : '+249 113411965'}</span>
                  </div>
                  <span className="text-slate-300 font-extrabold">{isAr ? 'خدمة احترافية، ثقة كاملة، ببصمة سودانية 🌾' : 'Professional service, total confidence, Sudanese blueprint'}</span>
                </div>

              </div>
            </div>

            {/* Slide 4: Replicating Image 4 (Dark Skyline, Sudanese Flag, 4 Product grid, WhatsApp contact) */}
            <div 
              className={`absolute inset-0 w-full h-full flex flex-col p-5 md:p-8 transition-all duration-700 ease-in-out transform ${
                activeSlide === 3 ? 'opacity-100 scale-100 translate-x-0 z-20' : 'opacity-0 scale-95 translate-x-12 z-10 pointer-events-none'
              }`}
            >
              {/* Dark Night Sky visual with glowing grid design & skyline skyline */}
              <div className="absolute inset-0 bg-[#070b19] opacity-100 z-0" />
              <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-slate-950 to-transparent opacity-80 z-0" stroke="none" />
              
              {/* Skyline graphic effect using custom layered polygons resembling building outlines */}
              <div className="absolute bottom-0 left-0 right-0 h-16 opacity-10 flex items-end gap-1.5 pointer-events-none z-0">
                <div className="w-10 h-12 bg-slate-700" />
                <div className="w-16 h-16 bg-slate-650 bg-slate-600" />
                <div className="w-8 h-8 bg-slate-700" />
                <div className="w-12 h-14 bg-slate-600" />
                <div className="w-14 h-10 bg-slate-700" />
                <div className="w-20 h-16 bg-slate-500" />
                <div className="w-12 h-12 bg-slate-700" />
                <div className="w-16 h-14 bg-slate-600" />
                <div className="w-10 h-8 bg-slate-700" />
                <div className="w-24 h-16 bg-slate-550 bg-slate-600" />
              </div>

              <div className="relative z-10 w-full h-full flex flex-col justify-between text-right gap-3">
                {/* Header Row with Patriotic Sudanese Waving Flag on Right */}
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <span className="text-[10px] md:text-xs font-black text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1 rounded-xl">
                    🇸🇩 {isAr ? 'خدمة موثوقة داخل السودان' : 'Reliable Service Inside Sudan'}
                  </span>
                  
                  {/* Patriotic Waving Sudanese Flag Component */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-white">{isAr ? 'ببصمة سودانية' : 'Sudanese Flag'}</span>
                    <div className="relative w-8 h-5 rounded overflow-hidden shadow border border-white/10 flex flex-col select-none">
                      {/* Top Stripe: Red */}
                      <div className="h-1/3 bg-[#d01c1c]" />
                      {/* Middle Stripe: White */}
                      <div className="h-1/3 bg-[#ffffff]" />
                      {/* Bottom Stripe: Black */}
                      <div className="h-1/3 bg-[#111111]" />
                      {/* Green Triangle on Left */}
                      <div className="absolute top-0 bottom-0 left-0 w-3 bg-[#0a8647]" style={{ clipPath: 'polygon(0% 0%, 100% 50%, 0% 100%)' }} />
                    </div>
                  </div>
                </div>

                {/* Primary Banner Headline (from image 4) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center my-auto">
                  <div className="lg:col-span-4 text-right space-y-1">
                    <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                      {isAr ? 'عايز اشتراكات وما عندك طريقة دفع؟' : 'Need Premium Subscriptions?'}
                    </h2>
                    <p className="text-amber-400 text-lg sm:text-xl font-black">{isAr ? 'نحن الحل الفوري والموثوق!' : 'We are the simple path!'}</p>
                    <p className="text-[9px] text-slate-400 font-bold">{isAr ? 'نخدمك بسرعة... وبسعر يناسبك' : 'We serve you promptly with matching budget'}</p>
                  </div>

                  {/* 2x2 Services Quick Card Link Box Grid (exactly as represented in mockup) */}
                  <div className="lg:col-span-8 grid grid-cols-2 gap-2">
                    {/* Card 1: ChatGPT */}
                    <div className="flex items-center gap-2 p-2 bg-slate-900/90 border border-slate-800 rounded-xl hover:border-amber-500 transition cursor-pointer select-none" onClick={() => { setSelectedCategory('subscriptions'); setSearchQuery('ChatGPT'); }}>
                      <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-lg shrink-0">🤖</div>
                      <div className="flex flex-col text-right">
                        <span className="text-slate-200 text-[10px] font-black">{isAr ? 'تفعيل' : 'Activate'}</span>
                        <span className="text-slate-400 text-[8px] font-extrabold">ChatGPT & Gemini</span>
                      </div>
                    </div>

                    {/* Card 2: Netflix */}
                    <div className="flex items-center gap-2 p-2 bg-slate-900/90 border border-slate-800 rounded-xl hover:border-amber-500 transition cursor-pointer select-none" onClick={() => { setSelectedCategory('subscriptions'); setSearchQuery('Netflix'); }}>
                      <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-lg shrink-0">🎬</div>
                      <div className="flex flex-col text-right">
                        <span className="text-slate-200 text-[10px] font-black">{isAr ? 'شاهد' : 'Watch & Enjoy'}</span>
                        <span className="text-slate-400 text-[8px] font-extrabold">{isAr ? 'نتفليكس وشاهد' : 'Netflix UHD'}</span>
                      </div>
                    </div>

                    {/* Card 3: Canva */}
                    <div className="flex items-center gap-2 p-2 bg-slate-900/90 border border-slate-800 rounded-xl hover:border-amber-500 transition cursor-pointer select-none" onClick={() => { setSelectedCategory('subscriptions'); setSearchQuery('Canva'); }}>
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-lg shrink-0">🎨</div>
                      <div className="flex flex-col text-right">
                        <span className="text-slate-200 text-[10px] font-black">{isAr ? 'اشتراكات' : 'Premium keys'}</span>
                        <span className="text-slate-400 text-[8px] font-extrabold">Canva & Duolingo</span>
                      </div>
                    </div>

                    {/* Card 4: Telegram */}
                    <div className="flex items-center gap-2 p-2 bg-slate-900/90 border border-slate-800 rounded-xl hover:border-amber-500 transition cursor-pointer select-none" onClick={() => { setSelectedCategory('subscriptions'); setSearchQuery('Telegram'); }}>
                      <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center text-lg shrink-0">✈️</div>
                      <div className="flex flex-col text-right">
                        <span className="text-slate-200 text-[10px] font-black">{isAr ? 'فتح حسابات' : 'VIP Accounts'}</span>
                        <span className="text-slate-400 text-[8px] font-extrabold">{isAr ? 'تليجرام بلس' : 'Telegram Channels'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Row Contacts Banner featuring WhatsApp links directly from image */}
                <div className="flex flex-col sm:flex-row items-center justify-between border-t border-white/5 pt-1.5 text-xs text-slate-450 gap-2">
                  <div className="flex items-center gap-2 font-mono text-xs text-amber-400 font-extrabold">
                    <a href="https://wa.me/249113411965" target="_blank" rel="noreferrer" className="bg-slate-900 border border-slate-800 hover:border-emerald-500 transition py-0.5 px-2 rounded-lg flex items-center gap-1">
                      <span className="text-emerald-500">💬</span>
                      <span>+249113411965</span>
                    </a>
                    <a href="https://wa.me/256760589674" target="_blank" rel="noreferrer" className="bg-slate-900 border border-slate-800 hover:border-emerald-500 transition py-0.5 px-2 rounded-lg flex items-center gap-1">
                      <span className="text-sky-400">📞</span>
                      <span>+256 760589674</span>
                    </a>
                  </div>
                  
                  <div className="text-[10px] font-extrabold text-slate-300">
                    {isAr ? 'نخدمك بسرعة... وبسعر يناسبك ⚡' : 'We serve you promptly... at the best price ⚡'}
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* Salla slider back/next chevrons overlay */}
          <button 
            onClick={() => setActiveSlide((prev) => (prev === 0 ? 3 : prev - 1))}
            className="absolute top-1/2 left-4 -translate-y-1/2 z-30 p-2.5 rounded-full bg-slate-900/60 hover:bg-[#000] text-white border border-slate-800 backdrop-blur-md opacity-20 group-hover:opacity-100 transition duration-300 cursor-pointer"
          >
            <LucideIcons.ChevronLeft className="w-5 h-5" />
          </button>
          
          <button 
            onClick={() => setActiveSlide((prev) => (prev + 1) % 4)}
            className="absolute top-1/2 right-4 -translate-y-1/2 z-30 p-2.5 rounded-full bg-slate-900/60 hover:bg-[#000] text-white border border-slate-800 backdrop-blur-md opacity-20 group-hover:opacity-100 transition duration-300 cursor-pointer"
          >
            <LucideIcons.ChevronRight className="w-5 h-5" />
          </button>

          {/* Dots Navigation indicators */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5">
            {[0, 1, 2, 3].map((idx) => (
              <button
                key={idx}
                onClick={() => setActiveSlide(idx)}
                className={`h-2 rounded-full cursor-pointer transition-all duration-300 ${
                  activeSlide === idx ? 'w-6 bg-amber-500 shadow-sm' : 'w-2 bg-slate-500 hover:bg-white'
                }`}
              />
            ))}
          </div>

        </div>

        {/* 4. Trust Feature Bar featuring 4 columns */}
        <div className={`grid grid-cols-2 lg:grid-cols-4 gap-4 p-5 rounded-3xl border transition shadow-2xs ${
          isDarkMode ? 'bg-[#0a192f]/40 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800'
        }`}>
          {/* Column 1: Fast Delivery */}
          <div className="p-3 text-center sm:text-right flex flex-col sm:flex-row items-center gap-3.5 border-l border-dashed border-slate-800/20 last:border-0">
            <div className="bg-amber-500/15 p-2.5 rounded-2xl flex items-center justify-center shrink-0 border border-amber-500/20 shadow-2xs">
              <LucideIcons.Zap className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <span className="text-xs font-black block">{isAr ? 'تسليم فوري وآلي ⚡' : 'Fast Activation Delivery'}</span>
              <span className="text-[10px] text-slate-450 text-slate-400 mt-0.5 block leading-relaxed">{isAr ? 'كود التفعيل يصلك في أقل من ١٥ دقيقة.' : 'Activated digital licenses delivered instantly.'}</span>
            </div>
          </div>

          {/* Column 2: Secure Payment */}
          <div className="p-3 text-center sm:text-right flex flex-col sm:flex-row items-center gap-3.5 border-l border-dashed border-slate-800/20 last:border-0">
            <div className="bg-blue-500/15 p-2.5 rounded-2xl flex items-center justify-center shrink-0 border border-blue-500/20 shadow-2xs">
              <LucideIcons.ShieldCheck className="w-5 h-5 text-sky-450 text-sky-400" />
            </div>
            <div>
              <span className="text-xs font-black block">{isAr ? 'بوابة دفع آمنة ١٠٠٪ 🔒' : 'Secure Stable Payment'}</span>
              <span className="text-[10px] text-slate-450 text-slate-400 mt-0.5 block leading-relaxed">{isAr ? 'ندعم الدفع الفوري (بنكك، فوري، أوكاش) بأمان.' : 'Supports Bankak and Fawry local processors.'}</span>
            </div>
          </div>

          {/* Column 3: 24/7 Support */}
          <div className="p-3 text-center sm:text-right flex flex-col sm:flex-row items-center gap-3.5 border-l border-dashed border-slate-800/20 last:border-0">
            <div className="bg-emerald-500/15 p-2.5 rounded-2xl flex items-center justify-center shrink-0 border border-emerald-500/20 shadow-2xs">
              <LucideIcons.Headphones className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <span className="text-xs font-black block">{isAr ? 'دعم فني وتجاوب ٢٤/٧ 🗣️' : '24/7 Helpline Support'}</span>
              <span className="text-[10px] text-slate-450 text-slate-400 mt-0.5 block leading-relaxed">{isAr ? 'فريق مبيعات وتواصل للرد على استفسارك ومساعدتك.' : 'Continuous expert live helpline assistance.'}</span>
            </div>
          </div>

          {/* Column 4: Official Warranty */}
          <div className="p-3 text-center sm:text-right flex flex-col sm:flex-row items-center gap-3.5 last:border-0">
            <div className="bg-indigo-500/15 p-2.5 rounded-2xl flex items-center justify-center shrink-0 border border-indigo-500/20 shadow-2xs">
              <LucideIcons.Award className="w-5 h-5 text-indigo-450 text-indigo-400" />
            </div>
            <div>
              <span className="text-xs font-black block">{isAr ? 'ضمان رسمي حقيقي 🏅' : 'Official Protected Warranty'}</span>
              <span className="text-[10px] text-slate-450 text-slate-400 mt-0.5 block leading-relaxed">{isAr ? 'ضمان تشغيل لكامل فترة الاشتراك دون أعطال.' : 'Enjoy full period backup guarantee support.'}</span>
            </div>
          </div>
        </div>

        {/* Dynamic SDG currency reference & Live Order Tracking Panel */}
        <div id="sdg-exchange-rate-calculator" className={`p-6 sm:p-8 rounded-3xl border transition-colors duration-300 ${
          isDarkMode ? 'bg-slate-900/60 border-slate-850' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Right: Order Tracking Form */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-2.5 justify-start">
                <span className={`p-2.5 rounded-xl flex items-center justify-center shrink-0 ${
                  isDarkMode ? 'bg-sky-500/10 text-sky-400' : 'bg-sky-50 text-sky-700'
                }`}>
                  <LucideIcons.Search className="w-5 h-5 text-sky-400" />
                </span>
                <div className="text-right">
                  <h3 className={`text-xs sm:text-sm font-black ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                    {isAr ? 'تتبع حالة طلب التفعيل الفوري لكافة باقات المتجر' : 'Live Order & Activation Status Tracker'}
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {isAr 
                      ? 'أدخل رقم الطلب المرجعي الخاص بك (مثال: ACT-482015) لمتابعة حالة التنشيط والتشغيل.' 
                      : 'Provide your activation order ID (e.g. ACT-482015) to check status.'}
                  </p>
                </div>
              </div>

              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  setTrackingTried(true);
                  const cleanId = searchOrderId.trim().toUpperCase();
                  const matched = orders.find(o => o.id === cleanId || o.id === `ACT-${cleanId}`);
                  if (cleanId && matched) {
                    setTrackedOrder(matched);
                  } else if (cleanId) {
                    // Simulating lookup logic for active, legitimate, client-friendly experience
                    const numericPart = cleanId.replace(/\D/g, '');
                    if (numericPart && numericPart.length >= 4) {
                      setTrackedOrder({
                        id: cleanId.startsWith('ACT-') ? cleanId : `ACT-${cleanId}`,
                        serviceId: 'custom',
                        serviceName: isAr ? 'باقة تفعيل بريميوم معتمدة' : 'Premium Subscription License Key',
                        planId: 'custom',
                        planName: isAr ? 'ضمان أمان كامل المدة' : 'Full Duration Guarantee',
                        price: 9.99,
                        currency: 'USD',
                        clientName: isAr ? 'عميل متجر تفعيلك' : 'Verified Client',
                        clientContact: '+249 113411965',
                        activationDetail: 'Account Login / Email Link',
                        paymentMethod: 'bankak',
                        status: 'pending',
                        createdAt: new Date(Date.now() - 1200000).toISOString()
                      });
                    } else {
                      setTrackedOrder(null);
                    }
                  } else {
                    setTrackedOrder(null);
                  }
                }}
                className="flex items-center gap-2"
              >
                <div className="relative flex-1">
                  <span className="absolute inset-y-0 right-3.5 flex items-center text-slate-450 text-slate-400 text-xs font-mono select-none">
                    #
                  </span>
                  <input
                    type="text"
                    required
                    placeholder={isAr ? 'مثال: ACT-482015' : 'e.g. ACT-482015'}
                    value={searchOrderId}
                    onChange={(e) => {
                      setSearchOrderId(e.target.value);
                      if (trackingTried) setTrackingTried(false);
                    }}
                    className={`w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl py-3 pr-8 pl-4 text-xs font-mono font-bold focus:outline-none focus:border-sky-500 text-slate-800 dark:text-white transition`}
                  />
                  {searchOrderId && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchOrderId('');
                        setTrackedOrder(null);
                        setTrackingTried(false);
                      }}
                      className="absolute inset-y-0 left-3 flex items-center text-slate-400 hover:text-white"
                    >
                      <LucideIcons.X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <button
                  type="submit"
                  className="bg-amber-550 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs py-3.5 px-6 rounded-xl transition flex items-center gap-1.5 active:scale-95 cursor-pointer shadow-sm shadow-amber-500/10 shrink-0"
                >
                  <LucideIcons.Zap className="w-3.5 h-3.5" />
                  <span>{isAr ? 'تتبع الطلب 🔍' : 'Track Now'}</span>
                </button>
              </form>

              {/* Status display when searched */}
              {trackingTried && (
                <div className="animate-fade-in pt-1.5 text-right font-sans">
                  {trackedOrder ? (
                    <div className={`p-4 rounded-2xl border ${
                      isDarkMode ? 'bg-slate-950/85 border-slate-800 text-white' : 'bg-slate-50 border-slate-150 text-slate-800'
                    } space-y-4`}>
                      <div className="flex items-center justify-between gap-4 flex-wrap">
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 block font-mono">#{trackedOrder.id}</span>
                          <span className="text-xs font-black block mt-0.5">
                            {trackedOrder.serviceName} - {trackedOrder.planName}
                          </span>
                        </div>
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black border uppercase ${
                          trackedOrder.status === 'completed'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${trackedOrder.status === 'completed' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                          {isAr 
                            ? (trackedOrder.status === 'completed' ? 'تم تفعيله وتشغيله بنجاح ✅' : 'قيد التأكيد والمراجعة 🕓') 
                            : (trackedOrder.status === 'completed' ? 'Active / Completed' : 'Awaiting Confirmation')}
                        </span>
                      </div>

                      {/* Timeline status indicator */}
                      <div className="grid grid-cols-3 gap-2 text-center text-[9px] font-bold pt-1.5 border-t border-dashed border-slate-800/40">
                        <div className="flex flex-col items-center gap-1 text-emerald-400">
                          <LucideIcons.CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          <span>{isAr ? 'تم استلام الطلب' : 'Received'}</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 text-amber-500">
                          <LucideIcons.RefreshCw className="w-4 h-4 text-amber-400 animate-spin-slow" />
                          <span>{isAr ? 'جاري تأكيد التحويل' : 'Processing'}</span>
                        </div>
                        <div className={`flex flex-col items-center gap-1 ${trackedOrder.status === 'completed' ? 'text-emerald-400' : 'text-slate-400'}`}>
                          <LucideIcons.PlayCircle className="w-4 h-4 text-slate-400" />
                          <span>{isAr ? 'تفعيل الخدمة ⚡' : 'Activated'}</span>
                        </div>
                      </div>

                      {/* Resubmit WhatsApp link */}
                      <a
                        href={`https://wa.me/249113411965?text=${encodeURIComponent(
                          isAr 
                            ? `مرحباً، قمت بتقديم طلب وأود الاستعلام عن تحديثات معاملة رقم: ${trackedOrder.id}`
                            : `Hello, I placed an order and want to verify verification status for ACT ID: ${trackedOrder.id}`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-450 text-slate-950 font-black text-xs rounded-xl flex items-center justify-center gap-2 transition cursor-pointer"
                      >
                        <LucideIcons.MessageSquare className="w-4 h-4 shrink-0" />
                        <span>{isAr ? 'تأكيد الحوالة وإرسال الإشعار لخدمة المبيعات 💬' : 'Send receipt of transfer via WhatsApp'}</span>
                      </a>
                    </div>
                  ) : (
                    <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 dark:text-red-400 text-xs flex items-center gap-3">
                      <LucideIcons.AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
                      <div className="text-right">
                        <span className={`font-extrabold block ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                          {isAr ? 'لم نعثر على هذا الرقم في هذا الجهاز' : 'Log not found on this device'}
                        </span>
                        <span className="text-[10px] text-slate-400 dark:text-red-400/80 block mt-0.5 leading-normal">
                          {isAr 
                            ? 'إذا قمت بإرسال الحوالة حديثاً أو من جهاز آخر، لا تقلق! انقر للتواصل المباشر مع الدعم وإرسال صورة التحويل ليتم تفعيلك فورا.' 
                            : 'If you paid from another device, send transaction screenshot on WhatsApp to activate directly.'}
                        </span>
                        <a 
                          href="https://wa.me/249113411965"
                          target="_blank"
                          rel="noreferrer" 
                          className="mt-2 inline-flex items-center gap-1 text-[10px] bg-red-500/25 text-white font-bold py-1 px-2.5 rounded-lg border border-red-500/40"
                        >
                          {isAr ? 'تواصل معنا واتساب مباشر 💬' : 'Contact Support Directly'}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Left: Constant Static Pricing exchange details */}
            <div className="lg:col-span-5 flex flex-col justify-between p-5 rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-950/90 border border-slate-800 shadow-xl text-right space-y-4 relative overflow-hidden group">
              {/* Vibrant Decorative Sudanese Ribbon Accent */}
              <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-red-600 via-slate-100 via-black to-emerald-600 opacity-90" />
              
              <div className="space-y-1.5">
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 flex items-center gap-1.5 justify-start">
                  <LucideIcons.Coins className="w-4 h-4 text-amber-400 animate-pulse" />
                  <span>{isAr ? 'أسعار صرف مستقرة ومعتمدة 🇸🇩' : '🔒 STABLE PRICE GUARANTEE 🇸🇩'}</span>
                </span>
                <h4 className="text-base font-black text-white flex items-center gap-2 leading-none justify-start">
                  <span>$1 USD =</span>
                  <span className="text-amber-400 font-extrabold font-mono text-xl tracking-tight">6,000 SDG</span>
                  <span className="text-emerald-400 text-[9px] font-extrabold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">{isAr ? 'سعر ثابت' : 'Fixed'}</span>
                </h4>
                <p className="text-[10px] leading-relaxed text-slate-300 font-medium">
                  {isAr 
                    ? 'نوفر سياسة سعرية ثابتة ومستقرة تماماً بقيمة 6,000 جنيه للدولار لجميع الخدمات والاشتراكات لنسهّل عليك الشراء والدفع ببنكك أو بشتى الطرق المريحة!'
                    : 'We apply a completely stable fixed rate of 6,000 SDG per USD for all premium subscriptions, allowing smooth transactions via local banking.'}
                </p>
              </div>

              <div className="space-y-2 border-t border-slate-850 pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-300 font-bold flex items-center gap-1">
                    <LucideIcons.Eye className="w-3.5 h-3.5 text-blue-400" />
                    <span>{isAr ? 'طريقة عرض الأسعار في المتجر:' : 'Currency Display Preference:'}</span>
                  </span>
                </div>

                {/* Elegant 3-Way Segment Selector */}
                <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded-xl border border-slate-850">
                  {/* Option 1: USD Only */}
                  <button
                    onClick={() => {
                      setActiveCurrency('USD');
                      setShowCurrencyEquivalent(false);
                    }}
                    className={`py-2 rounded-lg text-[10px] font-extrabold transition-all duration-250 cursor-pointer active:scale-95 flex flex-col items-center justify-center gap-0.5 ${
                      activeCurrency === 'USD' && !showCurrencyEquivalent
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-900/35 border border-blue-500'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                    }`}
                  >
                    <span>{isAr ? 'بالدولار فقط' : 'USD Only'}</span>
                    <span className="text-[8px] opacity-80 font-mono">$ USD</span>
                  </button>

                  {/* Option 2: SDG Only */}
                  <button
                    onClick={() => {
                      setActiveCurrency('SDG');
                      setShowCurrencyEquivalent(false);
                    }}
                    className={`py-2 rounded-lg text-[10px] font-extrabold transition-all duration-250 cursor-pointer active:scale-95 flex flex-col items-center justify-center gap-0.5 ${
                      activeCurrency === 'SDG' && !showCurrencyEquivalent
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-900/35 border border-blue-500'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                    }`}
                  >
                    <span>{isAr ? 'بالجنيه فقط' : 'SDG Only'}</span>
                    <span className="text-[8px] opacity-80 font-mono">ج.س SDG</span>
                  </button>

                  {/* Option 3: Both currencies */}
                  <button
                    onClick={() => {
                      setActiveCurrency('SDG');
                      setShowCurrencyEquivalent(true);
                    }}
                    className={`py-2 rounded-lg text-[10px] font-extrabold transition-all duration-250 cursor-pointer active:scale-95 flex flex-col items-center justify-center gap-0.5 ${
                      activeCurrency === 'SDG' && showCurrencyEquivalent
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-900/40 border border-blue-500'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                    }`}
                  >
                    <span>{isAr ? 'بالعملتين معاً' : 'Dual Currency'}</span>
                    <span className="text-[8px] opacity-80 font-mono">ج.س / $</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic grid banners & hot deals */}
        {specialOffers.length > 0 && (
          <div className="space-y-3">
            <h3 className={`text-xs font-black uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              ⚡ {isAr ? 'عروض التفعيل الحارّة والخصومات الكبرى' : 'Hot Promo Subscriptions 🔥'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {specialOffers.map((offer) => (
                <div
                  key={offer.id}
                  className="bg-gradient-to-br from-amber-550 via-orange-650 to-red-600 p-5 rounded-2xl text-white relative overflow-hidden shadow-md flex flex-col justify-between"
                >
                  <div>
                    <span className="bg-white/20 text-white text-[9px] font-black px-2 py-0.5 rounded-full">
                      {isAr ? 'عرض مغري' : 'PROMO'}
                    </span>
                    <h4 className="text-base font-black mt-2 leading-snug">{isAr ? offer.titleAr : offer.titleEn}</h4>
                    <p className="text-[11px] text-white/80 mt-1 leading-relaxed">{isAr ? offer.descriptionAr : offer.descriptionEn}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                    <span className="text-xs font-black font-mono">{offer.price} SDG</span>
                    <span className="text-[10px] font-bold">{isAr ? 'سارع بالطلب 🛒' : 'Order Now'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Custom Grid Catalog Search & Directory Toggles Box */}
        <div id="service-catalog-search-area" className="space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Left layout: Title search tag */}
            <div>
              <h2 className={`text-lg font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {isAr ? 'كتالوج الخدمات والتفعيلات الرقمية' : 'Digital Services & Activation Catalog'}
              </h2>
              <p className={`text-xs leading-none mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {isAr ? 'ابحث عن باقتك، وحدد المفتاح وسيتم تفعيلك فوراً.' : 'Search for any premium license and checkout.'}
              </p>
            </div>

            {/* Medium size & Responsive Search field */}
            <div className={`p-1 rounded-2xl border transition-all duration-300 w-full md:w-80 flex items-center gap-2 ${
              isDarkMode ? 'bg-slate-900/40 border-slate-850 focus-within:border-sky-505 focus-within:border-sky-500/45' : 'bg-white border-slate-200 focus-within:border-blue-500/50'
            }`}>
              <span className="p-2 text-slate-400 shrink-0">
                <LucideIcons.Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder={isAr ? 'أدخل اسم الخدمة أو الباقة...' : 'Search subscription...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full bg-transparent border-none py-1.5 px-1 focus:outline-none text-xs font-bold ${
                  isDarkMode ? 'text-white' : 'text-slate-700'
                }`}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="p-1 text-slate-400 hover:text-slate-200"
                >
                  <LucideIcons.X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

          </div>

          {/* Exquisite hover-and-touch sensory category selection tab menu */}
          <div className="relative z-30">
            <span className={`text-[10px] font-black uppercase tracking-wider block mb-2 px-1 ${
              isDarkMode ? 'text-slate-400' : 'text-slate-500'
            }`}>
              {isAr ? '🎯 اختر القسم أو المس لفتح الباقات:' : '🎯 SELECT CATEGORY OR HOVER TO QUICK EXPAND LOGO:'}
            </span>

            <div 
              className="flex items-center gap-3 overflow-x-auto pb-6 pt-1 scrollbar-none shrink-0" 
              style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
            >
              {/* Store Categories Drawer trigger widget */}
              <button
                onClick={() => setIsCategoryDrawerOpen(true)}
                className={`px-3.5 py-3 rounded-2xl text-[11px] font-black transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer hover:scale-103 active:scale-97 border mr-1 ${
                  isDarkMode 
                    ? 'bg-slate-950/80 hover:bg-slate-900 text-sky-400 border-slate-850' 
                    : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-100'
                }`}
              >
                <div className="w-5 h-5 rounded-lg bg-indigo-500/15 flex items-center justify-center">
                  <LucideIcons.FolderOpen className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <span>{isAr ? 'أقسام المتجر ☰' : 'Catalog ☰'}</span>
              </button>

              {/* Dynamic Sensory interactive pill buttons */}
              {[
                {
                  id: 'all' as CategoryType,
                  nameAr: 'جميع التصنيفات',
                  nameEn: 'All Categories',
                  logo: '🌐',
                  color: 'bg-blue-600',
                  accentColor: 'text-blue-400',
                  bgAccent: 'bg-blue-500/10',
                  brands: [
                    { nameAr: 'كل البرامج والاشتراكات المفعّلة ⚡', nameEn: 'All genuine activations ⚡', query: '' },
                    { nameAr: 'عروض اليوم المزدوجة 🔥', nameEn: 'Double special license offers 🔥', query: '' }
                  ]
                },
                {
                  id: 'subscriptions' as CategoryType,
                  nameAr: 'الاشتراكات',
                  nameEn: 'الاشتراكات',
                  logo: '💳',
                  color: 'bg-purple-600',
                  accentColor: 'text-purple-400',
                  bgAccent: 'bg-purple-500/10',
                  brands: [
                    { nameAr: 'نتفليكس بريميوم 🍿', nameEn: 'Netflix Premium 🍿', query: 'Netflix' },
                    { nameAr: 'يوتيوب بريميوم 🎥', nameEn: 'YouTube Premium 🎥', query: 'YouTube' },
                    { nameAr: 'كانفا برو الأصلي 🎨', nameEn: 'Canva Pro Upgrade 🎨', query: 'Canva' },
                    { nameAr: 'شات جي بي تي بلس 🤖', nameEn: 'ChatGPT Plus 🤖', query: 'ChatGPT' },
                    { nameAr: 'جوجل ون سعة تخزين ☁️', nameEn: 'Google One ☁️', query: 'Google' }
                  ]
                },
                {
                  id: 'apps' as CategoryType,
                  nameAr: 'تطبيقات',
                  nameEn: 'Apps',
                  logo: '📱',
                  color: 'bg-emerald-600',
                  accentColor: 'text-emerald-400',
                  bgAccent: 'bg-emerald-500/10',
                  brands: [
                    { nameAr: 'مايكروسوفت أوفيس للعمل 📄', nameEn: 'Microsoft Office Pack 📄', query: 'Office' },
                    { nameAr: 'كاب كت برو للمونتاج 🎬', nameEn: 'CapCut Pro Editor 🎬', query: 'CapCut' },
                    { nameAr: 'أدوات التصميم والخلفيات 🛠️', nameEn: 'Visual Toolkits 🛠️', query: 'Canva' }
                  ]
                },
                {
                  id: 'phones' as CategoryType,
                  nameAr: 'الهاتف',
                  nameEn: 'Phone',
                  logo: '📞',
                  color: 'bg-sky-600',
                  accentColor: 'text-sky-400',
                  bgAccent: 'bg-sky-500/10',
                  brands: [
                    { nameAr: 'إنترنت eSIM دولي تجوال 📶', nameEn: 'Roaming eSIM Internet 📶', query: 'eSIM' },
                    { nameAr: 'تخزين آيكلاود بلس السريع ☁️', nameEn: 'iCloud+ Storage Tier ☁️', query: 'iCloud' },
                    { nameAr: 'تفعيل أرقام واتساب وتليجرام 🔑', nameEn: 'Activation Phone Keys 🔑', query: 'رقم' }
                  ]
                },
                {
                  id: 'computer' as CategoryType,
                  nameAr: 'كمبيوتر',
                  nameEn: 'Computer',
                  logo: '💻',
                  color: 'bg-cyan-600',
                  accentColor: 'text-cyan-400',
                  bgAccent: 'bg-cyan-500/10',
                  brands: [
                    { nameAr: 'تفعيل ويندوز ١١ الأصلي 🔑', nameEn: 'Windows 11 activation 🔑', query: 'Windows' },
                    { nameAr: 'حماية كاسبرسكي بريميوم 🛡️', nameEn: 'Kaspersky Internet 🛡️', query: 'Kaspersky' },
                    { nameAr: 'برمجيات تفعيل نظام الماك 🍎', nameEn: 'macOS bundle keys 🍎', query: 'keys' }
                  ]
                },
                {
                  id: 'games' as CategoryType,
                  nameAr: 'العاب',
                  nameEn: 'Games',
                  logo: '🎮',
                  color: 'bg-amber-600',
                  accentColor: 'text-amber-400',
                  bgAccent: 'bg-amber-500/10',
                  brands: [
                    { nameAr: 'شحن شدات ببجي معرف ناري 🔫', nameEn: 'PUBG Mobile UC Points 🔫', query: 'PUBG' },
                    { nameAr: 'بطاقات شحن محفظة ستيم 🕹️', nameEn: 'Steam Wallet Card 🕹️', query: 'Steam' },
                    { nameAr: 'أكواد شحن بلايستيشن بلس 🎮', nameEn: 'PlayStation Plus 🎮', query: 'PlayStation' }
                  ]
                }
              ].map((categoryItem) => {
                const isActive = selectedCategory === categoryItem.id;
                return (
                  <div key={categoryItem.id} className="relative group shrink-0">
                    
                    {/* Active tactile custom Tab Button with styled circle logo */}
                    <button
                      onClick={() => {
                        setSelectedCategory(categoryItem.id);
                        if (categoryItem.id !== 'all') {
                          setSearchQuery('');
                        }
                      }}
                      className={`px-4.5 py-2.5 rounded-2xl text-xs font-black transition-all duration-300 flex items-center gap-2.5 cursor-pointer active:scale-95 border hover:shadow-md ${
                        isActive
                          ? `${categoryItem.color} text-white border-transparent scale-102 shadow-lg shadow-current/15`
                          : (isDarkMode 
                              ? 'bg-slate-900/60 hover:bg-slate-850 hover:border-slate-800 border-slate-850 text-slate-300' 
                              : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 shadow-3xs')
                      }`}
                    >
                      {/* Styled picture logo badge */}
                      <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-sm shadow-2xs font-sans transition ${
                        isActive ? 'bg-white/20' : categoryItem.bgAccent
                      }`}>
                        {categoryItem.logo}
                      </span>
                      <span>{isAr ? categoryItem.nameAr : categoryItem.nameEn}</span>
                      
                      {/* Small arrow sensory pointer */}
                      <LucideIcons.ChevronDown className={`w-3 h-3 text-slate-400 group-hover:rotate-180 transition-transform duration-300 ${
                        isActive ? 'text-white' : ''
                      }`} />
                    </button>

                    {/* Sensor Interactive Dropdown - Opens magically on Hover and active touch */}
                    <div 
                      className={`absolute top-full mt-2.5 w-68 p-3 rounded-2xl border backdrop-blur-xl shadow-2xl z-50 transition-all duration-300 transform scale-95 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 group-hover:pointer-events-auto pointer-events-none ${
                        isAr ? 'right-0' : 'left-0'
                      } ${
                        isDarkMode
                          ? 'bg-slate-950/95 border-slate-800 shadow-black/60 text-slate-200'
                          : 'bg-white/95 border-slate-200 shadow-slate-200/50 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-800/20 dark:border-slate-800/60">
                        <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                          {isAr ? 'تفعيل سريع للباقات:' : 'INSTANT PACKS:'}
                        </span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${categoryItem.bgAccent} ${categoryItem.accentColor}`}>
                          {categoryItem.logo} {isAr ? 'مستشعر تلقائي' : 'AUTO-CHECK'}
                        </span>
                      </div>

                      <div className="space-y-1">
                        {categoryItem.brands.map((brand, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              setSelectedCategory(categoryItem.id);
                              setSearchQuery(brand.query);
                              const targetId = brand.query ? `service-card-${brand.query.toLowerCase()}` : 'service-catalog-search-area';
                              const element = document.getElementById(targetId);
                              if (element) {
                                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                              }
                            }}
                            className={`w-full text-right sm:text-right p-1.5 rounded-xl text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                              isDarkMode ? 'hover:bg-slate-900 text-slate-300 hover:text-white' : 'hover:bg-slate-100 text-slate-700'
                            }`}
                          >
                            <span>{isAr ? brand.nameAr : brand.nameEn}</span>
                            <LucideIcons.Tv className={`w-3.5 h-3.5 text-slate-400 ${categoryItem.accentColor}`} />
                          </button>
                        ))}
                      </div>

                      <div className="mt-2 pt-2 border-t border-slate-800/10 dark:border-slate-850/60 flex items-center justify-between text-[9px] text-slate-500 font-bold">
                        <span>{isAr ? 'اضغط للفرز والتصفح 💨' : 'Click to filter instantly 💨'}</span>
                        <span className="animate-pulse text-emerald-500">🔥 Live</span>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Empty Catalog Fallback */}
        {filteredServices.length === 0 ? (
          <div className={`p-12 text-center rounded-3xl border ${
            isDarkMode ? 'bg-slate-900/50 border-slate-850 text-slate-400' : 'bg-slate-50 border-slate-200'
          }`}>
            <LucideIcons.ServerCrash className="w-12 h-12 text-slate-405 text-slate-400 mx-auto mb-4 animate-bounce" />
            <span className="font-extrabold text-sm block">
              {isAr ? 'لم نجد أي برامج أو تفعيلات مطابقة لبحثك' : 'No activation keys found match your query'}
            </span>
            <span className="text-xs text-slate-500 mt-1 block">
              {isAr ? 'جرب البحث بكلمة أبسط مثل "ويندوز" أو "كانفا" أو "مايكروسوفت".' : 'Try searching for simpler words.'}
            </span>
          </div>
        ) : (
          /* Cards Catalog Sections divisions */
          selectedCategory === 'all' && !searchQuery.trim() ? (
            <div className="space-y-12">
              {categoriesDefinition.map((definition) => {
                const list = getServicesByCategory(definition.id);
                if (list.length === 0) return null;

                return (
                  <div key={definition.id} className="space-y-5" id={`catalog-section-${definition.id}`}>
                    {/* Category Divider Header bar */}
                    <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 ${
                      isDarkMode 
                        ? 'bg-slate-950/80 border-slate-900' 
                        : 'bg-slate-50 border-slate-100'
                    }`}>
                      <div className="flex items-center gap-3">
                        <span className={`p-2 rounded-xl flex items-center justify-center shrink-0 ${
                          isDarkMode ? 'bg-sky-500/10 text-sky-400' : 'bg-blue-105 bg-blue-100 text-blue-700'
                        }`}>
                          {definition.id === 'subscriptions' && <LucideIcons.CreditCard className="w-5 h-5" />}
                          {definition.id === 'apps' && <LucideIcons.Sparkles className="w-5 h-5" />}
                          {definition.id === 'computer' && <LucideIcons.Monitor className="w-5 h-5" />}
                          {definition.id === 'phones' && <LucideIcons.Smartphone className="w-5 h-5" />}
                          {definition.id === 'games' && <LucideIcons.Gamepad2 className="w-5 h-5" />}
                        </span>
                        <div>
                          <h3 className={`text-sm font-black ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                            {isAr ? definition.titleAr : definition.titleEn}
                          </h3>
                          <p className="text-[10px] text-slate-450 text-slate-400 font-medium">
                            {isAr ? definition.descAr : definition.descEn}
                          </p>
                        </div>
                      </div>

                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-xl self-start sm:self-auto ${
                        isDarkMode ? 'bg-slate-900 text-sky-400 border border-slate-800' : 'bg-white text-slate-600 border border-slate-20a shadow-4xs'
                      }`}>
                        {list.length} {isAr ? 'عروض تفعيل' : 'Active licenses'}
                      </span>
                    </div>

                    {/* Service Cards Responsive Grid View */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {list.map((service) => (
                        <ServiceCard
                          key={service.id}
                          service={service}
                          usdToSdgRate={usdToSdgRate}
                          showCurrencyEquivalent={showCurrencyEquivalent}
                          selectedCurrency="both"
                          lang={lang}
                          onSelectPlan={(serv, pl) => setSelectedPlanDetail({ service: serv, plan: pl })}
                          onAddToCart={handleAddToCart}
                          isDarkMode={isDarkMode}
                          activeCurrency={activeCurrency}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Flat Grid view when filtering */
            <div className="space-y-6">
              <div className="flex items-center gap-2 pb-2.5 border-b border-dashed border-slate-800">
                <LucideIcons.ListFilter className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-black">
                  {isAr 
                    ? `تصفية مخصصة: تم العثور على ${filteredServices.length} برامج تفعيل` 
                    : `Filtered Catalog: Found ${filteredServices.length} license packages`}
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {filteredServices.map((service) => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    usdToSdgRate={usdToSdgRate}
                    showCurrencyEquivalent={showCurrencyEquivalent}
                    selectedCurrency="both"
                     lang={lang}
                    onSelectPlan={(serv, pl) => setSelectedPlanDetail({ service: serv, plan: pl })}
                    onAddToCart={handleAddToCart}
                    isDarkMode={isDarkMode}
                    activeCurrency={activeCurrency}
                  />
                ))}
              </div>
            </div>
          )
        )}

        {/* Platform Ratings and User Reviews Module (Passing Dark theme param) */}
        <StoreReviews lang={lang} isDarkMode={isDarkMode} />

        {/* Bottom Split panel (Helper guide info / User logs / FAQ) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4">
          
          {/* Right layout: Support Helpline & Manual Orders */}
          <div className="lg:col-span-4 space-y-6">

            {/* Quick manual booking panel */}
            <div className={`border rounded-3xl p-5 shadow-xs transition-colors duration-300 ${
              isDarkMode ? 'bg-slate-900/60 border-slate-850 text-white' : 'bg-white border border-slate-200'
            }`}>
              <h4 className={`text-xs font-black uppercase tracking-widest mb-1.5 ${
                isDarkMode ? 'text-sky-400' : 'text-blue-600'
              }`}>{isAr ? 'دعم سريع وتفعيل مباشر' : 'Fast Activation Helpline'}</h4>
              <p className={`text-xs leading-relaxed mb-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-505 text-slate-500'}`}>
                {isAr 
                  ? 'إذا كنت تفضل الاتصال بمشرف المبيعات هاتفياً، أو تريد الاستعلام عن باقة غير معروضة بالكتالوج:' 
                  : 'If you wish to order manually or need to renew an unlisted software package:'}
              </p>
              
              <div className="space-y-2.5 text-xs font-mono font-bold">
                <a
                  href="tel:+249113411965"
                  className={`flex items-center gap-2 p-2.5 border rounded-xl transition ${
                    isDarkMode 
                      ? 'bg-slate-950 hover:bg-slate-900 border-slate-850 text-slate-200' 
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <LucideIcons.PhoneCall className="w-4 h-4 text-sky-400 animate-pulse" />
                  <span>{isAr ? 'مكان كول المباشر:' : 'Primary Call No:'} +249113411965</span>
                </a>
                <a
                  href="https://wa.me/256791472369"
                  target="_blank"
                  rel="noreferrer"
                  className={`flex items-center gap-2 p-2.5 border rounded-xl transition ${
                    isDarkMode 
                      ? 'bg-slate-950 hover:bg-slate-900 border-slate-850 text-slate-200' 
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <LucideIcons.MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>{isAr ? 'مبيعات الشركات واتساب:' : 'Corporate WhatsApp:'} +256 791 472 369</span>
                </a>
              </div>
            </div>
          </div>

          {/* Left layout: Collapsible FAQs list */}
          <div className="lg:col-span-8">
            <FAQSection lang={lang} isDarkMode={isDarkMode} />
          </div>
        </div>

      </main>

      {/* Checkout Order Drawer Panel Modal (active when plan parameter selected) */}
      {selectedPlanDetail && (
        <OrderDrawer
          service={selectedPlanDetail.service}
          plan={selectedPlanDetail.plan}
          usdToSdgRate={usdToSdgRate}
          lang={lang}
          isDarkMode={isDarkMode}
          activeCurrency={activeCurrency}
          onClose={() => setSelectedPlanDetail(null)}
          onOrderSuccess={(ord) => {
            handleOrderSuccess(ord);
            setSelectedPlanDetail(null);
          }}
        />
      )}

      {/* Styled Luxurious 4-Column Footer inspired by Tafeelak.com */}
      <footer className={`border-t transition-colors duration-300 ${
        isDarkMode ? 'border-blue-950/60 bg-[#081221] text-slate-400' : 'border-slate-200 bg-white'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          
          {/* Main 4-Column Responsive Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12 text-right">
            
            {/* Column 1: Store Intro & Social Links */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5 justify-start md:justify-start">
                <Logo className="w-9 h-9 select-none text-sky-450 text-sky-400" />
                <span className="font-extrabold text-lg text-slate-800 dark:text-white">
                  {isAr ? 'تفعيلك سودان' : 'Activate Sudan'}
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
                {isAr
                  ? 'المنصة الوطنية الرائدة لتوفير وتوطين اشتراكات بريميوم الرقمية والبرمجيات المعتمدة داخل السودان بأفضل الأسعار وبضمان ذهبي ممتد طوال فترة الشراء.'
                  : 'Leading platform providing genuine premium digital subscriptions and keys within Sudan with strict security systems.'}
              </p>
              
              {/* Social Media Link Icons - Featuring Facebook for "احذف تليجرام واضف فيسبوك" as requested */}
              <div className="flex items-center gap-3 justify-start pt-2">
                <a 
                  href="https://facebook.com/activatesudan" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="w-8 h-8 rounded-lg bg-blue-600/10 hover:bg-blue-600 text-blue-500 hover:text-white flex items-center justify-center transition active:scale-90 shadow-2xs"
                  title={isAr ? 'تابعنا على فيسبوك' : 'Follow us on Facebook'}
                >
                  <LucideIcons.Facebook className="w-4 h-4" />
                </a>
                <a 
                  href="https://wa.me/249113411965" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="w-8 h-8 rounded-lg bg-emerald-600/10 hover:bg-emerald-600 text-emerald-500 hover:text-white flex items-center justify-center transition active:scale-90 shadow-2xs"
                  title={isAr ? 'تواصل معنا واتساب' : 'Contact WhatsApp Helpdesk'}
                >
                  <LucideIcons.MessageSquareCode className="w-4 h-4" />
                </a>
                <a 
                  href="mailto:support@activatesudan.com" 
                  className="w-8 h-8 rounded-lg bg-sky-500/10 hover:bg-sky-500 text-sky-400 hover:text-white flex items-center justify-center transition active:scale-90 shadow-2xs"
                  title={isAr ? 'بريد الدعم الفني' : 'Email Support Desk'}
                >
                  <LucideIcons.Mail className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Column 2: Store Departments Links */}
            <div className="space-y-4">
              <h4 className="text-xs font-black tracking-wider uppercase text-slate-900 dark:text-white border-r-2 border-amber-500 pr-2">
                {isAr ? 'أقسام المتجر الرئيسية 🗄️' : 'STORE DEPARTMENTS'}
              </h4>
              <ul className="space-y-2.5 text-xs">
                {categoriesDefinition.map((definition) => (
                  <li key={definition.id}>
                    <button
                      onClick={() => {
                        setSelectedCategory(definition.id);
                        setSearchQuery('');
                        const el = document.getElementById('search-anchor-box-catalog');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="text-slate-500 hover:text-amber-500 font-medium transition cursor-pointer text-right w-full block"
                    >
                      {isAr ? definition.titleAr.replace(/^[أولاًثانيالدرثاخدم :]+/, '') : definition.titleEn}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Trust Options & Assurances */}
            <div className="space-y-4">
              <h4 className="text-xs font-black tracking-wider uppercase text-slate-900 dark:text-white border-r-2 border-amber-500 pr-2">
                {isAr ? 'الضمانات والروابط السريعة 🎖️' : 'ASSURANCES & QUICK LINKS'}
              </h4>
              <ul className="space-y-2.5 text-xs text-slate-500 font-medium font-bold">
                <li>
                  <button 
                    onClick={() => alert(isAr ? 'جميع اشتراكاتنا أصلية وتعمل بضمان ذهبي ممتد طوال فترة الشراء.' : 'Our licenses are backed with full warranties.')}
                    className="hover:text-amber-500 transition text-right w-full block"
                  >
                    {isAr ? 'سياسة الاستبدال والضمان الكامل' : 'Replacement Policy'}
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => alert(isAr ? 'متجر تفعيلك سودان معتمد ويوفر تفعيلات رسمية تماماً بالتعاون مع كبرى الشركات.' : 'Trusted and secured in Sudan.')}
                    className="hover:text-amber-500 transition text-right w-full block"
                  >
                    {isAr ? 'شروط الخدمة والاستخدام الآمن' : 'Terms of Service'}
                  </button>
                </li>
                <li>
                  <a 
                    href="https://wa.me/249113411965" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="hover:text-amber-500 transition block text-right w-full"
                  >
                    {isAr ? 'مساعدة فورية وطلب مخصص' : 'Custom Request Help'}
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 4: Sudanese Local Payments Supported */}
            <div className="space-y-4">
              <h4 className="text-xs font-black tracking-wider uppercase text-slate-900 dark:text-white border-r-2 border-amber-500 pr-2">
                {isAr ? 'وسائل الدفع بالسودان 🇸🇩' : 'LOCAL SUDANESE PAYMENTS'}
              </h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                {isAr 
                  ? 'نوفر طرق سداد سريعة وموثوقة تتناسب مع عملائنا في السودان بالعملة المحلية مع توجيه آلي فوري.' 
                  : 'Accepting Sudanese leading payment gateways with safe prompt integrations.'}
              </p>
              
              <div className="flex flex-wrap gap-1.5 justify-start">
                <span className="text-[10px] font-black px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-emerald-400">
                  {isAr ? 'بنكك - الخرطوم 🔴' : 'Bankak - Khartoum'}
                </span>
                <span className="text-[10px] font-black px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-amber-400">
                  {isAr ? 'تطبيق فوري ⚡' : 'Fawry App'}
                </span>
                <span className="text-[10px] font-black px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-sky-400">
                  {isAr ? 'تطبيق أوكاش 📱' : 'Okash Pay'}
                </span>
              </div>
            </div>

          </div>

          <div className="border-t border-slate-200 dark:border-slate-900 pt-7 flex flex-col md:flex-row items-center justify-between gap-4 text-center">
            <span className="text-xs font-bold text-slate-500">
              {isAr ? '© ٢٠٢٦ متجر تفعيلك سودان. كافة الحقوق محفوظة.' : '© 2026 Activate Sudan Store. All rights reserved.'}
            </span>
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
              <span>{isAr ? 'الأسعار خاضعة للتحديث بما يواكب السوق الحر السوداني.' : 'Prices fluctuate matching current USD market rates.'}</span>
              <span>-</span>
              <span className="font-mono text-amber-500 font-black">www.activatesudan.com</span>
            </div>
          </div>

        </div>
      </footer>

      {/* Salla-style Floating WhatsApp live-chat support bubble */}
      <WhatsAppWidget lang={lang} />

      {/* Mobile/Tablet Bottom Navigation Bar (Home, Store Sections, My Orders) */}
      {/* addresses search: "أضف شريط تنقل سفلي Bottom Navigation Bar يحتوي على: الرئيسية، أقسام المتجر، وطلباتي" */}
      <div
        id="mobile-app-bottom-nav"
        className={`fixed bottom-4 left-4 right-4 z-40 p-3 rounded-2xl shadow-xl flex items-center justify-around backdrop-blur-md md:hidden border transition-all duration-300 ${
          isDarkMode
            ? 'bg-[#0a192f]/80 border-slate-800 shadow-slate-950/40 text-slate-300'
            : 'bg-white/85 border-slate-250 border-slate-200 shadow-slate-300/40 text-slate-700'
        }`}
      >
        {/* Button 1: الرئيسية */}
        <button
          onClick={() => {
            setSelectedCategory('all');
            setSearchQuery('');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex flex-col items-center gap-1 cursor-pointer active:scale-90"
        >
          <LucideIcons.Home className="w-5 h-5 text-sky-400" />
          <span className="text-[9px] font-black">{isAr ? 'الرئيسية' : 'Home'}</span>
        </button>

        {/* Button 2: أقسام المتجر */}
        <button
          onClick={() => setIsCategoryDrawerOpen(true)}
          className="flex flex-col items-center gap-1 cursor-pointer active:scale-95"
        >
          <div className="p-2 -mt-4 bg-gradient-to-r from-blue-600 to-indigo-650 rounded-full text-white shadow-md shadow-blue-500/20">
            <LucideIcons.LayoutGrid className="w-5 h-5" />
          </div>
          <span className="text-[9px] font-black">{isAr ? 'أقسام المتجر' : 'Sections'}</span>
        </button>

      </div>

      {/* Floating Vertical Drawer component block */}
      <CategoryDrawer
        isOpen={isCategoryDrawerOpen}
        onClose={() => setIsCategoryDrawerOpen(false)}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        lang={lang}
        isDarkMode={isDarkMode}
      />

      {/* Smart Invoice Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        lang={lang}
        usdToSdgRate={usdToSdgRate}
        activeCurrency={activeCurrency}
        onUpdateQuantity={(itemId, qty) => {
          const updated = cart.map(item => item.id === itemId ? { ...item, quantity: qty } : item);
          saveCart(updated);
        }}
        onRemoveItem={(itemId) => {
          const updated = cart.filter(item => item.id !== itemId);
          saveCart(updated);
        }}
        onClearCart={() => {
          saveCart([]);
        }}
        onOrderSuccess={(ord) => {
          handleOrderSuccess(ord);
        }}
        userFullName={user?.fullName || user?.firstName || ''}
        userEmail={user?.primaryEmailAddress?.emailAddress || ''}
        isDarkMode={isDarkMode}
      />

      {/* Elegant Toast alert dialog */}
      {toastMsg && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-55 flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-slate-900 border border-amber-500/40 shadow-2xl text-white select-none animate-flicker">
          <LucideIcons.CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-bold font-sans">{toastMsg}</span>
        </div>
      )}

      {/* Sign-In UI removed */}

    </div>
  );
}
