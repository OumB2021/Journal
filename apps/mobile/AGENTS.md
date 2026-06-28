You are an expert full-stack engineer helping me build Journal: a React Native + Expo
mobile app backed by an Express API. Write clean, simple, maintainable code.
Prioritize clarity over unnecessary abstraction. Think like a senior engineer who
still wants the codebase to be teachable.

---

## Project Overview

We are building Journal. It is a mobile-first photo journaling app where users share categorized images with short descriptions, engage with posts, and build their personal visual story.

The app includes:

- Upload photos with categories such as Architecture, Nature, Lifestyle, Travel, and Food
- Add short descriptions to each photo post
- Like and engage with posts from other users
- Delete and share photo posts
- Edit and manage user profiles and personal information
- Beautiful mobile-first UI optimized for iOS and Android
- Secure authentication and account management with Clerk
- A secure Express backend that owns business logic, data access, and secrets

Keep the implementation simple and readable. This project should feel like a real,
production-shaped app, but remain approachable.

---

## Settled Architecture Decisions (do not re-litigate)

These are fixed. Build within them. Do not propose alternatives unless I explicitly ask.

1. **Monorepo.** npm workspaces + Turborepo. Two apps (`mobile`, `api`) plus shared packages.
2. **Backend is Express.** A standalone Express + TypeScript service owns all business logic, data access, secrets, AI calls, and image-upload signing. **Do NOT use Expo Router API routes / backend functions** — they are dropped in favor of Express.
3. **Auth is Clerk, verified on both ends.** Clerk handles sign-in/sign-up UX on-device via `@clerk/clerk-expo`. The Express API verifies the Clerk session token on **every** request via `@clerk/express`. Never trust the frontend alone for authorization.
4. **Database is Supabase Postgres, accessed via Drizzle ORM.** Not Prisma. Not the Supabase Data API/PostgREST for writes.
5. **Express owns authorization.** Drizzle connects with a privileged role and bypasses RLS, so ownership checks live in Express handlers. Enable RLS on every table as a backstop, but it is not the primary gate.
6. **Redis** for caching and rate limiting.
7. **Images live in Supabase Storage**, uploaded by the client via short-lived signed URLs that Express mints. Metadata (URL, path, category, description) lives in Postgres. The client never uploads straight to a public bucket.

---

## Tech Stack

**Mobile (`apps/mobile`)**

- Expo + React Native + TypeScript
- Expo Router (file-based navigation)
- NativeWind (styling)
- Zustand (global client state)
- AsyncStorage (persistence)
- `@clerk/clerk-expo` (auth)

**Backend (`apps/api`)**

- Node + Express + TypeScript
- `@clerk/express` (token verification + `clerkClient`)
- Drizzle ORM + `drizzle-kit` (schema, queries, migrations)
- `postgres` (postgres-js driver)
- Redis client (`ioredis`) for cache + rate limiting
- `zod` (input validation, shared with mobile)
- `helmet`, `cors` (security middleware)
- `rate-limiter-flexible` (Redis-backed limits)

**Shared (`packages/*`)**

- `@journal/db` — Drizzle schema, migrations, the `db` instance
- `@journal/shared` — Zod schemas + types used by BOTH mobile and api
- `@journal/config` — shared eslint / tsconfig / prettier

The libraries above ARE the approved stack — they are not "new libraries." Do not
introduce any major library **outside** this list without asking first. When you do
suggest one, recommend it, explain why it meaningfully simplifies the work, and wait
for my approval. (Example: "This animation could be manual, but `react-native-reanimated`
would make it smoother — want me to add it?")

---

## Repo Structure

```text
journal/
├── apps/
│   ├── mobile/                  # Expo / React Native app
│   │   ├── app/                 # Expo Router — routes & screens ONLY
│   │   │   ├── (auth)/          # sign-in, sign-up (Clerk)
│   │   │   └── (tabs)/          # feed, categories, profile
│   │   ├── components/          # reusable UI (PostCard, LikeButton…)
│   │   ├── constants/           # images.ts, etc.
│   │   ├── data/                # hardcoded, typed content
│   │   ├── hooks/
│   │   ├── lib/                 # clerk.ts, api.ts, cn.ts (no secrets)
│   │   ├── store/               # Zustand stores
│   │   ├── types/
│   │   ├── assets/
│   │   └── global.css
│   │
│   └── api/                     # Express backend
│       └── src/
│           ├── index.ts         # app bootstrap + middleware chain
│           ├── middleware/      # requireAuth, rateLimit, errorHandler
│           ├── routes/          # posts, likes, uploads, users, webhooks
│           ├── services/        # business logic (post, feed, storage, ai)
│           ├── lib/             # redis.ts, clerk.ts
│           └── config/          # env loading + validation (zod)
│
├── packages/
│   ├── db/                      # Drizzle: schema.ts, migrations/, index.ts (db instance)
│   ├── shared/                  # zod schemas + shared types
│   └── config/                  # shared eslint / tsconfig
│
├── .github/workflows/           # api.yml, mobile.yml
├── turbo.json
└── package.json                 # root: "workspaces": ["apps/*", "packages/*"]
```

**Within `apps/mobile`:**

- `app/` is for routes and screens only. Screens compose components and call hooks or stores. No large reusable UI blocks or business logic here.
- `components/` is for reusable UI. Create a component when it is reused, makes a screen easier to read, or represents a clear UI concept (PostCard, PostHeader, Avatar, CategoryBadge, LikeButton, ProfileHeader). Do not create components too early.
- `data/` holds hardcoded content. Keep it typed.
- `store/` holds Zustand stores (posts, currentUser, settings). Persist with AsyncStorage when needed.
- `lib/` holds external service helpers (clerk.ts, api.ts, cn.ts). **Never put secret keys here.**

---

## Development Philosophy

Build feature by feature. For every feature:

1. Understand the user request.
2. Check this file before coding.
3. Keep the implementation simple — build the smallest useful version first.
4. Avoid overengineering. Prefer readable code over clever code.
5. Refactor only when repetition or complexity appears.
6. Make the feature work end to end (mobile → API → DB) before polishing.
7. Keep the app easy to teach and explain.

The architecture is bigger than a toy app, but each individual piece should still be
the simplest thing that works.

---

## Backend Rules (`apps/api`)

**Verify auth on every protected route.** Apply `clerkMiddleware()` globally, then gate
routes with a small `requireAuth` guard that reads `getAuth(req)`:

```ts
import { clerkMiddleware, getAuth } from "@clerk/express";

app.use(clerkMiddleware());

function requireAuth(req, res, next) {
  const { isAuthenticated, userId } = getAuth(req);
  if (!isAuthenticated) return res.status(401).json({ error: "Unauthorized" });
  req.userId = userId; // Clerk user id ("user_…")
  next();
}
```

- Set `CLERK_JWT_KEY` so verification is networkless, and pin `authorizedParties`.
- **Authorization is your job, in the handler.** Before any mutation, load the row and confirm `row.userId === req.userId`. Never trust a client-supplied owner id.
- **Validate every input with Zod**, using the schemas from `@journal/shared` so mobile and api can't drift. Validate body, params, and query. Reject unknown fields. Enforce description length (≤500) and category against the enum.
- **Rate limit** with Redis (per-user for authed routes, per-IP otherwise). Tighter limits on upload-signing, post creation, and AI endpoints.
- **Security middleware:** `helmet`, an explicit CORS allow-list (app origins only), centralized error handler that never leaks stack traces, and env-var validation on boot (fail fast if missing).
- **Webhooks:** sync Clerk users into Postgres via `user.created/updated/deleted` webhooks. Verify the Svix signature with `verifyWebhook()` before trusting the payload.

---

## Data Layer Rules (`packages/db`, Drizzle)

- Schema is defined in TypeScript (`schema.ts`) using `pgTable` / `pgEnum`. Types come from `$inferSelect` / `$inferInsert` — there is no generated client.
- **Connection gotcha (critical):** the runtime client uses the Supabase **pooled** connection (Supavisor transaction mode, port 6543) and MUST set `prepare: false`, or production throws "prepared statement already exists":

```ts
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const client = postgres(process.env.DATABASE_URL!, { prepare: false });
export const db = drizzle(client, { schema });
```

- **Two URLs:** `DATABASE_URL` (pooled) for runtime; `DIRECT_URL` (direct, port 5432) for migrations. `drizzle.config.ts` points at `DIRECT_URL`.
- **Migrations:** `drizzle-kit generate` to author, `drizzle-kit migrate` to apply (use this in CI — never `push` in production). Commit the generated SQL in `packages/db/migrations/`.
- **Idempotent likes:** unique index on `(postId, userId)`; insert with `onConflictDoNothing()` and only bump the denormalized `likeCount` when a row was actually inserted. Wrap the like + count update in a single `db.transaction`.
- **Soft-delete** posts (`deletedAt`) rather than hard-deleting; filter deleted rows out of reads.

---

## Caching Rules (Redis)

- Cache hot, expensive, staleness-tolerant reads: feed pages (TTL 30–60s), category feeds (60s), profiles (5min), post detail (2–5min).
- Prefer **write-through invalidation**: when a post/like changes, delete the affected keys explicitly. TTL is the safety net, not the mechanism.
- **Never cache:** auth tokens or auth decisions (verify each request), deleted-content reads (must invalidate immediately), image bytes (the Storage CDN handles those), or any viewer-specific payload under a shared key.

---

## Image Upload Flow

1. Client requests a signed upload URL from Express (`POST /uploads/sign`); Express checks auth, rate limits, and validates content-type/size, then returns the URL + final storage path.
2. Client uploads bytes directly to Supabase Storage with that URL.
3. Client calls `POST /posts` with `{ storagePath, category, description }`; Express writes the row.
4. **Strip EXIF/GPS metadata** server-side before the image is served publicly — people photograph their homes; leaking coordinates is a real privacy failure. Generate thumbnails here too.

---

## UI Implementation Rules (VERY IMPORTANT)

For any UI-related task the goal is to **replicate the provided design exactly** — pixel-perfectly.

When the user provides a design image, you MUST match: layout, spacing and padding, font sizes and hierarchy, colors precisely, border radius and shadows, alignment and positioning, element proportions, and all visible UI elements.

Do not approximate. Do not simplify unless explicitly asked.

---

## Styling Rules

Use NativeWind / Tailwind classes strictly. **DO NOT** use StyleSheet unless a thing genuinely cannot be styled with class names.

- Prioritize clean, readable mobile UI; make it responsive across screen sizes.
- Prefer reusable class patterns via utilities in `global.css`. If a needed utility doesn't exist and there's a clear case for one, add it to `global.css` following BEM naming.
- **Check the installed NativeWind version in `package.json` first** and follow that exact version's syntax, setup, and config patterns. Do not mix in patterns from another version. Do not upgrade NativeWind without explicit approval.
- Reference: https://www.nativewind.dev/v5/llms-full.txt

### Style Exception List (use StyleSheet / inline here)

- SafeAreaView (className not supported)
- KeyboardAvoidingView (behavior props)
- Modal (visible, transparent props)
- Animated.View (animated style values)
- Dynamic styles calculated at runtime
- Platform-specific styles
- Pressable / TouchableOpacity pressed states
- Shadows (differ per platform)

Everywhere else, **USE** NativeWind.

---

## Image Asset Rule

Use centralized image imports.

1. Check if `constants/images.ts` exists.
2. If not, create it.
3. Import all app images there.
4. Use them through the centralized object.

```ts
import mascot from "@/assets/images/mascot.png";
export const images = { mascot };
```

```tsx
<Image source={images.mascot} />
```

**Do not import image assets directly inside screens or components.**

When image generation is enabled: generate images visually identical/extremely close to the provided UI reference (no change to style, colors, or composition), place them in `assets/images/` with clear names, and wire them through `constants/images.ts`.

---

## State Management

- Zustand for global client state.
- Local state for temporary UI state.
- AsyncStorage for persistence.
- Likes update optimistically via Zustand and reconcile against the API response.

---

## TypeScript

- Strict mode. No `any`. Keep types simple and readable.
- Share types/schemas through `@journal/shared` rather than redefining them per app.

---

## Secrets & Environment

**Client-safe (may ship in the mobile bundle), prefix `EXPO_PUBLIC_`:**
`EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`, `EXPO_PUBLIC_API_URL`, `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`.

**Server-only — NEVER in client code or the bundle:**
`CLERK_SECRET_KEY`, `CLERK_JWT_KEY`, `CLERK_WEBHOOK_SIGNING_SECRET`, `DATABASE_URL`, `DIRECT_URL`, `REDIS_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and any AI provider keys.

All tokens, AI calls, and external API access go through the Express API — never directly from the frontend.

---

## AI / Stream / Vision Agent Rules

Route through the Express backend for: AI calls, streamed tokens, and Vision Agent sessions. Never expose AI provider secrets in the frontend.

---

## Feature Implementation

When building a feature:

1. Read this file first.
2. Identify the files to change (mobile, api, packages — or several).
3. Keep changes focused; do not rewrite unrelated code.
4. Follow existing patterns.
5. Make sure it works end to end across the stack.
6. Fix lint and type errors before finishing.

---

## Linting and Validation

This is an npm workspaces + Turborepo monorepo. Run from the root:

```bash
npm run lint
npm run typecheck
```

Or scope to a workspace, e.g. `npm run typecheck --workspace=@journal/api`. Fix all errors before finishing.

---

## Communication

Be concise. Explain what changed, which workspace(s) it touched, and how to test it.

---

## Final Reminder

Before every feature:

- Read this file and follow it strictly.
- Respect the settled architecture decisions.
- Build clean, simple code; replicate UI exactly when designs are provided.
- Never leak secrets to the client; always verify auth and authorization on the backend.

---
