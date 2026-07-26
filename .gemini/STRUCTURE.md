# Project Structure: Deli-Cheap

## Application
* `/src/app`: Next.js App Router entry points, metadata, and global CSS.
* `/src/components`: Feature-based React UI (`home`, `roulette`, `layout`, `common`).
* `/src/hooks`: Client data loading, persisted filters, and discount processing.
* `/src/constants`: Brand search/display rules, survey rankings, and roulette menus.
* `/src/utils`: Date/freshness, deep-link, share, and Supabase helpers.
* `/src/types`: Shared TypeScript domain types.

## Data and operations
* `/public/data`: Validated JSON shipped with the application.
* `/public/icons`: Brand assets used by `next/image`.
* `/scripts`: Data merge, validation, migrations, upload, and asset utilities.
* Root `BM|COUP|YO|TTANG.json`: Reviewed OCR source data.
* Root `BM|COUP|YO|TTANG/`: Source screenshots retained for traceability.
* `/prompts`: OCR and normalization prompts.
