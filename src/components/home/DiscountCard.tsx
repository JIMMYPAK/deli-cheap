import { GroupedDiscount } from '@/types/discount';
import PlatformBadge from '@/components/common/PlatformBadge';
import { openDeliveryApp } from '@/utils/deepLink';

interface DiscountCardProps {
  discount: GroupedDiscount;
}

export default function DiscountCard({ discount }: DiscountCardProps) {
  return (
    <div className={`relative bg-white border ${discount.isBest ? 'border-baemin shadow-md' : 'border-gray-100'} p-4 rounded-2xl flex flex-col gap-4 transition-transform active:scale-[0.98]`}>
      {discount.isBest && (
        <div className="absolute -top-3 left-4 bg-baemin text-white text-[10px] px-2 py-1 rounded-full font-bold flex items-center gap-1">
          <span>👑</span> 최고의 혜택
        </div>
      )}

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img 
            src={`/icons/${discount.brandName}.png`} 
            alt={`${discount.brandName} 로고`} 
            className="w-6 h-6 object-contain rounded-md bg-gray-50"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <h3 className="text-xl font-black text-gray-900">{discount.brandName}</h3>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-gray-400 text-[10px] font-bold">최대 할인액</span>
          <span className="text-baemin font-black text-xl">-{discount.totalMaxDiscount.toLocaleString()}원</span>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {discount.platforms.map((platformGroup) => (
          <div key={platformGroup.platform} className="flex flex-col gap-3">
            {/* Platform Header */}
            <div className="flex items-center justify-between pb-1 border-b border-gray-50">
              <div className="flex items-center gap-2">
                <PlatformBadge platform={platformGroup.platform} size="sm" />
                <span className="text-[12px] font-bold text-gray-700">
                  {platformGroup.platform === 'baemin' ? '배달의민족' : platformGroup.platform === 'yogiyo' ? '요기요' : '쿠팡이츠'}
                </span>
              </div>
              <button 
                onClick={() => openDeliveryApp(platformGroup.platform, discount.brandName)}
                className="text-[11px] font-bold text-baemin flex items-center gap-0.5"
              >
                앱 열기 <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              </button>
            </div>

            {/* Coupons for this platform */}
            <div className="flex flex-col gap-2">
              {platformGroup.coupons.map((coupon, cIdx) => (
                <div key={cIdx} className="flex flex-col gap-2 p-3 rounded-xl bg-gray-50/50 border border-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${
                        coupon.method === '배달' ? 'bg-blue-50 text-blue-500' : 
                        coupon.method === '픽업' ? 'bg-orange-50 text-orange-500' : 
                        'bg-gray-100 text-gray-500'
                      }`}>
                        {coupon.method}
                      </span>

                      {coupon.specialCondition && (
                        <span className="bg-red-50 text-red-500 text-[10px] px-1.5 py-0.5 rounded-md font-bold">
                          {coupon.specialCondition}
                        </span>
                      )}

                      {coupon.deliveryTypes.map((type, tIdx) => (
                        <span key={tIdx} className="text-[10px] text-gray-400 font-medium">
                          #{type}
                        </span>
                      ))}
                    </div>
                    <span className="text-gray-900 font-black text-sm">
                      -{coupon.discountAmount.toLocaleString()}원
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-gray-400">
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
