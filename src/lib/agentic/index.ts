import { prisma } from "../prisma";

type AnyObj = Record<string, any>;

export async function createRun(agent: string, input: AnyObj = {}, createdBy?: string) {
  return prisma.agentRun.create({
    data: {
      agent,
      status: "PENDING",
      input,
      createdBy: createdBy || null,
    },
  });
}

export async function updateRun(id: string, data: Partial<{ status: string; output: any; error: string; finishedAt: Date }>) {
  return prisma.agentRun.update({ where: { id }, data });
}

export async function getHistory(agent: string, limit = 50) {
  return prisma.agentRun.findMany({
    where: { agent },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function runOrEnqueue(run: { id: string; agent: string; input: AnyObj }, handler: (input: AnyObj) => Promise<any>) {
  // If a REDIS_URL is available, a real queue should be used. For now we support
  // an in-process fallback so the API works without extra infra.
  if (process.env.REDIS_URL) {
    // TODO: enqueue job using BullMQ / Redis
    return { enqueued: true };
  }

  await updateRun(run.id, { status: "RUNNING" });
  try {
    const output = await handler(run.input || {});
    await updateRun(run.id, { status: "COMPLETED", output, finishedAt: new Date() });
    return output;
  } catch (err: any) {
    await updateRun(run.id, { status: "FAILED", error: String(err || "unknown"), finishedAt: new Date() });
    throw err;
  }
}
