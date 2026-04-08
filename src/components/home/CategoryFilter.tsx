'use client';

import { useState } from 'react';
import { Category } from '@/types/discount';

const CATEGORIES: { id: Category; name: string; icon: string }[] = [
  { id: 'chicken', name: '치킨',     icon: '🍗' },
  { id: 'pizza',   name: '피자',     icon: '🍕' },
  { id: 'burger',  name: '버거',     icon: '🍔' },
  { id: 'bakery',  name: '베이커리', icon: '🥐' },
  { id: 'bunsik',  name: '분식',     icon: '🍢' },
  { id: 'cafe',    name: '카페',     icon: '☕' },
  // 이하 펼치기 시 노출
  { id: 'korean',  name: '한식',     icon: '🍚' },
  { id: 'chinese', name: '중식',     icon: '🥟' },
  { id: 'western', name: '양식',     icon: '🍝' },
  { id: 'japanese',name: '일식',     icon: '🍣' },
  { id: 'meat',    name: '족발·고기',icon: '🍖' },
];

const COLLAPSED_COUNT = 6;

interface CategoryFilterProps {
  activeId?: Category;
  onSelect: (id: Category) => void;
}

export default function CategoryFilter({ activeId, onSelect }: CategoryFilterProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="px-4 py-3">
      {expanded ? (
        /* ── 펼침: 4열 그리드 ── */
        <div className="grid grid-cols-4 gap-y-4 gap-x-2">
          {CATEGORIES.map((cat) => (
            <CategoryBtn
              key={cat.id}
              cat={cat}
              active={activeId === cat.id}
              onSelect={onSelect}
              size="lg"
            />
          ))}
          {/* 접기 버튼 */}
          <ToggleBtn expanded label="접기" onClick={() => setExpanded(false)} />
        </div>
      ) : (
        /* ── 기본: 7등분 한 줄 ── */
        <div className="grid grid-cols-7 gap-x-1">
          {CATEGORIES.slice(0, COLLAPSED_COUNT).map((cat) => (
            <CategoryBtn
              key={cat.id}
              cat={cat}
              active={activeId === cat.id}
              onSelect={onSelect}
              size="sm"
            />
          ))}
          {/* 전체보기 버튼 */}
          <ToggleBtn expanded={false} label="전체" onClick={() => setExpanded(true)} />
        </div>
      )}
    </div>
  );
}

/* ── 카테고리 버튼 ── */
function CategoryBtn({
  cat,
  active,
  onSelect,
  size,
}: {
  cat: { id: Category; name: string; icon: string };
  active: boolean;
  onSelect: (id: Category) => void;
  size: 'sm' | 'lg';
}) {
  const iconCls = size === 'sm'
    ? 'w-10 h-10 rounded-xl text-xl'
    : 'w-14 h-14 rounded-2xl text-2xl';
  const textCls = size === 'sm' ? 'text-[10px]' : 'text-[11px]';

  return (
    <button
      onClick={() => onSelect(cat.id)}
      className="flex flex-col items-center gap-1 group"
    >
      <div className={`${iconCls} flex items-center justify-center transition-all duration-200
        ${active
          ? 'bg-baemin text-white shadow-lg shadow-baemin/20 scale-105'
          : 'bg-gray-50 text-gray-400 group-hover:bg-gray-100 group-active:scale-95'}`}
      >
        {cat.icon}
      </div>
      <span className={`${textCls} font-bold transition-colors truncate w-full text-center
        ${active ? 'text-baemin' : 'text-gray-500'}`}
      >
        {cat.name}
      </span>
    </button>
  );
}

/* ── 전체보기 / 접기 토글 버튼 ── */
function ToggleBtn({
  expanded,
  label,
  onClick,
}: {
  expanded: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1 group"
    >
      <div className={`${expanded ? 'w-14 h-14 rounded-2xl text-lg' : 'w-10 h-10 rounded-xl text-base'}
        flex items-center justify-center bg-gray-100 text-gray-500
        group-hover:bg-gray-200 transition-all duration-200 group-active:scale-95`}
      >
        {expanded ? '▲' : '⊞'}
      </div>
      <span className={`${expanded ? 'text-[11px]' : 'text-[10px]'} font-bold text-gray-500 truncate w-full text-center`}>
        {label}
      </span>
    </button>
  );
}
