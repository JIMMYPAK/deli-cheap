'use client';

import { BrandSortMode } from '@/types/discount';

const OPTIONS: { id: BrandSortMode; label: string }[] = [
  { id: 'rank', label: '브랜드 랭킹순' },
  { id: 'discount', label: '할인 금액순' },
  { id: 'minOrder', label: '최소 주문 금액순' },
];

interface BrandSortControlProps {
  value: BrandSortMode;
  onChange: (mode: BrandSortMode) => void;
  /** false면 한식·중식 등: 할인 금액순 / 최소 주문 금액순만 노출 */
  showRankOption: boolean;
  filterButton?: React.ReactNode;
}

export default function BrandSortControl({ value, onChange, showRankOption, filterButton }: BrandSortControlProps) {
  const visible = showRankOption ? OPTIONS : OPTIONS.filter((o) => o.id !== 'rank');

  return (
    <div className="px-4 pt-2 pb-1 flex items-end justify-between gap-2">
      <div className="flex-1">
        <p className="text-[10px] font-bold text-gray-400 mb-1.5 uppercase tracking-wide">정렬</p>
        <div className="flex flex-wrap gap-1.5">
          {visible.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange(opt.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200
                ${value === opt.id
                  ? 'bg-baemin text-white shadow-sm shadow-baemin/25'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 active:scale-[0.98]'}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
      {filterButton && <div className="flex-shrink-0">{filterButton}</div>}
    </div>
  );
}
