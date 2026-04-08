export type Platform = 'baemin' | 'yogiyo' | 'coupang' | 'ttangyo';

export type Category = 'all' | 'chicken' | 'korean' | 'bunsik' | 'pizza' | 'meat' | 'chinese' | 'japanese' | 'burger' | 'western' | 'cafe' | 'bakery';

export type Method = '배달' | '픽업' | '전체';

export interface Coupon {
  discountAmount: number;
  minOrderAmount: number;
  description?: string;
  method: Method;
  deliveryTypes: string[];
  specialCondition: string | null;
}

export interface DiscountInfo {
  id: string;
  brandName: string;
  platform: Platform;
  discountAmount: number;
  minOrderAmount: number;
  description?: string;
  validUntil?: string;
  category: Category;
  isBest?: boolean;
  method: Method;
  deliveryTypes: string[];
  specialCondition: string | null;
}

export interface PlatformGroup {
  platform: Platform;
  coupons: Coupon[];
  maxDiscount: number;
}

export interface GroupedDiscount {
  id: string;
  brandName: string;
  category: Category;
  platforms: PlatformGroup[];
  totalMaxDiscount: number;
  isBest?: boolean;
}
