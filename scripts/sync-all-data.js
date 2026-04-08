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
  'BHC': 'chicken',
  '호치킨': 'chicken',
  '치킨마루': 'chicken',
  '치킨플러스': 'chicken',
  '본스치킨': 'chicken',
  '갓튀긴후라이드': 'chicken',
  '꾸브라꼬숯불치킨': 'chicken',
  '멕시카나': 'chicken',
  '처갓집양념치킨': 'chicken',
  '기영이숯불두마리치킨': 'chicken',
  '오븐마루치킨': 'chicken',
  '오븐마루': 'chicken',
  '훌랄라참숯바베큐치킨': 'chicken',
  '훌랄라참숯치킨': 'chicken',
  '또래오래': 'chicken',
  '또봉이통닭': 'chicken',
  '네네치킨': 'chicken',
  '교촌치킨': 'chicken',
  '자담치킨': 'chicken',
  '치킨인류': 'chicken',
  '치킨매니아': 'chicken',
  '오븐에빠진닭': 'chicken',
  '돈치킨': 'chicken',
  
  // Pizza
  '프레드피자': 'pizza',
  '피자헛': 'pizza',
  '반올림피자': 'pizza',
  '노모어피자': 'pizza',
  '도미노피자': 'pizza',
  '청년피자': 'pizza',
  '7번가피자': 'pizza',
  
  // Burger
  '쉐이크쉑': 'burger',
  '맘스터치': 'burger',
  
  // Korean
  '두찜': 'korean',
  
  // Bunsik
  '명랑핫도그': 'korean',
  '동대문엽기떡볶이': 'korean',
  
  // Japanese
  '육회바른연어': 'japanese',
  
  // Cafe
  'Tim Hortons': 'cafe',
  'jamba': 'cafe',
  'PASCUCCI': 'cafe',
  'COFFEE@WORKS': 'cafe',

  // Bakery
  '뚜레쥬르': 'cafe',

  // Western
  'Mad for Garlic': 'pizza'
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
  return {
    id: `sync-${index}`,
    brandName: item.brand,
    platform: platformMap[item.app] || (item.app === '쿠팡이츠' ? 'coupang' : item.app === '요기요' ? 'yogiyo' : item.app === '땡겨요' ? 'ttangyo' : 'baemin'),
    discountAmount: item.discount,
    minOrderAmount: item.min_order,
    description: item.special_condition || (item.method === '전체' ? '모든 주문 할인' : `${item.method} 전용 할인`),
    category: categoryMap[item.brand] || 'chicken',
    method: item.method,
    deliveryTypes: item.delivery_types || [],
    specialCondition: item.special_condition || null
  };
});

fs.writeFileSync(
  path.join(process.cwd(), 'public/data/discounts.json'),
  JSON.stringify(convertedData, null, 2)
);

console.log(`Successfully merged ${convertedData.length} items to public/data/discounts.json`);
