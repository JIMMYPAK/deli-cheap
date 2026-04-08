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
  '맘스터치': 'chicken',
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
  '동근이숯불두마리치킨': 'chicken',
  '강정이기가막혀': 'chicken',
  '치킨더홈': 'chicken',
  '치킨파티': 'chicken',

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
  '피자스쿨': 'pizza',
  '뽕뜨락피자': 'pizza',
  '피자스톰': 'pizza',

  // Burger
  '롯데리아': 'burger',
  '맥도날드': 'burger',
  '버거킹': 'burger',
  '쉐이크쉑': 'burger',
  '프랭크버거': 'burger',

  // Korean
  '두찜': 'korean',
  '포케올데이 샐러드&도시락': 'korean',

  // Bunsik
  '동대문엽기떡볶이': 'bunsik',
  '명랑핫도그': 'bunsik',
  '떡참': 'bunsik',
  '걸작떡볶이치킨': 'bunsik',
  '마피아떡볶이': 'bunsik',

  // Meat
  '기영이숯불두마리치킨': 'meat',
  '장충동왕족발보쌈': 'meat',
  '족발야시장': 'meat',
  '이가네족발보쌈': 'meat',

  // Chinese
  // (브랜드 추가 시 여기에)

  // Japanese
  '육회바른연어': 'japanese',

  // Western
  'Mad for Garlic': 'western',

  // Cafe
  'COFFEE@WORKS': 'cafe',
  'jamba': 'cafe',
  'PASCUCCI': 'cafe',
  'Tim Hortons': 'cafe',
  '메가MGC커피': 'cafe',
  '배스킨라빈스': 'cafe',
  '공차': 'cafe',
  '던킨': 'cafe',

  // Bakery
  '뚜레쥬르': 'bakery',
  '파리바게뜨': 'bakery',
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

const convertedData = allRawData.map((item, index) => {
  const isPercentDiscount = typeof item.discount === 'string' && item.discount.includes('%');
  const parsedDiscount = typeof item.discount === 'number'
    ? item.discount
    : Number(String(item.discount).replace(/[^\d]/g, '') || 0);
  const percentNote = isPercentDiscount ? `정률할인 ${item.discount}` : null;
  const combinedSpecialCondition = [percentNote, item.special_condition || null]
    .filter(Boolean)
    .join(' / ') || null;

  return {
    id: `sync-${index}`,
    brandName: item.brand,
    platform: platformMap[item.app] || (item.app === '쿠팡이츠' ? 'coupang' : item.app === '요기요' ? 'yogiyo' : item.app === '땡겨요' ? 'ttangyo' : 'baemin'),
    discountAmount: parsedDiscount,
    minOrderAmount: item.min_order,
    description: item.special_condition || (item.method === '전체' ? '모든 주문 할인' : `${item.method} 전용 할인`),
    category: categoryMap[item.brand] || 'chicken',
    method: item.method,
    deliveryTypes: item.delivery_types || [],
    specialCondition: combinedSpecialCondition
  };
});

fs.writeFileSync(
  path.join(process.cwd(), 'public/data/discounts.json'),
  JSON.stringify(convertedData, null, 2)
);

console.log(`Successfully merged ${convertedData.length} items to public/data/discounts.json`);
