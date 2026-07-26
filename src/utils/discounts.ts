import {
  ALL_CATEGORIES,
  ALL_FILTER_METHODS,
  ALL_PLATFORMS,
  Category,
  DiscountInfo,
  FilterMethod,
  Platform,
} from '@/types/discount';

export interface DiscountDataStats {
  activeCount: number;
  expiredExcludedCount: number;
  unknownExpiryCount: number;
  source: 'local' | 'supabase';
}

export function getTodayInKorea(date = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

export function isCurrentDiscount(
  discount: DiscountInfo,
  today = getTodayInKorea()
): boolean {
  return !discount.validUntil || discount.validUntil >= today;
}

export function filterCurrentDiscounts(
  discounts: DiscountInfo[],
  source: DiscountDataStats['source']
): { discounts: DiscountInfo[]; stats: DiscountDataStats } {
  const today = getTodayInKorea();
  const current = discounts.filter((discount) => isCurrentDiscount(discount, today));

  return {
    discounts: current,
    stats: {
      activeCount: current.length,
      expiredExcludedCount: discounts.length - current.length,
      unknownExpiryCount: current.filter((discount) => !discount.validUntil).length,
      source,
    },
  };
}

export function isCategory(value: string): value is Category {
  return ALL_CATEGORIES.includes(value as Category);
}

export function isPlatform(value: unknown): value is Platform {
  return typeof value === 'string' && ALL_PLATFORMS.includes(value as Platform);
}

export function isFilterMethod(value: unknown): value is FilterMethod {
  return typeof value === 'string' && ALL_FILTER_METHODS.includes(value as FilterMethod);
}
