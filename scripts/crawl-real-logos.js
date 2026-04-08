const fs = require('fs');
const path = require('path');
const https = require('https');
const gplay = require('google-play-scraper').default;

const categories = ['BM', 'COUP', 'YO'];
const brands = new Set();

categories.forEach(cat => {
  const file = path.join(process.cwd(), `${cat}.json`);
  if (fs.existsSync(file)) {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    data.forEach(item => brands.add(item.brand));
  }
});

const brandsArray = Array.from(brands);
const iconsDir = path.join(process.cwd(), 'public', 'icons');

function fetchImage(url, filePath) {
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode === 200) {
        const file = fs.createWriteStream(filePath);
        res.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve(true);
        });
      } else {
        resolve(false);
      }
    }).on('error', () => resolve(false));
  });
}

async function run() {
  console.log(`총 ${brandsArray.length}개 브랜드의 실제 앱 로고 검색을 시작합니다...`);

  for (const brand of brandsArray) {
    try {
      const results = await gplay.search({ term: brand, num: 3, country: 'kr' });
      
      const normalizedBrand = brand.replace(/\s+/g, '').toLowerCase();
      
      const matchedApp = results.find(app => {
        const normalizedTitle = app.title.replace(/\s+/g, '').toLowerCase();
        
        // 1. 완벽 포함
        if (normalizedTitle.includes(normalizedBrand)) return true;
        
        // 2. 특수 케이스 (예: 쉐이크쉑 -> shakeshack)
        if (brand === '쉐이크쉑' && normalizedTitle.includes('shakeshack')) return true;
        if (brand === '동대문엽기떡볶이' && normalizedTitle.includes('엽기떡볶이')) return true;
        
        return false;
      });

      if (matchedApp) {
        console.log(`[Found] ${brand} -> 매칭 앱: ${matchedApp.title}`);
        const iconUrl = matchedApp.icon;
        const filePath = path.join(iconsDir, `${brand}.png`);
        
        const dlUrl = iconUrl.includes('=s') ? iconUrl.replace(/=s\d+-rw/, '=s128-rw') : iconUrl + '=s128-rw';
        
        await fetchImage(dlUrl, filePath);
      } else {
        console.log(`[Skip] ${brand} (정확히 일치하는 공식 앱을 찾지 못함. 기본 이니셜 로고 유지)`);
      }
    } catch (e) {
      console.log(`[Error] ${brand} 검색 중 에러 발생: ${e.message}`);
    }
    
    await new Promise(r => setTimeout(r, 500));
  }
  
  console.log('🎉 실제 앱 로고 크롤링 및 업데이트가 완료되었습니다!');
}

run();