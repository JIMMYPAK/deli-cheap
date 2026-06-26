'use client';

import { useState } from 'react';
import { shareOrCopyLink } from '@/utils/share';

export default function Header() {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareData = {
      title: '딜리칩 - 배달 최저가 비교',
      text: '지금 어느 배달앱이 가장 쌀까요? 딜리칩에서 바로 확인해보세요!',
      url: window.location.origin,
    };

    const ok = await shareOrCopyLink(shareData);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const focusSearch = () => {
    document.getElementById('brand-search')?.focus();
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-1">
        <span className="text-xl font-black text-baemin italic tracking-tighter">Deli-Cheap</span>
        <span className="bg-baemin/10 text-baemin text-[10px] px-1.5 py-0.5 rounded font-bold uppercase">Beta</span>
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={handleShare}
          title={copied ? '링크 복사됨!' : '친구에게 공유하기'}
          aria-label={copied ? '링크 복사됨' : '친구에게 공유하기'}
          className="p-2 text-gray-400 hover:text-gray-600 relative"
        >
          {copied ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
          )}
        </button>
        <button
          onClick={focusSearch}
          aria-label="브랜드 검색창으로 이동"
          className="p-2 -mr-2 text-gray-400 hover:text-gray-600"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        </button>
      </div>
    </header>
  );
}
