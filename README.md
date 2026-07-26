# Deli-Cheap

배달의민족·요기요·쿠팡이츠·땡겨요의 브랜드 할인 정보를 한 화면에서 비교하는 모바일 우선 Next.js 앱입니다. 브랜드 검색, 카테고리/플랫폼/주문 방식/최소 주문금액 필터, 정렬, 앱 딥링크, 메뉴 룰렛을 제공합니다.

## 현재 상태

- 프런트엔드: Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4
- 데이터: `public/data/discounts.json`을 먼저 표시하고, Supabase가 설정되어 있으면 원격 데이터를 조회합니다.
- 만료 정책: 종료일이 지난 혜택은 데이터 생성 시점과 브라우저 로딩 시점에 모두 제외합니다.
- 주의: 현재 원본 중 종료일이 확인된 2026년 4~5월 혜택은 모두 만료되어 제외되었습니다. 종료일 정보가 없는 땡겨요 원본만 남아 있으므로 실제 진행 여부는 주문 전 앱에서 확인해야 합니다.

## 실행

Node.js 22 이상이 필요합니다.

```bash
npm install
npm run dev
```

`http://localhost:3000`에서 확인할 수 있습니다.

## 품질 검사

```bash
npm run validate:data
npm run lint
npm run typecheck
npm run build
```

전체 검사는 `npm run check`로 한 번에 실행합니다. 배포 의존성 보안 감사에는 `npm audit --omit=dev`를 사용합니다.

## 데이터 갱신

루트의 `BM.json`, `COUP.json`, `YO.json`, `TTANG.json`은 OCR로 정리한 플랫폼별 원본입니다. 새 원본을 검수한 뒤 다음 명령으로 공개 스냅샷을 다시 만듭니다.

```bash
npm run sync:data
npm run validate:data
```

동기화 스크립트는 다음 원칙을 적용합니다.

- 알 수 없는 플랫폼·브랜드 카테고리·주문 방식은 임의 분류하지 않고 실패 처리
- 한국 시간 기준 만료 혜택 제외
- 주문 방식·배달 유형·특수 조건이 다른 혜택은 별도 보존
- 동일 혜택에는 내용 기반의 안정적인 ID 부여
- 최대 할인액이 확인되지 않은 정률 할인은 수동 보정 전까지 실패 처리

Supabase 반영은 필요한 enum 마이그레이션을 먼저 적용하고 별도로 실행합니다.

```bash
node scripts/upload-to-supabase.js
```

`SUPABASE_SERVICE_ROLE_KEY`는 서버 측 동기화 전용이며 브라우저에 노출되는 `NEXT_PUBLIC_` 접두사를 붙이면 안 됩니다. 업로드 스크립트는 빈 데이터 업로드를 거부하고, 새 데이터를 먼저 upsert한 뒤 오래된 행을 정리합니다.

## 환경 변수

`.env.example`을 참고해 `.env.local`을 만듭니다. Supabase 변수가 없더라도 앱은 로컬 JSON으로 동작합니다.

```dotenv
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_GA_ID=
```

## 구조

```text
src/app/                 App Router 화면과 전역 스타일
src/components/          홈, 레이아웃, 룰렛 UI
src/hooks/               데이터 로딩, 필터, 할인 가공 로직
src/constants/           브랜드/랭킹/메뉴 규칙
src/utils/               날짜, 공유, 딥링크, Supabase 유틸리티
public/data/              배포용 할인 JSON
public/icons/             브랜드 아이콘
scripts/                  데이터 병합·검증·Supabase 동기화
BM|COUP|YO|TTANG/         OCR 원본 스크린샷
prompts/                  OCR/정제 프롬프트
```

`PRD.md`와 `PROPOSAL.md`는 제품 기획 및 2026년 4월 시점 제안 자료입니다. 현재 데이터 건수로 읽지 말고 문서 상단의 상태 안내를 확인하세요.
