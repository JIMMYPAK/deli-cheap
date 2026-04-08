import { GroupedDiscount } from '@/types/discount';
import PlatformBadge from '@/components/common/PlatformBadge';
import { openDeliveryApp } from '@/utils/deepLink';

interface DiscountCardProps {
  discount: GroupedDiscount;
}

export default function DiscountCard({ discount }: DiscountCardProps) {
  return (
    <div className={`relative bg-white border ${discount.isBest ? 'border-baemin shadow-md' : 'border-gray-200 shadow-sm'} p-5 rounded-xl flex flex-col gap-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md`}>
      {discount.isBest && (
        <div className="absolute -top-3 left-4 bg-baemin text-white text-[10px] px-3 py-1 rounded-full font-bold flex items-center gap-1 shadow-sm">
          <span>👑</span> 최고의 혜택
        </div>
      )}

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2.5">
          <img 
            src={`/icons/${discount.brandKey}.png`} 
            alt={`${discount.brandName} 로고`} 
            className="w-7 h-7 object-contain rounded-md bg-gray-50"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <h3 className="text-lg font-black text-gray-900 tracking-tight">{discount.brandName}</h3>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-gray-400 text-[10px] font-bold mb-0.5">최대 혜택</span>
          <span className="text-baemin font-black text-xl tracking-tight">-{discount.totalMaxDiscount.toLocaleString()}원</span>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        {discount.platforms.map((platformGroup) => (
          <div key={platformGroup.platform} className="flex flex-col gap-2.5">
            {/* Platform Header */}
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <PlatformBadge platform={platformGroup.platform} size="sm" />
                <span className="text-[12px] font-bold text-gray-700">
                  {platformGroup.platform === 'baemin' ? '배달의민족' : platformGroup.platform === 'yogiyo' ? '요기요' : platformGroup.platform === 'ttangyo' ? '땡겨요' : '쿠팡이츠'}
                </span>
              </div>
              <button 
                onClick={() => openDeliveryApp(platformGroup.platform, discount.brandName)}
                className="text-[11px] font-bold text-baemin flex items-center gap-0.5 bg-baemin/5 px-2 py-1 rounded-md transition-colors hover:bg-baemin/10"
              >
                앱 열기 <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              </button>
            </div>

            {/* Coupons for this platform */}
            <div className="flex flex-col gap-2">
              {platformGroup.coupons.map((coupon, cIdx) => (
                <div key={cIdx} className="flex flex-col gap-2 p-3.5 rounded-lg bg-gray-50 border border-gray-100/50 hover:border-gray-200 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded flex items-center font-bold ${
                        coupon.method === '배달' ? 'bg-blue-100/50 text-blue-600' : 
                        coupon.method === '픽업' ? 'bg-orange-100/50 text-orange-600' : 
                        'bg-gray-200/50 text-gray-600'
                      }`}>
                        {coupon.method}
                      </span>

                      {coupon.specialCondition && (
                        <span className="bg-red-50 text-red-500 text-[10px] px-1.5 py-0.5 rounded font-bold">
                          {coupon.specialCondition}
                          {platformGroup.platform === 'yogiyo' && coupon.specialCondition.includes('%') && !coupon.specialCondition.includes('적립') ? ' 적립' : ''}
                        </span>
                      )}

                      {coupon.deliveryTypes.map((type, tIdx) => (
                        <span key={tIdx} className="text-[10px] text-gray-500 font-medium">
                          #{type}
                        </span>
                      ))}
                    </div>
                    <span className="text-gray-900 font-black text-sm tracking-tight">
                      -{coupon.discountAmount.toLocaleString()}원
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-gray-400 font-medium">
                      {coupon.minOrderAmount > 0 ? `${coupon.minOrderAmount.toLocaleString()}원 이상 주문 시` : '최소주문금액 없음'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
