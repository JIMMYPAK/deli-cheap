딜리칩 데이터 추출 작업을 수행해줘.

== 목표 ==
TTANG 폴더 이미지를 분석하여 TTANG.json을 최신 데이터로 덮어써.
기존 웹사이트 카드 UI 코드는 절대 수정하지 않는다.

== 공통 원칙 ==
1. 화면에 명시적으로 표시된 텍스트·숫자만 추출. 임의 계산·추론 금지.
2. 쿠폰·프로모션 카드만 추출. 매장 리스트·리뷰·광고·추천 섹션은 완전히 무시.
3. "받기 완료" "종료" "마감" 상태 쿠폰은 제외.
4. 동일 브랜드 이미지가 여러 장이면 하나의 레코드로 합쳐서 처리.
5. 한 이미지에 여러 카드가 있으면 상단→하단 순서로 전부 추출.

== 공통 필드 규칙 ==
- app: "땡겨요"
- brand: 순수 브랜드명만. "할인" "최대" "이번주" "쿠폰" 등 수식어 제거.
- discount: 숫자만.
  % 할인 쿠폰은 최대 할인 금액을 숫자로 기록.
  최대 금액 명시 없이 %만 있으면 해당 레코드 제외.
- min_order: 숫자만. 명시 없으면 null.
- method: "배달" | "픽업" | "전체". 불명확하면 "전체".
- delivery_types: 없으면 [].
- special_condition: 부가 조건 텍스트. 없으면 null.
- valid_until: YYYY-MM-DD 형식. (없으면 null)

== JSON 출력 형식(필수) ==
[
  {
    "app": "땡겨요",
    "brand": "브랜드명",
    "discount": 8000,
    "min_order": null,
    "method": "전체",
    "delivery_types": [],
    "special_condition": null,
    "valid_until": null
  }
]

== 땡겨요(TTANG) 추출 규칙 ==
- 화면에 표시된 최대 할인액을 그대로 discount에 기록.
  (5,000원 차감 계산 절대 금지 — 스크립트가 자동 처리함)
- special_condition: 항상 null. 어떤 조건 문구도 기입하지 않음.
  ("첫주문/재주문", "선착순", "첫 입점 기념" 등 모두 무시)
- min_order: ★ 반드시 기입. 화면에 "N,000원 이상 주문 시" 또는 "최소주문금액 N,000원" 표시를 찾아 숫자로 기록.
  명시가 전혀 없을 때만 null. 절대 생략하거나 놓치지 말 것.
- delivery_types: 없으면 [].

== 새 브랜드 처리(필수) ==
추출된 브랜드 중 scripts/sync-all-data.js의 categoryMap에 없는 브랜드가 있으면:
1. 해당 브랜드 업종을 파악하여 아래 카테고리 중 하나로 분류.
   chicken / pizza / burger / korean / bunsik / meat / chinese / japanese / western / cafe / bakery
2. sync-all-data.js의 categoryMap 해당 섹션에 직접 추가.

== 품질 검증(필수) ==
- app / brand / discount 중 하나라도 비어있는 레코드는 배열에서 제외.
- 카드 수가 0이거나 비정상적으로 적으면 해당 이미지 재분석.

== 실행 완료 후 보고 ==
- TTANG 최종 카드 수
- 신규 추가 브랜드 및 배정 카테고리 내역(있을 때)
- 이미지 수 / 총 추출 카드 수 / 이미지별 카드 수 (파일명: n개)
