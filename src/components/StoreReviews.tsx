import React, { useState, useEffect } from 'react';
import { Star, ThumbsUp, Award, Send, CheckCircle2, User, Sparkles } from 'lucide-react';

interface Review {
  id: string;
  name: string;
  rating: number; // 1 to 5
  comment: string;
  timestamp: string;
  likes: number;
  isLikedByUser?: boolean;
}

interface StoreReviewsProps {
  lang: 'ar' | 'en';
  isDarkMode?: boolean;
}

export default function StoreReviews({ lang, isDarkMode = true }: StoreReviewsProps) {
  const isAr = lang === 'ar';

  const defaultReviews: Review[] = [
    {
      id: 'rev-1',
      name: 'أحمد الطيب الماحي',
      rating: 5,
      comment: 'ما شاء الله تبارك الله، تفعيل جوجل ون ٢٠٠ جيجا تم في أقل من ١٥ دقيقة فقط والضمان مستمر. تعامل راقي وسرعة رد ممتازة، أنصح بالتعامل معهم بشدة لتطوير العمل بالسودان.',
      timestamp: '2026-05-18T14:20:00Z',
      likes: 24,
    },
    {
      id: 'rev-2',
      name: 'سماح عبد الرحمن',
      rating: 5,
      comment: 'أفضل متجر تفعيلات على الإطلاق! وفروا لي اشتراك شات جي بي تي بلس بأسعار ممتازة جداً مقارنة بالدفع الخارجي، وطريقة الدفع عبر بنكك سهلة وسريعة ومريحة.',
      timestamp: '2026-05-20T09:15:00Z',
      likes: 18,
    },
    {
      id: 'rev-3',
      name: 'Mohamed El-Amin',
      rating: 5,
      comment: 'Excellent service! Activated LinkedIn Business for my professional networking. Communication was flawless and delivery was incredibly fast. A solid 10/10.',
      timestamp: '2026-05-21T18:45:00Z',
      likes: 15,
    },
    {
      id: 'rev-4',
      name: 'خالد عمر مصطفى',
      rating: 4,
      comment: 'تفعيل ممتاز ومستقر جداً في السودان. جربت تفعيل نتفليكس وسرعة الاستجابة ممتازة، الخدمة موثوقة وننتظر دائماً عروض تفعيلات جديدة.',
      timestamp: '2026-05-22T08:12:00Z',
      likes: 9,
    }
  ];

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('activate_sudan_user_reviews');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse user reviews', e);
      }
    }
    return defaultReviews;
  });

  const [formName, setFormName] = useState('');
  const [formComment, setFormComment] = useState('');
  const [formRating, setFormRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Persist reviews locally
  useEffect(() => {
    localStorage.setItem('activate_sudan_user_reviews', JSON.stringify(reviews));
  }, [reviews]);

  // Aggregate stats
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
    : '5.0';

  // Get count per stars
  const getStarCount = (starCount: number) => {
    return reviews.filter(r => r.rating === starCount).length;
  };

  const getStarPercentage = (starCount: number) => {
    if (totalReviews === 0) return 0;
    return Math.round((getStarCount(starCount) / totalReviews) * 100);
  };

  // Like button handler
  const handleLike = (id: string) => {
    setReviews(prev => prev.map(r => {
      if (r.id === id) {
        const isLiked = !!r.isLikedByUser;
        return {
          ...r,
          likes: r.likes + (isLiked ? -1 : 1),
          isLikedByUser: !isLiked
        };
      }
      return r;
    }));
  };

  // Submit handler
  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formComment.trim()) return;

    setIsSubmitting(true);
    
    // Simulate slight lag for a genuine feel
    setTimeout(() => {
      const newReview: Review = {
        id: `rev-custom-${Date.now()}`,
        name: formName.trim(),
        rating: formRating,
        comment: formComment.trim(),
        timestamp: new Date().toISOString(),
        likes: 0,
        isLikedByUser: false
      };

      setReviews(prev => [newReview, ...prev]);
      setFormName('');
      setFormComment('');
      setFormRating(5);
      setSuccessMsg(isAr ? 'تم إرسال تقييمك ونشره بنجاح! شكراً لثقتك بالمنصة 🌟' : 'Your review was submitted successfully! Thank you for your support 🌟');
      setIsSubmitting(false);

      setTimeout(() => {
        setSuccessMsg('');
      }, 5000);
    }, 600);
  };

  return (
    <div className={`border rounded-3xl p-6 sm:p-8 shadow-md transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-slate-900/60 border-slate-850 text-white' 
        : 'bg-white border text-slate-800 border-slate-200'
    }`} id="platform-ratings-and-reviews-section">
      
      {/* Platform Description block */}
      <div className={`mb-8 border-b pb-8 ${isDarkMode ? 'border-slate-850' : 'border-slate-100'}`}>
        <div className="flex items-center gap-2.5 mb-3.5">
          <div className={`p-2 rounded-xl flex items-center justify-center ${
            isDarkMode ? 'bg-sky-500/10 text-sky-400 border border-sky-400/20' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
          }`}>
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className={`text-base font-black ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
              {isAr ? 'منصة تفعيلات وإثراء رقمي موثوقة بالسودان' : 'About Activate Sudan Platform'}
            </h3>
            <p className={`text-[10px] uppercase font-bold tracking-widest ${
              isDarkMode ? 'text-emerald-400' : 'text-emerald-700'
            }`}>
              {isAr ? 'ضمان شامل ومتابعة دورية' : 'Full Duration Guarantees & Live Support'}
            </p>
          </div>
        </div>
        <p className={`text-xs leading-relaxed max-w-4xl font-medium ${
          isDarkMode ? 'text-slate-400' : 'text-slate-605 text-slate-650'
        }`}>
          {isAr 
            ? 'تُعد منصة Activate Sudan الخيار الوطني الأول لتوطين المشتريات والاشتراكات الرقمية للعملاء والشركات في السودان. نوفر حلول تفعيل قانونية ومستقلة تماماً بضمانات كاملة لمدد الخدمة المطلوبة، مع الدعم التقني السريع على مدار اليوم عبر الواتساب. متجرنا يتميز بالمرونة والأمان لتسهيل حصولك على اشتراكات الذكاء الاصطناعي الحديثة، البرامج التعليمية، أدوات التطوير المهني والتصميم، وبث الألعاب والترفيه بأسعار ملائمة وميسرة بالدفع المحلي (بنكك، فوري، أوكاش).'
            : 'Activate Sudan is the leading destination for official subscriptions and digital licensing solutions for customers. We provide completely transparent, guaranteed activation of premium tools under robust support guarantees, allowing you to easily purchase AI workspaces, language software, stream passes, and corporate platforms in Sudan without payment barriers.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Dynamic statistics and progression breakdown */}
        <div className="lg:col-span-5 space-y-6">
          <div className={`border rounded-2xl p-5 text-center flex flex-col items-center justify-center ${
            isDarkMode ? 'bg-slate-950/80 border-slate-850' : 'bg-slate-50 border-slate-105'
          }`}>
            <span className={`text-[10px] font-bold uppercase tracking-widest block mb-2 ${
              isDarkMode ? 'text-slate-500' : 'text-slate-400'
            }`}>
              {isAr ? 'التقييم العام للمنصة' : 'Overall Platform Rating'}
            </span>
            <div className="flex items-baseline justify-center gap-1.5">
              <span className={`text-5xl font-black font-mono ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{averageRating}</span>
              <span className="text-xs text-slate-400 font-bold">/ 5.0</span>
            </div>

            {/* Glowing Stars visual row */}
            <div className="flex items-center gap-0.5 my-3 text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-5 h-5 ${i < Math.round(parseFloat(averageRating)) ? 'fill-amber-400 text-amber-400 scale-105' : (isDarkMode ? 'text-slate-800' : 'text-slate-205')}`} 
                />
              ))}
            </div>

            <p className="text-xs text-slate-500 font-medium">
              {isAr 
                ? `بناءً على ${totalReviews.toLocaleString()} تقييم من عملائنا الكرام بالسودان` 
                : `Based on ${totalReviews.toLocaleString()} customer submissions`}
            </p>
          </div>

          {/* Breakdown progress bars with percentages requested */}
          <div className="space-y-3">
            <h4 className={`text-xs font-black pb-1 border-b ${
              isDarkMode ? 'border-slate-850 text-slate-400' : 'border-slate-100 text-slate-700'
            }`}>
              {isAr ? 'تفاصيل التقييم بالنسب المئوية' : 'Rating Breakdowns & Percentages'}
            </h4>
            
            {Array.from({ length: 5 }).map((_, idx) => {
              const stars = 5 - idx;
              const percent = getStarPercentage(stars);
              const count = getStarCount(stars);

              return (
                <div key={stars} className="flex items-center gap-3 text-xs">
                  <span className="w-12 text-slate-550 flex items-center justify-end gap-1 shrink-0 font-bold">
                    <span className={isDarkMode ? 'text-slate-300' : 'text-slate-500'}>{stars}</span>
                    <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-400 inline shrink-0" />
                  </span>
                  
                  {/* Progress tracks */}
                  <div className={`flex-1 h-2.5 rounded-full overflow-hidden relative ${
                    isDarkMode ? 'bg-slate-950' : 'bg-slate-100'
                  }`}>
                    <div 
                      className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-teal-500 via-emerald-500 to-emerald-600 rounded-full transition-all duration-1000 animate-pulse"
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  <span className={`w-10 font-bold font-mono text-right shrink-0 ${
                    isDarkMode ? 'text-sky-305 text-sky-400' : 'text-slate-800'
                  }`}>
                    {percent}%
                  </span>
                  
                  <span className="text-[10px] text-slate-450 text-slate-400 hidden sm:inline shrink-0 w-8 text-right">
                    ({count})
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Comments feed and form */}
        <div className="lg:col-span-7 space-y-6">
          {/* Create review form with ratings */}
          <div className={`border rounded-2xl p-5 transition-all duration-300 ${
            isDarkMode 
              ? 'bg-slate-950/60 border-slate-850 hover:bg-slate-950/90' 
              : 'bg-slate-50/70 hover:bg-slate-50 border-slate-200/60'
          }`}>
            <h4 className={`text-xs font-black uppercase tracking-wide mb-3 flex items-center gap-1.5 ${
              isDarkMode ? 'text-sky-400' : 'text-blue-700'
            }`}>
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
              <span>{isAr ? 'أضف تقييمًا وتعليقًا بخصوص تجربتك' : 'Write your own platform review'}</span>
            </h4>

            {successMsg ? (
              <div className="bg-emerald-500/10 border border-emerald-555/20 border-emerald-500/30 text-emerald-400 p-4 rounded-xl text-xs font-bold leading-relaxed flex items-center gap-2 text-emerald-400 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{successMsg}</span>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                {/* Rating selection row */}
                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1.5">
                    {isAr ? 'حدد تقييمك للمنصة بالنجوم:' : 'Select your star rating:'}
                  </label>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => {
                      const starValue = i + 1;
                      const isHighlighted = hoverRating !== null 
                        ? starValue <= hoverRating 
                        : starValue <= formRating;

                      return (
                        <button
                          key={i}
                          type="button"
                          className="text-2xl transition-all focus:outline-none focus:scale-110 active:scale-95 text-slate-200 cursor-pointer"
                          onClick={() => setFormRating(starValue)}
                          onMouseEnter={() => setHoverRating(starValue)}
                          onMouseLeave={() => setHoverRating(null)}
                        >
                          <Star className={`w-6 h-6 ${isHighlighted ? 'fill-amber-400 text-amber-400 scale-105' : (isDarkMode ? 'text-slate-800' : 'text-slate-300')}`} />
                        </button>
                      );
                    })}
                    <span className="text-xs font-bold text-slate-400 mr-2">
                      ({formRating} {isAr ? 'من 5 نجوم' : 'out of 5'})
                    </span>
                  </div>
                </div>

                {/* Input name and input comment */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <input
                      type="text"
                      required
                      placeholder={isAr ? 'اسمك الكريم' : 'Your name'}
                      className={`w-full rounded-xl px-3.5 py-2.5 text-xs focus:outline-none border font-medium ${
                        isDarkMode 
                          ? 'bg-slate-900 border-slate-850 focus:border-sky-500 text-white' 
                          : 'bg-white border-slate-200 focus:border-blue-500 text-slate-800'
                      }`}
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <textarea
                      required
                      rows={3}
                      placeholder={isAr ? 'اكتب تعليقك بصدق وثقة حول باقات التفعيل وسرعة الخدمة والضمان...' : 'Write your thoughts regarding our activation services...'}
                      className={`w-full rounded-xl px-3.5 py-2.5 text-xs focus:outline-none border font-medium resize-none ${
                        isDarkMode 
                          ? 'bg-slate-900 border-slate-850 focus:border-sky-500 text-white' 
                          : 'bg-white border-slate-200 focus:border-blue-500 text-slate-800'
                      }`}
                      value={formComment}
                      onChange={(e) => setFormComment(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting || !formName.trim() || !formComment.trim()}
                    className="bg-sky-500 hover:bg-sky-400 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 font-black text-xs py-2.5 px-6 rounded-xl transition flex items-center gap-1.5 active:scale-95 shadow-sm hover:shadow-sky-550/10 shrink-0 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? (isAr ? 'جاري النشر...' : 'Submittingֹֹֹ') : (isAr ? 'نشر التقييم والتعليق' : 'Publish Review')}</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* User Reviews Listing Feed */}
          <div className="space-y-4">
            <h4 className={`text-xs font-black flex items-center justify-between pb-1 border-b ${
              isDarkMode ? 'border-slate-850 text-slate-400' : 'border-slate-100 text-slate-700'
            }`}>
              <span>{isAr ? 'آراء وتعليقات المستخدمين الحقيقية بالمنصة' : 'Active Verified Reviews'}</span>
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded ${
                isDarkMode ? 'bg-slate-950 text-slate-405 text-slate-400' : 'bg-slate-100 text-slate-600'
              }`}>
                {totalReviews} {isAr ? 'تقييم معتمد' : 'Verified reviews'}
              </span>
            </h4>

            <div className="space-y-3.5 max-h-[460px] overflow-y-auto pr-1 scrollbar-none">
              {reviews.map((review) => (
                <div 
                  key={review.id} 
                  className={`border p-5 rounded-2xl space-y-2.5 transition-all duration-300 ${
                    isDarkMode 
                      ? 'bg-slate-950/40 border-slate-85a border-slate-900/80 hover:border-slate-800' 
                      : 'bg-white border-slate-200/70 hover:border-slate-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 border ${
                        isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-blue-50 border-blue-100/60'
                      }`}>
                        <User className="w-4 h-4 text-sky-400" />
                      </div>
                      <div>
                        <span className={`text-xs font-black block leading-tight ${isDarkMode ? 'text-white' : 'text-slate-700'}`}>{review.name}</span>
                        <span className="text-[9px] text-slate-400 font-mono">
                          {new Date(review.timestamp).toLocaleDateString(isAr ? 'ar-SD' : 'en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>

                    {/* rating stars representation */}
                    <div className="flex items-center gap-0.5 text-amber-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-amber-300 text-amber-400 scale-105' : (isDarkMode ? 'text-slate-850' : 'text-slate-210 text-slate-200')}`} 
                        />
                      ))}
                    </div>
                  </div>

                  {/* Comment context body */}
                  <p className={`text-xs leading-relaxed pr-1 whitespace-pre-line font-medium ${
                    isDarkMode ? 'text-slate-300' : 'text-slate-600'
                  }`}>
                    {review.comment}
                  </p>

                  {/* Likes button section (heart or thumbs up as requested) */}
                  <div className={`flex items-center justify-between pt-2.5 border-t ${
                    isDarkMode ? 'border-slate-900/60' : 'border-slate-50'
                  }`}>
                    <span className={`text-[10px] font-bold flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${
                      isDarkMode 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                        : 'bg-emerald-50/50 text-emerald-800 border-emerald-100/40'
                    }`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>{isAr ? 'عميل معتمد بالمنصة' : 'Verified Upgrade'}</span>
                    </span>

                    <button
                      type="button"
                      onClick={() => handleLike(review.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-black transition-all active:scale-90 cursor-pointer ${
                        review.isLikedByUser
                          ? (isDarkMode 
                              ? 'bg-sky-500/10 text-sky-400 border border-sky-450 border-sky-500/30' 
                              : 'bg-blue-50 text-blue-600 border border-blue-200 shadow-2xs')
                          : (isDarkMode 
                              ? 'bg-slate-900 text-slate-400 hover:text-white border border-slate-850 hover:border-slate-800' 
                              : 'bg-slate-50 text-slate-500 hover:text-slate-705 border border-transparent')
                      }`}
                    >
                      <ThumbsUp className={`w-3.5 h-3.5 ${review.isLikedByUser ? 'fill-sky-405 text-sky-400' : ''}`} />
                      <span>{review.likes}</span>
                      <span className="text-[10px]">
                        {isAr ? 'أعجبني' : 'Like'}
                      </span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
