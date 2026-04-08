'use client';

import { useState, useEffect, useMemo } from 'react';
import CategoryFilter from '@/components/home/CategoryFilter';
import DiscountCard from '@/components/home/DiscountCard';
import ShareButton from '@/components/home/ShareButton';
import { useDiscounts } from '@/hooks/useDiscounts';
import { GroupedDiscount, Category } from '@/types/discount';

const BRAND_ALIASES: Record<string, string[]> = {
  '동대문엽기떡볶이': ['엽떡', '엽기떡볶이', '동대문엽떡', '엽떡'],
  'BHC': ['bhc', '비에이치시', '비에이치씨'],
  '교촌치킨': ['교촌'],
  'BBQ': ['bbq', '비비큐'],
  '도미노피자': ['도미노'],
  '피자헛': ['핏자헛'],
  '맘스터치': ['맘터'],
  '버거킹': ['벜', '버킹'],
  '맥도날드': ['맥날'],
  '롯데리아': ['롯리'],
  '뚜레쥬르': ['뚜쥬'],
  '파리바게뜨': ['파바', '파리바게트'],
  '배스킨라빈스': ['베라', '배라', '베스킨라빈스', '배스킨'],
  '두찜': ['두마리찜닭'],
};

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const { discounts, loading, error } = useDiscounts();

  // Load state from localStorage on mount
  useEffect(() => {
    const init = () => {
      const savedCategory = localStorage.getItem('selectedCategory');
      const savedSearch = localStorage.getItem('searchQuery');
      if (savedCategory) setSelectedCategory(savedCategory as Category);
      if (savedSearch) setSearchQuery(savedSearch);
    };
    init();
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('selectedCategory', selectedCategory);
    localStorage.setItem('searchQuery', searchQuery);
  }, [selectedCategory, searchQuery]);

  const processedDiscounts = useMemo((): GroupedDiscount[] => {
    // 1. Filter by category and search
    const filtered = discounts.filter(d => {
      const searchLower = searchQuery.toLowerCase().trim();
      
      // 검색어가 있으면 카테고리 무시하고 전체에서 검색
      const matchesCategory = searchLower ? true : (selectedCategory === 'all' || d.category === selectedCategory);
      
      const brandNameLower = d.brandName.toLowerCase();
      
      // Check if direct match
      let matchesSearch = searchLower ? brandNameLower.includes(searchLower) : true;
      
      // Check aliases
      if (!matchesSearch && searchLower) {
        for (const [officialBrand, aliases] of Object.entries(BRAND_ALIASES)) {
          if (
            aliases.some(alias => alias.toLowerCase().includes(searchLower) || searchLower.includes(alias.toLowerCase())) &&
            (brandNameLower.includes(officialBrand.toLowerCase()) || officialBrand.toLowerCase().includes(brandNameLower))
          ) {
            matchesSearch = true;
            break;
          }
        }
      }

      return matchesCategory && matchesSearch;
    });

    // 2. Group by brandName only
    const brandGroups: Record<string, GroupedDiscount> = {};
    filtered.forEach(d => {
      const brandKey = d.brandName;
      if (!brandGroups[brandKey]) {
        brandGroups[brandKey] = {
          id: brandKey,
          brandName: d.brandName,
          category: d.category,
          platforms: [],
          totalMaxDiscount: 0,
          isBest: false
        };
      }

      let platformGroup = brandGroups[brandKey].platforms.find(p => p.platform === d.platform);
      if (!platformGroup) {
        platformGroup = {
          platform: d.platform,
          coupons: [],
          maxDiscount: 0
        };
        brandGroups[brandKey].platforms.push(platformGroup);
      }

      platformGroup.coupons.push({
        discountAmount: d.discountAmount,
        minOrderAmount: d.minOrderAmount,
        description: d.description,
        method: d.method,
        deliveryTypes: d.deliveryTypes,
        specialCondition: d.specialCondition
      });

      if (d.discountAmount > platformGroup.maxDiscount) {
        platformGroup.maxDiscount = d.discountAmount;
      }
      if (d.discountAmount > brandGroups[brandKey].totalMaxDiscount) {
        brandGroups[brandKey].totalMaxDiscount = d.discountAmount;
      }
    });

    // Sort platforms and coupons
    Object.values(brandGroups).forEach(brand => {
      // Sort platforms by maxDiscount descending
      brand.platforms.sort((a, b) => b.maxDiscount - a.maxDiscount);
      // Sort coupons in each platform by discountAmount descending
      brand.platforms.forEach(p => {
        p.coupons.sort((a, b) => b.discountAmount - a.discountAmount);
      });
    });

    const groups = Object.values(brandGroups);

    // 3. Find the maximum discount among all visible brands
    const globalMaxDiscount = groups.reduce((max, g) => Math.max(max, g.totalMaxDiscount), 0);

    // 4. Mark isBest for brands that offer the absolute maximum discount in current view (if it's a significant discount)
    return groups.map(g => ({
      ...g,
      isBest: globalMaxDiscount > 0 && g.totalMaxDiscount === globalMaxDiscount && g.totalMaxDiscount >= 4000
    }));
  }, [discounts, selectedCategory, searchQuery]);

  return (
    <div className="flex flex-col">
      {/* Search Bar */}
      <div className="px-4 mt-2">
        <div className="bg-gray-100 p-3 rounded-xl flex items-center gap-2 text-gray-600 focus-within:bg-gray-200 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input 
            type="text" 
            placeholder="브랜드명을 검색해보세요" 
            className="bg-transparent border-none outline-none w-full text-sm font-medium placeholder:text-gray-400"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Category Tabs & Share */}
      <div className="flex items-center justify-between pr-4 gap-2">
        <div className="flex-1 overflow-hidden">
          <CategoryFilter 
            activeId={selectedCategory} 
            onSelect={(id) => setSelectedCategory(id)} 
          />
        </div>
        <div className="flex-shrink-0">
          <ShareButton />
        </div>
      </div>

      {/* Content Area */}
      <div className="px-4 py-2 flex-1 flex flex-col gap-4">
        {loading ? (
          <div className="py-12 flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-baemin border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-400 text-sm">최신 할인 정보를 찾는 중...</p>
          </div>
        ) : error ? (
          <div className="py-12 text-center text-gray-400">
            <p className="text-sm">정보를 불러오지 못했습니다.</p>
          </div>
        ) : processedDiscounts.length > 0 ? (
          <div className="flex flex-col gap-5 mb-8">
            {processedDiscounts.map(discount => (
              <DiscountCard key={discount.id} discount={discount} />
            ))}
          </div>
        ) : (
          <div className="py-20 flex flex-col items-center justify-center text-center text-gray-400">
            <p className="text-sm font-medium">
              현재 진행 중인 할인이 없습니다.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
