export type CategoryType = 'all' | 'subscriptions' | 'apps' | 'computer' | 'phones' | 'games';

export interface Plan {
  id: string;
  nameAr: string;
  nameEn: string;
  price: number;
  currency: 'USD' | 'SDG';
  periodAr: string;
  periodEn: string;
  featuresAr: string[];
  featuresEn: string[];
  isPopular?: boolean;
}

export interface Service {
  id: string;
  nameAr: string;
  nameEn: string;
  category: CategoryType;
  descriptionAr: string;
  descriptionEn: string;
  iconName: string;
  accentColor: string; // Tailwind color name e.g. "sky-600"
  textColor: string;   // Tailwind text color class e.g. "text-sky-600"
  bannerColor: string; // Tailwind background overlay class
  plans: Plan[];
  whatsappContact?: string; // Specific WhatsApp if different
}

export interface Order {
  id: string;
  serviceId: string;
  serviceName: string;
  planId: string;
  planName: string;
  price: number;
  currency: 'USD' | 'SDG';
  clientName: string;
  clientContact: string; // Phone or WhatsApp
  activationDetail: string; // Email or account link or number
  paymentMethod: 'bankak' | 'fawry' | 'ocash' | 'usdt' | 'local_cash';
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface BankDetails {
  bankNameAr: string;
  bankNameEn: string;
  accountNameAr: string;
  accountNameEn: string;
  accountNumber: string;
  transferGuideAr: string;
  transferGuideEn: string;
  icon: string;
}

export interface Advertisement {
  id: string;
  textAr: string;
  textEn: string;
  link?: string;
  type: 'bar' | 'banner';
  active: boolean;
  createdAt: string;
}

export interface SpecialOffer {
  id: string;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  price: number;
  currency: 'USD' | 'SDG';
  badgeAr?: string;
  badgeEn?: string;
  periodAr: string;
  periodEn: string;
  active: boolean;
  featuresAr: string[];
  featuresEn: string[];
  createdAt: string;
}

export interface CartItem {
  id: string;
  service: Service;
  plan: Plan;
  quantity: number;
}

