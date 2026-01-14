import { prisma } from "../lib/prisma";
import { runFinance } from "../lib/agentic/finance";
import { runSupport } from "../lib/agentic/support";
import { runDiagnostics } from "../lib/agentic/diagnostics";

async function processOne() {
  const run = await prisma.agentRun.findFirst({ where: { status: "PENDING" }, orderBy: { createdAt: "asc" } });
  if (!run) return false;

  console.log(`Processing run ${run.id} (${run.agent})`);
  await prisma.agentRun.update({ where: { id: run.id }, data: { status: "RUNNING" } });

  try {
    let result: any = null;
    if (run.agent === "FINANCE") result = await runFinance(run.input || {});
    else if (run.agent === "SUPPORT") result = await runSupport(run.input || {});
    else if (run.agent === "DIAGNOSTICS" && typeof runDiagnostics === "function") result = await runDiagnostics(run.input || {});
    else result = { message: "No handler for agent: " + run.agent };

    await prisma.agentRun.update({ where: { id: run.id }, data: { status: "COMPLETED", output: result, finishedAt: new Date() } });
    console.log(`Completed run ${run.id}`);
  } catch (err: any) {
    console.error(`Run ${run.id} failed:`, err);
    await prisma.agentRun.update({ where: { id: run.id }, data: { status: "FAILED", error: String(err || "unknown"), finishedAt: new Date() } });
  }

  return true;
}

async function main() {
  console.log("Agentic worker started. Polling for pending runs...");
  while (true) {
    try {
      const didWork = await processOne();
      if (!didWork) await new Promise((r) => setTimeout(r, 2000));
    } catch (e) {
      console.error("Worker loop error:", e);
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
