'use client';

import { useMemo } from 'react';
import { getBrandDisplayName, getExtraCategories, matchesBrandSearch } from '@/constants/brands';
import { compareBrandsByRank, categoryHasSurveyRank } from '@/constants/brandRank';
import {
  ALL_FILTER_METHODS,
  ALL_PLATFORMS,
  BrandSortMode,
  Category,
  DiscountInfo,
  FilterState,
  GroupedDiscount,
} from '@/types/discount';

interface UseProcessedDiscountsOptions {
  discounts: DiscountInfo[];
  selectedCategory: Category;
  searchQuery: string;
  sortMode: BrandSortMode;
  filter: FilterState;
}

interface UseProcessedDiscountsResult {
  discounts: GroupedDiscount[];
  effectiveSortMode: BrandSortMode;
  showRankOption: boolean;
}

export function useProcessedDiscounts({
  discounts,
  selectedCategory,
  searchQuery,
  sortMode,
  filter,
}: UseProcessedDiscountsOptions): UseProcessedDiscountsResult {
  const searchActive = searchQuery.trim().length > 0;
  const showRankOption =
    selectedCategory !== 'all' &&
    (searchActive || categoryHasSurveyRank(selectedCategory));
  const effectiveSortMode =
    !showRankOption && sortMode === 'rank' ? 'discount' : sortMode;

  const processedDiscounts = useMemo((): GroupedDiscount[] => {
    const platformFiltered = filter.platforms.length < ALL_PLATFORMS.length;
    const methodFiltered = filter.methods.length < ALL_FILTER_METHODS.length;
    const platformSet = new Set(filter.platforms);
    const methodSet = new Set(filter.methods);

    const filtered = discounts.filter((discount) => {
      const matchesCategory = searchActive ||
        selectedCategory === 'all' ||
        discount.category === selectedCategory ||
        getExtraCategories(discount.brandName).includes(selectedCategory);

      if (!matchesCategory || !matchesBrandSearch(discount.brandName, searchQuery)) {
        return false;
      }

      if (platformFiltered && !platformSet.has(discount.platform)) return false;
      if (methodFiltered && discount.method !== '전체' && !methodSet.has(discount.method)) {
        return false;
      }

      return true;
    });

    const brandGroups = new Map<string, GroupedDiscount>();
    filtered.forEach((discount) => {
      const existing = brandGroups.get(discount.brandName);
      const brand = existing ?? {
        id: discount.brandName,
        brandKey: discount.brandName,
        brandName: getBrandDisplayName(discount.brandName),
        category: discount.category,
        platforms: [],
        totalMaxDiscount: 0,
        minOrderLowest: Number.POSITIVE_INFINITY,
        isBest: false,
      };

      if (discount.discountAmount > 0) {
        brand.minOrderLowest = Math.min(brand.minOrderLowest, discount.minOrderAmount);
      }

      let platform = brand.platforms.find((item) => item.platform === discount.platform);
      if (!platform) {
        platform = { platform: discount.platform, coupons: [], maxDiscount: 0 };
        brand.platforms.push(platform);
      }

      platform.coupons.push({
        discountAmount: discount.discountAmount,
        minOrderAmount: discount.minOrderAmount,
        description: discount.description,
        method: discount.method,
        deliveryTypes: discount.deliveryTypes,
        specialCondition: discount.specialCondition,
        validUntil: discount.validUntil,
      });
      platform.maxDiscount = Math.max(platform.maxDiscount, discount.discountAmount);
      brand.totalMaxDiscount = Math.max(brand.totalMaxDiscount, discount.discountAmount);
      brandGroups.set(discount.brandName, brand);
    });

    const groups = [...brandGroups.values()]
      .map((brand) => {
        brand.platforms.sort((a, b) => b.maxDiscount - a.maxDiscount);
        brand.platforms.forEach((platform) => {
          platform.coupons.sort((a, b) => b.discountAmount - a.discountAmount);
        });
        return {
          ...brand,
          minOrderLowest: Number.isFinite(brand.minOrderLowest) ? brand.minOrderLowest : 0,
        };
      })
      .filter((brand) =>
        filter.maxMinOrder === null || brand.minOrderLowest <= filter.maxMinOrder
      );

    const globalMaxDiscount = groups.reduce(
      (max, brand) => Math.max(max, brand.totalMaxDiscount),
      0
    );

    return groups
      .map((brand) => ({
        ...brand,
        isBest:
          globalMaxDiscount >= 4000 && brand.totalMaxDiscount === globalMaxDiscount,
      }))
      .sort((a, b) => {
        if (effectiveSortMode === 'discount' && b.totalMaxDiscount !== a.totalMaxDiscount) {
          return b.totalMaxDiscount - a.totalMaxDiscount;
        }
        if (effectiveSortMode === 'minOrder' && a.minOrderLowest !== b.minOrderLowest) {
          return a.minOrderLowest - b.minOrderLowest;
        }
        return compareBrandsByRank(a, b);
      });
  }, [discounts, effectiveSortMode, filter, searchActive, searchQuery, selectedCategory]);

  return { discounts: processedDiscounts, effectiveSortMode, showRankOption };
}
