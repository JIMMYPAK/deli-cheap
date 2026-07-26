import { DiscountCategory } from '@/types/discount';

const BRAND_ALIASES: Record<string, string[]> = {
  '7번가피자': ['7번가'],
  BBQ: ['bbq', '비비큐'],
  BHC: ['bhc', '비에이치씨', '비에이치시'],
  'COFFEE@WORKS': ['커앳웍', '커피앳웍스'],
  'Mad for Garlic': ['매포갈', '매드포갈릭'],
  PASCUCCI: ['파쿠', '파스쿠찌', '파스쿠치'],
  'Tim Hortons': ['팀홀튼'],
  jamba: ['잠바', '잠바주스'],
  교촌치킨: ['교촌'],
  굽네치킨: ['굽네'],
  꾸브라꼬숯불치킨: ['꾸브라꼬'],
  네네치킨: ['네네'],
  노모어피자: ['노모어'],
  도미노피자: ['도미노'],
  동대문엽기떡볶이: ['엽떡', '엽기떡볶이', '동대문엽떡'],
  두찜: ['두마리 찜닭', '두마리찜닭'],
  뚜레쥬르: ['뚜쥬'],
  롯데리아: ['롯리'],
  맘스터치: ['맘터'],
  맥도날드: ['맥날'],
  반올림피자: ['반올림'],
  배스킨라빈스: ['베라', '배라', '베스킨라빈스', '배스킨'],
  버거킹: ['벜', '버킹'],
  본스치킨: ['본스'],
  빅스타피자: ['빅스타'],
  쉐이크쉑: ['쉑쉑버거', '쉑쉑'],
  오븐마루치킨: ['오븐마루'],
  오븐에빠진닭: ['오빠닭'],
  유로코피자: ['유로코'],
  육회바른연어: ['육바연'],
  자담치킨: ['자담'],
  지코바치킨: ['지코바'],
  처갓집양념치킨: ['처갓집'],
  청년피자: ['청피'],
  치킨플러스: ['치플'],
  투존치킨: ['투존'],
  티바두마리치킨: ['티바'],
  파리바게뜨: ['파바', '파리바게트'],
  피자헛: ['핏자헛'],
  호식이두마리치킨: ['호식이'],
};

const EXTRA_CATEGORIES: Record<string, DiscountCategory[]> = {
  맘스터치: ['burger'],
  치킨플러스: ['bunsik'],
  '치킨플러스&떡볶이': ['bunsik'],
  샐러디: ['salad'],
  샐러리아: ['salad'],
  포케올데이: ['salad'],
  '포케올데이 샐러드&도시락': ['salad'],
};

const BRAND_KO_LABEL: Record<string, string> = {
  BBQ: 'BBQ',
  BHC: 'BHC',
  'COFFEE@WORKS': 'COFFEE@WORKS 커피앳웍스',
  'Mad for Garlic': 'Mad for Garlic 매드포갈릭',
  PASCUCCI: 'PASCUCCI 파스쿠찌',
  'Tim Hortons': 'Tim Hortons 팀홀튼',
  jamba: 'jamba 잠바주스',
};

function normalizeSearchText(value: string): string {
  return value.normalize('NFC').trim().toLocaleLowerCase('ko-KR');
}

export function getBrandDisplayName(brandName: string): string {
  return BRAND_KO_LABEL[brandName] ?? brandName;
}

export function getExtraCategories(brandName: string): DiscountCategory[] {
  return EXTRA_CATEGORIES[brandName] ?? [];
}

export function matchesBrandSearch(brandName: string, query: string): boolean {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return true;

  const searchableNames = [
    brandName,
    getBrandDisplayName(brandName),
    ...(BRAND_ALIASES[brandName] ?? []),
  ];

  return searchableNames.some((name) =>
    normalizeSearchText(name).includes(normalizedQuery)
  );
}
