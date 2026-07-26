const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(process.cwd(), 'public/data/discounts.json');
const PLATFORMS = new Set(['baemin', 'yogiyo', 'coupang', 'ttangyo']);
const CATEGORIES = new Set([
  'chicken',
  'korean',
  'bunsik',
  'pizza',
  'meat',
  'chinese',
  'japanese',
  'burger',
  'western',
  'cafe',
  'bakery',
  'salad',
]);
const METHODS = new Set(['배달', '포장', '전체']);
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

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

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exitCode = 1;
}

if (!fs.existsSync(DATA_PATH)) {
  fail(`데이터 파일이 없습니다: ${DATA_PATH}`);
  process.exit();
}

const data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
if (!Array.isArray(data)) {
  fail('discounts.json의 최상위 값은 배열이어야 합니다.');
  process.exit();
}

const today = getTodayInKorea();
const ids = new Set();
let unknownExpiryCount = 0;

data.forEach((item, index) => {
  const label = `row ${index + 1}`;
  if (!item || typeof item !== 'object') {
    fail(`${label}: 객체가 아닙니다.`);
    return;
  }
  if (typeof item.id !== 'string' || !item.id) fail(`${label}: id가 없습니다.`);
  if (ids.has(item.id)) fail(`${label}: 중복 id ${item.id}`);
  ids.add(item.id);
  if (typeof item.brandName !== 'string' || !item.brandName.trim()) fail(`${label}: brandName이 없습니다.`);
  if (!PLATFORMS.has(item.platform)) fail(`${label}: 알 수 없는 platform ${item.platform}`);
  if (!CATEGORIES.has(item.category)) fail(`${label}: 알 수 없는 category ${item.category}`);
  if (!METHODS.has(item.method)) fail(`${label}: 알 수 없는 method ${item.method}`);
  if (!Number.isFinite(item.discountAmount) || item.discountAmount < 0) fail(`${label}: 잘못된 discountAmount`);
  if (!Number.isFinite(item.minOrderAmount) || item.minOrderAmount < 0) fail(`${label}: 잘못된 minOrderAmount`);
  if (!Array.isArray(item.deliveryTypes)) fail(`${label}: deliveryTypes는 배열이어야 합니다.`);

  if (!item.validUntil) {
    unknownExpiryCount += 1;
  } else if (!DATE_PATTERN.test(item.validUntil)) {
    fail(`${label}: 잘못된 validUntil 형식 ${item.validUntil}`);
  } else if (item.validUntil < today) {
    fail(`${label}: 만료된 혜택이 포함되어 있습니다 (${item.validUntil}).`);
  }
});

if (process.exitCode) process.exit();

console.log(`Data validation passed: ${data.length} rows`);
if (unknownExpiryCount > 0) {
  console.warn(`WARNING: 종료일 미확인 혜택 ${unknownExpiryCount}개는 앱에서 실제 진행 여부를 확인해야 합니다.`);
}
