딜리칩 데이터 추출 작업을 수행해줘.

== 목표 ==
BM 폴더 이미지를 분석하여 BM.json을 최신 데이터로 덮어써.
기존 웹사이트 카드 UI 코드는 절대 수정하지 않는다.

== 공통 원칙 ==
1. 화면에 명시적으로 표시된 텍스트·숫자·아이콘만 추출. 임의 계산·추론 금지.
   (예외: % 할인 쿠폰의 현실 할인액 계산은 허용 — 아래 discount 규칙 참조)
2. 쿠폰·프로모션 카드만 추출. 매장 리스트·리뷰·광고·추천 섹션은 완전히 무시.
3. "받기 완료" "종료" "마감" 상태 쿠폰은 제외.
4. 동일 브랜드 이미지가 여러 장(예: 금액 화면 + 기간 화면)이면 하나의 레코드로 합쳐서 처리.
5. 한 이미지에 여러 카드가 있으면 상단→하단 순서로 전부 추출.

== 공통 필드 규칙 ==
- app: "배달의민족"
- brand: 순수 브랜드명만. "할인" "최대" "이번주" "쿠폰" 등 수식어 제거.
- discount: 숫자만.
  % 할인 쿠폰은 min_order × rate로 현실 할인액을 계산하여 기록.
  단, 계산값이 최대 금액을 초과하면 최대 금액으로 cap.
  special_condition에 "X%할인 최대 N,000원" 형식으로 원본 정보 유지.
  (예: 10%, min_order 18,900원, 최대 10,000원
      → discount: 1890, special_condition: "10%할인 최대 10,000원")
  (예: 10%, min_order 15,000원, 최대 1,000원
      → 15,000 × 0.1 = 1,500 → cap → discount: 1000, special_condition: "10%할인 최대 1,000원")
  최대 금액 명시 없이 %만 있으면 해당 레코드 제외.
- min_order: 숫자만. 명시 없으면 null.
- method: "배달" | "픽업" | "전체".
  판정 규칙(아래 순서대로 적용):
  1) delivery_types에 "한집배달" / "알뜰배달" / "가게배달" 중 하나라도 있고
     "픽업"은 없으면 → "배달"
  2) delivery_types가 ["픽업"]만으로 구성되면 → "픽업"
  3) delivery_types에 "픽업"과 배달계 태그가 함께 있으면 → "전체"
  4) delivery_types가 빈 배열([])이면 → "전체"
     (= 이미지에 배달방식 태그가 전혀 표시되지 않은 경우 = 모든 방식 가능)
- delivery_types: 카드에 "명시적으로" 표시된 배달 방식 태그만 그대로 배열에 기록.
  허용 값: "한집배달", "알뜰배달", "가게배달", "픽업"
  명시 없으면 반드시 []. 임의로 채우지 말 것.
  (UI는 빈 배열이면 "모든 배달방식 가능"으로 해석함)
- coupon_type: "normal" | "first_come" | "brand_wishlist" | "first_order"
  판정 규칙:
  · 선착순 쿠폰(타이머/수량 제한/"선착순" 텍스트) → "first_come"
  · 브랜드찜 전용 쿠폰("브랜드찜" 표시) → "brand_wishlist"
  · 브랜드 첫 주문 전용 쿠폰("첫 주문" 표시) → "first_order"
  · 위 어느 것도 아니면 → "normal"
- first_come_time: coupon_type이 "first_come"일 때만 사용.
  이미지에 시작 시간이 표시되어 있으면 "HH:MM" 형식(예: "10:00").
  시간 미표시 또는 coupon_type이 다른 값이면 null.
- requires_baemin_club: 불리언.
  쿠폰 카드에 "배민클럽" 로고/텍스트가 표시되어 "배민클럽 전용"으로 보이는 경우에만 true.
  그 외 기본값 false.
- requires_naver_pay: 불리언.
  쿠폰 카드에 "네이버페이" / "N Pay" 표시가 있어 결제수단이 네이버페이로 제한되는 경우에만 true.
  그 외 기본값 false.
- special_condition: 순수 부가 설명 텍스트만 기록.
  "선착순" / "브랜드찜" / "첫 주문" / "배민클럽 전용" / "네이버페이 전용" 같이
  이미 다른 필드로 구조화된 정보는 여기에 중복 기입하지 않는다.
  기록 예시: "X%할인 최대 N,000원" 형식의 원본 할인 정보 정도.
  해당 내용 없으면 null.
- valid_until: YYYY-MM-DD 형식. (예: 4월 15일→2026-04-15, 없으면 null)

== JSON 출력 형식(필수) ==
[
  {
    "app": "배달의민족",
    "brand": "브랜드명",
    "discount": 4000,
    "min_order": 15000,
    "method": "배달",
    "delivery_types": ["한집배달", "알뜰배달"],
    "coupon_type": "normal",
    "first_come_time": null,
    "requires_baemin_club": false,
    "requires_naver_pay": false,
    "special_condition": null,
    "valid_until": "2026-04-15"
  }
]

== 배달의민족(BM) 추출 규칙 ==
- 일반 쿠폰, 선착순 쿠폰, 브랜드찜 쿠폰, 첫 주문 쿠폰 모두 포함.
- 앱 가입 첫 주문 쿠폰(신규 회원 전용, 브랜드와 무관한 첫 주문 프로모션)은 제외.
- 선착순 쿠폰:
  - 유효기간이 당일이어도 유효 쿠폰으로 포함.
  - coupon_type: "first_come"
  - first_come_time: 이미지에 명시된 시작 시간("10:00" 등). 미표시면 null.
  - valid_until: 해당 브랜드의 다른 일반 쿠폰과 동일한 날짜로 기입. 없으면 null.
- 브랜드찜 쿠폰: coupon_type: "brand_wishlist"
- 브랜드 첫 주문 쿠폰: coupon_type: "first_order"
- 배민클럽 전용 표시가 있는 쿠폰은 반드시 requires_baemin_club: true.
- 네이버페이 전용 표시가 있는 쿠폰은 반드시 requires_naver_pay: true.
- 배달방식 태그가 전혀 표시되지 않은 쿠폰은 delivery_types: [], method: "전체"로 처리.
  (UI가 자동으로 "한집배달/알뜰배달/가게배달/픽업" 4개 모두를 표시함)

== 새 브랜드 처리(필수) ==
추출된 브랜드 중 scripts/sync-all-data.js의 categoryMap에 없는 브랜드가 있으면:
1. 해당 브랜드 업종을 파악하여 아래 카테고리 중 하나로 분류.
   chicken / pizza / burger / korean / bunsik / meat / chinese / japanese / western / cafe / bakery / salad
2. sync-all-data.js의 categoryMap 해당 섹션에 직접 추가.

== 품질 검증(필수) ==
- app / brand / discount 중 하나라도 비어있는 레코드는 배열에서 제외.
- coupon_type은 4개 enum 중 하나로 반드시 채운다(누락 금지).
- requires_baemin_club / requires_naver_pay는 불리언으로 반드시 채운다(누락 금지, 기본 false).
- 카드 수가 0이거나 비정상적으로 적으면 해당 이미지 재분석.

== 실행 완료 후 보고 ==
- BM 최종 카드 수
- coupon_type 분포(normal / first_come / brand_wishlist / first_order 각 n건)
- requires_baemin_club=true 카드 수, requires_naver_pay=true 카드 수
- 신규 추가 브랜드 및 배정 카테고리 내역(있을 때)
- 이미지 수 / 총 추출 카드 수 / 이미지별 카드 수 (파일명: n개)
