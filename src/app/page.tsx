'use client';

import { useEffect, useRef, useState } from 'react';
import CategoryFilter from '@/components/home/CategoryFilter';
import DataNotice from '@/components/home/DataNotice';
import DiscountCard from '@/components/home/DiscountCard';
import FilterPanel from '@/components/home/FilterPanel';
import { useDiscounts } from '@/hooks/useDiscounts';
import { useFilter } from '@/hooks/useFilter';
import { useProcessedDiscounts } from '@/hooks/useProcessedDiscounts';
import { BrandSortMode, Category } from '@/types/discount';
import { isCategory } from '@/utils/discounts';
import BrandSortControl from '@/components/home/BrandSortControl';
import MenuRoulette from '@/components/roulette/MenuRoulette';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [brandSortMode, setBrandSortMode] = useState<BrandSortMode>('rank');
  const [filterOpen, setFilterOpen] = useState(false);
  const [rouletteOpen, setRouletteOpen] = useState(false);
  const [showRouletteHint, setShowRouletteHint] = useState(true);
  const [preferencesLoaded, setPreferencesLoaded] = useState(false);
  const rouletteCloseButtonRef = useRef<HTMLButtonElement>(null);
  const { discounts, loading, error, stats } = useDiscounts();
  const { filter, setFilter, isFilterActive, activeFilterCount } = useFilter();

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const savedCategory = localStorage.getItem('selectedCategory');
      const savedSearch = localStorage.getItem('searchQuery');
      const savedSort = localStorage.getItem('brandSortMode');
      if (savedCategory && isCategory(savedCategory)) setSelectedCategory(savedCategory);
      if (savedSearch) setSearchQuery(savedSearch);
      if (savedSort === 'rank' || savedSort === 'discount' || savedSort === 'minOrder') {
        setBrandSortMode(savedSort);
      }
    } finally {
      setPreferencesLoaded(true);
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (!preferencesLoaded) return;
    localStorage.setItem('selectedCategory', selectedCategory);
    localStorage.setItem('searchQuery', searchQuery);
    localStorage.setItem('brandSortMode', brandSortMode);
  }, [brandSortMode, preferencesLoaded, searchQuery, selectedCategory]);

  // 스크롤을 시작하면 떠다니는 다이스의 안내 문구를 숨긴다.
  useEffect(() => {
    const onScroll = () => {
      setShowRouletteHint(window.scrollY < 40);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!rouletteOpen) return;

    const previousOverflow = document.body.style.overflow;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setRouletteOpen(false);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    window.requestAnimationFrame(() => rouletteCloseButtonRef.current?.focus());

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [rouletteOpen]);

  const {
    discounts: processedDiscounts,
    effectiveSortMode,
    showRankOption,
  } = useProcessedDiscounts({
    discounts,
    selectedCategory,
    searchQuery,
    sortMode: brandSortMode,
    filter,
  });

  return (
    <div className="flex flex-col">
      {/* Search Bar */}
      <div className="px-4 mt-2">
        <div className="bg-gray-100 p-3 rounded-xl flex items-center gap-2 text-gray-600 focus-within:bg-gray-200 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input 
            id="brand-search"
            aria-label="브랜드명 검색"
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

      <BrandSortControl
        value={effectiveSortMode}
        onChange={setBrandSortMode}
        showRankOption={showRankOption}
        filterButton={
          <button
            onClick={() => setFilterOpen(true)}
            className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
              isFilterActive
                ? 'bg-baemin text-white shadow-sm shadow-baemin/25'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/>
            </svg>
            필터
            {activeFilterCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center leading-none">
                {activeFilterCount}
              </span>
            )}
          </button>
        }
      />

      {!loading && !error && <DataNotice stats={stats} />}

      {filterOpen && (
        <FilterPanel
          isOpen={filterOpen}
          onClose={() => setFilterOpen(false)}
          filter={filter}
          onApply={setFilter}
        />
      )}

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
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-3 rounded-lg bg-gray-100 px-3 py-2 text-xs font-bold text-gray-600"
            >
              다시 시도
            </button>
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
              {searchQuery.trim() || isFilterActive
                ? '조건에 맞는 할인 정보가 없습니다.'
                : '현재 확인된 진행 중 할인이 없습니다.'}
            </p>
          </div>
        )}
      </div>

      {/* Roulette FAB */}
      <button
        onClick={() => setRouletteOpen(true)}
        type="button"
        aria-label="메뉴 룰렛 열기"
        className="roulette-fab fixed bottom-6 z-50 flex items-center justify-end"
      >
        <span
          className={`pointer-events-none mr-2 rounded-full bg-black/80 px-3 py-1.5 text-xs font-bold text-white shadow transition-all duration-300 ${
            showRouletteHint
              ? 'translate-x-0 opacity-100'
              : 'translate-x-2 opacity-0'
          }`}
        >
          뭐 먹지?
        </span>
        <span className="w-14 h-14 bg-red-500 text-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform active:scale-95">
        <span className="text-2xl">🎲</span>
        </span>
      </button>

      {/* Roulette Modal */}
      {rouletteOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4"
          onClick={() => setRouletteOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="roulette-title"
            className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto relative p-2 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button 
              ref={rouletteCloseButtonRef}
              onClick={() => setRouletteOpen(false)}
              type="button"
              aria-label="메뉴 룰렛 닫기"
              className="absolute top-4 right-4 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 font-bold z-10 hover:bg-gray-200"
            >
              ✕
            </button>
            <MenuRoulette />
          </div>
        </div>
      )}
    </div>
  );
}
