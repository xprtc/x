Vercel deploy checklist — automatic Prisma migrations

Goal: run DB migrations during Vercel deploy and enable Agentic persistence automatically.

1) Add environment variables in Vercel (Project Settings → Environment Variables):

- `DATABASE_URL` = <your Postgres connection string for pooling> (or use `POSTGRES_PRISMA_URL` from Supabase)

If your provider suggests a `POSTGRES_URL_NON_POOLING` or similar for serverless, set that too and map to `DATABASE_URL_NON_POOLING` as needed.

2) Use the added build script

We added a script to `package.json`:

```json
"vercel:build": "npx prisma migrate deploy && npx prisma generate && next build"
```

In Vercel Project Settings → General → Build & Development Settings set the Build Command to:

```
npm run vercel:build
```

(or leave default and add the `npx prisma migrate deploy` step into a custom build script if you prefer.)

3) Deploy

- Trigger a new deploy from Vercel Dashboard (or push to the connected Git branch). During build Vercel will run migrations against the configured `DATABASE_URL`.

4) Worker

- For processing Agent runs in production you should run a worker process separately (e.g., a small VM, a Docker container, or a serverless cron). The worker we added is `src/worker/agentic-worker.ts` and can be started with:

```bash
npm run agentic:worker
```

- In production prefer a queue (Redis + BullMQ) instead of polling; if you provide `REDIS_URL` we will wire the queue in a follow-up.

5) Verification

- After deploy, test the endpoints:
  - `POST /api/agentic/finance` — creates a run and should persist to DB
  - `GET /api/agentic/finance` — returns recent runs

6) Rollback plan

- If migration fails, check Vercel build logs; you can rollback to the previous deploy while you fix the migration script.

Notes
- `npx prisma migrate deploy` is safe for CI/production; it applies already-created migrations. For local development use `npx prisma migrate dev`.
- If using Supabase, prefer the `POSTGRES_PRISMA_URL` value for `DATABASE_URL`.

*** End File