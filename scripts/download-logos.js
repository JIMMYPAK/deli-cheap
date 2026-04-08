#!/usr/bin/env node
/**
 * 브랜드 로고 다운로드 스크립트
 * 1순위: https://logo.clearbit.com/{domain} (200 응답 시 사용)
 * 2순위: https://www.google.com/s2/favicons?domain={domain}&sz=128 (폴백)
 * 저장 위치: public/icons/{brandKey}.png
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const ICONS_DIR = path.join(__dirname, '../public/icons');

if (!fs.existsSync(ICONS_DIR)) {
  fs.mkdirSync(ICONS_DIR, { recursive: true });
}

// 브랜드 원본 키 → 공식 도메인 매핑
const brandDomains = {
  '7번가피자':       '7bungga.com',
  'BBQ':            'bbq.co.kr',
  'BHC':            'bhcchicken.com',
  'COFFEE@WORKS':   'coffeeatworks.com',
  'Mad for Garlic': 'madforgarlic.com',
  'PASCUCCI':       'pascucci.co.kr',
  'Tim Hortons':    'timhortons.com',
  'jamba':          'jamba.com',
  '교촌치킨':        'kyochon.com',
  '굽네치킨':        'goobne.co.kr',
  '꾸브라꼬숯불치킨': 'kkubeurakko.com',
  '네네치킨':        'nenechicken.com',
  '노모어피자':      'nomorepizza.co.kr',
  '도미노피자':      'dominos.co.kr',
  '돈치킨':          'donchicken.co.kr',
  '동대문엽기떡볶이': 'yupdduk.com',
  '두찜':            'doojjim.co.kr',
  '뚜레쥬르':        'tlj.co.kr',
  '롯데리아':        'lotteria.com',
  '맘스터치':        'momstouch.co.kr',
  '맥도날드':        'mcdonalds.com',
  '멕시카나':        'mexicana.co.kr',
  '반올림피자':      'banolrimpizza.com',
  '배스킨라빈스':    'baskinrobbins.co.kr',
  '버거킹':          'burgerking.co.kr',
  '본스치킨':        'vonschicken.co.kr',
  '빅스타피자':      'bigstarpizza.co.kr',
  '쉐이크쉑':        'shakeshack.com',
  '오븐마루치킨':    'ovenmaru.com',
  '오븐에빠진닭':    'oppadak.co.kr',
  '유로코피자':      'eurokopizza.kr',
  '자담치킨':        'jadamchicken.com',
  '지코바치킨':      'gcova.co.kr',
  '처갓집양념치킨':  'cheogajip.com',
  '청년피자':        'youngmanpizza.co.kr',
  '치킨마루':        'chickenmaru.co.kr',
  '치킨매니아':      'cknia.com',
  '치킨인류':        'chickenhumanity.co.kr',
  '치킨플러스':      'chickenplus.co.kr',
  '티바두마리치킨':  'tiba.co.kr',
  '파리바게뜨':      'paris.co.kr',
  '푸라닭':          'puradakchicken.com',
  '피자헛':          'pizzahut.co.kr',
  '호식이두마리치킨': '9922.co.kr',
  // 도메인 미확인 브랜드는 제외: 투존치킨, 육회바른연어, 호치킨
};

function download(url, destPath) {
  return new Promise((resolve, reject) => {
    const proto = url.startsWith('https') ? https : http;
    const req = proto.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      // 리다이렉트 처리 (최대 3번)
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return download(res.headers.location, destPath).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        res.resume();
        return reject(new Error(`HTTP ${res.statusCode}`));
      }
      const contentType = res.headers['content-type'] || '';
      if (!contentType.includes('image')) {
        res.resume();
        return reject(new Error(`Not an image: ${contentType}`));
      }
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => {
        const buf = Buffer.concat(chunks);
        if (buf.length < 100) {
          return reject(new Error('File too small (likely placeholder)'));
        }
        fs.writeFileSync(destPath, buf);
        resolve(buf.length);
      });
    });
    req.on('error', reject);
    req.setTimeout(10000, () => { req.destroy(); reject(new Error('Timeout')); });
  });
}

async function downloadLogo(brandKey, domain) {
  const destPath = path.join(ICONS_DIR, `${brandKey}.png`);

  // 이미 파일이 있으면 스킵
  if (fs.existsSync(destPath)) {
    console.log(`  ⏭  SKIP  ${brandKey} (already exists)`);
    return 'skip';
  }

  // 1순위: Clearbit
  try {
    const bytes = await download(
      `https://logo.clearbit.com/${domain}`,
      destPath
    );
    console.log(`  ✅ CLEARBIT  ${brandKey} (${bytes}B)`);
    return 'clearbit';
  } catch (e1) {
    // 2순위: Google Favicon (128px)
    try {
      const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
      const bytes = await download(faviconUrl, destPath);
      console.log(`  🔖 FAVICON   ${brandKey} (${bytes}B) - ${e1.message}`);
      return 'favicon';
    } catch (e2) {
      console.log(`  ❌ FAIL      ${brandKey} — ${e1.message} / ${e2.message}`);
      return 'fail';
    }
  }
}

async function main() {
  console.log(`\n📦 브랜드 로고 다운로드 시작 (${Object.keys(brandDomains).length}개 브랜드)\n`);

  const results = { skip: 0, clearbit: 0, favicon: 0, fail: 0 };

  for (const [brand, domain] of Object.entries(brandDomains)) {
    const result = await downloadLogo(brand, domain);
    results[result]++;
    // 서버 부하 방지를 위해 약간 대기
    await new Promise(r => setTimeout(r, 300));
  }

  console.log(`\n📊 결과:`);
  console.log(`  ⏭  스킵(이미 존재): ${results.skip}`);
  console.log(`  ✅ Clearbit 성공:   ${results.clearbit}`);
  console.log(`  🔖 Favicon 폴백:    ${results.favicon}`);
  console.log(`  ❌ 실패:            ${results.fail}`);
  console.log('');
}

main().catch(console.error);
