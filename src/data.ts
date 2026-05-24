import { Service, BankDetails } from './types';

// Exchange rate defaults (1 USD = 4200 SDG), editable in UI state
export const DEFAULT_USD_TO_SDG = 4200;

export const SERVICES: Service[] = [
  {
    id: 'gemini',
    nameAr: 'جوجل جيميناي والذكاء الاصطناعي 🧠',
    nameEn: 'Google Gemini & AI One 🧠',
    category: 'subscriptions',
    descriptionAr: 'تفعيل رسمي لخدمات جوجل المتقدمة وجيميناي الفائق للحصول على سعات التخزين السحابي وذكاء متميز.',
    descriptionEn: 'Official activation for advanced Google AI & Gemini Premium with larger storage and smarter workflows.',
    iconName: 'BrainCircuit',
    accentColor: 'blue-500',
    textColor: 'text-blue-500',
    bannerColor: 'bg-blue-50/70',
    whatsappContact: '249113411965',
    plans: [
      {
        id: 'gemini-plus-200gb',
        nameAr: 'جوجل جيميناي بلس 200 جيجابايت (شهري) ⚡',
        nameEn: 'Google AI Plus 200 GB (Monthly) ⚡',
        price: 8.5,
        currency: 'USD',
        periodAr: 'شهرياً',
        periodEn: 'Monthly',
        featuresAr: [
          'مساحة تخزينية مخصصة 200 جيجابايت لتطبيقات جوجل',
          'مشاركة مع العائلة بحد أقصى 5 أفراد',
          'ميزات متطورة للذكاء الاصطناعي ومحرر صور جوجل الفائق'
        ],
        featuresEn: [
          '200 GB dedicated Google AI cloud storage',
          'Share with up to 5 family members',
          'Advanced Gemini AI photo editor perks in Google'
        ]
      },
      {
        id: 'gemini-plus-200gb-yearly',
        nameAr: 'جوجل جيميناي بلس 200 جيجابايت (سنوي) ⭐',
        nameEn: 'Google AI Plus 200 GB (Annual) ⭐',
        price: 96.0,
        currency: 'USD',
        periodAr: 'سنوياً',
        periodEn: 'Annually',
        isPopular: true,
        featuresAr: [
          'اشتراك كامل لمدة عام كامل مع توفير هائل ومريح ومثالي',
          'تفعيل رسمي وقانوني على حسابك الخاص مباشرة بضمان كامل تشغيل'
        ],
        featuresEn: [
          'Full-year subscription with massive savings',
          'Official activation on your own Gmail account with guarantee'
        ]
      },
      {
        id: 'gemini-pro-6tb-monthly',
        nameAr: 'برو جوجل الذكاء الاصطناعي 6 تيرا (شهري) 🚀',
        nameEn: 'Pro Google AI 6 Tera (Monthly) 🚀',
        price: 24.0,
        currency: 'USD',
        periodAr: 'شهرياً',
        periodEn: 'Monthly',
        featuresAr: [
          'سعة تيرابايت تخزينية هائلة لحفظ كافة الصور والمستندات',
          'تفعيل رسمي وآمن بجودة وسلاسة كاملة'
        ],
        featuresEn: [
          '6 Terabytes huge cloud space mapping',
          'Official safe activation with robust backup features'
        ]
      },
      {
        id: 'gemini-pro-6tb-yearly',
        nameAr: 'برو جوجل الذكاء الاصطناعي 6 تيرا (سنوي) ⭐',
        nameEn: 'Pro Google AI 6 Tera (Annual) ⭐',
        price: 210.0,
        currency: 'USD',
        periodAr: 'سنوياً',
        periodEn: 'Annually',
        featuresAr: [
          'توفير عملاق لعام كامل لأصحاب المشاريع والأعمال',
          'مشاركة سحابية عائلية وسيرفرات مضمونة طوال العام'
        ],
        featuresEn: [
          'Huge annual discount for professionals and families',
          'Shared storage with full continuous warranty'
        ]
      },
      {
        id: 'gemini-ultra-20tb-monthly',
        nameAr: 'ألترا جوجل الذكاء الاصطناعي 20 تيرا (شهري فقط) 👑',
        nameEn: 'Ultra Google AI 20 Tera (Monthly Only) 👑',
        price: 110.0,
        currency: 'USD',
        periodAr: 'شهرياً',
        periodEn: 'Monthly',
        featuresAr: [
          'الباقة السحابية الضخمة بسعة 20 تيرابايت للأعمال الشاقة',
          'أسرع خطط المعالجة وسعات تخزينية لا تنتهي بضمان تفعيل كامل'
        ],
        featuresEn: [
          'Monster cloud pool with 20 Tera for heavy workloads',
          'Fastest processing queues and guaranteed delivery specs'
        ]
      }
    ]
  },
  {
    id: 'linkedin',
    nameAr: 'لينكد إن بريميوم للوظائف والأعمال 👔',
    nameEn: 'LinkedIn Premium Professional 👔',
    category: 'subscriptions',
    descriptionAr: 'عروض حصرية لتطوير ملفك الوظيفي، زيادة ظهورك لأصحاب العمل والشركات، وتصفح مجاني لكورسات لينكد إن.',
    descriptionEn: 'Exclusive offers to upgrade your professional profile, boost employer visibility, and access massive Courses.',
    iconName: 'Linkedin',
    accentColor: 'blue-600',
    textColor: 'text-blue-600',
    bannerColor: 'bg-blue-50/70',
    whatsappContact: '249113411965',
    plans: [
      {
        id: 'li-career-monthly',
        nameAr: 'المسار الوظيفي (Career Plan - شهري)',
        nameEn: 'LinkedIn Career Plan (Monthly)',
        price: 48.0,
        currency: 'USD',
        periodAr: 'شهرياً',
        periodEn: 'Monthly',
        featuresAr: [
          'ظهور أعلى ومتميز لملفك الشخصي بين المتقدمين للوظائف',
          'مراسلة مباشرة لمسؤولي التوظيف عبر رسائل InMail',
          'وصول كامل وعالي مجاناً لكافة كورسات ومحتوى LinkedIn Learning'
        ],
        featuresEn: [
          'High competitive badge with top visibility metrics',
          'Direct recruiter chat via complimentary InMail messages',
          'Uncapped entrance to LinkedIn Learning educational catalogue'
        ]
      },
      {
        id: 'li-career-yearly',
        nameAr: 'المسار الوظيفي (Career Plan - سنوي) ⭐',
        nameEn: 'LinkedIn Career Plan (Annual) ⭐',
        price: 288.0,
        currency: 'USD',
        periodAr: 'سنوياً',
        periodEn: 'Annually',
        isPopular: true,
        featuresAr: [
          'توفير عملاق للاشتراك السنوي لتعزيز مسارك المهني بأمان واستقرار',
          'مراسلة فورية، احصائيات وفوائد كاملة لعام كامل'
        ],
        featuresEn: [
          'Save significantly over month-by-month billing structures',
          'Uncapped progress, analytics tracking, and continuous warranty'
        ]
      },
      {
        id: 'li-business-monthly',
        nameAr: 'باقة الأعمال المميزة (Business Plan - شهري)',
        nameEn: 'LinkedIn Business Plan (Monthly)',
        price: 84.0,
        currency: 'USD',
        periodAr: 'شهرياً',
        periodEn: 'Monthly',
        featuresAr: [
          'باقة رائعة مخصصة للشركات والنمو التجاري السريع وصائدي الفرص',
          'احصل على رؤى وحلول أعمال متقدمة وفريدة مع تفعيل رسمي'
        ],
        featuresEn: [
          'Elite plan crafted for corporate expansion and key insight metrics',
          'Acquire official active business verification safely'
        ]
      },
      {
        id: 'li-allinone-monthly',
        nameAr: 'باقة الكل في واحد الاستثنائية (All In One - شهري) 👑',
        nameEn: 'LinkedIn All In One Plan (Monthly) 👑',
        price: 108.0,
        currency: 'USD',
        periodAr: 'شهرياً',
        periodEn: 'Monthly',
        featuresAr: [
          'دمج شامل لكافة الميزات المتقدمة وحلول التسويق والتوظيف بحساب واحد',
          'الحل النهائي لعمالقة البزنس الرقمي ورواد الأعمال بسعر خاص'
        ],
        featuresEn: [
          'Full-suite integration covering marketing and hire frameworks',
          'Definitive plan for prominent global scaling and entrepreneurs'
        ]
      },
      {
        id: 'li-sales-monthly',
        nameAr: 'باقة التسويق والمبيعات الفائقة (Sales Plan - شهري)',
        nameEn: 'LinkedIn Sales Plan (Monthly)',
        price: 144.0,
        currency: 'USD',
        periodAr: 'شهرياً',
        periodEn: 'Monthly',
        featuresAr: [
          'أداة المبيعات السريعة وبناء قوائم العملاء باحترافية وتواصل متكامل',
          'أفضل خيار لمديري المبيعات لزيادة التحويلات وجلب الصفقات الرابحة'
        ],
        featuresEn: [
          'Accelerated tool built strictly to map custom target clients',
          'The ideal package chosen by commercial directors to drive deals'
        ]
      },
      {
        id: 'li-hiring-monthly',
        nameAr: 'باقة التوظيف واستقطاب المواهب (Hiring Plan - شهري) 🚀',
        nameEn: 'LinkedIn Hiring Plan (Monthly) 🚀',
        price: 204.0,
        currency: 'USD',
        periodAr: 'شهرياً',
        periodEn: 'Monthly',
        featuresAr: [
          'استقطاب العباقرة والوصول المتقدم للمهارات مع فلاتر حصرية ومحكمة',
          'ترقية شاملة متكاملة وفعالة بالكامل بضمان "Activate + Sudan"'
        ],
        featuresEn: [
          'Elite filters & analytics to source exceptional worldwide talent',
          'Full comprehensive recruiter upgrade backed by complete local support'
        ]
      }
    ]
  },
  {
    id: 'duolingo',
    nameAr: 'سوبر دولينجو لتعلم اللغات 🦉',
    nameEn: 'Duolingo Premium Access 🦉',
    category: 'subscriptions',
    descriptionAr: 'تعلم اللغات بشكل سريع وسلس دون إعلانات مزعجة مع قلوب غير محدودة ومزايا سوبر وماكس الحصرية.',
    descriptionEn: 'Learn global languages swiftly with zero annoying ads, unlimited health hearts, and super duolingo structures.',
    iconName: 'GraduationCap',
    accentColor: 'green-600',
    textColor: 'text-green-600',
    bannerColor: 'bg-green-50/70',
    whatsappContact: '249113411965',
    plans: [
      {
        id: 'duo-super-family-yearly',
        nameAr: 'سوبر العائلي السنوي (Family Plan Super) ⭐',
        nameEn: 'Super Duolingo Family (Yearly) ⭐',
        price: 43.2,
        currency: 'USD',
        periodAr: 'سنوياً',
        periodEn: 'Annually',
        isPopular: true,
        featuresAr: [
          'تفعيلات رسمية كاملة لتعلم متميز يدعم 6 حسابات مستقلة تماماً',
          'توفير عملاق وتفعيل فوري على إيميلات المجموعة بضمان كامل'
        ],
        featuresEn: [
          'Official stable activation supporting up to 6 different profiles',
          'Incredible family bundle rates with immediate custom verification'
        ]
      },
      {
        id: 'duo-super-add-family',
        nameAr: 'إضافة لعائلة سوبر دولينجو الرسمية 🔗',
        nameEn: 'Add to Family - Super (Yearly) 🔗',
        price: 14.0,
        currency: 'USD',
        periodAr: 'سنوياً',
        periodEn: 'Annually',
        featuresAr: [
          'نضيفك لحساب عائلي رسمي بمتجرنا لتشغيل سوبر دولينجو فوراً برخص سعر',
          'تقدمك مستمر وحسابك مستقل بالكامل بنسبة ١٠٠٪ دون تداخل'
        ],
        featuresEn: [
          'Join our verified family slot to enable super features cheapest',
          'Your profile progress is completely private and independent'
        ]
      },
      {
        id: 'duo-personal-monthly',
        nameAr: 'الاشتراك الشخصي سوبر (شهري)',
        nameEn: 'Super Personal Plan (Monthly)',
        price: 5.4,
        currency: 'USD',
        periodAr: 'شهرياً',
        periodEn: 'Monthly',
        featuresAr: [
          'تعلم لغتك المفضلة في أي وقت بقلوب غير محدودة وإلغاء تام للإعلانات',
          'اختبارات ذكية مخصصة لتقييم مستواك دورياً وبشكل عملي'
        ],
        featuresEn: [
          'Study languages with unlimited hearts and zero interrupt ads',
          'Private test feedback arrays tailored to scale your progress'
        ]
      },
      {
        id: 'duo-personal-yearly',
        nameAr: 'الاشتراك الشخصي سوبر (سنوي) ⭐',
        nameEn: 'Super Personal Plan (Yearly) ⭐',
        price: 33.6,
        currency: 'USD',
        periodAr: 'سنوياً',
        periodEn: 'Annually',
        featuresAr: [
          'باقة العام الكامل الموفرة لتعلم بتركيز واستدامة تامة دون انقطاع',
          'تفعيل مضمون وآمن على حسابك الشخصي برقم الطلب المرجعي'
        ],
        featuresEn: [
          'Full calendar year of language learning without interruptions',
          'Guaranteed official activation mapped on your private account'
        ]
      },
      {
        id: 'duo-max-family-yearly',
        nameAr: 'دولينجو ماكس العائلي المتطور (Family Max) 👑',
        nameEn: 'Duolingo Max Family (Yearly) 👑',
        price: 96.0,
        currency: 'USD',
        periodAr: 'سنوياً',
        periodEn: 'Annually',
        featuresAr: [
          'الباقة الملكية الفائقة مع ميزات الذكاء الاصطناعي القصوى وشرح الأخطاء',
          'محادثات واقعية بالذكاء الاصطناعي وتقنية شرح الأخطاء الفورية لمجموعتك'
        ],
        featuresEn: [
          'The ultimate tier with Explanations and AI Speech Practice roleplays',
          'Realtime AI explanations of grammar errors for your entire list'
        ]
      },
      {
        id: 'duo-max-add-family',
        nameAr: 'إضافة لعائلة دولينجو ماكس المتطورة 🌟',
        nameEn: 'Add to Family - Max Title (Yearly) 🌟',
        price: 16.0,
        currency: 'USD',
        periodAr: 'سنوياً',
        periodEn: 'Annually',
        featuresAr: [
          'انضم إلى مجموعة ماكس المتميزة لتستمتع بكافة مميزات الذكاء الاصطناعي بنقرة واحدة',
          'حلول ذكية، شرح تفصيلي للقواعد، حساب مستقل تماماً بضمان عام كامل'
        ],
        featuresEn: [
          'Join our premium Max group to access AI feedback algorithms',
          'Detailed grammatical rules parsing with complete privacy guaranteed'
        ]
      },
      {
        id: 'duo-max-personal-yearly',
        nameAr: 'دولينجو ماكس الشخصي (Personal Max - سنوي) 🚀',
        nameEn: 'Duolingo Max Personal (Yearly) 🚀',
        price: 72.0,
        currency: 'USD',
        periodAr: 'سنوياً',
        periodEn: 'Annually',
        featuresAr: [
          'أقوى اشتراك شخصي لتعلم اللغات في العالم ممتد لعام كامل',
          'مكالمات الذكاء الاصطناعي التفاعلية، وشرح تفصيلي لأخطائك خطوة بخطوة'
        ],
        featuresEn: [
          'The most powerful personal yearly membership tier in the world',
          'Engaging AI phone conversations and detailed grammar insights'
        ]
      }
    ]
  },
  {
    id: 'chatgpt',
    nameAr: 'اشتراكات شات جي بي تي ذكية 💬',
    nameEn: 'ChatGPT Plus Subscriptions 💬',
    category: 'subscriptions',
    descriptionAr: 'اختبر حدود الذكاء الاصطناعي مع شات جي بي تي لتحليل البيانات، إنشاء الأفكار، كتابة الأكواد بسلاسة.',
    descriptionEn: 'Unleash advanced AI reasoning with official GPT models to build papers, codes, and generate designs.',
    iconName: 'MessageSquareCode',
    accentColor: 'emerald-600',
    textColor: 'text-emerald-400',
    bannerColor: 'bg-emerald-50/70',
    whatsappContact: '249113411965',
    plans: [
      {
        id: 'gpt-go-plan',
        nameAr: 'الباقة الميسرة والذكية (Go Plan) ⚡',
        nameEn: 'ChatGPT Go Plan ⚡',
        price: 7.2,
        currency: 'USD',
        periodAr: 'دفع مرة واحدة',
        periodEn: 'One-time',
        featuresAr: [
          'وصول اقتصادي ومكثف لخدمات وميزات الذكاء الاصطناعي الأساسية',
          'تفعيل مريح وسريع لحسابك بضمان منصة "Activate + Sudan"'
        ],
        featuresEn: [
          'Budget-friendly entrance to core AI analytical systems',
          'Swift convenient account access mapped safe and secure'
        ]
      },
      {
        id: 'gpt-plus-monthly',
        nameAr: 'الباقة المتميزة بلس (Plus Plan - شهري) ⭐',
        nameEn: 'ChatGPT Plus Plan (Monthly) ⭐',
        price: 27.6,
        currency: 'USD',
        periodAr: 'شهرياً',
        periodEn: 'Monthly',
        isPopular: true,
        featuresAr: [
          'تفعيل رسمي وقانوني بالكامل على إيميلك الشخصي مباشرة وبضمان كامل',
          'وصول كامل وسريع لأحدث النماذج GPT-4o والمنتجات الصوتية',
          'توليد ذكي ومبدع للصور عبر DALL-E 3 وتحليل ملفات برمجية دقيقة'
        ],
        featuresEn: [
          'Full legal guaranteed premium upgrade on your active private mail',
          'Unrestricted fast access to flagship GPT-4o with audio modules',
          'Generate rich visual content via advanced DALL-E 3 rendering engine'
        ]
      }
    ]
  },
  {
    id: 'claude',
    nameAr: 'اشتراكات كلود الذكية والمتميزة 🤖',
    nameEn: 'Claude AI Subscriptions 🤖',
    category: 'subscriptions',
    descriptionAr: 'المنصة المثالية والمتفوقة عالمياً في معالجة البرمجيات، تحرير التقارير العميقة وتلخيص المشاريع باحترافية.',
    descriptionEn: 'Anthropic flagship AI premium subscription package for software engineering and literature logic.',
    iconName: 'Sparkles',
    accentColor: 'amber-600',
    textColor: 'text-amber-500',
    bannerColor: 'bg-amber-50/70',
    whatsappContact: '249113411965',
    plans: [
      {
        id: 'claude-pro-monthly',
        nameAr: 'باقة كلود برو الأساسية (Pro Plan - شهري)',
        nameEn: 'Claude Pro Plan (Monthly)',
        price: 27.0,
        currency: 'USD',
        periodAr: 'شهرياً',
        periodEn: 'Monthly',
        featuresAr: [
          'الوصول الرائد لـ Claude 3.5 Sonnet الذكي بقوة هائلة',
          'معدلات استخدام تفوق الحسابات العادية بخمسة أضعاف متتالية',
          'إمكانية رفع الكتب الضخمة وملفات البرمجة الكبيرة وتحليلها بدقة'
        ],
        featuresEn: [
          'Priority access to the smart Claude 3.5 Sonnet chatbot',
          'Capacity bounds extended up to 5x of standard users',
          'Submit and review huge project repositories and PDFs seamlessly'
        ]
      },
      {
        id: 'claude-pro-yearly',
        nameAr: 'باقة كلود برو الأساسية (Pro Plan - سنوي) ⭐',
        nameEn: 'Claude Pro Plan (Annual) ⭐',
        price: 280.0,
        currency: 'USD',
        periodAr: 'سنوياً',
        periodEn: 'Annually',
        isPopular: true,
        featuresAr: [
          'توفير رائع وراحة كاملة طوال العام لطلاب الدراسات العليا والمطورين',
          'تنزيل أكواد برمجية كاملة، وبناء مشاريع فنية معقدة بضمان رسمي متكامل'
        ],
        featuresEn: [
          'Excellent savings for graduate students, researchers and active developers',
          'Full year uninterrupted usage on your private email credentials'
        ]
      },
      {
        id: 'claude-max-monthly',
        nameAr: 'باقة كلود ماكس العبقرية (Max Plan) 🚀',
        nameEn: 'Claude Max Plan (Monthly) 🚀',
        price: 165.0,
        currency: 'USD',
        periodAr: 'شهرياً',
        periodEn: 'Monthly',
        featuresAr: [
          'الوصول فائق السرعة لرواد وصناع الكود ومنصات البرمجة المعقدة',
          'أكبر مساحة للمشاريع وأعلى مستويات التحليل بضمان التفعيل الفوري'
        ],
        featuresEn: [
          'Ultra-fast priority limits tailored for active builders and enterprises',
          'Largest workspace context limits with guaranteed instant processing'
        ]
      },
      {
        id: 'claude-max-special',
        nameAr: 'باقة كلود ماكس الخاصة (Max Plan Extended)',
        nameEn: 'Claude Max Special Plan (Extended)',
        price: 324.0,
        currency: 'USD',
        periodAr: 'شهرياً',
        periodEn: 'Monthly',
        featuresAr: [
          'تفعيلات بحصص مضاعفة مخصصة للأعمال وسيرفرات التحليل الثقيل للشركات',
          'دعم مخصص وتعديلات خاصة مع ضمان تشغيل طوال مدة باقتك المتميزة'
        ],
        featuresEn: [
          'Dual quota thresholds engineered for enterprise data processing',
          'Priority VIP support agent access to secure uninterrupted services'
        ]
      }
    ]
  },
  {
    id: 'netflix',
    nameAr: 'نتفليكس بوضوح سينمائي فائق 🎬',
    nameEn: 'Netflix Cinematic HD 🎬',
    category: 'subscriptions',
    descriptionAr: 'تفعيلات سريعة وآمنة تماماً على نتفليكس بجودة وضوح فائقة تفعّل فوراً بمكالمة أو رسالة.',
    descriptionEn: 'Quick official activations on Netflix with sharp resolutions on your screen instantly.',
    iconName: 'Tv',
    accentColor: 'red-600',
    textColor: 'text-red-500',
    bannerColor: 'bg-red-50/70',
    whatsappContact: '249113411965',
    plans: [
      {
        id: 'nf-phone-480p',
        nameAr: 'باقة الهاتف الاقتصادية (Phone Plan 480p)',
        nameEn: 'Netflix Phone Plan 480p',
        price: 3.6,
        currency: 'USD',
        periodAr: 'شهرياً',
        periodEn: 'Monthly',
        featuresAr: [
          'جودة جيدة مناسبة تماماً للهواتف الذكية والأجهزة اللوحية الصغرى',
          'شاشة واحدة تدعم التشغيل المريح وبأقل استهلاك للمصروفات والبيانات'
        ],
        featuresEn: [
          'Good default streaming quality calibrated for smartphones',
          'Single profile access with minimal data and energy footprint'
        ]
      },
      {
        id: 'nf-basic-720p',
        nameAr: 'الباقة الأساسية المتميزة (Basic Plan 720p)',
        nameEn: 'Netflix Basic Plan 720p',
        price: 4.8,
        currency: 'USD',
        periodAr: 'شهرياً',
        periodEn: 'Monthly',
        featuresAr: [
          'جودة عالية الوضوح 720p تلائم الشاشات وأجهزة اللابتوب',
          'تفعيل رسمي وسهل بضمان كامل من متجر تفعيلك في السودان'
        ],
        featuresEn: [
          'Clear high-definition 720p video suitable for laptops and PCs',
          'Fast setup with robust support from activate platform'
        ]
      },
      {
        id: 'nf-standard-1080p',
        nameAr: 'الباقة القياسية الفائقة (Standard Plan 1080p) ⭐',
        nameEn: 'Netflix Standard 1080p ⭐',
        price: 9.6,
        currency: 'USD',
        periodAr: 'شهرياً',
        periodEn: 'Monthly',
        isPopular: true,
        featuresAr: [
          'جودة Full HD فائقة المظهر والوضوح مخصصة للشاشات الكبيرة بالسودان',
          'تشغيل على جهازين في نفس الوقت لمشاركة المتابعة والترفيه لعائلتك'
        ],
        featuresEn: [
          'Outstanding Full HD 1080p output for crisp rendering on big TVs',
          'Stream on up to 2 concurrent screens cleanly without errors'
        ]
      },
      {
        id: 'nf-premium-4k',
        nameAr: 'الباقة السينمائية الفاخرة (Premium Plan 4K)',
        nameEn: 'Netflix Premium 4K Spatial',
        price: 12.0,
        currency: 'USD',
        periodAr: 'شهرياً',
        periodEn: 'Monthly',
        featuresAr: [
          'جودة Ultra HD 4K فائقة وضوح كامل مع تقنية الصوت المحيطي المجسم',
          'تشغيل على 4 أجهزة في وقت واحد دون أي مانع أو انقطاع، مثالية للعائلات'
        ],
        featuresEn: [
          'Stunning Ultra HD 4K cinematic clarity with spatial acoustics',
          'Watch on up to 4 devices concurrently without any restriction'
        ]
      }
    ]
  },
  {
    id: 'youtube',
    nameAr: 'يوتيوب بريميوم بدون إعلانات 📺',
    nameEn: 'YouTube Premium No-Ads 📺',
    category: 'subscriptions',
    descriptionAr: 'استمتع بمشاهدة متصلة وخالية تماماً من الإعلانات المزعجة، مع تشغيل الخلفية وتحميل الفيديوهات.',
    descriptionEn: 'Say goodbye to boring ads. Support background audio playing and native offline video save folders.',
    iconName: 'Youtube',
    accentColor: 'red-500',
    textColor: 'text-red-400',
    bannerColor: 'bg-red-50/70',
    whatsappContact: '249113411965',
    plans: [
      {
        id: 'yt-individual-plan',
        nameAr: 'الاشتراك الفردي الرسمي (Individual Plan)',
        nameEn: 'YouTube Individual Plan',
        price: 6.22,
        currency: 'USD',
        periodAr: 'شهرياً',
        periodEn: 'Monthly',
        featuresAr: [
          'تفعيل رسمي وقانوني على بريدك الخاص Gmail دون الحاجة لمشاركة كلمة السر',
          'تشغيل الفيديوهات في الخلفية وتحميلها للمشاهدة بدون إنترنت بالسودان',
          'يتضمن يوتيوب ميوزك بريميوم (YouTube Music Premium) مجاناً بالكامل'
        ],
        featuresEn: [
          'Applied securely directly to your own Gmail without sharing passwords',
          'Background system playback + offline saves on your device',
          'Includes official YouTube Music Premium access absolutely free'
        ]
      },
      {
        id: 'yt-family-plan',
        nameAr: 'الاشتراك العائلي للمجموعة (Family Plan) ⭐',
        nameEn: 'YouTube Family Plan ⭐',
        price: 11.4,
        currency: 'USD',
        periodAr: 'شهرياً',
        periodEn: 'Monthly',
        isPopular: true,
        featuresAr: [
          'إضافة ما يصل إلى 5 أشخاص من أهلك وأصدقائك بضمان تشغيل محلي كامل',
          'حساب وتوصيات وقوائم تشغيل مستقلة ومنعزلة بالكامل لكل مستخدم مضاف',
          'يعمل بسلاسة على كافة الشاشات الذكية، أجهزة أبل، الأندرويد لراحتك الهائلة'
        ],
        featuresEn: [
          'Invite up to 5 family members and friends in your premium group',
          'Completely separated suggestions and custom profile for each user',
          'Works on smart TV consoles, iPad devices, and smartphones smoothly'
        ]
      }
    ]
  },
  {
    id: 'telegram',
    nameAr: 'تليجرام وحسابات بريميوم متميزة ✈️',
    nameEn: 'Telegram Premium Connections ✈️',
    category: 'subscriptions',
    descriptionAr: 'انضم لطبقة النخبة على تليجرام وفك حدود الإرسال مع تفعيلات رقمية رسمية ومضمونة لحسابات مميزة.',
    descriptionEn: 'Join elite telegram active community and bypass download speed thresholds with safe license paths.',
    iconName: 'Send',
    accentColor: 'sky-500',
    textColor: 'text-sky-400',
    bannerColor: 'bg-sky-50/70',
    whatsappContact: '249113411965',
    plans: [
      {
        id: 'tg-open-account',
        nameAr: 'تفعيل حساب جديد آمن بالكامل (Open Account) 🔑',
        nameEn: 'Open New Secure Account 🔑',
        price: 2.4,
        currency: 'USD',
        periodAr: 'مرة واحدة',
        periodEn: 'One-time',
        featuresAr: [
          'فتح وتنشيط حساب إضافي مميز ومستقر للاستقبال بأرقام مفحوصة',
          'سريع، خفيف ومثالي للتجارة وتثبيت محادثات العمل الخاصة بك'
        ],
        featuresEn: [
          'Setup new verified clean profile to operate business messaging',
          'Optimized for ecommerce scaling and fast operations'
        ]
      },
      {
        id: 'tg-premium-monthly',
        nameAr: 'تليجرام بريميوم النخبوي (شهري)',
        nameEn: 'Telegram Premium (Monthly)',
        price: 7.2,
        currency: 'USD',
        periodAr: 'شهرياً',
        periodEn: 'Monthly',
        featuresAr: [
          'الشارة الفاخرة بجانب اسمك، وإمكانية إرسال ملفات عملاقة لغاية 4 جيجابايت',
          'سرعة تنزيل فائقة للملفات والمقاطع، وملصقات وتفاعلات حصرية متحركة',
          'تحويل الكلام والرسائل الصوتية لرسائل نصية بذكاء اصطناعي بنقرة واحدة'
        ],
        featuresEn: [
          'VIP profile badge & double system bounds for files up to 4GB size',
          'Fastest download speeds with exclusive animated react animations',
          'Instantly transcribe audio notes to text strings on the fly'
        ]
      },
      {
        id: 'tg-premium-yearly',
        nameAr: 'تليجرام بريميوم النخبوي (سنوي) ⭐',
        nameEn: 'Telegram Premium (Yearly) ⭐',
        price: 48.0,
        currency: 'USD',
        periodAr: 'سنوياً',
        periodEn: 'Annually',
        isPopular: true,
        featuresAr: [
          'توفير رائع وضخم لأدوات تليجرام بريميوم ممتد لعام كامل بدون توقف',
          'تفعيل رسمي وقانوني على رقمك المسجل فورياً وبضمان "Activate + Sudan"'
        ],
        featuresEn: [
          'Great yearly savings for power clients on Telegram premium',
          'Legal activation details applied directly to your registered mobile'
        ]
      }
    ]
  }
];

export const BANK_DETAILS_LIST: BankDetails[] = [
  {
    bankNameAr: 'تطبيق بنكك (بنك الخرطوم)',
    bankNameEn: 'Bankak App (Bank of Khartoum)',
    accountNameAr: 'عثمان آدم يحيى',
    accountNameEn: 'Osman Adam Yahia',
    accountNumber: '2819144',
    transferGuideAr: 'يرجى إرسال مبلغ الاشتراك كاملاً عبر تطبيق بنكك إلى رقم الحساب المذكور، ثم أخذ لقطة شاشة (Screenshot) لعملية التحويل ومشاركتها مع خدمة العملاء بالواتساب لتفعيل الاشتراك فورياً.',
    transferGuideEn: 'Please transfer the exact amount using Bankak to the account listed above, take a screenshot of the digital receipt and send it to our Customer Service on WhatsApp for instant activation.',
    icon: 'Wallet'
  },
  {
    bankNameAr: 'خدمة فوري (بنك فيصل الإسلامي)',
    bankNameEn: 'Fawry Service (Faisal Islamic Bank)',
    accountNameAr: 'مصطفى صلاح',
    accountNameEn: 'MUSTAFA SALAH',
    accountNumber: '51565989',
    transferGuideAr: 'قم بالدفع عبر فوري، ثم شارك الرمز التعريفي لعملية الدفع مع مسؤول التفعيل لتسريع معالجة الطلب.',
    transferGuideEn: 'Process your payment through Fawry, and send the transaction ID to our service manager to authorize immediately.',
    icon: 'CheckSquare'
  },
  {
    bankNameAr: 'حساب أوكاش (بنك أمدرمان الوطني)',
    bankNameEn: 'O-Cash Account (Omdurman National Bank)',
    accountNameAr: 'مصطفى صلاح',
    accountNameEn: 'MUSTAFA SALAH',
    accountNumber: '1241486',
    transferGuideAr: 'يرجى إرسال قيمة الاشتراك كاملاً عبر تطبيق أوكاش إلى رقم الحساب المذكور، ثم خذ لقطة شاشة (Screenshot) لعملية التحويل ومشاركتها مع خدمة العملاء بالواتساب للتفعيل فورياً.',
    transferGuideEn: 'Please transfer the exact amount using O-Cash to the account listed above, take a screenshot of the digital receipt and send it to our Customer Service on WhatsApp for instant activation.',
    icon: 'Smartphone'
  }
];

export const FAQS = [
  {
    id: 'faq-1',
    qAr: 'كيف أقوم بشراء وتفعيل أي اشتراك أو برنامج؟',
    qEn: 'How do I purchase and activate a subscription?',
    aAr: 'الأمر بسيط جداً! قم باختيار البرنامج الباقة المناسبة لك، اضغط على زر "طلب التفعيل الآن" لتعبئة بياناتك الأساسية واختيار طريقة الدفع المناسبة لك (مثل تطبيق بنكك). بعد ذلك سيقوم النظام بإنشاء رسالة واتساب مجهزة ومكتوبة بعناية، اضغط إرسال وسيقوم موظف التفعيل بمباشرة طلبك وتنفيذه فوراً.',
    aEn: 'It is very simple! Browse our catalog, choose the desired service and plan, click on "Purchase Subscription Now" to fill your basic target parameters and select a payment gateway (e.g. Bankak). The app will automatically construct a customized direct WhatsApp chat message. Click send and our operator will process and verify your service immediately.'
  },
  {
    id: 'faq-2',
    qAr: 'ما هي مدة تفعيل الاشتراك بعد تحويل المبلغ؟',
    qEn: 'How long does the service activation take after payment?',
    aAr: 'يستغرق التفعيل عادةً من 5 دقائق إلى ساعة واحدة كحد أقصى خلال ساعات العمل من الساعة 8 صباحاً وحتى 12 من منتصف الليل بتوقيت السودان. بعض الخدمات المعقدة قد تطلب وقتاً أطول للتفعيل الرسمي بموجب دعوات رسمية.',
    aEn: 'Activations are typically processed within 5 to 60 minutes during our standard working hours (8:00 AM to 12:00 AM Sudan Time). Certain complex enterprise plans may utilize official invites that require up to a few hours of verification.'
  },
  {
    id: 'faq-3',
    qAr: 'هل التفعيلات أصلية وبضمان كامل؟',
    qEn: 'Are the activations official and under warranty?',
    aAr: 'نعم بالكامل! جميع اشتراكات منصة "Activate + Sudan" هي اشتراكات رسمية وشرعية 100% ويتم تفعيلها على حساباتك الشخصية الحالية دون الخوف من الحظر أو فقدان البيانات، ولدينا ضمان كامل طوال فترة الاشتراك لمتابعة وصيانة الخدمة.',
    aEn: '100% Yes! All "Activate + Sudan" service upgrades are direct, legal, and applied in compliance with the service rules without affecting your current private profile files. We provide a full-duration warranty on every single month purchased.'
  },
  {
    id: 'faq-4',
    qAr: 'كيف تضمنون تشغيل الخدمات في السودان رغم الحظر المفروض؟',
    qEn: 'How do you ensure service operations within Sudan despite limits?',
    aAr: 'نحن نستخدم حسابات دولية معتمدة ووكلاء دفع مرخصين في عدة دول لإصدار وتثبيت التفعيلات بطريقة قانونية وسليمة، مما يتيح لك الاستمتاع بكافة مزايا الخدمات دون أي انقطاع أو قيود على موقعك الجغرافي وبشكل سلس.',
    aEn: 'We employ global corporate billing setups and authorized payments via international partners across regions. Your account will securely gain all premium features cleanly and smoothly without continuous geographic lockdowns.'
  }
];
