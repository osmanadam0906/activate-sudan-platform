import React, { useState } from 'react';
import { CartItem, Order } from '../types';
import { BANK_DETAILS_LIST } from '../data';
import * as LucideIcons from 'lucide-react';
import { PlatformLogo } from './PlatformLogo';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  lang: 'ar' | 'en';
  usdToSdgRate: number;
  onUpdateQuantity: (itemId: string, qty: number) => void;
  onRemoveItem: (itemId: string) => void;
  onClearCart: () => void;
  onOrderSuccess: (order: Order) => void;
  userFullName?: string;
  userEmail?: string;
  isDarkMode?: boolean;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  lang,
  usdToSdgRate,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onOrderSuccess,
  userFullName = '',
  userEmail = '',
  isDarkMode = true,
}: CartDrawerProps) {
  const isAr = lang === 'ar';

  // Checkout states inside cart
  const [isCheckoutMode, setIsCheckoutMode] = useState(false);
  const [clientName, setClientName] = useState(userFullName);
  const [clientContact, setClientContact] = useState('');
  const [activationDetail, setActivationDetail] = useState(userEmail);
  const [paymentMethod, setPaymentMethod] = useState<'bankak' | 'fawry' | 'ocash'>('bankak');
  const [copiedState, setCopiedState] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  // Calculate cart totals
  const totalSdg = cart.reduce((sum, item) => {
    const priceInSdg = item.plan.currency === 'SDG' ? item.plan.price : item.plan.price * usdToSdgRate;
    return sum + priceInSdg * item.quantity;
  }, 0);

  const totalUsd = cart.reduce((sum, item) => {
    const priceInUsd = item.plan.currency === 'USD' ? item.plan.price : item.plan.price / usdToSdgRate;
    return sum + priceInUsd * item.quantity;
  }, 0);

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

  const triggerConsolidatedWhatsApp = (batchOrderId: string) => {
    // Determine default helpline depending on premium products (e.g. LinkedIn / general)
    const hasLinkedIn = cart.some(item => item.service.id === 'linkedin');
    const phoneNo = hasLinkedIn ? '256791472369' : '249113411965';

    const pMethodTitle = 
      paymentMethod === 'bankak'
        ? 'تطبيق بنكك (بنك الخرطوم)'
        : paymentMethod === 'fawry'
        ? 'فوري (بنك فيصل)'
        : 'أوكاش (بنك أمدرمان الوطني)';

    // Construct highly professional purchase report
    let itemsTextAr = '';
    let itemsTextEn = '';

    cart.forEach((item, index) => {
      const priceText = item.plan.currency === 'SDG'
        ? `${item.plan.price.toLocaleString('en-US')} SDG`
        : `$${item.plan.price} (~${(item.plan.price * usdToSdgRate).toLocaleString('en-US')} SDG)`;

      itemsTextAr += `\n   ${index + 1}. *${item.service.nameAr}* - ${item.plan.nameAr}\n      الكمية: ${item.quantity} × السعر: ${priceText}\n`;
      itemsTextEn += `\n   ${index + 1}. *${item.service.nameEn}* - ${item.plan.nameEn}\n      Qty: ${item.quantity} × Price: ${priceText}\n`;
    });

    const textAr = `🛍️ *فاتورة مشتريات جديدة من سلة تفعيلك* 🛍️
━━━━━━━━━━━━━━━━━━
👤 *اسم العميل:* ${clientName}
📱 *رقم التواصل:* ${clientContact}
🎟️ *حساب التفعيل الأساسي:* \`${activationDetail}\`
💳 *وسيلة التحويل المعتمدة:* ${pMethodTitle}
🆔 *الرقم المرجعي للطلب:* \`${batchOrderId}\`
━━━━━━━━━━━━━━━━━━
📦 *المنتجات المطلوبة:*
${itemsTextAr}
━━━━━━━━━━━━━━━━━━
💰 *إجمالي القيمة الكلية:*
   🔗 *${totalSdg.toLocaleString('en-US')} SDG* (~$${Math.round(totalUsd)})

💡 _ملاحظة: لقد قمت بإجراء التحويل المصرفي بنجاح ومستعد لإرسال إشعار التحويل لتفعيل باقاتي فوراً ⚡._`;

    const textEn = `🛍️ *NEW CART BILLING INVOICE - Activate Sudan* 🛍️
━━━━━━━━━━━━━━━━━━
👤 *Customer Name:* ${clientName}
📱 *Contact Number:* ${clientContact}
🎟️ *Primary Account:* \`${activationDetail}\`
💳 *Payment Gateway:* ${paymentMethod.toUpperCase()}
🆔 *Invoice ID:* \`${batchOrderId}\`
━━━━━━━━━━━━━━━━━━
📦 *Requested Licenses & Plans:*
${itemsTextEn}
━━━━━━━━━━━━━━━━━━
💰 *Consolidated Total:*
   🔗 *${totalSdg.toLocaleString('en-US')} SDG* (~$${Math.round(totalUsd)})

💡 _Note: I processed the electronic transfer and will provide the transaction screenshot to start immediate verification._`;

    const finalMessage = isAr ? textAr : textEn;
    const whatsappUrl = `https://wa.me/${phoneNo}?text=${encodeURIComponent(finalMessage)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!clientName.trim()) {
      setErrorMsg(isAr ? 'يرجى إدخال اسمك بالكامل' : 'Please enter your full name');
      return;
    }
    if (!clientContact.trim()) {
      setErrorMsg(isAr ? 'يرجى كتابة رقم الواتساب بالكامل' : 'WhatsApp contact number is required');
      return;
    }
    if (!activationDetail.trim()) {
      setErrorMsg(isAr ? 'يرجى كتابة بريد التفعيل الإلكتروني' : 'Activation email address is required');
      return;
    }

    const batchOrderId = 'ACT-B' + Math.floor(100000 + Math.random() * 900000);

    // Save individual logs to admin panel so admin sees details
    cart.forEach((item) => {
      const subOrder: Order = {
        id: `${batchOrderId}-${item.service.id}`,
        serviceId: item.service.id,
        serviceName: isAr ? item.service.nameAr : item.service.nameEn,
        planId: item.plan.id,
        planName: isAr ? `${item.plan.nameAr} (${item.quantity}x)` : `${item.plan.nameEn} (${item.quantity}x)`,
        price: item.plan.price * item.quantity,
        currency: item.plan.currency,
        clientName: clientName.trim(),
        clientContact: clientContact.trim(),
        activationDetail: activationDetail.trim(),
        paymentMethod,
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      onOrderSuccess(subOrder);
    });

    // Trigger Consolidated WhatsApp invoice redirect
    triggerConsolidatedWhatsApp(batchOrderId);

    // Clear and close
    onClearCart();
    setIsCheckoutMode(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-xs animate-fade-in font-sans">
      {/* Drawer Container Panel */}
      <div className={`w-full max-w-md h-full shadow-2xl flex flex-col transition-transform duration-300 ${
        isDarkMode ? 'bg-[#1e293b] text-white border-l border-slate-800' : 'bg-white text-slate-850 border-l border-slate-200'
      }`}>
        {/* Top Header */}
        <div className={`p-4 border-b flex items-center justify-between ${
          isDarkMode ? 'border-slate-800 bg-slate-900/60' : 'border-slate-100 bg-slate-50'
        }`}>
          <div className="flex items-center gap-2">
            <LucideIcons.ShoppingCart className="w-5 h-5 text-amber-500 animate-pulse" />
            <h3 className="font-black text-sm sm:text-base">
              {isAr ? 'سلة تسوق تفعيلك الذكية' : 'My Smart Invoice Cart'}
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-800 text-amber-400 rounded-md border border-slate-700">
              {cart.length} {isAr ? 'باقات' : 'Items'}
            </span>
          </div>

          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition ${
              isDarkMode ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-slate-200 text-slate-600 hover:text-slate-900'
            }`}
          >
            <LucideIcons.X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Section */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center text-slate-400 border border-slate-700">
                <LucideIcons.ShoppingBag className="w-8 h-8 text-amber-500" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-350">{isAr ? 'سلة التسوق فارغة تماماً!' : 'Your activation basket is empty!'}</p>
                <p className="text-xs text-slate-400">
                  {isAr 
                    ? 'تصفح باقات تليجرام، دولينجو، نتفليكس وأضف ما ترغب لتفعيله اليوم دفعة واحدة وبضمان متكامل.'
                    : 'Browse through our premium networks (Telegram, Duolingo, etc) and pile up activations.'}
                </p>
              </div>
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition"
              >
                {isAr ? 'متابعة تصفح المتجر 🛍️' : 'Start Browsing Subscriptions'}
              </button>
            </div>
          ) : !isCheckoutMode ? (
            /* List of Cart Items Mode */
            <div className="space-y-3.5">
              {cart.map((item) => {
                const priceInSdg = item.plan.currency === 'SDG' ? item.plan.price : item.plan.price * usdToSdgRate;
                return (
                  <div
                    key={item.id}
                    className={`p-3.5 rounded-2xl border flex items-start gap-3 transition ${
                      isDarkMode ? 'bg-slate-900/40 border-slate-800/80' : 'bg-slate-50 border-slate-200/80'
                    }`}
                  >
                    {/* Launcher Icon Box */}
                    <div className={`p-1.5 rounded-xl shrink-0 w-12 h-12 flex items-center justify-center border ${
                      isDarkMode ? 'bg-slate-800 border-slate-700/60' : 'bg-white border-slate-200'
                    }`}>
                      <PlatformLogo serviceId={item.service.id} fallbackIconName={item.service.iconName} className="w-8 h-8" />
                    </div>

                    {/* Meta info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs sm:text-sm font-black truncate leading-tight">
                        {isAr ? item.service.nameAr : item.service.nameEn}
                      </h4>
                      <p className="text-[11px] text-slate-400 font-bold mt-1 max-w-[200px] truncate">
                        {isAr ? item.plan.nameAr : item.plan.nameEn}
                      </p>
                      <p className="text-xs text-amber-500 font-black font-mono mt-1.5">
                        {priceInSdg.toLocaleString()} SDG
                        <span className="text-[9px] text-slate-400 font-medium px-1">
                          (~ ${item.plan.currency === 'USD' ? item.plan.price : Math.round(item.plan.price / usdToSdgRate)})
                        </span>
                      </p>
                    </div>

                    {/* Quantity controls and remover */}
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-slate-400 hover:text-rose-500 transition p-1"
                        title={isAr ? 'حذف من السلة' : 'Remove item'}
                      >
                        <LucideIcons.Trash2 className="w-4 h-4" />
                      </button>

                      <div className={`flex items-center rounded-lg border p-0.5 ${
                        isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200 shadow-3xs'
                      }`}>
                        <button
                          onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                          className="p-1 hover:text-amber-500 text-slate-400 transition"
                        >
                          <LucideIcons.Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-black font-mono px-2.5">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:text-amber-500 text-slate-400 transition"
                        >
                          <LucideIcons.Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Clear all basket option */}
              <button
                onClick={onClearCart}
                className="w-full text-center text-[11px] py-1 text-red-400 hover:text-red-300 transition-colors font-extrabold flex items-center justify-center gap-1.5"
              >
                <LucideIcons.Trash className="w-3.5 h-3.5" />
                <span>{isAr ? 'تفريغ وتصفير السلة بالكامل 🧹' : 'Empty Whole Shopping Cart 🧹'}</span>
              </button>
            </div>
          ) : (
            /* Checkout Mode Form inside CartDrawer */
            <form onSubmit={handleCheckoutSubmit} className="space-y-4">
              <div className={`p-4 rounded-xl border ${
                isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <h4 className="text-xs font-black text-amber-500 uppercase tracking-widest block mb-2">
                  {isAr ? 'دفع آمن مع تفعيلك المعتمد' : 'Consolidated Payment details'}
                </h4>
                <div className="flex justify-between items-center text-xs font-bold font-mono">
                  <span className="text-slate-400">{isAr ? 'المبلغ الإجمالي الكلي:' : 'Grand Total:'}</span>
                  <span className="text-sm font-black text-emerald-400">
                    {totalSdg.toLocaleString()} SDG (~${Math.round(totalUsd)})
                  </span>
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 bg-red-950/40 border border-red-800 rounded-lg text-red-300 text-xs flex items-center gap-2">
                  <LucideIcons.AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Form Input areas */}
              <div className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    {isAr ? 'الاسم بالكامل (ثلاثي) *' : 'Your Full Name *'}
                  </label>
                  <div className="relative">
                    <LucideIcons.User className="w-3.5 h-3.5 text-slate-500 absolute top-3 right-3" />
                    <input
                      type="text"
                      required
                      placeholder={isAr ? 'مثال: عثمان الطيب الفاضل' : 'e.g. Osman Yahia'}
                      className={`w-full py-2.5 pr-9 pl-3 text-xs rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500 border ${
                        isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                      }`}
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    {isAr ? 'رقم الواتساب للتفعيل والتحديثات *' : 'WhatsApp Contact Number *'}
                  </label>
                  <div className="relative">
                    <LucideIcons.Phone className="w-3.5 h-3.5 text-slate-500 absolute top-3 right-3" />
                    <input
                      type="text"
                      required
                      placeholder={isAr ? 'مثال: 0123456789' : 'e.g. +249112345678'}
                      className={`w-full py-2.5 pr-9 pl-3 text-xs rounded-xl font-mono focus:outline-none focus:ring-1 focus:ring-amber-500 border ${
                        isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                      }`}
                      value={clientContact}
                      onChange={(e) => setClientContact(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">
                    {isAr ? 'البريد الإلكتروني الأساسي للتفعيلات *' : 'Primary Invite E-mail *'}
                  </label>
                  <div className="relative">
                    <LucideIcons.Mail className="w-3.5 h-3.5 text-slate-500 absolute top-3 right-3" />
                    <input
                      type="email"
                      required
                      placeholder="example@gmail.com"
                      className={`w-full py-2.5 pr-9 pl-3 text-xs rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500 border ${
                        isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
                      }`}
                      value={activationDetail}
                      onChange={(e) => setActivationDetail(e.target.value)}
                    />
                  </div>
                  <p className="text-[9px] text-slate-450 text-slate-400 mt-1 leading-normal">
                    {isAr ? '💡 هذا البريد ستتم إضافة التفعيلات والمجموعات عليه مباشرة.' : '💡 Invite keys are dispatched directly to this email.'}
                  </p>
                </div>

                {/* Bank Gateways Options */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1.5">
                    {isAr ? 'طريقة التحويل الإلكتروني' : 'Bank Gateway'}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('bankak')}
                      className={`py-2 px-1 rounded-xl border text-center transition flex flex-col items-center gap-1 ${
                        paymentMethod === 'bankak'
                          ? 'border-blue-500 bg-blue-950/20 text-blue-400 font-bold'
                          : 'border-slate-800 bg-slate-900/30 text-slate-500 hover:bg-slate-900/50'
                      }`}
                    >
                      <LucideIcons.Wallet className="w-3.5 h-3.5" />
                      <span className="text-[9px] sm:text-xs">{isAr ? 'تطبيق بنكك' : 'Bankak'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('fawry')}
                      className={`py-2 px-1 rounded-xl border text-center transition flex flex-col items-center gap-1 ${
                        paymentMethod === 'fawry'
                          ? 'border-blue-500 bg-blue-950/20 text-blue-400 font-bold'
                          : 'border-slate-800 bg-slate-900/30 text-slate-500 hover:bg-slate-900/50'
                      }`}
                    >
                      <LucideIcons.CheckSquare className="w-3.5 h-3.5" />
                      <span className="text-[9px] sm:text-xs">{isAr ? 'فوري' : 'Fawry'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('ocash')}
                      className={`py-2 px-1 rounded-xl border text-center transition flex flex-col items-center gap-1 ${
                        paymentMethod === 'ocash'
                          ? 'border-blue-500 bg-blue-950/20 text-blue-400 font-bold'
                          : 'border-slate-800 bg-slate-900/30 text-slate-500 hover:bg-slate-900/50'
                      }`}
                    >
                      <LucideIcons.Smartphone className="w-3.5 h-3.5" />
                      <span className="text-[9px] sm:text-xs">{isAr ? 'أوكاش' : 'O-Cash'}</span>
                    </button>
                  </div>
                </div>

                {/* Acc Details Box */}
                <div className={`p-3.5 rounded-xl border space-y-2.5 ${
                  isDarkMode ? 'bg-slate-900/30 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-bold">
                      {isAr ? selectedBank.bankNameAr : selectedBank.bankNameEn}
                    </span>
                    <span className="text-[8px] bg-sky-950 text-sky-400 px-1.5 py-0.5 rounded border border-sky-850">
                      {isAr ? 'مستقبل تفعيلك المعتمد' : 'Deposit Point'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center bg-slate-900/50 px-2.5 py-2 rounded-lg border border-slate-800">
                    <div>
                      <span className="text-[8px] text-slate-500 block">{isAr ? 'رقم الحساب المراد الإيداع فيه' : 'Beneficiary Account'}</span>
                      <span className="text-xs font-mono font-bold select-all">{selectedBank.accountNumber}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopyAccount(selectedBank.accountNumber)}
                      className="p-1 hover:text-white text-slate-400 transition"
                      title={isAr ? 'نسخ الحساب' : 'Copy'}
                    >
                      {copiedState ? <LucideIcons.Check className="w-3.5 h-3.5 text-emerald-400" /> : <LucideIcons.Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <div className="flex justify-between text-[10px]">
                    <span className="text-slate-500">{isAr ? 'اسم المستفيد الكلي:' : 'Account Holder:'}</span>
                    <span className="font-extrabold text-slate-300">{isAr ? selectedBank.accountNameAr : selectedBank.accountNameEn}</span>
                  </div>
                </div>
              </div>

              {/* Action and back buttons */}
              <div className="flex flex-col gap-2 pt-2">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-110 py-3 rounded-xl font-black text-xs text-white transition flex items-center justify-center gap-2"
                >
                  <LucideIcons.MessageSquare className="w-4.5 h-4.5" />
                  <span>{isAr ? 'إرسال الطلب وإكمال الدفع عبر واتساب' : 'Submit Cart Order via WhatsApp'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsCheckoutMode(false)}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs text-center transition ${
                    isDarkMode ? 'bg-slate-800 text-slate-350 hover:bg-slate-700' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  }`}
                >
                  {isAr ? 'العودة لتعديل السلة 🛒' : 'Return to modify basket'}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Floating footer inside CartDrawer */}
        {cart.length > 0 && !isCheckoutMode && (
          <div className={`p-4 border-t space-y-4 ${
            isDarkMode ? 'border-slate-800 bg-slate-900/60' : 'border-slate-100 bg-slate-50'
          }`}>
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-bold text-slate-400">
                <span>{isAr ? 'سعر المنتجات الكلي:' : 'Products Total (USD equiv):'}</span>
                <span className="font-mono text-slate-300">${Math.round(totalUsd)}</span>
              </div>
              <div className="flex justify-between items-center text-sm font-black text-slate-150">
                <span>{isAr ? 'المجموع الإجمالي الكلي بالجنيه:' : 'Grand Total SDG:'}</span>
                <span className="font-mono text-amber-400 text-base">{totalSdg.toLocaleString()} SDG</span>
              </div>
            </div>

            <button
              onClick={() => setIsCheckoutMode(true)}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:brightness-110 text-slate-950 font-black text-xs transition flex items-center justify-center gap-2 active:scale-97 cursor-pointer shadow-lg shadow-orange-500/10"
            >
              <LucideIcons.ShoppingBag className="w-4 h-4" />
              <span>{isAr ? 'الانتقال لإنهاء عملية الشراء والتفعيل 👤' : 'Proceed to Checkout 👤'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
