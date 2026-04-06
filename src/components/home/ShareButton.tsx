'use client';

import { useState } from 'react';

export default function ShareButton() {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareData = {
      title: '딜리칩 - 배달 최저가 비교',
      text: '지금 어느 배달앱이 가장 쌀까요? 딜리칩에서 바로 확인해보세요!',
      url: window.location.origin,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.origin);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error('Share failed', err);
    }
  };

  return (
    <button 
      onClick={handleShare}
      className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full text-xs font-bold text-gray-500 hover:bg-gray-100 transition-colors"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
      {copied ? '링크 복사됨!' : '친구에게 공유하기'}
    </button>
  );
}
