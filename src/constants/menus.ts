export interface MenuItem {
  id: number;
  name: string;
}

export interface MenuCategory {
  id: string;
  name: string;
  description?: string;
  items: MenuItem[];
}

export const MENU_CATEGORIES: MenuCategory[] = [
  {
    id: 'heavy',
    name: '고기류',
    description: 'Heavy',
    items: [
      { id: 1, name: '후라이드/양념치킨' },
      { id: 2, name: '구운치킨' },
      { id: 3, name: '삼겹살/목살 구이' },
      { id: 4, name: '족발/보쌈' },
      { id: 5, name: '스테이크/폭립' },
      { id: 31, name: '곱창/막창' },
    ],
  },
  {
    id: 'soup',
    name: '국물류',
    items: [
      { id: 6, name: '김치찜/김치찌개' },
      { id: 7, name: '부대찌개' },
      { id: 8, name: '뼈해장국/감자탕' },
      { id: 9, name: '순대국/돼지국밥' },
      { id: 10, name: '된장찌개/순두부찌개' },
      { id: 32, name: '마라탕/마라샹궈' },
    ],
  },
  {
    id: 'rice-thief',
    name: '볶음 & 찜',
    description: '밥도둑',
    items: [
      { id: 11, name: '찜닭/닭볶음탕' },
      { id: 12, name: '아구찜/해물찜' },
      { id: 13, name: '제육볶음/불고기' },
      { id: 14, name: '게장' },
      { id: 15, name: '닭발/오돌뼈' },
      { id: 33, name: '도시락' },
    ],
  },
  {
    id: 'noodle',
    name: '면류',
    items: [
      { id: 16, name: '짜장/짬뽕' },
      { id: 17, name: '냉면/밀면' },
      { id: 18, name: '칼국수/수제비' },
      { id: 19, name: '쌀국수/팟타이' },
      { id: 20, name: '파스타/라자냐' },
    ],
  },
  {
    id: 'fresh',
    name: '일식 & 해산물',
    description: 'Fresh',
    items: [
      { id: 21, name: '모둠초밥' },
      { id: 22, name: '돈카츠' },
      { id: 23, name: '회/해산물' },
      { id: 24, name: '텐동/규동' },
      { id: 25, name: '라멘/소바' },
    ],
  },
  {
    id: 'simple',
    name: '분식 & 패스트푸드',
    description: 'Simple',
    items: [
      { id: 26, name: '떡볶이/튀김' },
      { id: 27, name: '햄버거' },
      { id: 28, name: '피자' },
      { id: 29, name: '샌드위치/샐러드' },
      { id: 30, name: '타코/브리또' },
    ],
  },
];
