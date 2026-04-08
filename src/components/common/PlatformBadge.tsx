import { Platform } from '@/types/discount';

interface PlatformBadgeProps {
  platform: Platform;
  size?: 'sm' | 'md';
}

const PLATFORM_MAP = {
  baemin: { name: '배민', color: 'bg-baemin', textColor: 'text-white' },
  yogiyo: { name: '요기요', color: 'bg-yogiyo', textColor: 'text-white' },
  coupang: { name: '쿠팡이츠', color: 'bg-coupang', textColor: 'text-white' },
  ttangyo: { name: '땡겨요', color: 'bg-ttangyo', textColor: 'text-white' },
};

export default function PlatformBadge({ platform, size = 'md' }: PlatformBadgeProps) {
  const config = PLATFORM_MAP[platform];
  const sizeClasses = size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-1 text-[11px]';

  return (
    <span className={`${config.color} ${config.textColor} ${sizeClasses} rounded font-bold inline-block`}>
      {config.name}
    </span>
  );
}
