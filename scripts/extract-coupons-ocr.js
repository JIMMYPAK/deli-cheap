const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const TARGETS = [
  { folder: 'BM', app: '배달의민족', out: 'BM.json' },
  { folder: 'YO', app: '요기요', out: 'YO.json' },
  { folder: 'TTANG', app: '땡겨요', out: 'TTANG.json' },
];

function listImages(folder) {
  return fs
    .readdirSync(folder)
    .filter((f) => /\.(png|jpg|jpeg|webp)$/i.test(f))
    .sort((a, b) => a.localeCompare(b));
}

function toNumber(text) {
  const digits = String(text || '').replace(/[^\d]/g, '');
  return digits ? Number(digits) : 0;
}

function normalize(line) {
  return line
    .replace(/\s+/g, ' ')
    .replace(/[|]/g, 'I')
    .replace(/[“”"']/g, '')
    .trim();
}

function runOcr(imagePath) {
  try {
    const cmd = `tesseract "${imagePath}" stdout -l kor+eng --psm 6`;
    return execSync(cmd, { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
  } catch {
    return '';
  }
}

function runOcrWithMode(imagePath, psm) {
  try {
    const cmd = `tesseract "${imagePath}" stdout -l kor+eng --psm ${psm}`;
    return execSync(cmd, { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
  } catch {
    return '';
  }
}

function loadHeadJson(filename) {
  try {
    const txt = execSync(`git show HEAD:${filename}`, { encoding: 'utf8' });
    return JSON.parse(txt);
  } catch {
    return [];
  }
}

function parseMethod(app, nearText) {
  const t = nearText || '';
  const hasDelivery = /배달/.test(t);
  const hasPickup = /(포장|픽업)/.test(t);
  if (hasDelivery && hasPickup) return '전체';
  if (hasPickup) return '픽업';
  if (hasDelivery) return '배달';
  // App-specific fallback
  if (app === '요기요') return '배달';
  return '배달';
}

function parseDeliveryTypes(app, nearText) {
  const tags = [];
  if (app === '배달의민족') {
    if (/한집배달/.test(nearText)) tags.push('한집배달');
    if (/알뜰배달/.test(nearText)) tags.push('알뜰배달');
  }
  if (app === '요기요') {
    if (/요기패스.?X 중복할인/.test(nearText)) tags.push('요기패스X 중복할인');
  }
  if (/배달비\s*0원/.test(nearText)) tags.push('배달비 0원');
  return [...new Set(tags)];
}

function parseCardsFromText(app, rawText) {
  const lines = rawText
    .split('\n')
    .map(normalize)
    .filter(Boolean);

  // 페이지 상단 브랜드(요기요 단일브랜드 화면에서 보완용)
  let pageBrand = '';
  for (const line of lines.slice(0, 40)) {
    if (/쿠폰|Coupons|최저가|주문/.test(line)) continue;
    if (/^[가-힣A-Za-z0-9&\-\s]{2,30}$/.test(line) && !/원|%/.test(line)) {
      pageBrand = line.trim();
      break;
    }
  }

  const cards = [];
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    const discountMatch = line.match(/(\d{1,2})\s*%|(\d{1,3}(?:,\d{3})+|\d{3,6})\s*원/);
    if (!discountMatch) continue;

    const windowText = lines.slice(i, Math.min(i + 10, lines.length)).join(' ');

    // Skip obvious non-card text
    if (/사용기간/.test(line) && !/할인/.test(windowText)) continue;

    let discount;
    if (discountMatch[1]) {
      discount = `${discountMatch[1]}%`;
    } else {
      discount = toNumber(discountMatch[2]);
    }

    let brand = '';
    let minOrder = 0;

    for (let j = i; j < Math.min(i + 8, lines.length); j += 1) {
      const l = lines[j];
      if (!brand && /할인/.test(l) && !/최대|중복|추가적립/.test(l)) {
        brand = normalize(l.replace(/할인.*/, '')).trim();
      }
      if (!minOrder && /최소\s*주문/.test(l)) {
        const mm = l.match(/(\d{1,3}(?:,\d{3})+|\d{3,6})/);
        if (mm) minOrder = toNumber(mm[1]);
      }
      // 요기요 % 할인 문구
      if (!minOrder && /이상 주문/.test(l)) {
        const mm = l.match(/(\d{1,3}(?:,\d{3})+|\d{3,6})/);
        if (mm) minOrder = toNumber(mm[1]);
      }
    }

    if (!brand && pageBrand) brand = pageBrand;
    if (!brand || !discount || !minOrder) continue;
    if (/받기 완료|종료|마감/.test(windowText)) continue;

    const method = parseMethod(app, windowText);
    const deliveryTypes = parseDeliveryTypes(app, windowText);

    let specialCondition = null;
    const maxMatch = windowText.match(/최대\s*([\d,]+)\s*원\s*할인/);
    if (maxMatch) specialCondition = `최대 ${toNumber(maxMatch[1]).toLocaleString()}원 할인`;

    cards.push({
      app,
      brand,
      discount,
      min_order: minOrder,
      method,
      delivery_types: deliveryTypes,
      special_condition: specialCondition,
    });
  }

  // Deduplicate near-identical cards
  const seen = new Set();
  return cards.filter((c) => {
    const key = `${c.brand}|${c.discount}|${c.min_order}|${c.method}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function parseYoCards(rawText, fallbackBrand) {
  const lines = rawText
    .split('\n')
    .map(normalize)
    .filter(Boolean);
  const cards = [];
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    if (/이상|주문|최대|사용기간|쿠폰받기/.test(line)) continue;
    const discountMatch = line.match(/(\d{1,2})\s*%/);
    if (!discountMatch) continue;

    const win = lines.slice(i, Math.min(i + 10, lines.length)).join(' ');
    const discount = `${discountMatch[1]}%`;
    let minOrder = 0;

    const mo = win.match(/(\d{1,3}(?:,\d{3})+)\s*원\s*이/);
    if (mo) minOrder = toNumber(mo[1]);
    if (!minOrder) {
      const mo2 = win.match(/이상\s*주문.*?(\d{1,3}(?:,\d{3})+)/);
      if (mo2) minOrder = toNumber(mo2[1]);
    }
    if (!minOrder) continue;

    const method = parseMethod('요기요', win);
    const deliveryTypes = [
      ...parseDeliveryTypes('요기요', win),
      ...(/요기패스.?[Xx×].?중복할인/.test(win) ? ['요기패스X 중복할인'] : []),
    ];
    let specialCondition = null;
    const maxMatch = win.match(/최대\s*([\d,]+)\s*원\s*할인/);
    if (maxMatch) specialCondition = `최대 ${toNumber(maxMatch[1]).toLocaleString()}원 할인`;

    cards.push({
      app: '요기요',
      brand: fallbackBrand || '',
      discount,
      min_order: minOrder,
      method,
      delivery_types: deliveryTypes,
      special_condition: specialCondition,
    });
  }

  const seen = new Set();
  return cards.filter((c) => {
    const key = `${c.brand}|${c.discount}|${c.min_order}|${c.method}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function runTarget({ folder, app, out }) {
  const images = listImages(folder);
  const allCards = [];
  const perImage = [];
  const fallbackRows = loadHeadJson(out);

  for (let idx = 0; idx < images.length; idx += 1) {
    const file = images[idx];
    const imagePath = path.join(folder, file);
    const raw = app === '요기요' ? runOcrWithMode(imagePath, 11) : runOcr(imagePath);
    let cards;
    if (app === '요기요') {
      const fallbackBrand = fallbackRows[idx]?.brand || '';
      cards = parseYoCards(raw, fallbackBrand);
      if (cards.length === 0 && fallbackRows[idx]) {
        cards = [fallbackRows[idx]];
      }
    } else {
      cards = parseCardsFromText(app, raw);
      if (cards.length === 0 && fallbackRows[idx]) {
        cards = [fallbackRows[idx]];
      }
    }
    allCards.push(...cards);
    perImage.push({ file, count: cards.length });
  }

  fs.writeFileSync(out, `${JSON.stringify(allCards, null, 2)}\n`);
  return { folder, out, imageCount: images.length, cardCount: allCards.length, perImage };
}

function main() {
  const results = TARGETS.map(runTarget);
  for (const r of results) {
    console.log(`[${r.folder}] images=${r.imageCount}, cards=${r.cardCount}, out=${r.out}`);
    for (const p of r.perImage) {
      console.log(`  - ${p.file}: ${p.count}`);
    }
  }
}

main();
