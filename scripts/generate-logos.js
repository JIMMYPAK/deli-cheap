const fs = require('fs');
const path = require('path');
const https = require('https');

// 1. 브랜드 목록 추출 (기존 JSON 데이터 기준)
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

if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// 2. 예쁜 파스텔톤/원색 헥사코드 색상 팔레트
const colors = [
  'FF6B6B', '4ECDC4', '45B7D1', '96CEB4', 'D4A5A5', 
  '9B59B6', '3498DB', 'F1C40F', 'E67E22', '1ABC9C',
  '34495E', 'E74C3C', '2ECC71', '8E44AD', 'D35400'
];

console.log(`총 ${brandsArray.length}개의 브랜드 로고 생성을 시작합니다...`);

function fetchImage(url, filePath, brand) {
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode === 200) {
        const file = fs.createWriteStream(filePath);
        res.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`[OK] ${brand} 로고 생성 완료!`);
          resolve();
        });
      } else if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        // 리다이렉트 처리
        fetchImage(res.headers.location, filePath, brand).then(resolve);
      } else {
        console.error(`[Error] ${brand} 다운로드 실패 (${res.statusCode})`);
        resolve(); 
      }
    }).on('error', (err) => {
      console.error(`[Error] ${brand} 다운로드 에러:`, err.message);
      resolve();
    });
  });
}

async function run() {
  for (let i = 0; i < brandsArray.length; i++) {
    const brand = brandsArray[i];
    const filePath = path.join(iconsDir, `${brand}.png`);
    
    if (fs.existsSync(filePath)) {
      console.log(`[Skip] ${brand}.png 이미 존재함.`);
      continue;
    }

    // 브랜드의 첫 글자를 추출하여 이니셜로 사용
    const initial = encodeURIComponent(brand.substring(0, 1));
    const color = colors[i % colors.length];
    
    // UI Avatars API: 텍스트 이니셜을 예쁜 색상의 PNG로 변환해주는 무료 서비스
    const url = `https://ui-avatars.com/api/?name=${initial}&background=${color}&color=ffffff&size=128&font-size=0.5&bold=true`;

    await fetchImage(url, filePath, brand);
    
    // API 서버 부하 방지를 위해 200ms 대기
    await new Promise(r => setTimeout(r, 200));
  }
  console.log('🎉 모든 브랜드 로고 생성이 완료되었습니다!');
}

run();
