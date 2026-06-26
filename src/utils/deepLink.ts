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
    case 'ttangyo':
      // 땡겨요 브랜드 검색 딥링크
      return `ddangyo://search?keyword=${encodedBrand}`;
    default:
      return '#';
  }
}

export function getWebFallback(platform: Platform): string {
  switch (platform) {
    case 'baemin':
      return `https://www.baemin.com/`; // 웹 메인으로 유도
    case 'yogiyo':
      return `https://www.yogiyo.co.kr/`;
    case 'coupang':
      return `https://www.coupangeats.com/`;
    case 'ttangyo':
      return `https://www.ddangyo.com/`;
    default:
      return '#';
  }
}

export function openDeliveryApp(platform: Platform, brandName: string) {
  const deepLink = getDeepLink(platform, brandName);
  const fallback = getWebFallback(platform);

  // 모바일 환경 체크 (간단한 정규식)
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  if (!isMobile) {
    window.open(fallback, '_blank');
    return;
  }

  let cancelled = false;
  const timeoutId = setTimeout(() => {
    if (cancelled) return;
    document.removeEventListener('visibilitychange', cancel);
    window.removeEventListener('blur', cancel);
    window.location.href = fallback;
  }, 2500);

  const cancel = () => {
    if (cancelled) return;
    cancelled = true;
    clearTimeout(timeoutId);
    document.removeEventListener('visibilitychange', cancel);
    window.removeEventListener('blur', cancel);
  };

  // 앱이 열리면 브라우저가 백그라운드로 전환(visibilitychange) 되거나 포커스를 잃음(blur)
  // 두 이벤트 중 하나라도 감지되면 폴백 타이머 취소
  document.addEventListener('visibilitychange', cancel);
  window.addEventListener('blur', cancel);

  // 딥링크 실행 시도
  window.location.href = deepLink;
}
