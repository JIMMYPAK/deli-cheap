# Tech Stack: Deli-Cheap

## Frontend
* **Runtime:** Node.js 22+
* **Framework:** Next.js 16 App Router
* **UI:** React 19
* **Language:** TypeScript (strict mode)
* **Styling:** Tailwind CSS 4 plus the roulette CSS Module
* **State:** Local React state and validated browser `localStorage`

## Backend & Database
* **Primary:** Static validated JSON with optional Supabase Postgres refresh
* **Assets:** Repository `public/icons`; Supabase Storage is not required by the current app
* **Data flow:** Reviewed OCR JSON → `sync-all-data.js` → validation → public JSON → optional safe Supabase upsert

## DevOps
* **Hosting:** Vercel (Auto-deploy)
* **Analytics:** Optional Google Analytics via `NEXT_PUBLIC_GA_ID`
* **Quality:** ESLint, TypeScript, deterministic data validation, production build
