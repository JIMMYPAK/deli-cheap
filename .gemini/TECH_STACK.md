Project stack:
- Next.js 16 (App Router)
- TypeScript
- Supabase
- Node.js scripts for data sync/upload

Data files:
- BM.json, COUP.json, YO.json, TTANG.json
- public/data/discounts.json (merged output)
# Tech Stack: Deli-Cheap MVP

## Frontend
* **Core:** React 18 (Vite)
* **Language:** TypeScript (Strict mode)
* **Styling:** Vanilla CSS (CSS Modules)
* **State Management:** React Context API or Zustand (Minimalist)
* **Navigation:** Next.js (App Router) - (Note: If Vite is preferred, we use React Router, but for SEO/Viral, Next.js is recommended in the PRD scope.)

## Backend & Database
* **Primary:** Supabase (Auth, Postgres DB)
* **Storage:** Supabase Storage (for brand assets)
* **Data Flow:** Daily 11:00 AM JSON Snapshot sync with Supabase Table.

## DevOps
* **Hosting:** Vercel (Auto-deploy)
* **Analytics:** Google Analytics (User Tracking)
