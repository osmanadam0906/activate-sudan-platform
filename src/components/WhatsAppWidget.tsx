import React, { useState } from 'react';
import { MessageCircle, X, Send, Heart } from 'lucide-react';

interface WhatsAppWidgetProps {
  lang: 'ar' | 'en';
  defaultNumber?: string;
}

export default function WhatsAppWidget({ lang, defaultNumber = '249113411965' }: WhatsAppWidgetProps) {
  const isAr = lang === 'ar';
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const encodedText = encodeURIComponent(message.trim() || (isAr ? 'مرحبا، أريد الاستفسار عن باقات التفعيل المتاحة.' : 'Hello, I want to inquire about activation plans.'));
    window.open(`https://wa.me/${defaultNumber}?text=${encodedText}`, '_blank');
    setIsOpen(false);
    setMessage('');
  };

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col items-end select-none" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Pop-up Chat Dialog */}
      {isOpen && (
        <div className="mb-4 w-72 sm:w-80 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden animate-fade-in-up">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-650 to-emerald-550 bg-emerald-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="text-xs font-black">{isAr ? 'خدمة العملاء | تفعيلات' : 'Live Support Chat'}</h4>
                <span className="text-[10px] text-emerald-100 block">{isAr ? 'متصلون لخدمتك فورياً' : 'Online to help you'}</span>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/10 rounded-full transition-colors text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSendMessage} className="p-4 space-y-3.5 bg-slate-50/70">
            <div className="bg-white p-3 rounded-xl border border-slate-100 text-xs text-slate-600 leading-relaxed shadow-3xs">
              {isAr 
                ? 'مرحباً بك في متجر Activate Sudan لتفعيل الاشتراكات الرقمية. كيف يمكننا مساعدتك اليوم؟ 💬'
                : 'Welcome to Activate Sudan support. Let us know how we can set up your premium account subscriptions today! 💬'}
            </div>

            <textarea
              rows={2}
              placeholder={isAr ? 'اكتب رسالتك هنا للتواصل المباشر...' : 'Write your inquiry detail here...'}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 text-slate-800"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 px-4 rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isAr ? 'إرسال عبر واتساب' : 'Send via WhatsApp'}</span>
            </button>
          </form>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-emerald-250 hover:scale-105 active:scale-90 transition-all z-50 cursor-pointer relative"
        title={isAr ? 'تواصل معنا مباشرة' : 'Chat with Support'}
      >
        <MessageCircle className="w-6 h-6 animate-pulse" />
        
        {/* Glow badge indicator */}
        <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
          <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
        </span>
      </button>
    </div>
  );
}
