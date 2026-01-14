Agentic — local run & deployment notes

Quick steps to enable persistent Agent runs and run the worker locally.

1) Configure database

- Set `DATABASE_URL` in your `.env` to point to a PostgreSQL (or other supported) database.

2) Create the AgentRun table

- Run a migration locally (recommended):

```bash
npx prisma migrate dev --name add_agent_run
npx prisma generate
```

- Or push the schema without a migration (for ephemeral/dev envs):

```bash
npx prisma db push
npx prisma generate
```

3) Start the web app (dev)

```bash
# from react-nextjs-tailwindcss
npm run dev
```

4) Run the agentic worker (processes PENDING runs)

```bash
# from react-nextjs-tailwindcss
npm run agentic:worker
```

Notes
- The API endpoints are available at `/api/agentic/{diagnostics,marketing,sales,finance,support}` and accept POST to create & run, and GET to list recent runs.
- In production you should run a queue/worker (Redis + BullMQ) rather than the in-process fallback. If `REDIS_URL` is set the code path will prefer enqueuing (TODO: implement enqueue).
- For long-running LLM calls, move work to a background worker and stream progress back to the client via WebSockets or server-sent events.
