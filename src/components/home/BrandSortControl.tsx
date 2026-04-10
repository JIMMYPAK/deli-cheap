'use client';

import { BrandSortMode } from '@/types/discount';

const OPTIONS: { id: BrandSortMode; label: string }[] = [
  { id: 'rank', label: '랭킹순' },
  { id: 'discount', label: '할인금액순' },
  { id: 'minOrder', label: '최소주문 적은 순' },
];

interface BrandSortControlProps {
  value: BrandSortMode;
  onChange: (mode: BrandSortMode) => void;
}

export default function BrandSortControl({ value, onChange }: BrandSortControlProps) {
  return (
    <div className="px-4 pt-2 pb-1">
      <p className="text-[10px] font-bold text-gray-400 mb-1.5 uppercase tracking-wide">정렬</p>
      <div className="flex flex-wrap gap-1.5">
        {OPTIONS.map((opt) => (
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
  );
}
