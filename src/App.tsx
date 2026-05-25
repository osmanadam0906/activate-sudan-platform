import React, { useState, useEffect } from 'react';
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

  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('activate_sudan_dark_mode');
    return saved ? saved === 'true' : false;
  });

  const [isCategoryDrawerOpen, setIsCategoryDrawerOpen] = useState(false);
  const [usdToSdgRate] = useState<number>(4200);
  const [showCurrencyEquivalent, setShowCurrencyEquivalent] = useState(true);

  const USD_TO_SDG_EXCHANGE = 4200;
  const USD_TO_SAR_EXCHANGE = 4;
  const USD_TO_EGP_EXCHANGE = 55;

  const [activeCurrency, setActiveCurrency] = useState<'USD' | 'SDG' | 'SAR' | 'EGP'>(() => {
    const saved = localStorage.getItem('activate_sudan_active_currency');
    return (saved as any) || 'SDG';
  });

  const getConvertedPrice = (priceUSD: number) => {
    switch (activeCurrency) {
      case 'SDG': return { value: Math.round(priceUSD * USD_TO_SDG_EXCHANGE), symbol: lang === 'ar' ? 'ج.س' : 'SDG' };
      case 'SAR': return { value: parseFloat((priceUSD * USD_TO_SAR_EXCHANGE).toFixed(2)), symbol: lang === 'ar' ? 'ر.س' : 'SAR' };
      case 'EGP': return { value: Math.round(priceUSD * USD_TO_EGP_EXCHANGE), symbol: lang === 'ar' ? 'ج.م' : 'EGP' };
      case 'USD': default: return { value: parseFloat(priceUSD.toFixed(2)), symbol: '$' };
    }
  };

  useEffect(() => {
    const savedCurrency = localStorage.getItem('activate_sudan_active_currency');
    if (!savedCurrency) {
      setActiveCurrency('SDG');
      localStorage.setItem('activate_sudan_active_currency', 'SDG');
    }
  }, []);

  const [searchOrderId, setSearchOrderId] = useState('');
  const [trackedOrder, setTrackedOrder] = useState<Order | null>(null);
  const [trackingTried, setTrackingTried] = useState(false);
  const [activeSlide, setActiveSlide] = useState<number>(0);

  const [advertisements, setAdvertisements] = useState<Advertisement[]>(() => {
    return [{
      id: 'ad-default-1',
      textAr: '⚡ تفعيل فوري لجميع اشتراكات بريميوم والذكاء الاصطناعي وجوجل ون وباقة الأعمال خلال أقل من 15 دقيقة متاح الآن بالسودان!',
      textEn: '⚡ Instant activation for all premium accounts and Google One plans under 15 minutes is live in Sudan!',
      type: 'bar',
      active: true,
      createdAt: new Date().toISOString()
    }];
  });

  const [specialOffers, setSpecialOffers] = useState<SpecialOffer[]>([]);

  // الخدعة الذكية: نقوم بدمج روابط الصور الملونة مباشرة داخل الكتالوج الأساسي عند التحميل
  const [services, setServices] = useState<Service[]>(() => {
    const baseServices = SERVICES;
    
    // خريطة الروابط الملونة فائقة الدقة .svg لجميع المنصات الخاصة بك
    const iconMapping: { [key: string]: string } = {
      'telegram': 'https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg',
      'youtube': 'https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg',
      'duolingo': 'https://upload.wikimedia.org/wikipedia/commons/1/15/Duolingo_logo_%282019%29.svg',
      'instagram': 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.svg',
      'snapchat': 'https://upload.wikimedia.org/wikipedia/commons/c/c4/Snapchat_logo.svg',
      'chatgpt': 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg',
      'netflix': 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg',
      'claude': 'https://upload.wikimedia.org/wikipedia/commons/c/cc/Claude_AI_logo.svg',
      'gemini': 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Google_Gemini_logo.svg',
      'linkedin': 'https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.svg'
    };

    return baseServices.map(service => ({
      ...service,
      directIconUrl: iconMapping[service.id.toLowerCase()] || undefined
    }));
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('all');
  const [selectedPlanDetail, setSelectedPlanDetail] = useState<{ service: Service; plan: Plan } | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  const isAr = lang === 'ar';

  const toggleDarkMode = () => {
    const nextVal = !isDarkMode;
    setIsDarkMode(nextVal);
    localStorage.setItem('activate_sudan_dark_mode', String(nextVal));
  };

  useEffect(() => {
    if (isSignedIn && user?.id) {
      const savedCart = localStorage.getItem(`activate_sudan_cart_${user.id}`);
      if (savedCart) {
        try { setCart(JSON.parse(savedCart)); } catch (e) { setCart([]); }
      } else { setCart([]); }
    } else { setCart([]); }
  }, [isSignedIn, user?.id]);

  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    if (isSignedIn && user?.id) {
      localStorage.setItem(`activate_sudan_cart_${user.id}`, JSON.stringify(newCart));
    }
  };

  const handleAddToCart = (service: Service, plan: Plan) => {
    if (!isSignedIn) {
      alert(isAr ? 'يرجى تسجيل الدخول أولاً للوصول إلى سلة مشترياتك وإضافة الباقة.' : 'Please sign in first.');
      clerk.openSignIn();
      return;
    }
    const exists = cart.find(item => item.plan.id === plan.id);
    let updated;
    if (exists) {
      updated = cart.map(item => item.plan.id === plan.id ? { ...item, quantity: item.quantity + 1 } : item);
    } else {
      updated = [...cart, { id: 'item_' + Math.random().toString(36).substr(2, 9), service, plan, quantity: 1 }];
    }
    saveCart(updated);
    setToastMsg(isAr ? `📥 تمت إضافة "${plan.nameAr}" بنجاح!` : `📥 Added "${plan.nameEn}" successfully!`);
    setTimeout(() => setToastMsg(''), 4000);
  };

  useEffect(() => {
    const saved = localStorage.getItem('activate_sudan_orders');
    if (saved) { try { setOrders(JSON.parse(saved)); } catch (e) {} }
  }, []);

  useEffect(() => {
    document.body.style.backgroundColor = isDarkMode ? '#0a192f' : '#f8fafc';
    document.body.style.color = isDarkMode ? '#F1F5F9' : '#0f172a';
  }, [isDarkMode]);

  useEffect(() => {
    const timer = setInterval(() => { setActiveSlide((prev) => (prev + 1) % 4); }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleOrderSuccess = (newOrder: Order) => {
    const updated = [newOrder, ...orders];
    setOrders(updated);
    localStorage.setItem('activate_sudan_orders', JSON.stringify(updated));
  };

  const filteredServices = services.filter((service) => {
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const nameArMatch = service.nameAr.toLowerCase().includes(q);
    const nameEnMatch = service.nameEn.toLowerCase().includes(q);
    return matchesCategory && (!q || nameArMatch || nameEnMatch);
  });

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
    <div id="activate-sudan-fullstack-view" className={`min-h-screen flex flex-col justify-between font-sans ${isDarkMode ? 'bg-[#0a192f] text-slate-100' : 'bg-slate-50 text-slate-900'}`} dir={isAr ? 'rtl' : 'ltr'}>
      
      {advertisements.filter(ad => ad.active && ad.type === 'bar').map((ad) => (
        <div key={ad.id} className="bg-[#2563eb] text-white py-1.5 px-4 text-[11px] md:text-xs font-black relative flex items-center shadow-sm">
          <marquee className="w-full text-right" scrollamount="4">
            {isAr ? ad.textAr : ad.textEn}
          </marquee>
        </div>
      ))}

      <header className={`sticky top-0 z-40 border-b ${isDarkMode ? 'bg-[#0a192f]/95 text-white border-slate-800' : 'bg-white/95 text-slate-800 border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center justify-between w-full md:w-auto gap-4">
            <button onClick={() => setIsCategoryDrawerOpen(true)} className="md:hidden px-3 py-2 border rounded-xl">
              <LucideIcons.Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2.5">
              {/* هنا قمنا بتكبير الشعار ليكون واضحاً جداً */}
              <Logo className={isDarkMode ? 'text-white' : 'text-slate-900'} lang={lang} imageSizeClass="w-16 h-16 md:w-24 md:h-24" />
              <div className="flex flex-col text-right border-r pr-2.5 border-slate-200">
                <span className="text-[10px] text-amber-500 font-extrabold flex items-center gap-1">
                  <span>🇸🇩</span> <span>{isAr ? 'الوكيل المعتمد الأول' : 'Official Distributor'}</span>
                </span>
                <span className="text-[9px] font-black mt-1.5 px-2 py-1 rounded-md border bg-blue-50/70 text-blue-700">
                  {isAr ? 'سعر الصرف ثابت: $1 = 4200 ج.س' : 'Static Rate: 1 USD = 4200 SDG'}
                </span>
              </div>
            </div>
          </div>

          <div className="w-full md:flex-1 md:max-w-2xl relative">
            <input type="text" placeholder={isAr ? 'ابحث عن اشتراك، لعبة، أو رمز تفعيل أصلي...' : 'Search...'} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full border rounded-2xl py-2.5 pr-10 pl-4 text-xs font-black text-right bg-slate-100 border-slate-200 text-slate-800 focus:bg-white" />
          </div>

          <div className="hidden md:flex items-center gap-2.5 shrink-0">
            <button onClick={toggleDarkMode} className="p-2 border rounded-xl">
              {isDarkMode ? '☀️ نهارى' : '🌙 ليلى'}
            </button>
            <button onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')} className="px-3 py-2.5 border rounded-xl text-xs font-black">
              {lang === 'ar' ? 'English' : 'عربي'}
            </button>
            <SignedIn>
              <button onClick={() => setIsCartOpen(true)} className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs rounded-xl relative">
                <LucideIcons.ShoppingCart className="w-4 h-4 inline mr-1" /> {isAr ? 'سلة المشتريات' : 'My Cart'}
              </button>
            </SignedIn>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        
        {/* البانر التعريفي */}
        <div className="p-8 rounded-3xl bg-gradient-to-tr from-[#0a1128] via-[#0d1527] to-[#122c68] text-white text-right space-y-4 border border-slate-800">
          <h2 className="text-2xl font-black text-amber-400">{isAr ? 'منصة تفعيلك سودان الرسمية' : 'Activate Sudan Platform'}</h2>
          <p className="text-xs text-slate-300 max-w-xl">{isAr ? 'تفعيل فوري وآمن بنسبة 100% لجميع الاشتراكات والذكاء الاصطناعي وباقات الأعمال في السودان.' : 'Instant activations.'}</p>
        </div>

        {/* الكتالوج وعرض الاشتراكات بـ كروت الخدمة */}
        <div className="space-y-6">
          {categoriesDefinition.map((definition) => {
            const list = getServicesByCategory(definition.id);
            if (list.length === 0) return null;
            return (
              <div key={definition.id} className="space-y-5">
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
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <FAQSection lang={lang} isDarkMode={isDarkMode} />
      </main>

      <footer className={`border-t py-8 text-center text-xs ${isDarkMode ? 'bg-[#081221] border-slate-900 text-slate-400' : 'bg-white border-slate-200 text-slate-500'}`}>
        <p>© 2026 متجر تفعيلك سودان. كافة الحقوق محفوظة. | activatesudan.online</p>
      </footer>

      <WhatsAppWidget lang={lang} />
      
      {selectedPlanDetail && (
        <OrderDrawer
          service={selectedPlanDetail.service}
          plan={selectedPlanDetail.plan}
          usdToSdgRate={usdToSdgRate}
          lang={lang}
          isDarkMode={isDarkMode}
          activeCurrency={activeCurrency}
          onClose={() => setSelectedPlanDetail(null)}
          onOrderSuccess={(ord) => { handleOrderSuccess(ord); setSelectedPlanDetail(null); }}
        />
      )}

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cart={cart} lang={lang} usdToSdgRate={usdToSdgRate} activeCurrency={activeCurrency} onUpdateQuantity={(itemId, qty) => saveCart(cart.map(i => i.id === itemId ? { ...i, quantity: qty } : i))} onRemoveItem={(itemId) => saveCart(cart.filter(i => i.id !== itemId))} onClearCart={() => saveCart([])} onOrderSuccess={handleOrderSuccess} userFullName="" userEmail="" isDarkMode={isDarkMode} />
    </div>
  );
} حسنا هذا كل الكود الموجود في الملف فقط عله لي لانسخه 
