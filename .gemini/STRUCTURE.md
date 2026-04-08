Place source code under:
- src/
- scripts/
- public/

Coupon extraction outputs must update:
- BM.json
- YO.json
- TTANG.json

After updates, run:
1) node scripts/sync-all-data.js
2) node scripts/upload-to-supabase.js
# Project Structure: Deli-Cheap

## Root Layout
* `/src/components`: UI components (Atomic or Feature-based).
* `/src/hooks`: Custom React hooks (e.g., `useDiscounts`, `useDeepLink`).
* `/src/services`: Supabase and External API connections.
* `/src/styles`: Global CSS and CSS Modules.
* `/src/utils`: Helper functions (Deep link generator, Formatter).
* `/src/types`: TypeScript definitions (Shared interfaces).
* `/public/data`: JSON snapshots for daily 11:00 AM updates.

## Page Structure
* `/src/pages`: Main entry points.
* `/src/layouts`: Common layout components (Header, Footer).
