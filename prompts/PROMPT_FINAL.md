BM/YO/COUP/TTANG 추출이 모두 완료되었다.
아래를 순서대로 실행해:

1) node scripts/sync-all-data.js
2) node scripts/upload-to-supabase.js
3) git add -A && git commit -m "data: 쿠폰 데이터 업데이트" && git push origin main

== 최종 보고 형식 ==
- BM / YO / COUP / TTANG 각각 최종 카드 수
- 신규 추가 브랜드 및 배정 카테고리 내역
- 병합 총 아이템 수
- Supabase 업로드 성공/실패 여부
- 실패 시 원인 및 수정 내역
