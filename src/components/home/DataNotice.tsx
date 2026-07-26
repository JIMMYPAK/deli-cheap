import { DiscountDataStats } from '@/utils/discounts';

interface DataNoticeProps {
  stats: DiscountDataStats;
}

export default function DataNotice({ stats }: DataNoticeProps) {
  if (stats.activeCount === 0 && stats.expiredExcludedCount === 0) return null;

  return (
    <aside
      aria-label="할인 정보 상태"
      className="mx-4 mt-2 rounded-xl border border-amber-100 bg-amber-50 px-3 py-2.5 text-[11px] leading-relaxed text-amber-800"
    >
      <p className="font-extrabold">할인 정보 확인 안내</p>
      <p className="mt-0.5 text-amber-700">
        {stats.expiredExcludedCount > 0 && (
          <>종료일이 지난 {stats.expiredExcludedCount}개 혜택은 자동으로 제외했습니다. </>
        )}
        {stats.unknownExpiryCount > 0
          ? `현재 표시된 혜택 중 ${stats.unknownExpiryCount}개는 종료일 정보가 없어 주문 전에 앱에서 확인해 주세요.`
          : '종료일이 확인된 진행 중 혜택만 표시합니다.'}
      </p>
    </aside>
  );
}
