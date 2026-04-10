'use client';

import { useState, useEffect, useMemo } from 'react';
import CategoryFilter from '@/components/home/CategoryFilter';
import DiscountCard from '@/components/home/DiscountCard';
import { useDiscounts } from '@/hooks/useDiscounts';
import { GroupedDiscount, Category, BrandSortMode } from '@/types/discount';
import { compareBrandsByRank } from '@/constants/brandRank';
import BrandSortControl from '@/components/home/BrandSortControl';

const BRAND_ALIASES: Record<string, string[]> = {
  '7번가피자': ['7번가'],
  'BBQ': ['bbq', '비비큐'],
  'BHC': ['bhc', '비에이치씨', '비에이치시'],
  'COFFEE@WORKS': ['커앳웍'],
  'Mad for Garlic': ['매포갈', '매드포갈릭'],
  'PASCUCCI': ['파쿠', '파스쿠찌', '파스쿠치'],
  'Tim Hortons': ['팀홀튼'],
  'jamba': ['잠바', '잠바주스'],
  '교촌치킨': ['교촌'],
  '굽네치킨': ['굽네'],
  '꾸브라꼬숯불치킨': ['꾸브라꼬'],
  '네네치킨': ['네네'],
  '노모어피자': ['노모어'],
  '도미노피자': ['도미노'],
  '동대문엽기떡볶이': ['엽떡', '엽기떡볶이', '동대문엽떡'],
  '두찜': ['두마리 찜닭', '두마리찜닭'],
  '뚜레쥬르': ['뚜쥬'],
  '롯데리아': ['롯리'],
  '맘스터치': ['맘터'],
  '맥도날드': ['맥날'],
  '반올림피자': ['반올림'],
  '배스킨라빈스': ['베라', '배라', '베스킨라빈스', '배스킨'],
  '버거킹': ['벜', '버킹'],
  '본스치킨': ['본스'],
  '빅스타피자': ['빅스타'],
  '쉐이크쉑': ['쉑쉑버거', '쉑쉑'],
  '오븐마루치킨': ['오븐마루'],
  '오븐에빠진닭': ['오빠닭'],
  '유로코피자': ['유로코'],
  '육회바른연어': ['육바연'],
  '자담치킨': ['자담'],
  '지코바치킨': ['지코바'],
  '처갓집양념치킨': ['처갓집'],
  '청년피자': ['청피'],
  '치킨플러스': ['치플'],
  '투존치킨': ['투존'],
  '티바두마리치킨': ['티바'],
  '파리바게뜨': ['파바', '파리바게트'],
  '피자헛': ['핏자헛'],
  '호식이두마리치킨': ['호식이'],
};

// 특정 브랜드가 추가로 포함될 카테고리 (DB 카테고리 외 추가 노출)
const EXTRA_CATEGORIES: Record<string, Category[]> = {
  '맘스터치': ['burger'],
};

// 영문 브랜드명 → 한글 표기 병기 맵
const BRAND_KO_LABEL: Record<string, string> = {
  'BBQ': 'BBQ',
  'BHC': 'BHC',
  'COFFEE@WORKS': 'COFFEE@WORKS 커피앳웍스',
  'Mad for Garlic': 'Mad for Garlic 매드포갈릭',
  'PASCUCCI': 'PASCUCCI 파스쿠찌',
  'Tim Hortons': 'Tim Hortons 팀홀튼',
  'jamba': 'jamba 잠바주스',
};

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<Category>('chicken');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [brandSortMode, setBrandSortMode] = useState<BrandSortMode>('rank');
  const { discounts, loading, error } = useDiscounts();

  // Load state from localStorage on mount
  useEffect(() => {
    const init = () => {
      const savedCategory = localStorage.getItem('selectedCategory');
      const savedSearch = localStorage.getItem('searchQuery');
      const savedSort = localStorage.getItem('brandSortMode');
      if (savedCategory && savedCategory !== 'all') setSelectedCategory(savedCategory as Category);
      if (savedSearch) setSearchQuery(savedSearch);
      if (savedSort === 'rank' || savedSort === 'discount' || savedSort === 'minOrder') {
        setBrandSortMode(savedSort);
      }
    };
    init();
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('selectedCategory', selectedCategory);
    localStorage.setItem('searchQuery', searchQuery);
    localStorage.setItem('brandSortMode', brandSortMode);
  }, [selectedCategory, searchQuery, brandSortMode]);

  const processedDiscounts = useMemo((): GroupedDiscount[] => {
    // 1. Filter by category and search
    const filtered = discounts.filter(d => {
      const searchLower = searchQuery.toLowerCase().trim();
      
      // 검색어가 있으면 카테고리 무시하고 전체에서 검색
      const extraCategories = EXTRA_CATEGORIES[d.brandName] ?? [];
      const matchesCategory = searchLower ? true : (
        selectedCategory === 'all' ||
        d.category === selectedCategory ||
        extraCategories.includes(selectedCategory)
      );
      
      const brandNameLower = d.brandName.toLowerCase();
      // 병기 표시명도 검색 대상에 포함
      const brandLabelLower = (BRAND_KO_LABEL[d.brandName] ?? d.brandName).toLowerCase();

      // Check if direct match (원본명 + 병기명 모두 체크)
      let matchesSearch = searchLower
        ? brandNameLower.includes(searchLower) || brandLabelLower.includes(searchLower)
        : true;

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
          brandKey: brandKey,
          brandName: BRAND_KO_LABEL[d.brandName] ?? d.brandName,
          category: d.category,
          platforms: [],
          totalMaxDiscount: 0,
          minOrderLowest: Number.POSITIVE_INFINITY,
          isBest: false
        };
      }

      brandGroups[brandKey].minOrderLowest = Math.min(
        brandGroups[brandKey].minOrderLowest,
        d.minOrderAmount
      );

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

    const groups = Object.values(brandGroups).map((g) => ({
      ...g,
      minOrderLowest: Number.isFinite(g.minOrderLowest) ? g.minOrderLowest : 0,
    }));

    // 3. Find the maximum discount among all visible brands
    const globalMaxDiscount = groups.reduce((max, g) => Math.max(max, g.totalMaxDiscount), 0);

    // 4. Mark isBest for brands that offer the absolute maximum discount in current view (if it's a significant discount)
    const withBest = groups.map(g => ({
      ...g,
      isBest: globalMaxDiscount > 0 && g.totalMaxDiscount === globalMaxDiscount && g.totalMaxDiscount >= 4000
    }));

    const sorted = [...withBest].sort((a, b) => {
      if (brandSortMode === 'discount') {
        if (b.totalMaxDiscount !== a.totalMaxDiscount) {
          return b.totalMaxDiscount - a.totalMaxDiscount;
        }
        return compareBrandsByRank(a, b);
      }
      if (brandSortMode === 'minOrder') {
        if (a.minOrderLowest !== b.minOrderLowest) {
          return a.minOrderLowest - b.minOrderLowest;
        }
        return compareBrandsByRank(a, b);
      }
      return compareBrandsByRank(a, b);
    });

    return sorted;
  }, [discounts, selectedCategory, searchQuery, brandSortMode]);

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

      {/* Category Tabs */}
      <div className="px-0">
        <CategoryFilter 
          activeId={selectedCategory} 
          onSelect={(id) => setSelectedCategory(id)} 
        />
      </div>

      <BrandSortControl value={brandSortMode} onChange={setBrandSortMode} />

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
