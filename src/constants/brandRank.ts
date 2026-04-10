import type { Category, GroupedDiscount } from '@/types/discount';

/**
 * 검색 등으로 카테고리가 섞일 때 브랜드 그룹 간 대략적 순서입니다.
 */
const CATEGORY_SORT_ORDER: readonly Category[] = [
  'chicken',
  'pizza',
  'burger',
  'cafe',
  'bunsik',
  'bakery',
  'korean',
  'chinese',
  'japanese',
  'western',
  'meat',
];

const CHICKEN_RANK: readonly string[] = [
  'BBQ',
  'BHC',
  '교촌치킨',
  '맘스터치',
  '굽네치킨',
  '60계치킨',
  '노랑통닭',
  '깐부치킨',
  '푸라닭',
  '자담치킨',
  '처갓집양념치킨',
  '네네치킨',
  '호식이두마리치킨',
  '바른치킨',
  '페리카나',
  '지코바치킨',
  '아웃닭',
  '훌랄라치킨',
  '또봉이통닭',
  '멕시카나',
  '부어치킨',
  '또래오래',
  '오븐마루치킨',
  '땅땅치킨',
  '디디치킨',
  '순수치킨',
  '웰덤치킨',
  '마파치킨',
];

const PIZZA_RANK: readonly string[] = [
  '도미노피자',
  '피자헛',
  '반올림피자',
  '파파존스',
  '고피자',
  '피자나라치킨공주',
  '피자알볼로',
  '청년피자',
  '빽보이피자',
  '노모어피자',
  '7번가피자',
  '미스터피자',
  '피자스쿨',
  '피자마루',
  '유로코피자',
  '피자덕',
  '피자비토랩',
  '라오피자',
];

const BURGER_RANK: readonly string[] = [
  '맥도날드',
  '버거킹',
  '롯데리아',
  '맘스터치',
  'KFC',
  '쉐이크쉑',
  '파파이스',
  '프랭크버거',
  '노브랜드 버거',
  '슈퍼두퍼',
];

const BAKERY_RANK: readonly string[] = [
  '성심당',
  '던킨도너츠',
  '뚜레쥬르',
  '파리바게뜨',
  '이성당',
  '크리스피크림',
  '삼송빵집',
  '태극당',
  '앤티앤스',
  '홍루이젠',
];

const BUNSIK_RANK: readonly string[] = [
  '동대문엽기떡볶이',
  '배떡',
  '신전떡볶이',
  '청년다방',
  '죠스떡볶이',
  '국대떡볶이',
  '떡참',
  '감탄떡볶이',
  '삼첩분식',
  '할머니가래떡볶이',
  '우리할매떡볶이',
  '신참떡볶이',
  '불스떡볶이',
  '걸작떡볶이',
];

const COFFEE_RANK: readonly string[] = [
  '스타벅스',
  '메가커피',
  '컴포즈커피',
  '투썸플레이스',
  '이디야',
  '빽다방',
  '커피빈',
  '파스쿠찌',
  '감성커피',
  '할리스',
  '더벤티',
  '폴바셋',
  '엔제리너스',
  '하삼동커피',
  '매머드커피',
  '커피베이',
  '카페베네',
  '커피나무',
  '탐앤탐스',
  '달콤커피',
  '커피명가',
  '드롭탑',
  '커피스미스',
  '더카페',
  '커피마마',
  '만랩커피',
  '셀렉토커피',
  '빈스빈스',
  '토프레소',
  '그라찌에',
  '전광수커피',
  '더착한커피',
  '카페보니또',
];

function listToScoreMap(names: readonly string[]): Record<string, number> {
  const m: Record<string, number> = {};
  names.forEach((n, i) => {
    m[n] = i;
  });
  return m;
}

function applyAliases(map: Record<string, number>, pairs: readonly (readonly [string, string])[]): void {
  for (const [alias, canonical] of pairs) {
    if (canonical in map) map[alias] = map[canonical];
  }
}

const UNRANKED = Number.MAX_SAFE_INTEGER;

function buildRankMaps(): Partial<Record<Category, Record<string, number>>> {
  const chicken = listToScoreMap(CHICKEN_RANK);
  applyAliases(chicken, [
    ['멕시칸치킨', '멕시카나'],
    ['훌랄라참숯치킨', '훌랄라치킨'],
    ['훌랄라참숯바베큐치킨', '훌랄라치킨'],
  ]);

  const pizza = listToScoreMap(PIZZA_RANK);

  const burger = listToScoreMap(BURGER_RANK);

  const bakery = listToScoreMap(BAKERY_RANK);

  const bunsik = listToScoreMap(BUNSIK_RANK);

  const cafe = listToScoreMap(COFFEE_RANK);
  applyAliases(cafe, [
    ['메가MGC커피', '메가커피'],
    ['PASCUCCI', '파스쿠찌'],
  ]);

  return {
    chicken,
    pizza,
    burger,
    bakery,
    bunsik,
    cafe,
  };
}

const RANK_SCORE_BY_CATEGORY = buildRankMaps();

/** 조사 기반 순위표가 있는 카테고리(치킨·피자·버거·베이커리·분식·카페) */
export function categoryHasSurveyRank(category: Category): boolean {
  return Boolean(RANK_SCORE_BY_CATEGORY[category]);
}

function categorySortIndex(c: Category): number {
  const i = CATEGORY_SORT_ORDER.indexOf(c);
  return i === -1 ? 999 : i;
}

function brandRankScore(brandKey: string, category: Category): number {
  const table = RANK_SCORE_BY_CATEGORY[category];
  if (!table) return UNRANKED;
  const s = table[brandKey];
  return s === undefined ? UNRANKED : s;
}

/**
 * 랭킹순 모드에서:
 * - 순위표가 있는 카테고리: 조사 순위 → 미등록 브랜드는 가나다순
 * - 순위표가 없는 카테고리(한식·중식·일식·양식·고기 등): 조사 랭킹 없이 할인금액 큰 순 → 가나다순
 * 검색으로 카테고리가 섞이면 카테고리 우선순위 후, 같은 카테고리끼리 위 규칙.
 */
export function compareBrandsByRank(
  a: Pick<GroupedDiscount, 'brandKey' | 'category' | 'totalMaxDiscount'>,
  b: Pick<GroupedDiscount, 'brandKey' | 'category' | 'totalMaxDiscount'>
): number {
  if (a.category !== b.category) {
    const ca = categorySortIndex(a.category);
    const cb = categorySortIndex(b.category);
    if (ca !== cb) return ca - cb;
  }

  if (a.category === b.category && !categoryHasSurveyRank(a.category)) {
    if (b.totalMaxDiscount !== a.totalMaxDiscount) {
      return b.totalMaxDiscount - a.totalMaxDiscount;
    }
    return a.brandKey.localeCompare(b.brandKey, 'ko');
  }

  const sa = brandRankScore(a.brandKey, a.category);
  const sb = brandRankScore(b.brandKey, b.category);
  if (sa !== sb) return sa - sb;

  return a.brandKey.localeCompare(b.brandKey, 'ko');
}
