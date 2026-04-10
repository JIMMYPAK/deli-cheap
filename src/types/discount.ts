export type Platform = 'baemin' | 'yogiyo' | 'coupang' | 'ttangyo';

export type Category = 'all' | 'chicken' | 'korean' | 'bunsik' | 'pizza' | 'meat' | 'chinese' | 'japanese' | 'burger' | 'western' | 'cafe' | 'bakery';

/** 브랜드 카드 목록 정렬 */
export type BrandSortMode = 'rank' | 'discount' | 'minOrder';

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
  brandKey: string;
  brandName: string;
  category: Category;
  platforms: PlatformGroup[];
  totalMaxDiscount: number;
  /** 브랜드 내 쿠폰 중 최소 주문 금액이 가장 작은 값 (정렬·비교용) */
  minOrderLowest: number;
  isBest?: boolean;
}
