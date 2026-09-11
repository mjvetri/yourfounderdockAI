# YourFounderDock — Merged Project Setup

This project now has the frontend and backend merged into one folder.
Here's exactly what was done automatically, and the few things you
still need to do by hand.

## ✅ Already done in this merge
- `supabase/` (migrations + edge functions) copied into the project root
- `src/lib/api.ts` and `src/lib/supabaseClient.ts` added
- `src/lib/gemini.ts` removed (no longer used or needed)
- All page imports switched from `lib/gemini` → `lib/api`
- `chat/page.tsx` updated for the new `chatWithFounderBot(ideaId, message)`
  signature (history is now loaded server-side, not passed manually)
- `vite.config.ts` — removed the block that baked `GEMINI_API_KEY` into
  the browser bundle
- `.env.local` — removed the exposed key, added placeholders for Supabase
- `package.json` — removed `@google/genai` (no longer used client-side),
  added `@supabase/supabase-js`
- `package-lock.json` removed so it regenerates cleanly on install

## 🔲 What you still need to do

### 1. Create your Supabase project (if you haven't yet)
Go to supabase.com → New Project → note the Project URL and anon key
(Settings → API).

### 2. Run the migration
Supabase Dashboard → SQL Editor → paste the contents of
`supabase/migrations/0001_init.sql` → Run. Confirm 5 tables appear in
Table Editor: `profiles`, `ideas`, `validations`, `roadmap_items`,
`chat_messages`.

### 3. Deploy the edge functions
From this project's root folder:

```bash
npm install -g supabase
supabase login
supabase link --project-ref YOUR_PROJECT_REF

supabase secrets set GEMINI_API_KEY=your_real_gemini_key

supabase functions deploy validate-idea
supabase functions deploy market-validation
supabase functions deploy founder-chat
```

### 4. Fill in `.env.local`
Replace the two placeholders with your real values:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_public_key
```

### 5. Install dependencies and run
```bash
npm install
npm run dev
```

### 6. Wire up real auth (still using simulated login/signup)
`src/app/(auth)/login/page.tsx` and `signup/page.tsx` still use a fake
`setTimeout` instead of calling Supabase. Replace with:
```ts
import { signIn } from '../../../lib/api';
// on submit:
await signIn(email, password);
navigate('/dashboard');
```
and the equivalent `signUp(email, password, name)` on the signup page.

### 7. Add a route guard (not yet in place)
`/dashboard/*` is currently reachable without logging in. This needs a
guard component checking `getCurrentUser()` before rendering dashboard
routes — ask if you want this written next.

### 8. Wire `idea-upload` to actually save an idea first
Right now `generateMVPAdvice` can be called with just a description.
To get validations persisted and linked properly, create the idea row
first with `createIdea()`, then pass its returned `id` in as the second
argument to `generateMVPAdvice(description, ideaId)`.

## Still not included (by design, ask if you want these next)
- Razorpay payment collection
- Auth route guard component
- Rate limiting on the edge functions
