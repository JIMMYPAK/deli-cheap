import { Category } from '@/types/discount';

const CATEGORIES: { id: Category; name: string; icon: string }[] = [
  { id: 'chicken', name: '치킨', icon: '🍗' },
  { id: 'pizza', name: '피자', icon: '🍕' },
  { id: 'burger', name: '버거/샌드위치', icon: '🍔' },
  { id: 'bakery', name: '베이커리', icon: '🥐' },
  { id: 'bunsik', name: '분식', icon: '떡' },
  { id: 'cafe', name: '카페/디저트', icon: '☕' },
  { id: 'korean', name: '한식', icon: '🍚' },
  { id: 'chinese', name: '중식', icon: '🥟' },
  { id: 'western', name: '양식', icon: '🍝' },
  { id: 'japanese', name: '일식', icon: '🍣' },
  { id: 'meat', name: '족발/보쌈/고기류', icon: '🍖' },
];

interface CategoryFilterProps {
  activeId?: Category;
  onSelect: (id: Category) => void;
}

export default function CategoryFilter({ activeId, onSelect }: CategoryFilterProps) {
  return (
    <div className="flex overflow-x-auto gap-3 px-4 py-4 scrollbar-hide no-scrollbar">
      {CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={`flex-shrink-0 flex flex-col items-center gap-2 group`}
        >
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-all duration-200 
            ${activeId === cat.id 
              ? 'bg-baemin text-white shadow-lg shadow-baemin/20 scale-105' 
              : 'bg-gray-50 text-gray-400 group-hover:bg-gray-100 group-active:scale-95'}`}
          >
            {cat.icon}
          </div>
          <span className={`text-[12px] font-bold transition-colors 
            ${activeId === cat.id ? 'text-baemin' : 'text-gray-500'}`}
          >
            {cat.name}
          </span>
        </button>
      ))}
    </div>
  );
}
