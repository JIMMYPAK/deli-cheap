'use client';

import { useState } from 'react';
import { Category } from '@/types/discount';

// 기본 노출 5개 (항상 보이는 행)
const FIRST_ROW: { id: Category; name: string; icon: string }[] = [
  { id: 'chicken', name: '치킨',       icon: '🍗' },
  { id: 'pizza',   name: '피자',       icon: '🍕' },
  { id: 'cafe',    name: '카페/디저트', icon: '☕' },
  { id: 'burger',  name: '버거/샌드위치', icon: '🍔' },
  { id: 'korean',  name: '한식',       icon: '🍚' },
];

// 펼치기 시 추가로 보이는 카테고리 (배달 인기 순)
const SECOND_ROW: { id: Category; name: string; icon: string }[] = [
  { id: 'bunsik',  name: '분식',           icon: '🍢' },
  { id: 'salad',   name: '샐러드/포케',     icon: '🥗' },
  { id: 'chinese', name: '중식',           icon: '🥟' },
  { id: 'japanese',name: '일식',           icon: '🍣' },
  { id: 'western', name: '양식',           icon: '🍝' },
];

const THIRD_ROW: { id: Category; name: string; icon: string }[] = [
  { id: 'meat',    name: '족발/보쌈/고기', icon: '🍖' },
  { id: 'bakery',  name: '베이커리',       icon: '🥐' },
];

interface CategoryFilterProps {
  activeId?: Category;
  onSelect: (id: Category) => void;
}

export default function CategoryFilter({ activeId, onSelect }: CategoryFilterProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="px-4 pt-3 pb-1">
      {/* 항상 보이는 첫 행: 5개 + 전체 버튼 */}
      <div className="grid grid-cols-6 gap-x-1 mb-1">
        {FIRST_ROW.map((cat) => (
          <CatBtn key={cat.id} cat={cat} active={activeId === cat.id} onSelect={onSelect} size="sm" />
        ))}
        <ToggleBtn expanded={expanded} onClick={() => setExpanded(v => !v)} />
      </div>

      {/* 펼쳤을 때만 보이는 추가 행들 */}
      {expanded && (
        <div className="mt-1 border-t border-gray-100 pt-2">
          {/* 2번째 행 */}
          <div className="grid grid-cols-5 gap-x-1 mb-1">
            {SECOND_ROW.map((cat) => (
              <CatBtn key={cat.id} cat={cat} active={activeId === cat.id} onSelect={onSelect} size="sm" />
            ))}
          </div>
          {/* 3번째 행: 족발 + 나머지 자리는 빈칸으로 */}
          <div className="grid grid-cols-5 gap-x-1">
            {THIRD_ROW.map((cat) => (
              <CatBtn key={cat.id} cat={cat} active={activeId === cat.id} onSelect={onSelect} size="sm" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── 카테고리 버튼 ── */
function CatBtn({
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
  return (
    <button
      onClick={() => onSelect(cat.id)}
      className="flex flex-col items-center gap-1 group py-1"
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all duration-200
        ${active
          ? 'bg-baemin text-white shadow-md shadow-baemin/20 scale-105'
          : 'bg-gray-50 text-gray-400 group-hover:bg-gray-100 group-active:scale-95'}`}
      >
        {cat.icon}
      </div>
      <span className={`text-[9px] font-bold transition-colors leading-tight w-full text-center line-clamp-1
        ${active ? 'text-baemin' : 'text-gray-500'}`}
      >
        {cat.name}
      </span>
    </button>
  );
}

/* ── 전체보기 / 접기 토글 버튼 ── */
function ToggleBtn({ expanded, onClick }: { expanded: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1 group py-1"
    >
      <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gray-100 text-gray-500
        group-hover:bg-gray-200 transition-all duration-200 group-active:scale-95 text-base"
      >
        {expanded ? '▲' : '⊞'}
      </div>
      <span className="text-[9px] font-bold text-gray-400 leading-tight">
        {expanded ? '접기' : '전체'}
      </span>
    </button>
  );
}
