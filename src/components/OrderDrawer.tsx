import React, { useState } from 'react';
import { Service, Plan, Order } from '../types';
import { BANK_DETAILS_LIST } from '../data';
import * as LucideIcons from 'lucide-react';
import { PlatformLogo } from './PlatformLogo';

interface OrderDrawerProps {
  service: Service;
  plan: Plan;
  usdToSdgRate: number;
  lang: 'ar' | 'en';
  onClose: () => void;
  onOrderSuccess: (order: Order) => void;
  prefilledEmail?: string;
  isDarkMode?: boolean;
}

export default function OrderDrawer({
  service,
  plan,
  usdToSdgRate,
  lang,
  onClose,
  onOrderSuccess,
  prefilledEmail = '',
  isDarkMode = true,
}: OrderDrawerProps) {
  const isAr = lang === 'ar';

  // Client Input States
  const [clientName, setClientName] = useState('');
  const [clientContact, setClientContact] = useState('');
  const [activationDetail, setActivationDetail] = useState(prefilledEmail);
  const [paymentMethod, setPaymentMethod] = useState<'bankak' | 'fawry' | 'ocash'>('bankak');
  const [copiedState, setCopiedState] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Calculate prices based on plan currency and selected display
  const finalPriceInSdg = plan.currency === 'SDG' ? plan.price : plan.price * usdToSdgRate;
  const finalPriceInUsd = plan.currency === 'USD' ? plan.price : Math.round(plan.price / usdToSdgRate);

  // Pick bank information
  const getSelectedBank = () => {
    if (paymentMethod === 'bankak') return BANK_DETAILS_LIST[0];
    if (paymentMethod === 'fawry') return BANK_DETAILS_LIST[1];
    return BANK_DETAILS_LIST[2]; // O-Cash
  };

  const selectedBank = getSelectedBank();

  const handleCopyAccount = (number: string) => {
    navigator.clipboard.writeText(number);
    setCopiedState(true);
    setTimeout(() => setCopiedState(false), 2000);
  };

  const triggerWhatsAppRedirect = (order: Order) => {
    // 1. Determine target phone number based on service
    // Default to Netflix WhatsApp from Image 4 or LinkedIn from Image 2
    let phoneNo = '249113411965'; // Default Netflix/Cloudy +249113411965
    if (service.id === 'linkedin') {
      phoneNo = '256791472369'; // LinkedIn +256 791 472 369
    } else if (service.id === 'duolingo') {
      phoneNo = '249112786527'; // Duolingo from Image 5 (formatted correctly for international API)
    }

    // 2. Format a professional activation bill message
    const pMethodTitle = 
      paymentMethod === 'bankak'
        ? 'تطبيق بنكك (بنك الخرطوم)'
        : paymentMethod === 'fawry'
        ? 'فوري (بنك فيصل)'
        : 'أوكاش (بنك أمدرمان الوطني)';

    const priceText = plan.currency === 'SDG' 
      ? `${plan.price.toLocaleString('en-US')} SDG`
      : `${plan.price} USD (~${finalPriceInSdg.toLocaleString('en-US')} SDG)`;

    const textAr = `🚨 *طلب تفعيل اشتراك جديد - منصة Activate Sudan* 🚨

👤 *اسم العميل:* ${order.clientName}
📱 *رقم التواصل:* ${order.clientContact}
📦 *الخدمة المطلوبة:* ${service.nameAr}
⭐ *الباقة:* ${plan.nameAr}
💰 *القيمة الإجمالية:* ${priceText}
🎟️ *الحساب المراد تفعيله:* \`${order.activationDetail}\`
💳 *طريقة الدفع المختارة:* ${pMethodTitle}
🆔 *رقم الطلب:* \`${order.id}\`

💡 _ملاحظة: قمت بتحويل القيمة المطلوبة وأنا جاهز لإرفاق صورة التحويل الإلكترونية لتنشيط الخدمة في دقائق._`;

    const textEn = `🚨 *NEW ACTIVATION REQUEST - Activate Sudan* 🚨

👤 *Customer Name:* ${order.clientName}
📱 *Contact Number:* ${order.clientContact}
📦 *Service:* ${service.nameEn}
⭐ *Plan:* ${plan.nameEn}
💰 *Total Price:* ${priceText}
🎟 *Account to Activate:* \`${order.activationDetail}\`
💳 *Payment Gateway:* ${paymentMethod.toUpperCase()}
🆔 *Order Reference:* \`${order.id}\`

💡 _Note: I processed the electronic payment and am ready to supply screenshot for quick service authorization._`;

    const finalMessage = isAr ? textAr : textEn;
    const encodedMessage = encodeURIComponent(finalMessage);
    const whatsappUrl = `https://wa.me/${phoneNo}?text=${encodedMessage}`;
    
    // Open in separate tab
    window.open(whatsappUrl, '_blank');
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!clientName.trim()) {
      setErrorMsg(isAr ? 'يرجى إدخال اسمك بالكامل' : 'Please enter your full name');
      return;
    }
    if (!clientContact.trim()) {
      setErrorMsg(isAr ? 'يرجى كتابة رقم الواتساب أو الهاتف لمتابعتك' : 'WhatsApp number is required');
      return;
    }
    if (!activationDetail.trim()) {
      setErrorMsg(isAr ? 'يرجى كتابة بريدك الإلكتروني أو حساب التفعيل' : 'Email/Account detail is required');
      return;
    }

    const orderId = 'ACT-' + Math.floor(100000 + Math.random() * 900000);
    const newOrder: Order = {
      id: orderId,
      serviceId: service.id,
      serviceName: isAr ? service.nameAr : service.nameEn,
      planId: plan.id,
      planName: isAr ? plan.nameAr : plan.nameEn,
      price: plan.price,
      currency: plan.currency,
      clientName: clientName.trim(),
      clientContact: clientContact.trim(),
      activationDetail: activationDetail.trim(),
      paymentMethod,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    // Store order log into localized state
    onOrderSuccess(newOrder);

    // Call WhatsApp hook
    triggerWhatsAppRedirect(newOrder);
  };

  return (
    <div
      id="order-drawer-backdrop"
      className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto animate-fade-in"
    >
      <div
        id="order-drawer-container"
        className={`border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative flex flex-col transition-colors duration-300 ${
          isDarkMode ? 'bg-[#1e293b] border-slate-700/60 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
        }`}
        dir={isAr ? 'rtl' : 'ltr'}
      >
        {/* Draw Header */}
        <div className={`p-5 border-b sticky top-0 z-10 flex justify-between items-center transition-colors duration-300 ${
          isDarkMode ? 'border-slate-800 bg-[#1e293b]' : 'border-slate-100 bg-white'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-1.5 rounded-xl border flex items-center justify-center shrink-0 w-11 h-11 ${
              isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200/60'
            }`}>
              <PlatformLogo serviceId={service.id} fallbackIconName={service.iconName} className="w-8 h-8" />
            </div>
            <div>
              <span className={`text-xs font-bold uppercase tracking-widest block mb-0.5 ${
                isDarkMode ? 'text-amber-400' : 'text-blue-600'
              }`}>
                {isAr ? 'الطلب والتنشيط الفوري' : 'Direct Checkout & Activation'}
              </span>
              <h3 className={`text-base sm:text-lg font-bold flex items-center gap-1 leading-tight ${
                isDarkMode ? 'text-white' : 'text-slate-800'
              }`}>
                <span>{isAr ? 'طلب اشتراك: ' : 'Order for: '}</span>
                <span className={`font-extrabold ${isDarkMode ? 'text-amber-400' : 'text-blue-600'}`}>{isAr ? service.nameAr : service.nameEn}</span>
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-all duration-150 ${
              isDarkMode ? 'bg-slate-850 text-slate-400 hover:text-white hover:bg-slate-805' : 'bg-slate-100 text-slate-500 hover:text-slate-800 hover:bg-slate-200'
            }`}
            title={isAr ? 'إغلاق' : 'Close'}
          >
            <LucideIcons.X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Summary Box */}
          <div className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors duration-300 ${
            isDarkMode ? 'bg-slate-900/60 border-slate-850' : 'bg-slate-50/70 border-slate-200/60'
          }`}>
            <div>
              <p className="text-xs text-slate-400">{isAr ? 'الباقة المختارة' : 'Selected Plan'}</p>
              <h4 className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{isAr ? plan.nameAr : plan.nameEn}</h4>
              <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {isAr ? 'تحديث وتفعيل آمن ورسمي بالكامل خلال ساعة واحدة.' : 'Secure guaranteed official upgrades within an hour.'}
              </p>
            </div>
            <div className={`md:text-left py-2 px-4 rounded-lg border transition-colors ${
              isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <span className="text-xs text-slate-400 block">{isAr ? 'سعر الاشتراك' : 'Subscription Price'}</span>
              <span className={`text-lg font-extrabold font-mono ${isDarkMode ? 'text-amber-400' : 'text-blue-600'}`}>
                {plan.currency === 'USD' ? `$${plan.price}` : `${plan.price.toLocaleString()} SDG`}
              </span>
              {/* If plan is SDG, show USD estimated conversion, and vice versa */}
              <span className="text-[10px] text-slate-400 block mt-0.5">
                {plan.currency === 'USD'
                  ? `~ ${finalPriceInSdg.toLocaleString()} SDG`
                  : `~ $${finalPriceInUsd}`}
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmitOrder} className="space-y-5">
            {errorMsg && (
              <div className="p-3.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-200 text-xs flex items-center gap-2">
                <LucideIcons.AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Input fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-xs font-semibold mb-1.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                  {isAr ? 'الاسم بالكامل (ثلاثي) *' : 'Full Name (3 Names) *'}
                </label>
                <div className="relative">
                  <LucideIcons.User className="w-4 h-4 text-slate-400 absolute top-3.5 right-3.5 pointer-events-none" />
                  <input
                    type="text"
                    required
                    placeholder={isAr ? 'مثال: عثمان الطيب الفاضل' : 'e.g. Osman Yahia El-Fadil'}
                    className={`w-full border rounded-xl py-3 pr-10 pl-4 text-sm focus:outline-none transition ${
                      isDarkMode 
                        ? 'bg-slate-900 border-slate-800 text-white focus:border-amber-500 focus:bg-slate-950/80' 
                        : 'bg-slate-50/50 border-slate-200 text-slate-800 focus:border-blue-500 focus:bg-white'
                    }`}
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-xs font-semibold mb-1.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                  {isAr ? 'رقم الواتساب للتواصل وتأكيد التفعيل *' : 'WhatsApp Number for Status Updates *'}
                </label>
                <div className="relative">
                  <LucideIcons.Phone className="w-4 h-4 text-slate-400 absolute top-3.5 right-3.5 pointer-events-none" />
                  <input
                    type="text"
                    required
                    placeholder={isAr ? 'مثال: 0123456789' : 'e.g. +249113411965'}
                    className={`w-full border rounded-xl py-3 pr-10 pl-4 text-sm font-mono focus:outline-none transition ${
                      isDarkMode 
                        ? 'bg-slate-900 border-slate-800 text-white focus:border-amber-500 focus:bg-slate-950/80' 
                        : 'bg-slate-50/50 border-slate-200 text-slate-800 focus:border-blue-500 focus:bg-white'
                    }`}
                    value={clientContact}
                    onChange={(e) => setClientContact(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className={`block text-xs font-semibold mb-1.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                {isAr
                  ? 'البريد الإلكتروني / الحساب المراد تفعيل الاشتراك عليه *'
                  : 'Email / Profile URL to Activate Premium on *'}
              </label>
              <div className="relative">
                <LucideIcons.Mail className="w-4 h-4 text-slate-400 absolute top-3.5 right-3.5 pointer-events-none" />
                <input
                  type="text"
                  required
                  placeholder={
                    service.id === 'linkedin'
                      ? (isAr ? 'أدخل رابط حسابك الشخصي أو إيميل التسجيل' : 'LinkedIn Profile Link or registered Gmail')
                      : (isAr ? 'أدخل بريد الدخول أو حساب البرنامج' : 'Account login email address')
                  }
                  className={`w-full border rounded-xl py-3 pr-10 pl-4 text-sm focus:outline-none transition ${
                    isDarkMode 
                      ? 'bg-slate-900 border-slate-800 text-white focus:border-amber-500 focus:bg-slate-950/80' 
                      : 'bg-slate-50/50 border-slate-200 text-slate-800 focus:border-blue-500 focus:bg-white'
                  }`}
                  value={activationDetail}
                  onChange={(e) => setActivationDetail(e.target.value)}
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1 leading-normal">
                {isAr
                  ? '⚠️ لن نطلب كلمة السر الخاصة بك مطلقاً. يعتمد التفعيل على البريد الشخصي أو الروابط الرسمية للخدمة.'
                  : '⚠️ We will never ask for your password. Activations are applied using premium invites or profile configurations.'}
              </p>
            </div>

            {/* Payment Portal Options */}
            <div>
              <label className={`block text-xs font-semibold mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                {isAr ? 'اختر طريقة الدفع المناسبة' : 'Select Payment Method'}
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('bankak')}
                  className={`py-3 px-2 rounded-xl border text-center transition flex flex-col items-center gap-1.5 cursor-pointer ${
                    paymentMethod === 'bankak'
                      ? (isDarkMode ? 'border-amber-500 bg-amber-500/10 text-amber-400 font-bold' : 'border-blue-600 bg-blue-50/40 text-blue-700 font-bold')
                      : (isDarkMode ? 'border-slate-800 bg-slate-900 text-slate-400 hover:bg-slate-850' : 'border-slate-200 bg-slate-50/50 text-slate-500 hover:bg-slate-55')
                  }`}
                >
                  <LucideIcons.Wallet className="w-4 h-4" />
                  <span className="text-[10px] sm:text-xs">{isAr ? 'تطبيق بنكك' : 'Bankak'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('fawry')}
                  className={`py-3 px-2 rounded-xl border text-center transition flex flex-col items-center gap-1.5 cursor-pointer ${
                    paymentMethod === 'fawry'
                      ? (isDarkMode ? 'border-amber-500 bg-amber-500/10 text-amber-400 font-bold' : 'border-blue-600 bg-blue-50/40 text-blue-700 font-bold')
                      : (isDarkMode ? 'border-slate-800 bg-slate-900 text-slate-400 hover:bg-slate-850' : 'border-slate-200 bg-slate-50/50 text-slate-500 hover:bg-slate-55')
                  }`}
                >
                  <LucideIcons.CheckSquare className="w-4 h-4" />
                  <span className="text-[10px] sm:text-xs">{isAr ? 'فوري' : 'Fawry'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('ocash')}
                  className={`py-3 px-2 rounded-xl border text-center transition flex flex-col items-center gap-1.5 cursor-pointer ${
                    paymentMethod === 'ocash'
                      ? (isDarkMode ? 'border-amber-500 bg-amber-500/10 text-amber-400 font-bold' : 'border-blue-600 bg-blue-50/40 text-blue-700 font-bold')
                      : (isDarkMode ? 'border-slate-800 bg-slate-900 text-slate-400 hover:bg-slate-850' : 'border-slate-200 bg-slate-50/50 text-slate-500 hover:bg-slate-55')
                  }`}
                >
                  <LucideIcons.Smartphone className="w-4 h-4" />
                  <span className="text-[10px] sm:text-xs">{isAr ? 'أوكاش' : 'O-Cash'}</span>
                </button>
              </div>
            </div>

            {/* Selected Payee Bank Instructions Card */}
            <div className={`p-4 rounded-xl border space-y-3.5 transition-colors duration-300 ${
              isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50/40 border-slate-200'
            }`}>
              <div className={`flex items-center justify-between border-b pb-2.5 ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                <div className="flex items-center gap-2">
                  <div className={`p-1 px-2 text-xs rounded-md font-bold animate-pulse ${
                    isDarkMode ? 'bg-amber-500/10 text-amber-400' : 'bg-blue-50 text-blue-700'
                  }`}>
                    {isAr ? 'تحويل تفعيل' : 'Direct deposit'}
                  </div>
                  <span className={`text-xs font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                    {isAr ? selectedBank.bankNameAr : selectedBank.bankNameEn}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className={`flex justify-between items-center px-3 py-2.5 rounded-lg border transition-colors ${
                  isDarkMode ? 'bg-slate-950/80 border-slate-850' : 'bg-white border-slate-200'
                }`}>
                  <div>
                    <span className="text-[10px] text-slate-400 block">
                      {isAr ? 'رقم الحساب للتحويل' : 'Account Number'}
                    </span>
                    <span className={`text-sm font-mono font-bold select-all break-all ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                      {selectedBank.accountNumber}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyAccount(selectedBank.accountNumber)}
                    className={`p-1.5 rounded-md transition ${
                      isDarkMode ? 'bg-slate-800 text-slate-400 hover:bg-slate-705 lg:hover:text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800'
                    }`}
                    title={isAr ? 'نسخ الرقم' : 'Copy'}
                  >
                    {copiedState ? (
                      <LucideIcons.Check className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <LucideIcons.Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>

                <div className={`flex justify-between items-center px-3 py-1.5 rounded-lg text-xs transition ${
                  isDarkMode ? 'bg-slate-900/50 text-slate-350' : 'bg-slate-50/50 text-slate-650'
                }`}>
                  <span className="text-slate-400">{isAr ? 'اسم المستفيد:' : 'Beneficiary Name:'}</span>
                  <span className={`font-semibold ${isDarkMode ? 'text-amber-400' : 'text-slate-700'}`}>{isAr ? selectedBank.accountNameAr : selectedBank.accountNameEn}</span>
                </div>
              </div>

              <div className={`text-xs leading-relaxed p-3 rounded-lg border flex gap-2 ${
                isDarkMode ? 'bg-amber-500/10 border-amber-500/15 text-slate-300' : 'bg-blue-50/30 border-blue-100/50 text-slate-600'
              }`}>
                <LucideIcons.Info className={`w-4 h-4 shrink-0 mt-0.5 ${isDarkMode ? 'text-amber-400' : 'text-blue-500'}`} />
                <p>{isAr ? selectedBank.transferGuideAr : selectedBank.transferGuideEn}</p>
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                className={`flex-1 font-extrabold py-3 rounded-xl transition flex items-center justify-center gap-2 text-sm shadow-md cursor-pointer ${
                  isDarkMode 
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 hover:brightness-110 shadow-orange-500/10' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                <LucideIcons.MessageSquare className="w-5 h-5 shrink-0" />
                <span>{isAr ? 'متابعة الطلب وتأكيد بالواتساب' : 'Submit & Authorize on WhatsApp'}</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className={`py-3 px-5 rounded-xl transition text-xs font-semibold cursor-pointer ${
                  isDarkMode 
                    ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {isAr ? 'إلغاء وتعديل' : 'Cancel'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
