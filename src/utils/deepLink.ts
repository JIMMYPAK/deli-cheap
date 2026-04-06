import { Platform } from '@/types/discount';

export function getDeepLink(platform: Platform, brandName: string): string {
  const encodedBrand = encodeURIComponent(brandName);

  switch (platform) {
    case 'baemin':
      // 배민 브랜드 검색 결과 페이지 딥링크 (예시 규격)
      return `baemin://search?keyword=${encodedBrand}`;
    case 'yogiyo':
      // 요기요 브랜드 검색 딥링크
      return `yogiyo://search?keyword=${encodedBrand}`;
    case 'coupang':
      // 쿠팡이츠 브랜드 검색 딥링크
      return `coupangeats://search?q=${encodedBrand}`;
    default:
      return '#';
  }
}

export function getWebFallback(platform: Platform, _brandName: string): string {
  switch (platform) {
    case 'baemin':
      return `https://www.baemin.com/`; // 웹 메인으로 유도
    case 'yogiyo':
      return `https://www.yogiyo.co.kr/`;
    case 'coupang':
      return `https://www.coupangeats.com/`;
    default:
      return '#';
  }
}

export function openDeliveryApp(platform: Platform, brandName: string) {
  const deepLink = getDeepLink(platform, brandName);
  const fallback = getWebFallback(platform, brandName);

  // 모바일 환경 체크 (간단한 정규식)
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  if (!isMobile) {
    window.open(fallback, '_blank');
    return;
  }

  // 딥링크 실행 시도
  const start = Date.now();
  window.location.href = deepLink;

  // 딥링크가 작동하지 않을 경우(앱 미설치 등) 2.5초 후 마켓/웹으로 이동
  setTimeout(() => {
    if (Date.now() - start < 3000) {
      window.open(fallback, '_blank');
    }
  }, 2500);
}
