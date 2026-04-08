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

export function getWebFallback(platform: Platform, _brandName: string): string {
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
  const fallback = getWebFallback(platform, brandName);

  // 모바일 환경 체크 (간단한 정규식)
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  if (!isMobile) {
    window.open(fallback, '_blank');
    return;
  }

  let timeoutId: ReturnType<typeof setTimeout>;

  const handleVisibilityChange = () => {
    // 앱이 정상적으로 실행되어 브라우저가 백그라운드로 전환되면 폴백 타이머 취소
    if (document.hidden || document.visibilityState === 'hidden') {
      clearTimeout(timeoutId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    }
  };

  document.addEventListener('visibilitychange', handleVisibilityChange);

  // 딥링크 실행 시도
  window.location.href = deepLink;

  // 딥링크가 작동하지 않을 경우(앱 미설치 등) 일정 시간 후 웹으로 이동
  timeoutId = setTimeout(() => {
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    // 팝업 차단을 우회하기 위해 현재 창에서 이동
    window.location.href = fallback;
  }, 2000);
}
