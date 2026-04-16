const fs = require('fs');
const path = require('path');

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

  // Pizza
  '7번가피자': 'pizza',
  '노모어피자': 'pizza',
  '도미노피자': 'pizza',
  '반올림피자': 'pizza',
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
  '샐러디': 'burger',
  '왓더버거': 'burger',

  // Korean
  '두찜': 'korean',
  '포케올데이 샐러드&도시락': 'korean',
  '포케올데이': 'korean',
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

  // Bunsik
  '동대문엽기떡볶이': 'bunsik',
  '명랑핫도그': 'bunsik',
  '떡참': 'bunsik',
  '떡볶이참잘하는집': 'bunsik',
  '기떡찜': 'bunsik',
  '강다짐': 'bunsik',
  '지지고': 'bunsik',

  // Meat
  '기영이숯불두마리치킨': 'meat',
  '미스터보쌈&삼겹': 'meat',

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
  '샐러리아': 'cafe',
  '요아잇': 'cafe',
  '카페인중독': 'cafe',

  // Bakery
  '뚜레쥬르': 'bakery',
  '파리바게뜨': 'bakery',
  '오베이글하우스': 'bakery',
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
  return validUntil < new Date().toISOString().slice(0, 10);
}

const convertedData = allRawData
  .map((item, index) => {
    const isPercentDiscount = typeof item.discount === 'string' && item.discount.includes('%');
    let parsedDiscount = toNumber(item.discount);

    // 땡겨요: 화면에 표시되는 최대 할인액에는 첫 주문 5,000원이 포함되어 있음 → 항상 차감
    if (item.app === '땡겨요') {
      parsedDiscount = Math.max(0, parsedDiscount - 5000);
    }
    const percentNote = isPercentDiscount ? `정률할인 ${item.discount}` : null;
    const combinedSpecialCondition = [percentNote, item.special_condition || null]
      .filter(Boolean)
      .join(' / ') || null;
    const validUntil = normalizeValidUntil(item.valid_until || null);

    return {
      id: `sync-${index}`,
      brandName: item.brand,
      platform: platformMap[item.app] || (item.app === '쿠팡이츠' ? 'coupang' : item.app === '요기요' ? 'yogiyo' : item.app === '땡겨요' ? 'ttangyo' : 'baemin'),
      discountAmount: parsedDiscount,
      minOrderAmount: toNumber(item.min_order),
      description: item.special_condition || (item.method === '전체' ? '모든 주문 할인' : `${item.method} 전용 할인`),
      category: categoryMap[item.brand] || 'chicken',
      method: item.method,
      deliveryTypes: item.delivery_types || [],
      specialCondition: combinedSpecialCondition,
      validUntil,
    };
  })
  // 만료일이 있으면 자동 제외
  .filter((item) => !isExpired(item.validUntil));

// 한정수량 쿠폰 유효기간 보정:
// valid_until이 오늘인 쿠폰은 같은 브랜드의 더 긴 유효기간으로 자동 대체
const today = new Date().toISOString().slice(0, 10);

const brandMaxValidUntil = {};
convertedData.forEach(item => {
  if (item.validUntil && item.validUntil > today) {
    if (!brandMaxValidUntil[item.brandName] || item.validUntil > brandMaxValidUntil[item.brandName]) {
      brandMaxValidUntil[item.brandName] = item.validUntil;
    }
  }
});

// 중복 제거: brandName, platform, discountAmount, minOrderAmount 기준
// 같은 조건이면 validUntil이 더 긴 것을 우선함
const dedupedMap = new Map();
convertedData.forEach(item => {
  let validUntil = item.validUntil;
  if (validUntil === today && brandMaxValidUntil[item.brandName]) {
    validUntil = brandMaxValidUntil[item.brandName];
  }
  
  const key = `${item.brandName}|${item.platform}|${item.discountAmount}|${item.minOrderAmount}`;
  const existing = dedupedMap.get(key);
  
  if (!existing || (validUntil && (!existing.validUntil || validUntil > existing.validUntil))) {
    dedupedMap.set(key, { ...item, validUntil });
  }
});

const finalData = Array.from(dedupedMap.values());

fs.writeFileSync(
  path.join(process.cwd(), 'public/data/discounts.json'),
  JSON.stringify(finalData, null, 2)
);

const extended = finalData.filter(item => item.validUntil && brandMaxValidUntil[item.brandName] && convertedData.find(c => c.id === item.id)?.validUntil === today && item.validUntil !== today);
if (extended.length > 0) {
  console.log(`유효기간 보정: ${extended.length}개 쿠폰의 유효기간을 같은 브랜드 기준으로 연장`);
}
console.log(`Successfully merged ${finalData.length} items to public/data/discounts.json`);
