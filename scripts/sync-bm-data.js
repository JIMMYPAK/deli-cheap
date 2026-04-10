const fs = require('fs');
const path = require('path');

const bmData = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'BM.json'), 'utf8'));

const categoryMap = {
  'BHC': 'chicken',
  '호치킨': 'chicken',
  '치킨마루': 'chicken',
  '치킨플러스': 'chicken',
  '본스치킨': 'chicken',
  '갓튀긴후라이드': 'chicken',
  '꾸브라꼬숯불치킨': 'chicken',
  '멕시카나': 'chicken',
  '처갓집양념치킨': 'chicken',
  '두찜': 'korean',
  '쉐이크쉑': 'burger',
  '기영이숯불두마리치킨': 'meat',
  '기영이숯불치킨': 'chicken',
  '뚜레쥬르': 'bakery',
  '오븐마루치킨': 'chicken',
  '훌랄라참숯바베큐치킨': 'chicken',
  '훌랄라참숯치킨': 'chicken',
  '프레드피자': 'pizza',
  '또래오래': 'chicken',
  '또봉이통닭': 'chicken',
  '명랑핫도그': 'bunsik',
  '피자헛': 'pizza',
  '반올림피자': 'pizza',
  '노모어피자': 'pizza',
  '네네치킨': 'chicken',
  '미스터피자': 'pizza',
  '프랭크버거': 'burger',
  '마라공방': 'chinese',
  '요아정': 'cafe',
  '피자알볼로': 'pizza',
  '오구샌': 'burger',
  '맘스터치': 'burger',
  '배스킨라빈스': 'cafe',
  '자담치킨': 'chicken',
};

const platformMap = {
  '배달의민족': 'baemin',
  '요기요': 'yogiyo',
  '쿠팡이츠': 'coupang'
};

const convertedData = bmData.map((item, index) => {
  return {
    id: `bm-${index}`,
    brandName: item.brand,
    platform: platformMap[item.app] || 'baemin',
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

console.log(`Successfully converted ${convertedData.length} items to public/data/discounts.json`);
