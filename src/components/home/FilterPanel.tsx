'use client';

import { useEffect, useRef, useState } from 'react';
import {
  FilterState,
  FilterMethod,
  Platform,
  ALL_PLATFORMS,
  ALL_FILTER_METHODS,
  DEFAULT_FILTER,
} from '@/types/discount';

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  filter: FilterState;
  onApply: (filter: FilterState) => void;
}

const PLATFORM_LABELS: Record<Platform, string> = {
  baemin: '배민',
  yogiyo: '요기요',
  coupang: '쿠팡이츠',
  ttangyo: '땡겨요',
};

const METHOD_LABELS: Record<FilterMethod, string> = {
  배달: '배달',
  포장: '포장',
};

const MIN_ORDER_OPTIONS: { value: number | null; label: string }[] = [
  { value: 15000, label: '1.5만원 이하' },
  { value: 20000, label: '2만원 이하' },
  { value: 25000, label: '2.5만원 이하' },
  { value: null, label: '제한없음' },
];

export default function FilterPanel({ isOpen, onClose, filter, onApply }: FilterPanelProps) {
  const [draft, setDraft] = useState<FilterState>(filter);
  const panelRef = useRef<HTMLDivElement>(null);

  // Sync draft when panel opens
  useEffect(() => {
    if (isOpen) setDraft(filter);
  }, [isOpen, filter]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const togglePlatform = (p: Platform) => {
    setDraft(prev => {
      const has = prev.platforms.includes(p);
      if (has && prev.platforms.length === 1) return prev; // 최소 1개 유지
      return {
        ...prev,
        platforms: has ? prev.platforms.filter(x => x !== p) : [...prev.platforms, p],
      };
    });
  };

  const toggleMethod = (m: FilterMethod) => {
    setDraft(prev => {
      const has = prev.methods.includes(m);
      if (has && prev.methods.length === 1) return prev;
      return {
        ...prev,
        methods: has ? prev.methods.filter(x => x !== m) : [...prev.methods, m],
      };
    });
  };

  const allPlatformsSelected = draft.platforms.length === ALL_PLATFORMS.length;
  const allMethodsSelected = draft.methods.length === ALL_FILTER_METHODS.length;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className={`fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-2xl shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {/* Handle bar */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-9 h-1 bg-gray-200 rounded-full" />
        </div>

        <div className="px-5 pt-2 pb-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-black text-gray-900">필터</h2>
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-gray-600"
              aria-label="닫기"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Platform */}
          <section className="mb-5">
            <div className="flex items-center justify-between mb-2.5">
              <p className="text-xs font-bold text-gray-700">플랫폼</p>
              <button
                onClick={() =>
                  setDraft(prev => ({
                    ...prev,
                    platforms: allPlatformsSelected ? [] : [...ALL_PLATFORMS],
                  }))
                }
                className={`text-[11px] font-bold px-2 py-0.5 rounded-md transition-colors ${
                  allPlatformsSelected
                    ? 'text-baemin bg-baemin/10'
                    : 'text-gray-400 bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {allPlatformsSelected ? '전체해제' : '전체선택'}
              </button>
            </div>
            <div className="flex gap-2 flex-wrap">
              {ALL_PLATFORMS.map(p => (
                <button
                  key={p}
                  onClick={() => togglePlatform(p)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-150 ${
                    draft.platforms.includes(p)
                      ? 'bg-baemin text-white shadow-sm shadow-baemin/25'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {PLATFORM_LABELS[p]}
                </button>
              ))}
            </div>
          </section>

          {/* Method */}
          <section className="mb-5">
            <div className="flex items-center justify-between mb-2.5">
              <p className="text-xs font-bold text-gray-700">주문방식</p>
              <button
                onClick={() =>
                  setDraft(prev => ({
                    ...prev,
                    methods: allMethodsSelected ? [] : [...ALL_FILTER_METHODS],
                  }))
                }
                className={`text-[11px] font-bold px-2 py-0.5 rounded-md transition-colors ${
                  allMethodsSelected
                    ? 'text-baemin bg-baemin/10'
                    : 'text-gray-400 bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {allMethodsSelected ? '전체해제' : '전체선택'}
              </button>
            </div>
            <div className="flex gap-2">
              {ALL_FILTER_METHODS.map(m => (
                <button
                  key={m}
                  onClick={() => toggleMethod(m)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-150 ${
                    draft.methods.includes(m)
                      ? 'bg-baemin text-white shadow-sm shadow-baemin/25'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {METHOD_LABELS[m]}
                </button>
              ))}
            </div>
          </section>

          {/* Min Order */}
          <section className="mb-6">
            <p className="text-xs font-bold text-gray-700 mb-2.5">최소 주문금액 상한</p>
            <div className="flex gap-2 flex-wrap">
              {MIN_ORDER_OPTIONS.map(opt => (
                <button
                  key={String(opt.value)}
                  onClick={() => setDraft(prev => ({ ...prev, maxMinOrder: opt.value }))}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-150 ${
                    draft.maxMinOrder === opt.value
                      ? 'bg-baemin text-white shadow-sm shadow-baemin/25'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </section>

          {/* Footer buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => setDraft(DEFAULT_FILTER)}
              className="flex-1 py-3.5 rounded-xl text-sm font-bold bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
            >
              초기화
            </button>
            <button
              onClick={() => { onApply(draft); onClose(); }}
              className="flex-[2] py-3.5 rounded-xl text-sm font-bold bg-baemin text-white hover:bg-baemin/90 transition-colors shadow-sm shadow-baemin/25"
            >
              적용하기
            </button>
          </div>
        </div>

        {/* Safe area for iOS */}
        <div className="h-safe-bottom pb-safe" />
      </div>
    </>
  );
}
