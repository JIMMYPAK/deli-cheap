'use client';
import { Category } from '@/types/discount';

// 항상 노출되는 카테고리 (첫 항목: 전체)
const FIRST_ROW: { id: Category; name: string; icon: string }[] = [
  { id: 'all',     name: '전체',           icon: '✨' },
  { id: 'chicken', name: '치킨',       icon: '🍗' },
  { id: 'pizza',   name: '피자',       icon: '🍕' },
  { id: 'cafe',    name: '카페/디저트', icon: '☕' },
  { id: 'burger',  name: '버거/샌드위치', icon: '🍔' }
];

// 나머지 카테고리도 모두 항상 노출
const SECOND_ROW: { id: Category; name: string; icon: string }[] = [
  { id: 'bunsik',  name: '분식',           icon: '🍢' },
  { id: 'salad',   name: '샐러드/포케',     icon: '🥗' },
  { id: 'korean',  name: '한식',           icon: '🍚' },
  { id: 'japanese',name: '일식',           icon: '🍣' },
  { id: 'chinese', name: '중식',           icon: '🥟' },
];

const THIRD_ROW: { id: Category; name: string; icon: string }[] = [
  { id: 'western', name: '양식',           icon: '🍝' },
  { id: 'bakery',  name: '베이커리',       icon: '🥐' },
  { id: 'meat',    name: '족발/보쌈/고기', icon: '🍖' },
];

interface CategoryFilterProps {
  activeId?: Category;
  onSelect: (id: Category) => void;
}

export default function CategoryFilter({ activeId, onSelect }: CategoryFilterProps) {
  return (
    <div className="px-4 pt-3 pb-2">
      {/* 1번째 행 */}
      <div className="grid grid-cols-5 gap-x-1 mb-1">
        {FIRST_ROW.map((cat) => (
          <CatBtn key={cat.id} cat={cat} active={activeId === cat.id} onSelect={onSelect} size="sm" />
        ))}
      </div>

      {/* 2번째 행 */}
      <div className="grid grid-cols-5 gap-x-1 mb-1">
        {SECOND_ROW.map((cat) => (
          <CatBtn key={cat.id} cat={cat} active={activeId === cat.id} onSelect={onSelect} size="sm" />
        ))}
      </div>

      {/* 3번째 행 */}
      <div className="grid grid-cols-5 gap-x-1">
        {THIRD_ROW.map((cat) => (
          <CatBtn key={cat.id} cat={cat} active={activeId === cat.id} onSelect={onSelect} size="sm" />
        ))}
      </div>
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
