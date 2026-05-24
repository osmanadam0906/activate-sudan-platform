import React, { useState } from 'react';
import { Service, Plan, Order, CategoryType, Advertisement, SpecialOffer } from '../types';
import { SERVICES } from '../data';
import * as LucideIcons from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface AdminPanelProps {
  services: Service[];
  setServices: React.Dispatch<React.SetStateAction<Service[]>>;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  usdToSdgRate: number;
  setUsdToSdgRate: (rate: number) => void;
  lang: 'ar' | 'en';
  onClose: () => void;
  advertisements: Advertisement[];
  setAdvertisements: React.Dispatch<React.SetStateAction<Advertisement[]>>;
  specialOffers: SpecialOffer[];
  setSpecialOffers: React.Dispatch<React.SetStateAction<SpecialOffer[]>>;
}

export default function AdminPanel({
  services,
  setServices,
  orders,
  setOrders,
  usdToSdgRate,
  setUsdToSdgRate,
  lang,
  onClose,
  advertisements,
  setAdvertisements,
  specialOffers,
  setSpecialOffers,
}: AdminPanelProps) {
  const isAr = lang === 'ar';

  // Order status statistics for visualization
  const pendingCount = orders.filter(o => o.status === 'pending').length;
  const completedCount = orders.filter(o => o.status === 'completed').length;
  const cancelledCount = orders.filter(o => o.status === 'cancelled').length;
  const totalOrdersCount = orders.length;

  const chartData = [
    { name: isAr ? '⏳ قيد المعالجة' : '⏳ Pending', value: pendingCount, color: '#f59e0b' },
    { name: isAr ? '✅ تم التفعيل' : '✅ Completed', value: completedCount, color: '#10b981' },
    { name: isAr ? '❌ ملغي بالرفض' : '❌ Cancelled', value: cancelledCount, color: '#ef4444' }
  ].filter(slice => slice.value > 0);

  // Secure entry
  const [pin, setPin] = useState('');
  const [adminPin, setAdminPin] = useState(() => localStorage.getItem('activate_sudan_admin_pin') || '1234');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [unlockedError, setUnlockedError] = useState(false);

  // Recovery States
  const [pinResetStep, setPinResetStep] = useState<'normal' | 'otp' | 'new_pin'>('normal');
  const [recoveryCode, setRecoveryCode] = useState('');
  const [enteredRecoveryCode, setEnteredRecoveryCode] = useState('');
  const [newPinCandidate, setNewPinCandidate] = useState('');
  const [resetToast, setResetToast] = useState<string | null>(null);

  // Active Admin Sub-tab
  const [activeTab, setActiveTab] = useState<'rates' | 'services' | 'orders' | 'ads' | 'offers'>('rates');

  // Advertisement Form States
  const [adTextAr, setAdTextAr] = useState('');
  const [adTextEn, setAdTextEn] = useState('');
  const [adLink, setAdLink] = useState('');
  const [adType, setAdType] = useState<'bar' | 'banner'>('bar');

  // Special Offer Form States
  const [offerTitleAr, setOfferTitleAr] = useState('');
  const [offerTitleEn, setOfferTitleEn] = useState('');
  const [offerDescAr, setOfferDescAr] = useState('');
  const [offerDescEn, setOfferDescEn] = useState('');
  const [offerPrice, setOfferPrice] = useState<number>(0);
  const [offerCurrency, setOfferCurrency] = useState<'USD' | 'SDG'>('USD');
  const [offerBadgeAr, setOfferBadgeAr] = useState('');
  const [offerBadgeEn, setOfferBadgeEn] = useState('');
  const [offerPeriodAr, setOfferPeriodAr] = useState('شهرياً');
  const [offerPeriodEn, setOfferPeriodEn] = useState('Monthly');
  const [offerFeaturesAr, setOfferFeaturesAr] = useState('');
  const [offerFeaturesEn, setOfferFeaturesEn] = useState('');

  // New Service Form State
  const [newServiceNameAr, setNewServiceNameAr] = useState('');
  const [newServiceNameEn, setNewServiceNameEn] = useState('');
  const [newServiceCategory, setNewServiceCategory] = useState<CategoryType>('intelligence');
  const [newDescAr, setNewDescAr] = useState('');
  const [newDescEn, setNewDescEn] = useState('');
  const [newIcon, setNewIcon] = useState('BrainCircuit');
  const [newAccentColor, setNewAccentColor] = useState('blue-600');
  const [newTextColor, setNewTextColor] = useState('text-blue-600');
  const [newBannerColor, setNewBannerColor] = useState('bg-blue-50/70');

  // Current plans structure inside the added service
  const [newPlans, setNewPlans] = useState<Partial<Plan>[]>([
    {
      id: 'plan-1',
      nameAr: 'الباقة التجريبية',
      nameEn: 'Trial Premium Plan',
      price: 10,
      currency: 'USD',
      periodAr: 'شهرياً',
      periodEn: 'Monthly',
      featuresAr: ['ميزات تفعيل كاملة وبأمان', 'دعم متكامل ومستمر'],
      featuresEn: ['Fully secured activation', 'Complete priority support']
    }
  ]);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.trim() === adminPin) {
      setIsUnlocked(true);
      setUnlockedError(false);
    } else {
      setUnlockedError(true);
    }
  };

  const handleTriggerRecovery = () => {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setRecoveryCode(code);
    setPinResetStep('otp');
    
    const msg = isAr
      ? `📬 تم إرسال كود استعادة الرمز لبريدك osmanyahia93@gmail.com بنجاح! كود التغيير الخاص بك هو: [ ${code} ]`
      : `📬 Admin recovery email sent to osmanyahia93@gmail.com! Your verification OTP code is: [ ${code} ]`;
    setResetToast(msg);
    setTimeout(() => setResetToast(null), 10000);
  };

  const handleVerifyRecovery = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredRecoveryCode.trim() === recoveryCode) {
      setPinResetStep('new_pin');
    } else {
      alert(isAr ? 'كود التحقق خاطئ' : 'Incorrect verification OTP');
    }
  };

  const handleSaveNewPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPinCandidate.trim().length < 4) {
      alert(isAr ? 'الرمز يجب أن يكون 4 أرقام على الأقل' : 'PIN must be at least 4 digits');
      return;
    }
    localStorage.setItem('activate_sudan_admin_pin', newPinCandidate.trim());
    setAdminPin(newPinCandidate.trim());
    setPinResetStep('normal');
    setPin(newPinCandidate.trim());
    alert(isAr ? '🎉 تم تغيير رمز الإدارة بنجاح!' : '🎉 Admin PIN changed successfully!');
  };

  // Preset accent themes helper
  const THEME_PRESETS = [
    { label: 'Blue / جيميناي ولينكد إن', accent: 'blue-600', text: 'text-blue-600', banner: 'bg-blue-50/70' },
    { label: 'Emerald / شات جي بي تي', accent: 'emerald-600', text: 'text-emerald-600', banner: 'bg-emerald-50/70' },
    { label: 'Red / يوتيوب ونتفليكس', accent: 'red-600', text: 'text-red-600', banner: 'bg-red-50/70' },
    { label: 'Amber / كلود', accent: 'amber-600', text: 'text-amber-600', banner: 'bg-amber-50/70' },
    { label: 'Green / دولينقو', accent: 'green-600', text: 'text-green-600', banner: 'bg-green-50/70' },
    { label: 'Sky / تليجرام وكلاودي', accent: 'sky-600', text: 'text-sky-600', banner: 'bg-sky-50/70' },
  ];

  // Helper change list and save
  const updateAndPersistServices = (updated: Service[]) => {
    setServices(updated);
    localStorage.setItem('activate_sudan_local_services', JSON.stringify(updated));
  };

  // Change individual plan price in-line
  const handlePriceChange = (serviceId: string, planId: string, newPrice: number) => {
    const updated = services.map(s => {
      if (s.id === serviceId) {
        return {
          ...s,
          plans: s.plans.map(p => {
            if (p.id === planId) {
              return { ...p, price: newPrice };
            }
            return p;
          })
        };
      }
      return s;
    });
    updateAndPersistServices(updated);
  };

  // Toggle isPopular state
  const handlePopularToggle = (serviceId: string, planId: string) => {
    const updated = services.map(s => {
      if (s.id === serviceId) {
        return {
          ...s,
          plans: s.plans.map(p => {
            if (p.id === planId) {
              return { ...p, isPopular: !p.isPopular };
            }
            return p;
          })
        };
      }
      return s;
    });
    updateAndPersistServices(updated);
  };

  // Apply markup helper: 20% Markup on all plans
  const handleApply20Markup = () => {
    const confirmMessage = isAr 
      ? 'هل أنت متأكد من زيادة أسعار جميع الاشتراكات والخطط بنسبة 20% مضافة؟'
      : 'Are you sure you want to add 20% profit markup to all active prices?';
    if (!window.confirm(confirmMessage)) return;

    const updated = services.map(s => ({
      ...s,
      plans: s.plans.map(p => {
        let newPrice = p.price;
        if (p.currency === 'USD') {
          // Keep nice USD decimals
          newPrice = parseFloat((p.price * 1.2).toFixed(2));
        } else {
          // Round Sudanese SDG to nearest 100
          newPrice = Math.round((p.price * 1.2) / 100) * 100;
        }
        return { ...p, price: newPrice };
      })
    }));

    updateAndPersistServices(updated);
    alert(isAr ? '🎉 تم ترفيع جميع الأسعار بهامش 20% بنجاح!' : '🎉 Profit markup of 20% applied successfully!');
  };

  // Add individual custom markup
  const handleApplyCustomMarkup = (percentage: number) => {
    if (isNaN(percentage) || percentage <= 0) return;
    const factor = 1 + (percentage / 100);
    const updated = services.map(s => ({
      ...s,
      plans: s.plans.map(p => {
        let newPrice = p.price;
        if (p.currency === 'USD') {
          newPrice = parseFloat((p.price * factor).toFixed(2));
        } else {
          newPrice = Math.round((p.price * factor) / 100) * 100;
        }
        return { ...p, price: newPrice };
      })
    }));
    updateAndPersistServices(updated);
    alert(isAr ? `🎉 تم ترفيع جميع الأسعار بهامش ${percentage}% بنجاح!` : `🎉 Profit markup of ${percentage}% applied!`);
  };

  // Reset services to default
  const handleResetToFactoryDefaults = () => {
    const confirmMessage = isAr
      ? 'تحذير: هذا الإجراء سيقوم بحذف جميع التعديلات والمنصات الجديدة التي قمت بإضافتها واستعادة الكتالوج الافتراضي الأصلي وتصفير الصرف إلى 4200 SDG. هل ترغب في الاستمرار؟'
      : 'Critical: This will erase all edits, new services, and custom pricing, reverting everything to default values. Continue?';
    if (!window.confirm(confirmMessage)) return;

    localStorage.removeItem('activate_sudan_local_services');
    localStorage.removeItem('activate_sudan_usd_rate');
    setServices(SERVICES);
    setUsdToSdgRate(4200);
    alert(isAr ? 'تمت استعادة كتالوج المصنع والأسعار والأسعار الافتراضية بالكامل!' : 'Reverted everything to original defaults successfully!');
  };

  // Plan creation helpers
  const handleAddPlanToForm = () => {
    const nextId = `custom-plan-${Date.now()}-${newPlans.length}`;
    setNewPlans([
      ...newPlans,
      {
        id: nextId,
        nameAr: isAr ? `خطة جديدة ${newPlans.length + 1}` : `New plan ${newPlans.length + 1}`,
        nameEn: `New Elite Plan ${newPlans.length + 1}`,
        price: 15,
        currency: 'USD',
        periodAr: 'شهرياً',
        periodEn: 'Monthly',
        featuresAr: ['ميزات متقدمة وحصرية'],
        featuresEn: ['Advanced elite configurations']
      }
    ]);
  };

  const handleUpdatePlansField = (index: number, field: string, value: any) => {
    const updated = [...newPlans];
    updated[index] = { ...updated[index], [field]: value };
    setNewPlans(updated);
  };

  const handleCreateNewServiceAndSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceNameAr || !newServiceNameEn) {
      alert(isAr ? 'يرجى كتابة اسم المنصة بالعربية والانجليزية' : 'Please provide Service name in both Arabic and English');
      return;
    }

    const uniqueId = `srv-${Date.now()}`;
    const formattedPlans: Plan[] = newPlans.map((p, idx) => ({
      id: p.id || `${uniqueId}-plan-${idx}`,
      nameAr: p.nameAr || 'خطة',
      nameEn: p.nameEn || 'Package Plan',
      price: Number(p.price) || 0,
      currency: (p.currency as 'USD' | 'SDG') || 'USD',
      periodAr: p.periodAr || 'شهرياً',
      periodEn: p.periodEn || 'Monthly',
      featuresAr: p.featuresAr || ['تفعيل رسمي كامل'],
      featuresEn: p.featuresEn || ['Official activation benefits']
    }));

    const newlyCreated: Service = {
      id: uniqueId,
      nameAr: newServiceNameAr,
      nameEn: newServiceNameEn,
      category: newServiceCategory,
      descriptionAr: newDescAr || 'تفعيل مضمون وبأسعار ملائمة عبر مكتبنا وموظفي التفعيلات.',
      descriptionEn: newDescEn || 'Guaranteed delivery through our operations center helper keys.',
      iconName: newIcon,
      accentColor: newAccentColor,
      textColor: newTextColor,
      bannerColor: newBannerColor,
      plans: formattedPlans,
    };

    updateAndPersistServices([...services, newlyCreated]);

    // Reset Form
    setNewServiceNameAr('');
    setNewServiceNameEn('');
    setNewDescAr('');
    setNewDescEn('');
    setNewPlans([
      {
        id: 'plan-1',
        nameAr: 'الباقة المبدئية',
        nameEn: 'Initial Premium Package',
        price: 10,
        currency: 'USD',
        periodAr: 'شهرياً',
        periodEn: 'Monthly',
        featuresAr: ['تفعيل رسمي وسريع'],
        featuresEn: ['Swift original configuration']
      }
    ]);

    alert(isAr ? '🎉 تم إضافة المنصة الجديدة بنجاح وإتاحتها فوراً للمشترقين!' : '🎉 Add new Subscription service successfully!');
  };

  // Advertisement Action Helpers
  const handleCreateAd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adTextAr || !adTextEn) {
      alert(isAr ? 'يرجى ملء نص الإعلان بالعربية والانجليزية' : 'Please provide Ad text in both Arabic and English');
      return;
    }
    const newAd: Advertisement = {
      id: `ad-${Date.now()}`,
      textAr: adTextAr,
      textEn: adTextEn,
      link: adLink.trim() || undefined,
      type: adType,
      active: true,
      createdAt: new Date().toISOString()
    };
    const updated = [newAd, ...advertisements];
    setAdvertisements(updated);
    localStorage.setItem('activate_sudan_ads', JSON.stringify(updated));
    setAdTextAr('');
    setAdTextEn('');
    setAdLink('');
    alert(isAr ? '🎉 تم إضافة ونشر الإعلان بنجاح!' : '🎉 Ad published successfully!');
  };

  const handleToggleAd = (id: string) => {
    const updated = advertisements.map(ad => ad.id === id ? { ...ad, active: !ad.active } : ad);
    setAdvertisements(updated);
    localStorage.setItem('activate_sudan_ads', JSON.stringify(updated));
  };

  const handleDeleteAd = (id: string) => {
    if (!window.confirm(isAr ? 'هل أنت متأكد من حذف هذا الإعلان نهائياً؟' : 'Are you sure you want to delete this ad?')) return;
    const updated = advertisements.filter(ad => ad.id !== id);
    setAdvertisements(updated);
    localStorage.setItem('activate_sudan_ads', JSON.stringify(updated));
  };

  // Special Offer Action Helpers
  const handleCreateOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!offerTitleAr || !offerTitleEn) {
      alert(isAr ? 'يرجى ملء عنوان العرض بالعربية والانجليزية' : 'Please provide Offer title in both Arabic and English');
      return;
    }
    const newOffer: SpecialOffer = {
      id: `offer-${Date.now()}`,
      titleAr: offerTitleAr,
      titleEn: offerTitleEn,
      descAr: offerDescAr,
      descEn: offerDescEn,
      price: Number(offerPrice) || 0,
      currency: offerCurrency,
      badgeAr: offerBadgeAr.trim() || undefined,
      badgeEn: offerBadgeEn.trim() || undefined,
      periodAr: offerPeriodAr,
      periodEn: offerPeriodEn,
      active: true,
      featuresAr: offerFeaturesAr ? offerFeaturesAr.split('\n').map(x => x.trim()).filter(Boolean) : [],
      featuresEn: offerFeaturesEn ? offerFeaturesEn.split('\n').map(x => x.trim()).filter(Boolean) : [],
      createdAt: new Date().toISOString()
    };
    const updated = [newOffer, ...specialOffers];
    setSpecialOffers(updated);
    localStorage.setItem('activate_sudan_special_offers', JSON.stringify(updated));
    setOfferTitleAr('');
    setOfferTitleEn('');
    setOfferDescAr('');
    setOfferDescEn('');
    setOfferPrice(0);
    setOfferBadgeAr('');
    setOfferBadgeEn('');
    setOfferFeaturesAr('');
    setOfferFeaturesEn('');
    alert(isAr ? '🎉 تم إضافة العرض الخاص بنجاح!' : '🎉 Special offer added successfully!');
  };

  const handleToggleOffer = (id: string) => {
    const updated = specialOffers.map(o => o.id === id ? { ...o, active: !o.active } : o);
    setSpecialOffers(updated);
    localStorage.setItem('activate_sudan_special_offers', JSON.stringify(updated));
  };

  const handleDeleteOffer = (id: string) => {
    if (!window.confirm(isAr ? 'هل أنت متأكد من حذف هذا العرض نهائياً؟' : 'Are you sure you want to delete this offer?')) return;
    const updated = specialOffers.filter(o => o.id !== id);
    setSpecialOffers(updated);
    localStorage.setItem('activate_sudan_special_offers', JSON.stringify(updated));
  };

  // Remove a service
  const handleDeleteService = (id: string) => {
    const confirmMessage = isAr 
      ? 'هل ترغب فعلاً في حذف هذه المنصة والاشتراكات المرتبطة بها نهائياً؟'
      : 'Are you absolutely sure you want to delete this subscription platform forever?';
    if (!window.confirm(confirmMessage)) return;

    const updated = services.filter(s => s.id !== id);
    updateAndPersistServices(updated);
  };

  // Order List helpers
  const handleUpdateOrderStatus = (orderId: string, status: 'pending' | 'completed' | 'cancelled') => {
    const updated = orders.map(o => {
      if (o.id === orderId) {
        return { ...o, status };
      }
      return o;
    });
    setOrders(updated);
    localStorage.setItem('activate_sudan_orders', JSON.stringify(updated));
  };

  const handleClearAllOrders = () => {
    if (window.confirm(isAr ? 'مسح كافة سجلات طلبات التفعيل للزبائن بالكامل؟' : 'Clear all stored activation logs?')) {
      setOrders([]);
      localStorage.removeItem('activate_sudan_orders');
    }
  };

  // Unlocked screen UI
  if (!isUnlocked) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4" dir={isAr ? 'rtl' : 'ltr'}>
        {/* Simulation Email Notification Toast */}
        {resetToast && (
          <div className="fixed top-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-slate-950 text-white p-4 rounded-xl shadow-2xl border border-blue-500/30 z-[110] animate-bounce">
            <div className="flex gap-2.5 items-start">
              <span className="p-1 px-2 text-[10px] rounded bg-blue-600 font-extrabold text-white animate-pulse shrink-0">
                EMAIL SERVICE 📬
              </span>
              <div className="flex-1">
                <p className="text-xs font-bold text-blue-300">استعادة الرمز | PIN Recovery</p>
                <p className="text-[11px] text-slate-300 mt-1 leading-normal">{resetToast}</p>
              </div>
              <button onClick={() => setResetToast(null)} className="text-slate-400 hover:text-white shrink-0">
                <LucideIcons.X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 text-slate-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <LucideIcons.Lock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-black text-slate-800">
              {isAr ? 'لوحة تحكم سيد التطبيق' : 'Master App Control Panel'}
            </h3>
          </div>

          {pinResetStep === 'normal' && (
            <>
              <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                {isAr
                  ? 'يرجى إدخال رقم التعريف الخاص بك لتعديل الأسعار وإدارة الاشتراكات والطلبات القادمة.'
                  : 'Please enter your administrator PIN to edit rates, add custom platforms, or check incoming client bookings.'}
              </p>

              <form onSubmit={handleUnlock} className="space-y-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-extrabold text-slate-400 mb-1">
                    {isAr ? 'رمز الدخول الخاص بك رئيسي' : 'Enter Administrator PIN'}
                  </label>
                  <input
                    type="password"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:border-blue-600 font-mono text-center"
                    placeholder="••••"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    autoFocus
                  />
                  {unlockedError && (
                    <p className="text-red-500 text-[10px] font-bold mt-1">
                      {isAr ? 'رمز المرور غير صحيح! يرجى إدخال البين كود الصحيح.' : 'Incorrect PIN!'}
                    </p>
                  )}
                </div>

                <div className="flex justify-between items-center text-xs">
                  <button
                    type="button"
                    onClick={handleTriggerRecovery}
                    className="text-blue-600 hover:underline font-bold"
                  >
                    {isAr ? 'نسيت الرمز؟ إرسال كود ببريد osman' : 'Forgot PIN? Send OTP to osman email'}
                  </button>
                </div>

                <div className="flex gap-2.5 pt-1">
                  <button
                    type="submit"
                    className="flex-1 py-2 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow-sm"
                  >
                    {isAr ? 'فتح اللوحة' : 'Unlock Dashboard'}
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="py-2 px-4 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-705 text-slate-700 font-bold text-xs transition-colors"
                  >
                    {isAr ? 'إلغاء' : 'Cancel'}
                  </button>
                </div>
              </form>
            </>
          )}

          {pinResetStep === 'otp' && (
            <>
              <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                {isAr
                  ? 'تم إرسال كود فوري مكوّن من 4 أرقام لبريدك الإلكتروني، يرجى كتابته لتغيير كلمة المرور.'
                  : 'We have sent a 4-digit verification code to your email. Enter it below to authorize changing your password.'}
              </p>

              <form onSubmit={handleVerifyRecovery} className="space-y-4" id="otp-verify-form">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-extrabold text-slate-400 mb-1">
                    {isAr ? 'كود التحقق المستلم' : 'Verification OTP Code'}
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={4}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-808 font-mono text-center tracking-widest text-lg"
                    placeholder="e.g. 1234"
                    value={enteredRecoveryCode}
                    onChange={(e) => setEnteredRecoveryCode(e.target.value.replace(/[^0-9]/g, ''))}
                  />
                </div>

                <div className="flex gap-2.5 pt-1">
                  <button
                    type="submit"
                    className="flex-1 py-2 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors"
                  >
                    {isAr ? 'تأكيد الرمز' : 'Verify OTP'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setPinResetStep('normal')}
                    className="py-2 px-4 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
                  >
                    {isAr ? 'رجوع' : 'Back'}
                  </button>
                </div>
              </form>
            </>
          )}

          {pinResetStep === 'new_pin' && (
            <>
              <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                {isAr
                  ? 'أدخل رمز الدخول (البين كود) الجديد لإدارة التطبيق وتذكره جيداً.'
                  : 'Specify a secure new PIN code to restrict your admin panel access.'}
              </p>

              <form onSubmit={handleSaveNewPin} className="space-y-4" id="new-pin-setup-form">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-extrabold text-slate-400 mb-1">
                    {isAr ? 'البيين كود الجديد المكون من 4 أرقام على الأقل' : 'New Admin PIN'}
                  </label>
                  <input
                    type="password"
                    required
                    minLength={4}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-805 font-mono text-center"
                    placeholder="••••"
                    value={newPinCandidate}
                    onChange={(e) => setNewPinCandidate(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-sm"
                >
                  {isAr ? 'حفظ رمز المرور الجديد' : 'Save New Admin PIN'}
                </button>
              </form>
            </>
          )}

        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 font-sans overflow-hidden" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="bg-white rounded-2xl w-full max-w-5xl h-[85vh] flex flex-col shadow-2xl border border-slate-300 relative">
        
        {/* Header control */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-blue-600 rounded-lg text-white">
              <LucideIcons.Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black flex items-center gap-1.5 leading-none">
                <span>{isAr ? 'مركز تحكم المدير السيد: عثمان يحيى 👑' : 'Master Admin Operations Control Desk'}</span>
                <span className="text-[10px] font-bold bg-green-500 text-white px-1.5 py-0.5 rounded-full uppercase tracking-wider animate-pulse">Live</span>
              </h3>
              <p className="text-[10px] text-slate-400 mt-1 leading-none">
                {isAr ? 'تحديث الأسعار وإضافة المنصات وتعديل قيم SDG تلقائياً' : 'Dynamic SDG updates & markup coefficients'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 text-slate-400 hover:text-white rounded-lg transition"
          >
            <LucideIcons.X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 py-1 shrink-0 scrollbar-none overflow-x-auto">
          <button
            onClick={() => setActiveTab('rates')}
            className={`px-4 py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'rates' ? 'border-blue-600 text-blue-650 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <LucideIcons.DollarSign className="w-4 h-4" />
            <span>{isAr ? 'الأسعار والصرف الحالي' : 'Rates & Exchange'}</span>
          </button>

          <button
            onClick={() => setActiveTab('services')}
            className={`px-4 py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'services' ? 'border-blue-600 text-blue-650 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <LucideIcons.PlusCircle className="w-4 h-4" />
            <span>{isAr ? 'إضافة وإدارة منصات جديدة' : 'Add custom platforms'}</span>
          </button>

          <button
            onClick={() => setActiveTab('ads')}
            className={`px-4 py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'ads' ? 'border-blue-600 text-blue-650 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <LucideIcons.Megaphone className="w-4 h-4" />
            <span>{isAr ? 'إدارة ونشر الإعلانات' : 'Manage Ads'}</span>
          </button>

          <button
            onClick={() => setActiveTab('offers')}
            className={`px-4 py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'offers' ? 'border-blue-600 text-blue-650 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <LucideIcons.Tags className="w-4 h-4" />
            <span>{isAr ? 'إضافة عروض حصرية' : 'Publish Offers'}</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'orders' ? 'border-blue-600 text-blue-650 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <LucideIcons.ClipboardList className="w-4 h-4" />
            <span>{isAr ? `طلبات الزبائن القادمة (${orders.length})` : `Customer Requests (${orders.length})`}</span>
          </button>
        </div>

        {/* Body content scrollable */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
          
          {/* Tab 1: Rates & Current Prices editable */}
          {activeTab === 'rates' && (
            <div className="space-y-6">
              
              {/* Dollar to SDG conversion block */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-800">{isAr ? 'سعر تداول الدولار في التطبيق (SDG)' : 'Current USD to SDG Rate Conversion'}</h4>
                  <p className="text-[11px] text-slate-400 font-medium">
                    {isAr
                      ? 'عندما يقوم المشترك بالشراء، يحسب السعر تلقائياً بناء على هذا العامل.'
                      : 'Changing this immediately propagates to all USD based subscriptions dynamically.'}
                  </p>
                </div>
                
                <div className="flex items-center gap-2.5 justify-end">
                  <span className="text-xs font-extrabold text-slate-500 text-slate-500">1$ =</span>
                  <input
                    type="number"
                    className="w-32 text-center text-sm font-extrabold font-mono bg-slate-50 text-slate-800 border-2 border-slate-200 rounded-lg py-1.5 focus:outline-none focus:border-blue-600"
                    value={usdToSdgRate}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      if (!isNaN(val) && val > 0) {
                        setUsdToSdgRate(val);
                        localStorage.setItem('activate_sudan_usd_rate', val.toString());
                      }
                    }}
                  />
                  <span className="text-xs font-extrabold text-slate-800">SDG</span>
                </div>
              </div>

              {/* Bulk Profit Actions */}
              <div className="bg-gradient-to-br from-amber-500/10 via-amber-600/5 to-transparent p-4 rounded-xl border border-amber-200 shadow-xs">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
                      <LucideIcons.Sparkles className="w-4 h-4 text-amber-600" />
                      <span>{isAr ? 'أدوات التحكم السريع وتعديل الأسعار التلقائي' : 'Instant Pricing Multipliers'}</span>
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      {isAr
                        ? 'يمكنك زيادة جميع الأسعار دفعة واحدة بهامش ربح، أو إعادة ضبط الكتالوج الأصلي.'
                        : 'Easily apply percentage logic across all services instantly.'}
                    </p>
                  </div>

                  <div className="flex gap-2 flex-wrap items-center">
                    <button
                      onClick={handleApply20Markup}
                      className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-[10px] px-3 py-2 rounded-lg transition shadow-xs flex items-center gap-1"
                    >
                      <LucideIcons.Check className="w-3.5 h-3.5" />
                      <span>{isAr ? 'إضافة 20% لكل الأسعار ⚡' : 'Multiply all by +20%'}</span>
                    </button>

                    <button
                      onClick={() => handleApplyCustomMarkup(15)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] px-3 py-2 rounded-lg transition shadow-xs"
                    >
                      {isAr ? 'إضافة 15% 📈' : '+15% profit margin'}
                    </button>

                    <button
                      onClick={handleResetToFactoryDefaults}
                      className="bg-slate-800 hover:bg-slate-900 text-white font-bold text-[10px] px-3 py-2 rounded-lg transition shadow-xs flex items-center gap-1"
                    >
                      <LucideIcons.RotateCcw className="w-3.5 h-3.5 text-red-400" />
                      <span>{isAr ? 'إعادة ضبط مصنع الكتالوج' : 'Reset defaults'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Editable Subscription Prices Matrix */}
              <div className="space-y-4">
                <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                  {isAr ? 'جدول تعديل أسعار باقات الكتالوج المباشرة' : 'Direct pricing modification matrix'}
                </h4>

                <div className="space-y-4">
                  {services.map(service => (
                    <div key={service.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3.5">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-800">{isAr ? service.nameAr : service.nameEn}</span>
                          <span className="text-[9px] uppercase tracking-wider bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-mono">
                            {service.category}
                          </span>
                        </div>
                        
                        <button
                          onClick={() => handleDeleteService(service.id)}
                          className="text-[10px] font-bold text-red-650 text-red-500 hover:text-red-700 hover:underline flex items-center gap-1"
                        >
                          <LucideIcons.Trash2 className="w-3.5 h-3.5" />
                          <span>{isAr ? 'حذف هذه المنصة' : 'Delete'}</span>
                        </button>
                      </div>

                      {/* Plans Pricing Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {service.plans.map(plan => (
                          <div key={plan.id} className="bg-slate-50/80 p-3 rounded-lg border border-slate-200/50 flex flex-col justify-between gap-2 text-xs">
                            <div className="flex items-start justify-between">
                              <span className="font-bold text-slate-700 leading-snug">
                                {isAr ? plan.nameAr : plan.nameEn}
                              </span>
                              <span className="font-mono text-[10px] text-slate-400">/{isAr ? plan.periodAr : plan.periodEn}</span>
                            </div>

                            <div className="flex items-center gap-2">
                              {/* Price input field */}
                              <div className="relative flex-1">
                                <span className="absolute right-2 top-2.5 font-bold text-slate-455 text-slate-400 text-[10px]">
                                  {plan.currency === 'USD' ? '$' : 'ج.س'}
                                </span>
                                <input
                                  type="number"
                                  step="any"
                                  className="w-full bg-white border border-slate-200 rounded-lg py-1.5 pr-8 pl-3 text-xs font-extrabold text-slate-800 font-mono focus:outline-none focus:border-blue-600"
                                  value={plan.price}
                                  onChange={(e) => handlePriceChange(service.id, plan.id, parseFloat(e.target.value) || 0)}
                                />
                              </div>

                              {/* Toggle Best seller badge */}
                              <button
                                onClick={() => handlePopularToggle(service.id, plan.id)}
                                className={`px-2.5 py-1.5 rounded-lg border text-[10px] font-bold transition flex items-center gap-1 shrink-0 ${
                                  plan.isPopular
                                    ? 'bg-amber-500 text-white border-amber-600'
                                    : 'bg-white text-slate-500 hover:bg-slate-100 border-slate-250'
                                }`}
                              >
                                <LucideIcons.Star className="w-3 h-3 fill-current" />
                                <span>{isAr ? 'أكثر مبيعاً' : 'Popular'}</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* Tab 2: Create new Services platforms */}
          {activeTab === 'services' && (
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
              <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-4">
                {isAr ? 'إدخال منصة تفعيل جديدة مخصصة بالكامل' : 'Incorporate a newly registered Service channel'}
              </h4>

              <form onSubmit={handleCreateNewServiceAndSave} className="space-y-5">
                
                {/* Dual names */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">{isAr ? 'اسم المنصة (بالعربية) *' : 'Platform Name (Arabic) *'}</label>
                    <input
                      type="text"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-650"
                      placeholder="مثال: ياهو بلس، كانفا برو"
                      required
                      value={newServiceNameAr}
                      onChange={(e) => setNewServiceNameAr(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">{isAr ? 'اسم المنصة (بالانجليزية) *' : 'Platform Name (English) *'}</label>
                    <input
                      type="text"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-650"
                      placeholder="e.g. Canva Pro Office"
                      required
                      value={newServiceNameEn}
                      onChange={(e) => setNewServiceNameEn(e.target.value)}
                    />
                  </div>
                </div>

                {/* Category and icon */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">{isAr ? 'قسم الخدمات رئيسي' : 'Core service Category'}</label>
                    <select
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-805"
                      value={newServiceCategory}
                      onChange={(e) => setNewServiceCategory(e.target.value as CategoryType)}
                    >
                      <option value="intelligence">{isAr ? 'الذكاء الاصطناعي 🧠' : 'AI Intelligence'}</option>
                      <option value="business">{isAr ? 'أعمال ومحترفين 👔' : 'Business'}</option>
                      <option value="cloud">{isAr ? 'خدمات سحابية ☁️' : 'Cloud Setup'}</option>
                      <option value="entertainment">{isAr ? 'ترفيه وبث 🎬' : 'Media'}</option>
                      <option value="education">{isAr ? 'تعلم ولغات 🦉' : 'Study'}</option>
                      <option value="social">{isAr ? 'شبكات وتواصل ✈️' : 'Social Connection'}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">{isAr ? 'اسم أيقونة Lucide' : 'Lucide Vector component name'}</label>
                    <select
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-805 font-mono"
                      value={newIcon}
                      onChange={(e) => setNewIcon(e.target.value)}
                    >
                      <option value="BrainCircuit">BrainCircuit</option>
                      <option value="Sparkles">Sparkles</option>
                      <option value="MessageSquareCode">MessageSquareCode</option>
                      <option value="Linkedin">Linkedin</option>
                      <option value="Tv">Tv</option>
                      <option value="Youtube">Youtube</option>
                      <option value="Send">Send</option>
                      <option value="GraduationCap">GraduationCap</option>
                      <option value="Cloud">Cloud</option>
                      <option value="AppWindow">AppWindow</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">{isAr ? 'قالب المظهر والألوان' : 'Adaptive branding theme preset'}</label>
                    <select
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-805"
                      onChange={(e) => {
                        const sel = THEME_PRESETS[parseInt(e.target.value)];
                        if (sel) {
                          setNewAccentColor(sel.accent);
                          setNewTextColor(sel.text);
                          setNewBannerColor(sel.banner);
                        }
                      }}
                    >
                      {THEME_PRESETS.map((p, idx) => (
                        <option key={idx} value={idx}>{p.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Dual descriptions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">{isAr ? 'وصف المنصة (بالعربية)' : 'Description (Arabic)'}</label>
                    <textarea
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 h-16 resize-none focus:outline-none"
                      placeholder="اكتب وصفاً جذاباً لجذب انتباه المشتر كين بالسودان..."
                      value={newDescAr}
                      onChange={(e) => setNewDescAr(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">{isAr ? 'وصف المنصة (بالانجليزية)' : 'Description (English)'}</label>
                    <textarea
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 h-16 resize-none focus:outline-none"
                      placeholder="Write description in English..."
                      value={newDescEn}
                      onChange={(e) => setNewDescEn(e.target.value)}
                    />
                  </div>
                </div>

                {/* Dynamic plans list table */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-xs font-bold text-slate-700">{isAr ? 'باقات الاشتراك وأسعارها' : 'Tiers & prices list'}</span>
                    <button
                      type="button"
                      onClick={handleAddPlanToForm}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-705 text-slate-700 font-bold text-[10px] px-3 py-1 rounded border border-slate-250 flex items-center gap-1"
                    >
                      <LucideIcons.Plus className="w-3.5 h-3.5" />
                      <span>{isAr ? 'إضافة باقة/خطة جديدة' : 'Add Package tier'}</span>
                    </button>
                  </div>

                  {newPlans.map((p, idx) => (
                    <div key={idx} className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex flex-col gap-3">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                        
                        {/* Plan Name Ar */}
                        <div>
                          <input
                            type="text"
                            className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs text-slate-805"
                            placeholder={isAr ? 'اسم الباقة بالعربية' : 'Plan Name (Ar)'}
                            value={p.nameAr}
                            onChange={(e) => handleUpdatePlansField(idx, 'nameAr', e.target.value)}
                          />
                        </div>

                        {/* Plan Name En */}
                        <div>
                          <input
                            type="text"
                            className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs text-slate-805"
                            placeholder={isAr ? 'اسم الباقة بالانجليزية' : 'Plan Name (En)'}
                            value={p.nameEn}
                            onChange={(e) => handleUpdatePlansField(idx, 'nameEn', e.target.value)}
                          />
                        </div>

                        {/* Plan Price */}
                        <div className="flex gap-1">
                          <input
                            type="number"
                            className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs text-slate-805 font-mono"
                            placeholder="السعر"
                            value={p.price}
                            onChange={(e) => handleUpdatePlansField(idx, 'price', parseFloat(e.target.value) || 0)}
                          />
                          <select
                            className="bg-white border border-slate-200 rounded text-[11px] text-slate-805 px-1 font-mono"
                            value={p.currency}
                            onChange={(e) => handleUpdatePlansField(idx, 'currency', e.target.value)}
                          >
                            <option value="USD">USD</option>
                            <option value="SDG">SDG</option>
                          </select>
                        </div>

                        {/* Plan Period */}
                        <div>
                          <input
                            type="text"
                            className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs text-slate-805"
                            placeholder={isAr ? 'المدة (شهرياً/سنوياً)' : 'Period'}
                            value={p.periodAr}
                            onChange={(e) => handleUpdatePlansField(idx, 'periodAr', e.target.value)}
                          />
                        </div>

                      </div>
                    </div>
                  ))}
                </div>

                {/* Submitting button */}
                <div className="pt-3 border-t border-slate-100 flex justify-end">
                  <button
                    type="submit"
                    className="bg-blue-605 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2 px-6 rounded-lg transition shadow-md flex items-center gap-1.5"
                  >
                    <LucideIcons.Save className="w-4 h-4" />
                    <span>{isAr ? 'حفظ ونشر المنصة حالاً' : 'Publish & launch service now'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Tab: Managing Ads publishing */}
          {activeTab === 'ads' && (
            <div className="space-y-6 animate-fade-in">
              {/* Ad Creation Card */}
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
                <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-4">
                  {isAr ? 'إنشاء ونشر إعلان جديد' : 'Publish a new advertisement'}
                </h4>
                
                <form onSubmit={handleCreateAd} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">
                        {isAr ? 'نص الإعلان (بالعربية) *' : 'Ad Text (Arabic) *'}
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-600"
                        placeholder="مثال: ✨ تفعيل فوري لجميع باقات اشتراكات الذكاء الاصطناعي وجوجل ون خلال أقل من 15 دقيقة!"
                        value={adTextAr}
                        onChange={(e) => setAdTextAr(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">
                        {isAr ? 'نص الإعلان (بالانجليزية) *' : 'Ad Text (English) *'}
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-600"
                        placeholder="e.g., ✨ Special Deal: AI Plus accounts upgraded under 15 min!"
                        value={adTextEn}
                        onChange={(e) => setAdTextEn(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">
                        {isAr ? 'نوع الإعلان ومكانه' : 'Ad Placement Type'}
                      </label>
                      <select
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none"
                        value={adType}
                        onChange={(e) => setAdType(e.target.value as 'bar' | 'banner')}
                      >
                        <option value="bar">{isAr ? 'شريط إعلاني متحرك أعلى الموقع 📣' : 'Scrolling Header Bar'}</option>
                        <option value="banner">{isAr ? 'كرت إعلاني مميز في الكتالوج 🏷️' : 'Catalog Ad Card'}</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">
                        {isAr ? 'رابط الإعلان (اختياري)' : 'Target Link (Optional)'}
                      </label>
                      <input
                        type="url"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-blue-600"
                        placeholder="https://wa.me/..."
                        value={adLink}
                        onChange={(e) => setAdLink(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2 px-6 rounded-lg transition shadow-md flex items-center gap-1.5"
                    >
                      <LucideIcons.Megaphone className="w-4 h-4" />
                      <span>{isAr ? 'نشر الإعلان الآن 🚀' : 'Publish Ad Now'}</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Ads list matrix */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                  {isAr ? 'منصة الإعلانات المنشورة والمجدولة' : 'Currently published adverts'}
                </h4>

                {advertisements.length === 0 ? (
                  <div className="bg-white rounded-xl p-8 text-center border border-slate-200">
                    <p className="text-xs text-slate-500 font-bold">{isAr ? 'لا توجد إعلانات نشطة حالياً.' : 'No ads found.'}</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3">
                    {advertisements.map((ad) => (
                      <div key={ad.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] bg-slate-100 text-blue-600 border border-blue-200 px-2 py-0.5 rounded-full font-bold">
                              {ad.type === 'bar' ? (isAr ? 'شريط علوي' : 'Header Bar') : (isAr ? 'كرت بالكتالوج' : 'Catalog Card')}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {new Date(ad.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-xs font-bold text-slate-800 mt-1">{isAr ? ad.textAr : ad.textEn}</p>
                          {ad.link && (
                            <a href={ad.link} target="_blank" rel="noreferrer" className="text-[10px] text-blue-600 hover:underline block font-mono">
                              {ad.link}
                            </a>
                          )}
                        </div>

                        <div className="flex items-center gap-2.5 shrink-0">
                          {/* Active / Inactive Toggle */}
                          <button
                            onClick={() => handleToggleAd(ad.id)}
                            className={`px-3 py-1.5 rounded-lg border text-[10px] font-extrabold transition flex items-center gap-1 ${
                              ad.active
                                ? 'bg-green-50 text-green-700 border-green-200'
                                : 'bg-slate-50 text-slate-400 border-slate-200'
                            }`}
                          >
                            <LucideIcons.Globe className="w-3.5 h-3.5" />
                            <span>{ad.active ? (isAr ? 'منشور نشط' : 'Active') : (isAr ? 'مخفي مؤقتاً' : 'Hidden')}</span>
                          </button>

                          {/* Delete ad */}
                          <button
                            onClick={() => handleDeleteAd(ad.id)}
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                          >
                            <LucideIcons.Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab: Create and manage Special Offers */}
          {activeTab === 'offers' && (
            <div className="space-y-6 animate-fade-in">
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
                <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-4">
                  {isAr ? 'إدخال عرض ترويجي خاص وحصري' : 'Publish a new exclusive promotional offer'}
                </h4>

                <form onSubmit={handleCreateOffer} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">{isAr ? 'اسم العرض (بالعربية) *' : 'Offer Title (Arabic) *'}</label>
                      <input
                        type="text"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none"
                        placeholder="مثال: يوتيوب بريميوم العائلي السنوي"
                        required
                        value={offerTitleAr}
                        onChange={(e) => setOfferTitleAr(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">{isAr ? 'اسم العرض (بالانجليزية) *' : 'Offer Title (English) *'}</label>
                      <input
                        type="text"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-805"
                        placeholder="e.g., YouTube Premium Annual Family Plan"
                        required
                        value={offerTitleEn}
                        onChange={(e) => setOfferTitleEn(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">{isAr ? 'علامة مميزة (أبرز الباقة بالعربية)' : 'Discount Badge (Arabic)'}</label>
                      <input
                        type="text"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs"
                        placeholder="مثال: خصم 30% وشحن فوري"
                        value={offerBadgeAr}
                        onChange={(e) => setOfferBadgeAr(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">{isAr ? 'علامة مميزة (أبرز الباقة بالانجليزية)' : 'Discount Badge (English)'}</label>
                      <input
                        type="text"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs"
                        placeholder="e.g. 30% OFF - Quick activation"
                        value={offerBadgeEn}
                        onChange={(e) => setOfferBadgeEn(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="col-span-1">
                      <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">{isAr ? 'السعر المخفض' : 'Offer Price'}</label>
                      <input
                        type="number"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono"
                        placeholder="Price"
                        min="0"
                        step="any"
                        required
                        value={offerPrice || ''}
                        onChange={(e) => setOfferPrice(parseFloat(e.target.value) || 0)}
                      />
                    </div>

                    <div className="col-span-1">
                      <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">{isAr ? 'العملة' : 'Currency'}</label>
                      <select
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs"
                        value={offerCurrency}
                        onChange={(e) => setOfferCurrency(e.target.value as 'USD' | 'SDG')}
                      >
                        <option value="USD">USD ($)</option>
                        <option value="SDG">SDG (ج.س)</option>
                      </select>
                    </div>

                    <div className="col-span-1">
                      <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">{isAr ? 'المدة بالعربية' : 'Period (Arabic)'}</label>
                      <input
                        type="text"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs"
                        placeholder="مثال: سنوي"
                        value={offerPeriodAr}
                        onChange={(e) => setOfferPeriodAr(e.target.value)}
                      />
                    </div>

                    <div className="col-span-1">
                      <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">{isAr ? 'المدة بالانجليزية' : 'Period (English)'}</label>
                      <input
                        type="text"
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs"
                        placeholder="e.g. Annually"
                        value={offerPeriodEn}
                        onChange={(e) => setOfferPeriodEn(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">{isAr ? 'تفاصيل ووصف العرض بالعربية' : 'Description (Arabic)'}</label>
                      <textarea
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs h-16 resize-none"
                        placeholder="تفاصيل العرض والمميزات لتشجيع العميل..."
                        required
                        value={offerDescAr}
                        onChange={(e) => setOfferDescAr(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">{isAr ? 'تفاصيل ووصف العرض بالانجليزية' : 'Description (English)'}</label>
                      <textarea
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs h-16 resize-none"
                        placeholder="English promotional offer details..."
                        required
                        value={offerDescEn}
                        onChange={(e) => setOfferDescEn(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">
                        {isAr ? 'مميزات العرض وسطور الإقناع (بالعربية - سطر لكل ميزة) * (اختياري)' : 'Features (Arabic, one per line) (Optional)'}
                      </label>
                      <textarea
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-sans h-20 resize-none"
                        placeholder="ميزة 1&#10;ميزة 2&#10;ميزة 3"
                        value={offerFeaturesAr}
                        onChange={(e) => setOfferFeaturesAr(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-extrabold uppercase text-slate-400 mb-1">
                        {isAr ? 'مميزات العرض وسطور الإقناع (بالانجليزية - سطر لكل ميزة) (اختياري)' : 'Features (English, one per line) (Optional)'}
                      </label>
                      <textarea
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-sans h-20 resize-none"
                        placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                        value={offerFeaturesEn}
                        onChange={(e) => setOfferFeaturesEn(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex justify-end border-t border-slate-100 pt-3">
                    <button
                      type="submit"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 px-6 rounded-lg transition shadow-md flex items-center gap-1.5"
                    >
                      <LucideIcons.Save className="w-4 h-4" />
                      <span>{isAr ? 'تأكيد وإضافة العرض الحصري 🎉' : 'Publish Promotional Offer'}</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Special offers list */}
              <div className="space-y-3">
                <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                  {isAr ? 'العروض الحصريّة المتاحة حالياً بالكتالوج' : 'Promotional Offers Portfolio'}
                </h4>

                {specialOffers.length === 0 ? (
                  <div className="bg-white rounded-xl p-8 text-center border border-slate-200">
                    <p className="text-xs text-slate-500 font-bold">{isAr ? 'لا توجد عروض مخصصة حالياً.' : 'No promotional offers found.'}</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {specialOffers.map((offer) => (
                      <div key={offer.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-bold">
                              {isAr ? offer.badgeAr : offer.badgeEn}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {offer.currency === 'USD' ? `$${offer.price}` : `${offer.price.toLocaleString()} SDG`}
                            </span>
                          </div>
                          <h5 className="text-xs font-bold text-slate-800 mt-2">{isAr ? offer.titleAr : offer.titleEn}</h5>
                          <p className="text-[11px] text-slate-500 line-clamp-2">{isAr ? offer.descAr : offer.descEn}</p>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                          {/* Active Toggle Switch */}
                          <button
                            onClick={() => handleToggleOffer(offer.id)}
                            className={`px-3 py-1 rounded-lg border text-[10px] font-extrabold transition flex items-center gap-1 ${
                              offer.active
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-slate-50 text-slate-400 border-slate-200'
                            }`}
                          >
                            <LucideIcons.Check className="w-3.5 h-3.5" />
                            <span>{offer.active ? (isAr ? 'معروض نشط' : 'Active') : (isAr ? 'مخفي' : 'Hidden')}</span>
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => handleDeleteOffer(offer.id)}
                            className="p-1 px-2.5 bg-red-50 text-red-500 border border-red-200 rounded-md hover:bg-red-100 text-[10px] font-bold flex items-center gap-1 transition"
                          >
                            <LucideIcons.Trash2 className="w-3.5 h-3.5" />
                            <span>{isAr ? 'حذف' : 'Delete'}</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 3: Customer Incoming Request List */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <div>
                  <h4 className="text-xs font-extrabold text-slate-600 block uppercase tracking-wider">{isAr ? 'مستقبل طلبات الفواتير والتفعيل' : 'Active activation invoice tracker'}</h4>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {isAr ? 'الطلبات المفعّلة على الأجهزة تحفظ تلقائياً هنا للمراجعة والمصادقة هاتفياً.' : 'Simulated operations from clients globally.'}
                  </span>
                </div>

                <button
                  onClick={handleClearAllOrders}
                  className="p-1 px-3 bg-red-50 text-red-650 text-red-500 rounded border border-red-155 border-red-200 font-bold hover:bg-red-100 transition text-[10px]"
                >
                  {isAr ? 'تصفير الطلبات' : 'Reset all requests data'}
                </button>
              </div>

              {/* Statistical Distribution Overview (Pie Chart & metrics) */}
              {orders.length > 0 && (
                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                    <LucideIcons.PieChart className="w-4 h-4 text-blue-600" />
                    <h5 className="text-xs font-black text-slate-800">
                      {isAr ? 'توزيع حالات طلبات المشتركين' : 'Subscriber Order Allocation & Metrics'}
                    </h5>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    {/* Pie Chart Representation */}
                    <div className="h-[200px] w-full flex items-center justify-center relative">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={75}
                            paddingAngle={3}
                            dataKey="value"
                          >
                            {chartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              background: '#1e293b',
                              border: 'none',
                              borderRadius: '8px',
                              padding: '5px 8px',
                              fontSize: '11px',
                              color: '#fff',
                              direction: isAr ? 'rtl' : 'ltr'
                            }}
                            itemStyle={{ color: '#fff' }}
                          />
                        </PieChart>
                      </ResponsiveContainer>

                      {/* Displaying total number of orders in center */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-xl font-black text-slate-800 leading-none font-mono">
                          {totalOrdersCount}
                        </span>
                        <span className="text-[9px] text-slate-400 font-bold mt-1 text-center leading-none">
                          {isAr ? 'إجمالي الطلبات' : 'Total Requests'}
                        </span>
                      </div>
                    </div>

                    {/* Quick Metrics columns */}
                    <div className="space-y-2.5">
                      {/* Pending card */}
                      <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-amber-500 shrink-0" />
                          <div>
                            <p className="text-[10px] text-slate-500 font-bold leading-none">{isAr ? '⏳ قيد المعالجة' : 'Pending Verification'}</p>
                            <p className="text-xs font-black text-slate-800 font-mono mt-1">
                              {pendingCount} {isAr ? 'طلب' : 'orders'}
                            </p>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono font-black bg-amber-50 text-amber-700 px-2 py-0.5 rounded-md">
                          {totalOrdersCount > 0 ? Math.round((pendingCount / totalOrdersCount) * 100) : 0}%
                        </span>
                      </div>

                      {/* Completed card */}
                      <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-emerald-500 shrink-0" />
                          <div>
                            <p className="text-[10px] text-slate-500 font-bold leading-none">{isAr ? '✅ مفعّلة ومكتملة' : 'Activated & Done'}</p>
                            <p className="text-xs font-black text-slate-800 font-mono mt-1">
                              {completedCount} {isAr ? 'طلب مفعّل' : 'activations'}
                            </p>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono font-black bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md">
                          {totalOrdersCount > 0 ? Math.round((completedCount / totalOrdersCount) * 100) : 0}%
                        </span>
                      </div>

                      {/* Cancelled card */}
                      <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-red-500 shrink-0" />
                          <div>
                            <p className="text-[10px] text-slate-500 font-bold leading-none">{isAr ? '❌ ملغية ومرفوضة' : 'Cancelled / Unapproved'}</p>
                            <p className="text-xs font-black text-slate-800 font-mono mt-1">
                              {cancelledCount} {isAr ? 'طلب ملغي' : 'rejected'}
                            </p>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono font-black bg-red-50 text-red-700 px-2 py-0.5 rounded-md">
                          {totalOrdersCount > 0 ? Math.round((cancelledCount / totalOrdersCount) * 100) : 0}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {orders.length === 0 ? (
                <div className="bg-white rounded-xl p-12 text-center border border-slate-200 shadow-xs">
                  <LucideIcons.Inbox className="w-10 h-10 text-slate-455 text-slate-400 mx-auto mb-3" />
                  <h5 className="text-xs font-bold text-slate-700">
                    {isAr ? 'لا توجد طلبات تفعيل واردة حتى هذه اللحظة' : 'No incoming custom bookings yet'}
                  </h5>
                  <p className="text-[10px] text-slate-500 mt-1">
                    {isAr ? 'عندما يقوم أي زبون بملء الطلب والضغط على تأكيد، ستسجل حركة الطلب هنا.' : 'Simulate your services requests on device to populate.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-3.5">
                  {orders.map(order => (
                    <div key={order.id} className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 flex-wrap text-xs">
                          <span className="font-extrabold text-slate-800">{order.clientName}</span>
                          <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">
                            {order.serviceName} - {order.planName}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">#{order.id}</span>
                        </div>

                        <div className="text-[10px] text-slate-500 space-y-0.5">
                          <p>
                            <span className="font-bold">{isAr ? 'الحساب للتفعيل:' : 'Email target:'}</span>{' '}
                            <code className="bg-slate-50 px-1 border border-slate-100 rounded text-slate-800 select-all font-mono">
                              {order.activationDetail}
                            </code>
                          </p>
                          <p>
                            <span className="font-bold">{isAr ? 'هاتف العميل والواتساب:' : 'Client WhatsApp:'}</span>{' '}
                            <a href={`https://wa.me/${order.clientContact}`} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                              {order.clientContact}
                            </a>
                          </p>
                          <p className="text-slate-402 text-slate-400">
                            <span>{isAr ? 'مصدر الطلب وتاريخ الدفع:' : 'Date & origin:'}</span> {new Date(order.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                        <div className="text-left md:text-right">
                          <span className="text-sm font-black text-slate-905 text-slate-900 font-mono block">
                            {order.currency === 'USD' ? `$${order.price}` : `${order.price.toLocaleString()} SDG`}
                          </span>
                          <span className="text-[10px] uppercase font-bold text-slate-400 select-none block">
                            {order.paymentMethod}
                          </span>
                        </div>

                        {/* Change order status drop control */}
                        <select
                          className={`text-[11px] font-bold px-2 py-1 rounded-lg border-2 ${
                            order.status === 'completed'
                              ? 'bg-green-50 text-green-700 border-green-200'
                              : order.status === 'cancelled'
                              ? 'bg-red-50 text-red-705 text-red-700 border-red-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}
                          value={order.status}
                          onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as any)}
                        >
                          <option value="pending">{isAr ? '⏳ قيد المعالجة' : '⏳ Pending'}</option>
                          <option value="completed">{isAr ? '✅ تم التفعيل بنجاح' : '✅ Completed'}</option>
                          <option value="cancelled">{isAr ? '❌ ملغي بالرفض' : '❌ Cancelled'}</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer info about default admin */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-center text-[10px] text-slate-400 flex items-center justify-between px-6 shrink-0">
          <span>{isAr ? 'كافة البيانات محفوظة محلياً بالكامل' : 'Offline sandbox client control system active'}</span>
          <span className="font-mono text-[9px]">v1.4.0 (Activate Studio Core)</span>
        </div>

      </div>
    </div>
  );
}
