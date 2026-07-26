const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const platformMap = {
  '배달의민족': 'baemin',
  '요기요': 'yogiyo',
  '쿠팡이츠': 'coupang',
  '땡겨요': 'ttangyo'
};

const categoryMap = {
  // Chicken
  'BBQ': 'chicken',
  'BHC': 'chicken',
  '갓튀긴후라이드': 'chicken',
  '교촌치킨': 'chicken',
  '굽네치킨': 'chicken',
  '꾸브라꼬숯불치킨': 'chicken',
  '기영이숯불두마리치킨': 'chicken',
  '네네치킨': 'chicken',
  '돈치킨': 'chicken',
  '또래오래': 'chicken',
  '또봉이통닭': 'chicken',
  '멕시카나': 'chicken',
  '본스치킨': 'chicken',
  '오븐마루': 'chicken',
  '오븐마루치킨': 'chicken',
  '오븐에빠진닭': 'chicken',
  '자담치킨': 'chicken',
  '지코바치킨': 'chicken',
  '처갓집양념치킨': 'chicken',
  '치킨마루': 'chicken',
  '치킨매니아': 'chicken',
  '치킨인류': 'chicken',
  '치킨플러스': 'chicken',
  '투존치킨': 'chicken',
  '티바두마리치킨': 'chicken',
  '푸라닭': 'chicken',
  '호식이두마리치킨': 'chicken',
  '호치킨': 'chicken',
  '훌랄라참숯바베큐치킨': 'chicken',
  '훌랄라참숯치킨': 'chicken',
  '디디치킨': 'chicken',
  '쌀통닭': 'chicken',
  '순살몬스터': 'chicken',
  '아라치치킨': 'chicken',
  '칠봉통닭': 'chicken',
  '웰덤치킨': 'chicken',
  '땅땅치킨': 'chicken',
  '부어치킨': 'chicken',
  'bhc': 'chicken',
  '멕시카나치킨': 'chicken',
  '꾸브라꼬 숯불치킨': 'chicken',
  '바른치킨': 'chicken',
  '해두리치킨': 'chicken',
  '노랑통닭': 'chicken',
  'BHC치킨': 'chicken',
  '치킨플러스&떡볶이': 'chicken',
  '꾸브라꼬숯불두마리치킨': 'chicken',
  '훌랄라참숯바베큐': 'chicken',

  // Pizza
  '7번가피자': 'pizza',
  '노모어피자': 'pizza',
  '도미노피자': 'pizza',
  '반올림피자': 'pizza',
  '빽보이피자': 'pizza',
  '빅스타피자': 'pizza',
  '유로코피자': 'pizza',
  '청년피자': 'pizza',
  '프레드피자': 'pizza',
  '피자헛': 'pizza',
  '미스터피자': 'pizza',
  '아메리칸피자': 'pizza',
  '파파존스': 'pizza',
  '피자알볼로': 'pizza',
  '클랩피자': 'pizza',
  '피자에땅': 'pizza',
  '맘스터치피자앤치킨': 'pizza',
  '맘스터치 피자앤치킨': 'pizza',
  '맘스피자': 'pizza',
  '피자마루': 'pizza',
  '선명희피자': 'pizza',

  // Burger
  '롯데리아': 'burger',
  '맥도날드': 'burger',
  '버거킹': 'burger',
  '쉐이크쉑': 'burger',
  '맘스터치': 'burger',
  '프랭크버거': 'burger',
  '오구샌': 'burger',
  '버거리': 'burger',
  '다운타우너': 'burger',
  '왓더버거': 'burger',
  '이삭토스트': 'burger',

  // Salad
  '샐러디': 'salad',
  '샐러리아': 'salad',
  '포케올데이': 'salad',
  '포케올데이 샐러드&도시락': 'salad',

  // Korean
  '두찜': 'korean',
  '계근상': 'korean',
  '보끄당': 'korean',
  '큰맘할매순대국': 'korean',
  '일미리금계찜닭': 'korean',
  '진교동찜닭': 'korean',
  '황실김치찜&찌개': 'korean',
  '슈퍼키친': 'korean',
  '방가네 소고기국밥': 'korean',
  '본초맘죽': 'korean',
  '국민낙곱새': 'korean',
  '신밥도둑': 'korean',
  '마선생얼큰국밥': 'korean',
  '아구듬뿍알곤마니': 'korean',
  '유가네닭갈비': 'korean',
  '유가네찜닭': 'korean',
  '덮덮밥': 'korean',
  '보끔당': 'korean',
  '전통숙성황실김치찜&찌개': 'korean',
  '반찬가게슈퍼키친': 'korean',

  // Bunsik
  '동대문엽기떡볶이': 'bunsik',
  '명랑핫도그': 'bunsik',
  '떡참': 'bunsik',
  '떡볶이참잘하는집': 'bunsik',
  '기떡찜': 'bunsik',
  '강다짐': 'bunsik',
  '지지고': 'bunsik',
  '감탄떡볶이': 'bunsik',
  '삼첩분식': 'bunsik',
  '죠스떡볶이': 'bunsik',
  '응급실국물떡볶이': 'bunsik',

  // Meat
  '미스터보쌈&삼겹': 'meat',
  '직구삼': 'meat',
  '청년고기장수': 'meat',
  '존가네': 'meat',

  // Chinese
  '마라공방': 'chinese',

  // Japanese
  '육회바른연어': 'japanese',

  // Western
  'Mad for Garlic': 'western',
  '매드포갈릭': 'western',
  '아웃백': 'western',
  '아웃백스테이크하우스': 'western',

  // Cafe
  'COFFEE@WORKS': 'cafe',
  '커피앳웍스': 'cafe',
  'jamba': 'cafe',
  '잠바주스': 'cafe',
  'PASCUCCI': 'cafe',
  '파스쿠찌': 'cafe',
  'Tim Hortons': 'cafe',
  '메가MGC커피': 'cafe',
  '배스킨라빈스': 'cafe',
  '요아정': 'cafe',
  '벤슨 아이스크림': 'cafe',
  '토스트카페마리': 'cafe',
  '읍천리382': 'cafe',
  '트리플에이커피': 'cafe',
  '영커피': 'cafe',
  '요아잇': 'cafe',
  '카페인중독': 'cafe',
  '공차': 'cafe',
  '폴바셋': 'cafe',
  '카페베네': 'cafe',
  '디저트39': 'cafe',

  // Bakery
  '뚜레쥬르': 'bakery',
  '파리바게뜨': 'bakery',
  '오베이글하우스': 'bakery',
  '던킨': 'bakery',
};

function readJson(filename) {
  const filePath = path.join(process.cwd(), filename);
  if (fs.existsSync(filePath)) {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }
  return [];
}

const bmData = readJson('BM.json');
const coupData = readJson('COUP.json');
const yoData = readJson('YO.json');
const ttangData = readJson('TTANG.json');

const allRawData = [...bmData, ...coupData, ...yoData, ...ttangData];

const unknownPlatforms = [...new Set(
  allRawData.filter((item) => !platformMap[item.app]).map((item) => item.app)
)];
const unknownBrands = [...new Set(
  allRawData.filter((item) => !categoryMap[item.brand]).map((item) => item.brand)
)];
const supportedMethods = new Set(['배달', '픽업', '포장', '전체']);
const unknownMethods = [...new Set(
  allRawData.filter((item) => !supportedMethods.has(item.method)).map((item) => item.method)
)];

if (unknownPlatforms.length || unknownBrands.length || unknownMethods.length) {
  const details = [
    unknownPlatforms.length ? `플랫폼: ${unknownPlatforms.join(', ')}` : null,
    unknownBrands.length ? `브랜드 카테고리: ${unknownBrands.join(', ')}` : null,
    unknownMethods.length ? `주문 방식: ${unknownMethods.join(', ')}` : null,
  ].filter(Boolean).join(' / ');
  throw new Error(`원본 데이터 매핑을 먼저 추가해야 합니다. ${details}`);
}

function toNumber(value) {
  if (typeof value === 'number') return value;
  const digits = String(value || '').replace(/[^\d]/g, '');
  return digits ? Number(digits) : 0;
}

function normalizeValidUntil(raw) {
  if (!raw) return null;
  const text = String(raw).trim();
  // YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) return text;
  // YY.MM.DD or YYYY.MM.DD (+ optional "까지")
  const dot = text.match(/^(\d{2}|\d{4})\.(\d{1,2})\.(\d{1,2})(?:까지)?$/);
  if (dot) {
    const year = dot[1].length === 2 ? `20${dot[1]}` : dot[1];
    const month = dot[2].padStart(2, '0');
    const day = dot[3].padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  // YY/MM/DD or YYYY/MM/DD
  const slash = text.match(/^(\d{2}|\d{4})\/(\d{1,2})\/(\d{1,2})$/);
  if (slash) {
    const year = slash[1].length === 2 ? `20${slash[1]}` : slash[1];
    const month = slash[2].padStart(2, '0');
    const day = slash[3].padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  return null;
}

function isExpired(validUntil) {
  if (!validUntil) return false;
  return validUntil < getTodayInKorea();
}

function getTodayInKorea(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function createDiscountKey(item) {
  return JSON.stringify([
    item.brandName,
    item.platform,
    item.discountAmount,
    item.minOrderAmount,
    item.method,
    [...item.deliveryTypes].sort(),
    item.specialCondition,
    item.category,
  ]);
}

function createStableId(key) {
  return `discount-${crypto.createHash('sha256').update(key).digest('hex').slice(0, 16)}`;
}

const convertedData = allRawData
  .map((item) => {
    const isPercentDiscount = typeof item.discount === 'string' && item.discount.includes('%');
    if (isPercentDiscount) {
      throw new Error(`${item.brand}의 정률 할인(${item.discount})은 최대 할인액을 원 단위로 보정해야 합니다.`);
    }
    let parsedDiscount = toNumber(item.discount);

    // 땡겨요: 화면에 표시되는 최대 할인액에는 첫 주문 5,000원이 포함되어 있음 → 항상 차감
    if (item.app === '땡겨요') {
      parsedDiscount = Math.max(0, parsedDiscount - 5000);
    }
    const combinedSpecialCondition = item.special_condition || null;
    const validUntil = normalizeValidUntil(item.valid_until || null);
    if (item.valid_until && !validUntil) {
      throw new Error(`${item.brand}의 종료일 형식을 확인해 주세요: ${item.valid_until}`);
    }

    return {
      brandName: item.brand,
      platform: platformMap[item.app],
      discountAmount: parsedDiscount,
      minOrderAmount: toNumber(item.min_order),
      description: item.special_condition || (item.method === '전체' ? '모든 주문 할인' : `${item.method} 전용 할인`),
      category: categoryMap[item.brand],
      method: item.method === '픽업' ? '포장' : item.method,
      deliveryTypes: (item.delivery_types || []).map(t => t === '픽업' ? '포장' : t),
      specialCondition: combinedSpecialCondition,
      validUntil,
    };
  })
  // 만료일이 있으면 자동 제외
  .filter((item) => !isExpired(item.validUntil));

// 주문 방식·배달 유형·조건까지 같을 때만 중복으로 본다.
// 동일 혜택의 종료일만 다르면 더 긴 값을 유지한다.
const dedupedMap = new Map();
convertedData.forEach(item => {
  const key = createDiscountKey(item);
  const existing = dedupedMap.get(key);

  if (!existing || (item.validUntil && (!existing.validUntil || item.validUntil > existing.validUntil))) {
    dedupedMap.set(key, item);
  }
});

const finalData = Array.from(dedupedMap.entries())
  .map(([key, item]) => ({ id: createStableId(key), ...item }))
  .sort((a, b) =>
    a.platform.localeCompare(b.platform) ||
    a.brandName.localeCompare(b.brandName, 'ko-KR') ||
    b.discountAmount - a.discountAmount
  );

fs.writeFileSync(
  path.join(process.cwd(), 'public/data/discounts.json'),
  JSON.stringify(finalData, null, 2)
);

console.log(`Successfully merged ${finalData.length} items to public/data/discounts.json`);
